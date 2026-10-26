const { createHash } = require('node:crypto');
const { createReadStream } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createRequire } = require('node:module');

const requireFromApp = createRequire(path.resolve(process.cwd(), 'local-media-migration.cjs'));
const requireFromStrapi = createRequire(requireFromApp.resolve('@strapi/strapi'));
const { compileStrapi, createStrapi } = requireFromStrapi('@strapi/core');

const fileUid = 'plugin::upload.file';
const pageSize = 100;

const fail = (message) => {
  throw new Error(message);
};

const parseArgs = (args) => {
  let write = false;
  for (const arg of args) {
    if (arg === '--help') return { help: true };
    if (arg === '--write') {
      write = true;
      continue;
    }
    fail('Unknown option. Expected optional --write.');
  }
  return { write };
};

const normalize = (value) => {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value)
      .filter((key) => key !== 'updatedAt')
      .sort()
      .map((key) => [key, normalize(value[key])])
  );
};

const equal = (left, right) => JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));

const inside = (parent, child) => {
  const relative = path.relative(parent, child);
  return (
    relative !== '' &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
};

const hashStream = async (stream) => {
  const hash = createHash('sha256');
  let size = 0;
  for await (const chunk of stream) {
    hash.update(chunk);
    size += chunk.length;
  }
  return { sha256: hash.digest('hex'), size };
};

const sourcePathFor = async (url, uploadsRoot) => {
  if (typeof url !== 'string' || !url.startsWith('/uploads/')) {
    fail(`Local media URL is outside /uploads/: ${url}`);
  }
  let pathname;
  try {
    const parsed = new URL(url, 'http://strapi.local');
    if (parsed.origin !== 'http://strapi.local' || parsed.search || parsed.hash) {
      fail(`Local media URL is not a plain /uploads/ path: ${url}`);
    }
    pathname = decodeURIComponent(parsed.pathname);
  } catch {
    fail(`Local media URL is invalid: ${url}`);
  }
  const basename = pathname.slice('/uploads/'.length);
  if (
    !basename ||
    basename.includes('/') ||
    basename.includes('\\') ||
    basename === '.' ||
    basename === '..' ||
    path.basename(basename) !== basename
  ) {
    fail(`Local media URL must identify one /uploads/ basename: ${url}`);
  }
  const candidate = path.resolve(uploadsRoot, basename);
  const realPath = await fs.realpath(candidate);
  if (!inside(uploadsRoot, realPath))
    fail(`Local media file resolves outside public/uploads: ${url}`);
  const stats = await fs.stat(realPath);
  if (!stats.isFile()) fail(`Local media source is not a regular file: ${url}`);
  return { path: realPath, ...(await hashStream(createReadStream(realPath))) };
};

const listFiles = async (query) => {
  const records = [];
  const seen = new Set();
  for (let offset = 0; ; offset += pageSize) {
    const page = await query.findMany({
      orderBy: { id: 'asc' },
      limit: pageSize,
      offset
    });
    if (!Array.isArray(page)) fail('Strapi returned an invalid media file page.');
    for (const record of page) {
      if (record?.id === undefined || record?.id === null || seen.has(String(record.id))) {
        fail('Strapi media listing contains a missing or duplicate file id.');
      }
      seen.add(String(record.id));
      records.push(record);
    }
    if (page.length < pageSize) return records;
  }
};

const assetsFor = async (record, uploadsRoot) => {
  const assets = [{ slot: null, metadata: record }];
  if (record.formats != null) {
    if (typeof record.formats !== 'object' || Array.isArray(record.formats)) {
      fail(`Media file ${record.id} has invalid formats metadata.`);
    }
    for (const [slot, format] of Object.entries(record.formats)) {
      if (!format || typeof format !== 'object' || Array.isArray(format)) {
        fail(`Media file ${record.id} has invalid ${slot} format metadata.`);
      }
      assets.push({ slot, metadata: format });
    }
  }

  return Promise.all(
    assets.map(async (asset) => {
      if (
        typeof asset.metadata.hash !== 'string' ||
        !asset.metadata.hash ||
        typeof asset.metadata.ext !== 'string' ||
        !asset.metadata.ext
      ) {
        fail(
          `Media file ${record.id} has incomplete ${asset.slot ?? 'original'} provider metadata.`
        );
      }
      return {
        ...asset,
        originalUrl: asset.metadata.url,
        source: await sourcePathFor(asset.metadata.url, uploadsRoot)
      };
    })
  );
};

const sanitizePathComponent = (component) => {
  if (!component) return '';
  return component
    .replace(/\.\./g, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');
};

const targetUrlFor = (asset, providerOptions) => {
  const baseUrl = providerOptions?.baseUrl;
  if (typeof baseUrl !== 'string' || !baseUrl)
    fail('S3_PUBLIC_BASE_URL is required for public media readback.');
  const rootPath = providerOptions.rootPath
    ? `${providerOptions.rootPath.replace(/\/+$/, '')}/`
    : '';
  const filePath = sanitizePathComponent(asset.metadata.path);
  const sanitizedHash = sanitizePathComponent(asset.metadata.hash);
  const sanitizedExt = asset.metadata.ext.replace(/[^a-zA-Z0-9.]/g, '');
  const key = `${rootPath}${filePath ? `${filePath}/` : ''}${sanitizedHash}${sanitizedExt}`;
  return `${baseUrl.replace(/\/+$/, '')}/${key}`;
};

const verifyRemoteBytes = async (url, expected) => {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(120000), cache: 'no-store' });
  } catch {
    fail(`S3 public readback failed for ${url}`);
  }
  if (!response.ok || !response.body)
    fail(`S3 public readback returned HTTP ${response.status} for ${url}`);
  const actual = await hashStream(response.body);
  if (actual.sha256 !== expected.sha256 || actual.size !== expected.size) {
    fail(`S3 byte readback mismatch for ${url}`);
  }
};

const uploadAsset = async (asset, provider, providerService, providerOptions) => {
  const targetUrl = targetUrlFor(asset, providerOptions);
  if (await provider.objectExists(asset.metadata)) {
    await verifyRemoteBytes(targetUrl, asset.source);
    return targetUrl;
  }

  const uploadFile = {
    ...asset.metadata,
    size: asset.source.size,
    getStream: () => createReadStream(asset.source.path)
  };
  await providerService.upload(uploadFile);
  if (uploadFile.url !== targetUrl)
    fail(`Provider URL differs from configured public URL for ${targetUrl}`);
  await verifyRemoteBytes(uploadFile.url, asset.source);
  return uploadFile.url;
};

const readRecord = async (query, id, populate = false) =>
  query.findOne({
    where: { id },
    ...(populate ? { populate: ['related', 'folder'] } : {})
  });

const assertPreflightUnchanged = (before, current) => {
  if (
    !current ||
    current.id !== before.id ||
    current.provider !== before.provider ||
    current.url !== before.url ||
    !equal(current.formats, before.formats)
  ) {
    fail(`Media file ${before.id} changed after migration preflight.`);
  }
  for (const key of Object.keys(before)) {
    if (['url', 'provider', 'formats', 'updatedAt', 'related', 'folder'].includes(key)) continue;
    if (!equal(current[key], before[key]))
      fail(`Media file ${before.id} metadata changed after migration preflight: ${key}`);
  }
};

const assertReadback = (expected, actual, id) => {
  if (!actual || !equal(expected, actual)) fail(`Media file ${id} exact readback mismatch.`);
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log('Usage: node migrate-local-media.cjs [--write]\nDefault is a read-only dry run.');
    return;
  }

  const appDir = process.cwd();
  const context = await compileStrapi({ appDir });
  const strapi = createStrapi(context);
  try {
    await strapi.load();
    const uploadConfig = strapi.config.get('plugin::upload');
    if (uploadConfig.provider !== 'aws-s3') fail('Configured upload provider is not aws-s3.');
    const providerOptions = uploadConfig.providerOptions;
    const provider = strapi.plugin('upload').provider;
    const providerService = strapi.plugin('upload').service('provider');
    if (typeof provider?.objectExists !== 'function' || typeof provider?.upload !== 'function') {
      fail('Configured upload provider lacks the required objectExists/upload APIs.');
    }
    const query = strapi.db.query(fileUid);
    const uploadsRoot = await fs.realpath(path.resolve(appDir, 'public/uploads'));
    const records = await listFiles(query);
    const localFiles = [];
    let alreadyMigrated = 0;
    for (const record of records) {
      if (record.provider === 'aws-s3') {
        alreadyMigrated += 1;
        continue;
      }
      if (record.provider !== 'local')
        fail(`Media file ${record.id} uses unsupported provider ${record.provider}.`);
      localFiles.push({ record, assets: await assetsFor(record, uploadsRoot) });
    }

    const assetCount = localFiles.reduce((count, item) => count + item.assets.length, 0);
    if (!options.write) {
      console.log(
        `mode=dry-run localFiles=${localFiles.length} assets=${assetCount} alreadyAwsS3=${alreadyMigrated}`
      );
      console.log('No S3 objects or CMS records were written.');
      return;
    }

    const backupDir = process.env.MEDIA_MIGRATION_BACKUP_DIR;
    if (!backupDir || !path.isAbsolute(backupDir))
      fail('An absolute MEDIA_MIGRATION_BACKUP_DIR is required.');
    await fs.mkdir(backupDir, { recursive: true });
    await fs.writeFile(
      path.join(backupDir, `media-before-${Date.now()}.json`),
      JSON.stringify(records, null, 2),
      { flag: 'wx', mode: 0o600 }
    );

    for (const item of localFiles) {
      const migratedAssets = [];
      for (const asset of item.assets) {
        const url = await uploadAsset(asset, provider, providerService, providerOptions);
        migratedAssets.push({ ...asset, url });
      }

      const current = await readRecord(query, item.record.id, true);
      assertPreflightUnchanged(item.record, current);
      const formats =
        current.formats == null
          ? current.formats
          : Object.fromEntries(
              Object.entries(current.formats).map(([slot, format]) => {
                const migrated = migratedAssets.find((asset) => asset.slot === slot);
                if (!migrated) fail(`Media file ${current.id} has an unverified ${slot} format.`);
                return [slot, { ...format, url: migrated.url }];
              })
            );
      const expected = { ...current, url: migratedAssets[0].url, provider: 'aws-s3', formats };
      await query.update({
        where: { id: current.id },
        data: { url: expected.url, provider: expected.provider, formats: expected.formats }
      });
      const actual = await readRecord(query, current.id, true);
      assertReadback(expected, actual, current.id);
      console.log(
        `file=${current.id} provider=aws-s3 originalsAndFormats=${migratedAssets.length} readback=verified`
      );
    }

    console.log(
      `mode=write localFiles=${localFiles.length} assets=${assetCount} alreadyAwsS3=${alreadyMigrated} readback=verified`
    );
  } finally {
    await strapi.destroy();
  }
};

run().catch((error) => {
  console.error(`Media migration failed: ${error.message}`);
  process.exitCode = 1;
});
