import { assertWriteConfigured, createKamekoCms, postFields } from './kameko-cms.mjs';

const zweigenTags = ['zweigen', 'ツェーゲン', 'ツエーゲン'];
const belongs = (tags) =>
  tags.includes('カメコしてみた') ||
  tags.includes('百瀬安由未') ||
  (tags.includes('蓮ノ空') && tags.some((tag) => zweigenTags.includes(tag)));
const deep = process.env.KAMEKO_DEEP === '1';
const maxPages = Number(process.env.KAMEKO_MAX_PAGES ?? 30);
const apiKey = process.env.TWEETAPI_IO_API_KEY;

const isDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));

const toPost = (tweet) => ({
  id: String(tweet.id),
  url: `https://x.com/${tweet.author.userName}/status/${tweet.id}`,
  createdAt: new Date(tweet.createdAt).toISOString(),
  text: tweet.text,
  author: { userName: tweet.author.userName, name: tweet.author.name },
  hashtags: (tweet.entities?.hashtags ?? []).map((tag) => tag.text),
  mentions: (tweet.entities?.user_mentions ?? []).map((user) => ({
    userName: user.screen_name,
    name: user.name
  })),
  media: (tweet.extendedEntities?.media ?? [])
    .filter((item) => item.type === 'photo')
    .map((item) => ({
      url: item.media_url_https,
      width: item.original_info?.width ?? null,
      height: item.original_info?.height ?? null,
      alt: item.ext_alt_text ?? null
    }))
});

const validateCatalog = (catalog) => {
  if (!catalog)
    throw new Error('Photo catalog metadata is not initialized; import the seed first.');
  if (typeof catalog.account !== 'string' || !catalog.account.trim()) {
    throw new Error('Photo catalog account is invalid.');
  }
  if (
    !Array.isArray(catalog.hashtagQueries) ||
    catalog.hashtagQueries.length === 0 ||
    !catalog.hashtagQueries.every((query) => typeof query === 'string' && query.trim())
  ) {
    throw new Error('Photo catalog hashtagQueries are invalid.');
  }
  if (!isDate(catalog.fetchedAt)) throw new Error('Photo catalog fetchedAt is invalid.');
  if (catalog.newestSeenAt !== null && !isDate(catalog.newestSeenAt)) {
    throw new Error('Photo catalog newestSeenAt is invalid.');
  }
};

const validateExistingPosts = (posts) => {
  const ids = new Set();
  for (const post of posts) {
    if (typeof post.sourceId !== 'string' || !/^\d+$/.test(post.sourceId)) {
      throw new Error('CMS contains a post without a numeric sourceId.');
    }
    if (ids.has(post.sourceId)) throw new Error('CMS contains duplicate sourceIds.');
    ids.add(post.sourceId);
    if (!isDate(post.postedAt)) {
      throw new Error(`CMS post ${post.sourceId} has an invalid postedAt timestamp.`);
    }
  }
  return ids;
};

const cmsPost = (post) => ({
  sourceId: post.id,
  url: post.url,
  postedAt: post.createdAt,
  text: post.text,
  authorUserName: post.author.userName,
  authorName: post.author.name ?? null,
  hashtags: post.hashtags,
  mentions: post.mentions,
  media: post.media
});

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

const mismatchedFields = (expected, actual) =>
  postFields.filter(
    (field) =>
      JSON.stringify(normalizeJson(expected[field])) !==
      JSON.stringify(normalizeJson(actual?.[field]))
  );

const indexExisting = (posts) => {
  const indexed = new Map();
  for (const post of posts) {
    if (typeof post.sourceId !== 'string' || !/^\d+$/.test(post.sourceId)) {
      throw new Error('CMS contains a post without a numeric sourceId.');
    }
    if (indexed.has(post.sourceId)) throw new Error('CMS contains duplicate sourceIds.');
    indexed.set(post.sourceId, post);
  }
  return indexed;
};

const requestPosts = async (apiKey, query, queryType, cursor) => {
  const url = new URL('https://api.twitterapi.io/twitter/tweet/advanced_search');
  url.searchParams.set('query', query);
  url.searchParams.set('queryType', queryType);
  if (cursor) url.searchParams.set('cursor', cursor);

  let response;
  try {
    response = await fetch(url, {
      headers: { 'X-API-Key': apiKey },
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    throw new Error('The post provider request could not be completed.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`The post provider returned invalid JSON (HTTP ${response.status}).`);
  }
  if (!response.ok) throw new Error(`The post provider request failed (HTTP ${response.status}).`);
  if (
    !Array.isArray(data?.tweets) ||
    typeof data.has_next_page !== 'boolean' ||
    (data.has_next_page && (typeof data.next_cursor !== 'string' || !data.next_cursor))
  ) {
    throw new Error('The post provider returned invalid tweet or pagination data.');
  }
  return { ...data, tweets: data.tweets ?? [], has_next_page: data.has_next_page === true };
};

const validateTweet = (tweet) => {
  if (
    typeof tweet?.id !== 'string' ||
    !/^\d+$/.test(tweet.id) ||
    !isDate(tweet.createdAt) ||
    typeof tweet.author?.userName !== 'string' ||
    !tweet.author.userName ||
    (tweet.author.name != null && typeof tweet.author.name !== 'string') ||
    typeof tweet.text !== 'string'
  ) {
    throw new Error('The post provider returned a tweet with invalid canonical fields.');
  }

  const hashtags = tweet.entities?.hashtags ?? [];
  const mentions = tweet.entities?.user_mentions ?? [];
  const media = tweet.extendedEntities?.media ?? [];
  if (
    !Array.isArray(hashtags) ||
    !hashtags.every((tag) => typeof tag?.text === 'string') ||
    !Array.isArray(mentions) ||
    !mentions.every(
      (mention) => typeof mention?.screen_name === 'string' && typeof mention.name === 'string'
    ) ||
    !Array.isArray(media)
  ) {
    throw new Error('The post provider returned invalid tweet entities.');
  }

  for (const item of media.filter((entry) => entry?.type === 'photo')) {
    let url;
    try {
      url = new URL(item.media_url_https);
    } catch {
      throw new Error('The post provider returned an invalid photo URL.');
    }
    if (
      url.protocol !== 'https:' ||
      !url.hostname.toLowerCase().endsWith('.twimg.com') ||
      (item.original_info?.width != null && !Number.isInteger(item.original_info.width)) ||
      (item.original_info?.height != null && !Number.isInteger(item.original_info.height)) ||
      (item.ext_alt_text != null && typeof item.ext_alt_text !== 'string')
    ) {
      throw new Error('The post provider returned invalid photo metadata.');
    }
  }
};

const run = async () => {
  assertWriteConfigured();
  if (!apiKey) throw new Error('TWEETAPI_IO_API_KEY is not set.');
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new Error('KAMEKO_MAX_PAGES must be a positive integer.');
  }

  const cms = createKamekoCms();
  const catalog = await cms.getCatalog();
  validateCatalog(catalog);
  const existingPosts = await cms.listPosts();
  const known = validateExistingPosts(existingPosts);
  let newestSeen = catalog.newestSeenAt ? Date.parse(catalog.newestSeenAt) : 0;
  const since = !deep && newestSeen ? ` since_time:${Math.floor(newestSeen / 1000) + 1}` : '';
  const combined = `(${catalog.hashtagQueries.map((tags) => `(${tags})`).join(' OR ')})`;
  const queries = deep
    ? catalog.hashtagQueries.flatMap((tags) => [
        [`from:${catalog.account} ${tags} filter:images`, 'Latest'],
        [`from:${catalog.account} ${tags} filter:images`, 'Top']
      ])
    : [[`from:${catalog.account} ${combined} filter:images${since}`, 'Latest']];

  const fetched = new Map();
  let requests = 0;
  for (const [query, queryType] of queries) {
    let cursor = '';
    const seenCursors = new Set();
    for (let page = 1; page <= maxPages; page += 1) {
      const data = await requestPosts(apiKey, query, queryType, cursor);
      requests += 1;

      for (const tweet of data.tweets) {
        validateTweet(tweet);
        if (tweet.author.userName.toLowerCase() !== catalog.account.toLowerCase()) continue;
        newestSeen = Math.max(newestSeen, Date.parse(tweet.createdAt));
        const post = toPost(tweet);
        if (post.media.length > 0 && belongs(post.hashtags)) fetched.set(post.id, post);
      }

      if (!data.has_next_page) break;
      if (page === maxPages) {
        throw new Error(
          `Refresh stopped at KAMEKO_MAX_PAGES=${maxPages}; provider has another page. No CMS writes were made.`
        );
      }
      if (seenCursors.has(data.next_cursor)) {
        throw new Error('The post provider repeated a cursor while additional pages remained.');
      }
      seenCursors.add(data.next_cursor);
      cursor = data.next_cursor;
    }
  }

  const current = indexExisting(await cms.listPosts());
  const writes = [];
  for (const post of fetched.values()) {
    const record = cmsPost(post);
    const existing = current.get(record.sourceId);
    if (!existing) {
      writes.push({ type: 'create', record });
    } else if (mismatchedFields(record, existing).length) {
      if (typeof existing.documentId !== 'string' || !existing.documentId) {
        throw new Error(
          `CMS post ${record.sourceId} is missing documentId; no CMS writes were made.`
        );
      }
      writes.push({ type: 'update', record, documentId: existing.documentId });
    }
  }

  let completed = 0;
  for (const item of writes) {
    try {
      if (item.type === 'create') await cms.createPost(item.record);
      else await cms.updatePost(item.documentId, item.record);
      completed += 1;
    } catch (error) {
      throw new Error(
        `CMS post write failed for sourceId ${item.record.sourceId} after ${completed} of ${writes.length} writes. ` +
          `Catalog watermark was not updated; rerunning is idempotent. ${error.message}`
      );
    }
  }

  try {
    const readback = indexExisting(await cms.listPosts());
    for (const post of fetched.values()) {
      const expected = cmsPost(post);
      const actual = readback.get(expected.sourceId);
      if (!actual || mismatchedFields(expected, actual).length) {
        throw new Error(`CMS readback differs for sourceId ${expected.sourceId}.`);
      }
    }
  } catch (error) {
    throw new Error(
      `CMS posts may have been written, but canonical-field readback failed. Catalog watermark was not updated. ${error.message}`
    );
  }

  const updatedCatalog = {
    account: catalog.account,
    hashtagQueries: catalog.hashtagQueries,
    fetchedAt: new Date().toISOString(),
    newestSeenAt: newestSeen ? new Date(newestSeen).toISOString() : null
  };
  try {
    await cms.updateCatalog(updatedCatalog);
    const savedCatalog = await cms.getCatalog();
    const fields = ['account', 'hashtagQueries', 'fetchedAt', 'newestSeenAt'];
    if (
      !savedCatalog ||
      fields.some(
        (field) =>
          JSON.stringify(normalizeJson(updatedCatalog[field])) !==
          JSON.stringify(normalizeJson(savedCatalog[field]))
      )
    ) {
      throw new Error('Catalog metadata readback differs.');
    }
  } catch (error) {
    throw new Error(
      `CMS posts were written and verified, but catalog metadata was not verified. Inspect the catalog before retrying. ${error.message}`
    );
  }

  console.log(
    `mode=${deep ? 'deep' : 'incremental'} requests=${requests} new=${[...fetched.keys()].filter((id) => !known.has(id)).length} ` +
      `total=${current.size + writes.filter((item) => item.type === 'create').length} ` +
      `cmsWrites=${writes.length} watermark=verified`
  );
};

try {
  await run();
} catch (error) {
  console.error(`Kameko CMS refresh failed: ${error.message}`);
  process.exitCode = 1;
}
