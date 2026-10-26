import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  assertWriteConfigured,
  catalogFields,
  createKamekoCms,
  postFields
} from './kameko-cms.mjs';

const usage =
  'Usage: bun scripts/import-kameko-catalog.mjs --input <snapshot.json> [--write]\n' +
  'Defaults to a read-only dry run. --write requires STRAPI_API_TOKEN.';

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
      if (!inputPath || inputPath.startsWith('--')) {
        throw new Error('--input requires an explicit file path.');
      }
      index += 1;
      continue;
    }
    if (arg.startsWith('--input=')) {
      inputPath = arg.slice('--input='.length);
      if (!inputPath) throw new Error('--input requires an explicit file path.');
      continue;
    }
    throw new Error('Unknown option. Expected --input and optional --write.');
  }

  if (!inputPath) throw new Error('An explicit --input file is required.');
  return { inputPath, write };
};

const isDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));

const normalizeSnapshot = (snapshot) => {
  if (!snapshot || typeof snapshot !== 'object' || !Array.isArray(snapshot.posts)) {
    throw new Error('Input must be a Kameko snapshot with a posts array.');
  }
  if (!snapshot.posts.length) throw new Error('Input contains no posts; refusing an empty import.');
  if (typeof snapshot.account !== 'string' || !snapshot.account) {
    throw new Error('Input is missing the catalog account.');
  }
  if (
    !Array.isArray(snapshot.hashtagQueries) ||
    !snapshot.hashtagQueries.every((value) => typeof value === 'string')
  ) {
    throw new Error('Input has invalid hashtagQueries metadata.');
  }
  if (!isDate(snapshot.fetchedAt)) throw new Error('Input has an invalid fetchedAt timestamp.');
  if (snapshot.newestSeenAt !== null && !isDate(snapshot.newestSeenAt)) {
    throw new Error('Input has an invalid newestSeenAt timestamp.');
  }

  const seen = new Set();
  const posts = snapshot.posts.map((post, index) => {
    const sourceId =
      typeof post?.id === 'string' || typeof post?.id === 'number' ? String(post.id) : '';
    if (!/^\d+$/.test(sourceId)) {
      throw new Error(`Input post ${index + 1} is missing a valid numeric source ID.`);
    }
    if (seen.has(sourceId)) throw new Error(`Input contains duplicate sourceId ${sourceId}.`);
    seen.add(sourceId);

    if (typeof post.url !== 'string' || !post.url) {
      throw new Error(`Input post ${sourceId} is missing its URL.`);
    }
    if (!isDate(post.createdAt)) {
      throw new Error(`Input post ${sourceId} has an invalid createdAt timestamp.`);
    }
    if (typeof post.author?.userName !== 'string' || !post.author.userName) {
      throw new Error(`Input post ${sourceId} is missing its author user name.`);
    }
    if (post.text != null && typeof post.text !== 'string') {
      throw new Error(`Input post ${sourceId} has invalid text.`);
    }
    if (
      !Array.isArray(post.hashtags) ||
      !Array.isArray(post.mentions) ||
      !Array.isArray(post.media)
    ) {
      throw new Error(`Input post ${sourceId} has invalid hashtag, mention, or media data.`);
    }
    if (post.author.name != null && typeof post.author.name !== 'string') {
      throw new Error(`Input post ${sourceId} has invalid author name.`);
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
      throw new Error('Existing CMS post is missing sourceId; refusing to import.');
    }
    if (indexed.has(record.sourceId)) {
      throw new Error(`CMS contains duplicate sourceId ${record.sourceId}; refusing to import.`);
    }
    indexed.set(record.sourceId, record);
  }
  return indexed;
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
      throw new Error(`CMS post ${post.sourceId} is missing documentId; refusing to update.`);
    }
    plan.update.push({ post, documentId: current.documentId });
  }
  return plan;
};

const catalogChanged = (expected, current) =>
  !current || mismatchedFields(expected, current, catalogFields).length > 0;

const printPlan = (mode, posts, plan, updateCatalog) => {
  console.log(
    `mode=${mode} posts=${posts.length} create=${plan.create.length} ` +
      `update=${plan.update.length} unchanged=${plan.unchanged.length} ` +
      `catalog=${updateCatalog ? 'update' : 'unchanged'}`
  );
};

const verifyPosts = (expectedPosts, records) => {
  const indexed = indexExistingPosts(records);
  for (const post of expectedPosts) {
    const actual = indexed.get(post.sourceId);
    if (!actual) {
      throw new Error(`CMS readback is missing sourceId ${post.sourceId}.`);
    }
    const fields = mismatchedFields(post, actual, postFields);
    if (fields.length) {
      throw new Error(
        `CMS readback differs for sourceId ${post.sourceId} in fields: ${fields.join(', ')}.`
      );
    }
  }
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage);
    return;
  }
  if (options.write) assertWriteConfigured();

  const inputFile = resolve(process.cwd(), options.inputPath);
  let input;
  try {
    input = JSON.parse(await readFile(inputFile, 'utf8'));
  } catch {
    throw new Error('Could not read or parse the explicit input file.');
  }

  const snapshot = normalizeSnapshot(input);
  const cms = createKamekoCms();
  const existing = indexExistingPosts(await cms.listPosts());
  const plan = planPosts(snapshot.posts, existing);
  const currentCatalog = await cms.getCatalog();
  const updateCatalog = catalogChanged(snapshot.catalog, currentCatalog);

  if (!options.write) {
    printPlan('dry-run', snapshot.posts, plan, updateCatalog);
    console.log('No CMS records were written.');
    return;
  }

  let completed = 0;
  const writes = [
    ...plan.create.map((post) => ({ type: 'create', post })),
    ...plan.update.map(({ post, documentId }) => ({ type: 'update', post, documentId }))
  ];

  for (const item of writes) {
    try {
      if (item.type === 'create') await cms.createPost(item.post);
      else await cms.updatePost(item.documentId, item.post);
      completed += 1;
    } catch (error) {
      throw new Error(
        `Post write failed for sourceId ${item.post.sourceId} after ${completed} of ${writes.length} writes. ` +
          `The watermark was not updated; rerunning with the same input is idempotent. ${error.message}`
      );
    }
  }

  let readback;
  try {
    readback = await cms.listPosts();
    verifyPosts(snapshot.posts, readback);
  } catch (error) {
    throw new Error(
      `Posts may have been written, but canonical-field readback failed. The watermark was not updated. ${error.message}`
    );
  }

  if (updateCatalog) {
    try {
      await cms.updateCatalog(snapshot.catalog);
      const savedCatalog = await cms.getCatalog();
      const fields = mismatchedFields(snapshot.catalog, savedCatalog, catalogFields);
      if (fields.length) {
        throw new Error(`Catalog readback differs in fields: ${fields.join(', ')}.`);
      }
    } catch (error) {
      throw new Error(
        `Posts were written and verified, but catalog metadata was not verified. Inspect the catalog before retrying. ${error.message}`
      );
    }
  }

  printPlan('write', snapshot.posts, plan, updateCatalog);
  console.log(`readback=verified watermark=${updateCatalog ? 'updated' : 'unchanged'}`);
};

try {
  await run();
} catch (error) {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
}
