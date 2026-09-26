import { readFile, writeFile } from 'node:fs/promises';

const cacheUrl = new URL('../src/constants/kameko-posts.json', import.meta.url);
const account = 'HamP_punipuni';
const hashtagQueries = [
  '#カメコしてみた',
  '#百瀬安由未',
  '#蓮ノ空 #zweigen',
  '#蓮ノ空 #ツェーゲン'
];
const zweigenTags = ['zweigen', 'ツェーゲン', 'ツエーゲン'];
const belongs = (tags) =>
  tags.includes('カメコしてみた') ||
  tags.includes('百瀬安由未') ||
  (tags.includes('蓮ノ空') && tags.some((tag) => zweigenTags.includes(tag)));
const deep = process.env.KAMEKO_DEEP === '1';
const maxPages = Number(process.env.KAMEKO_MAX_PAGES ?? 30);
const apiKey = process.env.TWEETAPI_IO_API_KEY;

if (!apiKey) {
  console.error('TWEETAPI_IO_API_KEY is not set');
  process.exit(1);
}

const readCache = async () => {
  try {
    return JSON.parse(await readFile(cacheUrl, 'utf8'));
  } catch {
    return { posts: [] };
  }
};

const toPost = (tweet) => ({
  id: tweet.id,
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

const cache = await readCache();
const known = new Set(cache.posts.map((post) => post.id));
const newest = cache.posts.reduce(
  (latest, post) => Math.max(latest, Date.parse(post.createdAt)),
  cache.newestSeenAt ? Date.parse(cache.newestSeenAt) : 0
);
const since = !deep && newest ? ` since_time:${Math.floor(newest / 1000) + 1}` : '';
const combined = `(${hashtagQueries.map((tags) => `(${tags})`).join(' OR ')})`;
const queries = deep
  ? hashtagQueries.flatMap((tags) => [
      [`from:${account} ${tags} filter:images`, 'Latest'],
      [`from:${account} ${tags} filter:images`, 'Top']
    ])
  : [[`from:${account} ${combined} filter:images${since}`, 'Latest']];

const fetched = new Map();
let requests = 0;
let newestSeen = newest;
for (const [query, queryType] of queries) {
  let cursor = '';
  for (let page = 0; page < maxPages; page++) {
    const url = new URL('https://api.twitterapi.io/twitter/tweet/advanced_search');
    url.searchParams.set('query', query);
    url.searchParams.set('queryType', queryType);
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    requests += 1;
    const data = await response.json();
    if (!response.ok) {
      console.error(`Request failed (${response.status}): ${JSON.stringify(data).slice(0, 300)}`);
      process.exit(1);
    }
    let reachedKnown = false;
    let unseen = 0;
    for (const tweet of data.tweets ?? []) {
      newestSeen = Math.max(newestSeen, Date.parse(tweet.createdAt));
      if (known.has(tweet.id)) {
        reachedKnown = !deep;
        continue;
      }
      unseen += 1;
      if (tweet.author?.userName?.toLowerCase() !== account.toLowerCase()) continue;
      const post = toPost(tweet);
      known.add(tweet.id);
      if (post.media.length > 0 && belongs(post.hashtags)) fetched.set(post.id, post);
    }
    if (reachedKnown || unseen === 0 || !data.has_next_page || !data.next_cursor) break;
    cursor = data.next_cursor;
  }
}

const posts = [...fetched.values(), ...cache.posts].sort(
  (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
);
await writeFile(
  cacheUrl,
  `${JSON.stringify(
    {
      account,
      hashtagQueries,
      fetchedAt: new Date().toISOString(),
      newestSeenAt: newestSeen ? new Date(newestSeen).toISOString() : null,
      posts
    },
    null,
    2
  )}\n`
);
console.log(
  `mode=${deep ? 'deep' : 'incremental'} requests=${requests} new=${fetched.size} total=${posts.length}`
);
