const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const { gunzipSync } = require('node:zlib');
const { readFile, stat } = require('node:fs/promises');

const requireFromApp = createRequire(resolve(process.cwd(), 'photo-catalog-import.cjs'));
const requireFromStrapi = createRequire(requireFromApp.resolve('@strapi/strapi'));
const { compileStrapi, createStrapi } = requireFromStrapi('@strapi/core');

const postsUid = 'api::kameko-post.kameko-post';
const catalogUid = 'api::photo-catalog.photo-catalog';
const postFields = [
  'sourceId',
  'url',
  'postedAt',
  'text',
  'authorUserName',
  'authorName',
  'hashtags',
  'mentions',
  'media'
];
const catalogFields = ['account', 'hashtagQueries', 'fetchedAt', 'newestSeenAt'];
const pageSize = 100;

const fail = (message) => {
  throw new Error(message);
};

const parseArgs = (args) => {
  let inputPath;
  let write = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help') return { help: true };
    if (arg === '--write') {
      write = true;
      continue;
    }
    if (arg === '--input') {
      inputPath = args[index + 1];
      if (!inputPath || inputPath.startsWith('--')) fail('--input requires an explicit file path.');
      index += 1;
      continue;
    }
    if (arg.startsWith('--input=')) {
      inputPath = arg.slice('--input='.length);
      if (!inputPath) fail('--input requires an explicit file path.');
      continue;
    }
    fail('Unknown option. Expected optional --input and optional --write.');
  }
  if (inputPath && process.env.PHOTO_CATALOG_SNAPSHOT_GZIP_BASE64) {
    fail('Use either --input or PHOTO_CATALOG_SNAPSHOT_GZIP_BASE64, not both.');
  }
  return { inputPath, write };
};

const isDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));

const readSnapshot = async ({ inputPath }) => {
  if (inputPath) {
    const file = resolve(process.cwd(), inputPath);
    if ((await stat(file)).size > 1024 * 1024) fail('Snapshot file exceeds 1 MiB.');
    try {
      return JSON.parse(await readFile(file, 'utf8'));
    } catch {
      fail('Could not read or parse the explicit input file.');
    }
  }
  const compressed = process.env.PHOTO_CATALOG_SNAPSHOT_GZIP_BASE64;
  if (!compressed) fail('Set PHOTO_CATALOG_SNAPSHOT_GZIP_BASE64 or provide --input.');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    fail('Compressed snapshot input is not valid base64.');
  try {
    return JSON.parse(
      gunzipSync(Buffer.from(compressed, 'base64'), { maxOutputLength: 1024 * 1024 }).toString(
        'utf8'
      )
    );
  } catch {
    fail('Compressed snapshot input is not valid gzip JSON.');
  }
};

const normalizeSnapshot = (snapshot) => {
  if (!snapshot || typeof snapshot !== 'object' || !Array.isArray(snapshot.posts)) {
    fail('Input must be a Kameko snapshot with a posts array.');
  }
  if (!snapshot.posts.length) fail('Input contains no posts; refusing an empty import.');
  if (typeof snapshot.account !== 'string' || !snapshot.account)
    fail('Input is missing the catalog account.');
  if (
    !Array.isArray(snapshot.hashtagQueries) ||
    !snapshot.hashtagQueries.every((value) => typeof value === 'string')
  ) {
    fail('Input has invalid hashtagQueries metadata.');
  }
  if (!isDate(snapshot.fetchedAt)) fail('Input has an invalid fetchedAt timestamp.');
  if (snapshot.newestSeenAt !== null && !isDate(snapshot.newestSeenAt)) {
    fail('Input has an invalid newestSeenAt timestamp.');
  }

  const seen = new Set();
  const posts = snapshot.posts.map((post, index) => {
    const sourceId =
      typeof post?.id === 'string' || typeof post?.id === 'number' ? String(post.id) : '';
    if (!/^\d+$/.test(sourceId))
      fail(`Input post ${index + 1} is missing a valid numeric source ID.`);
    if (seen.has(sourceId)) fail(`Input contains duplicate sourceId ${sourceId}.`);
    seen.add(sourceId);
    if (typeof post.url !== 'string' || !post.url)
      fail(`Input post ${sourceId} is missing its URL.`);
    if (!isDate(post.createdAt)) fail(`Input post ${sourceId} has an invalid createdAt timestamp.`);
    if (typeof post.author?.userName !== 'string' || !post.author.userName) {
      fail(`Input post ${sourceId} is missing its author user name.`);
    }
    if (post.text != null && typeof post.text !== 'string')
      fail(`Input post ${sourceId} has invalid text.`);
    if (
      !Array.isArray(post.hashtags) ||
      !Array.isArray(post.mentions) ||
      !Array.isArray(post.media)
    ) {
      fail(`Input post ${sourceId} has invalid hashtag, mention, or media data.`);
    }
    if (post.author.name != null && typeof post.author.name !== 'string') {
      fail(`Input post ${sourceId} has invalid author name.`);
    }
    return {
      sourceId,
      url: post.url,
      postedAt: post.createdAt,
      text: post.text ?? null,
      authorUserName: post.author.userName,
      authorName: post.author.name ?? null,
      hashtags: post.hashtags,
      mentions: post.mentions,
      media: post.media
    };
  });

  return {
    posts,
    catalog: {
      account: snapshot.account,
      hashtagQueries: snapshot.hashtagQueries,
      fetchedAt: snapshot.fetchedAt,
      newestSeenAt: snapshot.newestSeenAt
    }
  };
};

const normalizeJson = (value) => {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizeJson(value[key])])
    );
  }
  return value;
};

const mismatchedFields = (expected, actual, fields) =>
  fields.filter(
    (field) =>
      JSON.stringify(normalizeJson(expected[field])) !==
      JSON.stringify(normalizeJson(actual?.[field]))
  );

const indexExistingPosts = (records) => {
  const indexed = new Map();
  for (const record of records) {
    if (typeof record?.sourceId !== 'string' || !/^\d+$/.test(record.sourceId)) {
      fail('Existing CMS post is missing sourceId; refusing to import.');
    }
    if (indexed.has(record.sourceId)) {
      fail(`CMS contains duplicate sourceId ${record.sourceId}; refusing to import.`);
    }
    indexed.set(record.sourceId, record);
  }
  return indexed;
};

const listPosts = async (documents) => {
  const records = [];
  const seen = new Set();
  for (let page = 1; ; page += 1) {
    const batch = await documents.findMany({
      start: (page - 1) * pageSize,
      limit: pageSize,
      sort: { sourceId: 'asc' }
    });
    if (!Array.isArray(batch)) fail('Document Service returned an invalid post page.');
    if (batch.length > pageSize) fail('Document Service did not honor the page size.');
    for (const record of batch) {
      if (seen.has(record.documentId)) fail('Document Service repeated a post while paginating.');
      seen.add(record.documentId);
    }
    records.push(...batch);
    if (batch.length < pageSize) return records;
  }
};

const planPosts = (posts, existing) => {
  const plan = { create: [], update: [], unchanged: [] };
  for (const post of posts) {
    const current = existing.get(post.sourceId);
    if (!current) {
      plan.create.push(post);
      continue;
    }
    if (mismatchedFields(post, current, postFields).length === 0) {
      plan.unchanged.push(post);
      continue;
    }
    if (typeof current.documentId !== 'string' || !current.documentId) {
      fail(`CMS post ${post.sourceId} is missing documentId; refusing to update.`);
    }
    plan.update.push({ post, documentId: current.documentId });
  }
  return plan;
};

const verifyPosts = (expectedPosts, records) => {
  const indexed = indexExistingPosts(records);
  for (const post of expectedPosts) {
    const actual = indexed.get(post.sourceId);
    if (!actual) fail(`CMS readback is missing sourceId ${post.sourceId}.`);
    const fields = mismatchedFields(post, actual, postFields);
    if (fields.length) {
      fail(`CMS readback differs for sourceId ${post.sourceId} in fields: ${fields.join(', ')}.`);
    }
  }
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(
      'Usage: node import-photo-catalog.cjs [--input snapshot.json] [--write]\n' +
        'Input may instead be provided as PHOTO_CATALOG_SNAPSHOT_GZIP_BASE64. Default is dry-run.'
    );
    return;
  }

  const snapshot = normalizeSnapshot(await readSnapshot(options));
  const appDir = process.cwd();
  const context = await compileStrapi({ appDir });
  const strapi = createStrapi(context);
  try {
    await strapi.load();
    const posts = strapi.documents(postsUid);
    const catalog = strapi.documents(catalogUid);
    const existing = indexExistingPosts(await listPosts(posts));
    const plan = planPosts(snapshot.posts, existing);
    const currentCatalog = await catalog.findFirst();
    if (
      currentCatalog &&
      (Date.parse(currentCatalog.fetchedAt) > Date.parse(snapshot.catalog.fetchedAt) ||
        (currentCatalog.newestSeenAt && snapshot.catalog.newestSeenAt === null) ||
        Date.parse(currentCatalog.newestSeenAt) > Date.parse(snapshot.catalog.newestSeenAt))
    ) {
      fail('CMS catalog is newer than this snapshot; refusing to regress the watermark.');
    }
    const updateCatalog =
      !currentCatalog ||
      mismatchedFields(snapshot.catalog, currentCatalog, catalogFields).length > 0;
    const writes = [
      ...plan.create.map((post) => ({ type: 'create', post })),
      ...plan.update.map(({ post, documentId }) => ({ type: 'update', post, documentId }))
    ];

    if (!options.write) {
      console.log(
        `mode=dry-run posts=${snapshot.posts.length} create=${plan.create.length} ` +
          `update=${plan.update.length} unchanged=${plan.unchanged.length} ` +
          `catalog=${updateCatalog ? 'update' : 'unchanged'}`
      );
      console.log('No CMS records were written.');
      return;
    }

    let completed = 0;
    for (const item of writes) {
      try {
        if (item.type === 'create') await posts.create({ data: item.post });
        else await posts.update({ documentId: item.documentId, data: item.post });
        completed += 1;
      } catch (error) {
        fail(
          `Post write failed for sourceId ${item.post.sourceId} after ${completed} of ${writes.length} writes. ` +
            `The watermark was not updated; rerunning with the same input is idempotent. ${error.message}`
        );
      }
    }

    try {
      verifyPosts(snapshot.posts, await listPosts(posts));
    } catch (error) {
      fail(
        `Posts may have been written, but canonical-field readback failed. The watermark was not updated. ${error.message}`
      );
    }

    if (updateCatalog) {
      try {
        if (currentCatalog) {
          if (typeof currentCatalog.documentId !== 'string' || !currentCatalog.documentId) {
            fail('Existing photo catalog is missing documentId; refusing to update watermark.');
          }
          await catalog.update({ documentId: currentCatalog.documentId, data: snapshot.catalog });
        } else {
          await catalog.create({ data: snapshot.catalog });
        }
        const savedCatalog = await catalog.findFirst();
        const fields = mismatchedFields(snapshot.catalog, savedCatalog, catalogFields);
        if (!savedCatalog || fields.length) {
          fail(`Catalog readback differs in fields: ${fields.join(', ')}.`);
        }
      } catch (error) {
        fail(
          `Posts were written and verified, but catalog metadata was not verified. Inspect the catalog before retrying. ${error.message}`
        );
      }
    }

    console.log(
      `mode=write posts=${snapshot.posts.length} create=${plan.create.length} ` +
        `update=${plan.update.length} unchanged=${plan.unchanged.length} ` +
        `catalog=${updateCatalog ? 'update' : 'unchanged'}`
    );
    console.log(`readback=verified watermark=${updateCatalog ? 'updated' : 'unchanged'}`);
  } finally {
    await strapi.destroy();
  }
};

run().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
});
