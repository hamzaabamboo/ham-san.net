import { withLastGoodState } from './cms-cache';
import { parseKamekoPosts, unifyEvents } from '~/utils/kameko';
import type { KamekoEntry, KamekoMedia, KamekoPost } from '~/utils/kameko';

type PhotoCatalog = {
  account: string;
  hashtagQueries: string[];
  fetchedAt: string;
  newestSeenAt: string | null;
};

type CmsPost = {
  sourceId: string;
  url: string;
  postedAt: string;
  text: string;
  authorUserName: string;
  authorName: string | null;
  hashtags: string[];
  mentions: Array<{ userName: string; name: string }>;
  media: KamekoMedia[];
};

type CatalogResult = {
  account: string;
  fetchedAt: string;
  newestSeenAt: string | null;
  entries: KamekoEntry[];
};

type Pagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

const pageSize = 100;
const cacheTtl = 60_000;
const cacheLimit = 4;
const cache = new Map<string, { value: CatalogResult; storedAt: number }>();
const inFlight = new Map<string, Promise<CatalogResult>>();
const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const isString = (value: unknown): value is string => typeof value === 'string';
const isInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value);

const isIsoDate = (value: unknown): value is string => {
  if (!isString(value) || !isoDatePattern.test(value) || !Number.isFinite(Date.parse(value))) {
    return false;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const hour = Number(value.slice(11, 13));
  const minute = Number(value.slice(14, 16));
  const second = Number(value.slice(17, 19));
  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day &&
    utc.getUTCHours() === hour &&
    utc.getUTCMinutes() === minute &&
    utc.getUTCSeconds() === second
  );
};

const apiBaseUrl = () => {
  const privatePhotoCatalogApiUrl =
    process.env.PRIVATE_PHOTO_CATALOG_API_URL ?? import.meta.env.PRIVATE_PHOTO_CATALOG_API_URL;
  const privateBackendApiUrl =
    process.env.PRIVATE_BACKEND_API_URL ?? import.meta.env.PRIVATE_BACKEND_API_URL;
  const publicApiUrl = process.env.PUBLIC_API_URL ?? import.meta.env.PUBLIC_API_URL;
  const value = privatePhotoCatalogApiUrl || privateBackendApiUrl || publicApiUrl;
  if (!value) throw new Error('Photo catalog CMS URL is not configured.');

  let base: URL;
  try {
    base = new URL(value);
  } catch {
    throw new Error('Photo catalog CMS URL is invalid.');
  }

  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) {
    throw new Error('Photo catalog CMS URL must use HTTP(S) without embedded credentials.');
  }

  base.search = '';
  base.hash = '';
  base.pathname = `${base.pathname.replace(/\/+$/, '')}/`;
  return base;
};

const fetchJson = async (base: URL, endpoint: string) => {
  let response: Response;
  try {
    response = await fetch(new URL(endpoint.replace(/^\/+/, ''), base), {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(7000)
    });
  } catch {
    throw new Error(`Photo catalog CMS ${endpoint.split('?')[0]} could not be reached.`);
  }

  if (!response.ok) {
    throw new Error(
      `Photo catalog CMS ${endpoint.split('?')[0]} failed with HTTP ${response.status}.`
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`Photo catalog CMS ${endpoint.split('?')[0]} returned invalid JSON.`);
  }
};

const catalogFromResponse = (value: unknown): PhotoCatalog => {
  const data = isRecord(value) && isRecord(value.data) ? value.data : null;
  if (
    !data ||
    !isString(data.account) ||
    data.account.trim().length === 0 ||
    !Array.isArray(data.hashtagQueries) ||
    !data.hashtagQueries.every(isString) ||
    !isIsoDate(data.fetchedAt) ||
    !(data.newestSeenAt === null || isIsoDate(data.newestSeenAt))
  ) {
    throw new Error('Photo catalog CMS returned invalid catalog metadata.');
  }

  return {
    account: data.account,
    hashtagQueries: data.hashtagQueries,
    fetchedAt: data.fetchedAt,
    newestSeenAt: data.newestSeenAt
  };
};

const httpsUrl = (value: unknown, label: string, hostname?: (host: string) => boolean) => {
  if (!isString(value)) throw new Error(`Photo catalog CMS returned invalid ${label}.`);

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Photo catalog CMS returned invalid ${label}.`);
  }

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    (hostname && !hostname(url.hostname.toLowerCase()))
  ) {
    throw new Error(`Photo catalog CMS returned invalid ${label}.`);
  }

  return value;
};

const validateMedia = (value: unknown, sourceId: string): KamekoMedia[] => {
  if (!Array.isArray(value)) throw new Error(`Photo catalog post ${sourceId} has invalid media.`);

  return value.map((media, index) => {
    if (
      !isRecord(media) ||
      (media.width !== null && (!isInteger(media.width) || media.width < 1)) ||
      (media.height !== null && (!isInteger(media.height) || media.height < 1)) ||
      (media.alt !== null && !isString(media.alt))
    ) {
      throw new Error(`Photo catalog post ${sourceId} has invalid media item ${index + 1}.`);
    }

    return {
      url: httpsUrl(media.url, `media URL for ${sourceId}`, (host) => host.endsWith('.twimg.com')),
      width: media.width as number | null,
      height: media.height as number | null,
      alt: media.alt as string | null
    };
  });
};

const validatePost = (value: unknown): CmsPost => {
  if (!isRecord(value)) throw new Error('Photo catalog CMS returned an invalid post.');
  const sourceId = isString(value.sourceId) ? value.sourceId : '';
  if (!/^\d+$/.test(sourceId)) {
    throw new Error('Photo catalog CMS returned a post without a numeric source ID.');
  }

  const authorUserName = isString(value.authorUserName) ? value.authorUserName : '';
  if (
    !authorUserName ||
    !(value.authorName === null || isString(value.authorName)) ||
    !isString(value.text) ||
    !isIsoDate(value.postedAt) ||
    !Array.isArray(value.hashtags) ||
    !value.hashtags.every(isString) ||
    !Array.isArray(value.mentions) ||
    !value.mentions.every(
      (mention) => isRecord(mention) && isString(mention.userName) && isString(mention.name)
    )
  ) {
    throw new Error(`Photo catalog post ${sourceId} has invalid fields.`);
  }

  const url = httpsUrl(value.url, `post URL for ${sourceId}`, (host) => host === 'x.com');
  const media = validateMedia(value.media, sourceId);

  return {
    sourceId,
    url,
    postedAt: value.postedAt,
    text: value.text,
    authorUserName,
    authorName: value.authorName,
    hashtags: value.hashtags,
    mentions: value.mentions,
    media
  };
};

const parsePagination = (value: unknown, expectedPage: number): Pagination => {
  const meta = isRecord(value) && isRecord(value.meta) ? value.meta : null;
  const pagination = meta && isRecord(meta.pagination) ? meta.pagination : null;
  if (
    !pagination ||
    pagination.page !== expectedPage ||
    !isInteger(pagination.pageCount) ||
    pagination.pageCount < 0 ||
    !isInteger(pagination.pageSize) ||
    pagination.pageSize < 1 ||
    pagination.pageSize > pageSize ||
    !isInteger(pagination.total) ||
    pagination.total < 0
  ) {
    throw new Error('Photo catalog CMS returned invalid pagination data.');
  }

  return pagination as Pagination;
};

const readPosts = async (base: URL): Promise<KamekoPost[]> => {
  const posts: KamekoPost[] = [];
  const seen = new Set<string>();
  let page = 1;
  let pageCount: number | undefined;
  let total: number | undefined;

  do {
    const query = new URLSearchParams({
      'pagination[page]': String(page),
      'pagination[pageSize]': String(pageSize),
      'sort[0]': 'sourceId:asc'
    });
    const response = await fetchJson(base, `/api/kameko-posts?${query}`);
    const pagination = parsePagination(response, page);
    if (
      (pageCount !== undefined && pagination.pageCount !== pageCount) ||
      (total !== undefined && pagination.total !== total)
    ) {
      throw new Error('Photo catalog CMS collection changed while reading.');
    }
    if (!isRecord(response) || !Array.isArray(response.data)) {
      throw new Error('Photo catalog CMS returned invalid post data.');
    }

    pageCount = pagination.pageCount;
    total = pagination.total;
    for (const item of response.data) {
      const post = validatePost(item);
      if (seen.has(post.sourceId)) {
        throw new Error(`Photo catalog CMS returned duplicate source ID ${post.sourceId}.`);
      }
      seen.add(post.sourceId);
      posts.push({
        id: post.sourceId,
        url: post.url,
        createdAt: post.postedAt,
        text: post.text,
        author: { userName: post.authorUserName, name: post.authorName ?? '' },
        hashtags: post.hashtags,
        mentions: post.mentions,
        media: post.media
      });
    }
    page += 1;
  } while (page <= (pageCount ?? 0));

  if (posts.length !== total)
    throw new Error('Photo catalog CMS returned an incomplete collection.');
  return posts;
};

const fetchCatalog = async (base: URL): Promise<CatalogResult> => {
  const [metadataResponse, posts] = await Promise.all([
    fetchJson(base, '/api/photo-catalog'),
    readPosts(base)
  ]);
  const metadata = catalogFromResponse(metadataResponse);
  const entries = unifyEvents(parseKamekoPosts(posts).filter((entry) => entry.subjects.length > 0));

  return {
    account: metadata.account,
    fetchedAt: metadata.fetchedAt,
    newestSeenAt: metadata.newestSeenAt,
    entries
  };
};

const retainRecent = (key: string, value: CatalogResult) => {
  cache.delete(key);
  cache.set(key, { value, storedAt: Date.now() });
  while (cache.size > cacheLimit) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
};

export const getPhotoCatalog = async (): Promise<CatalogResult> => {
  const base = apiBaseUrl();
  const key = base.href;
  const cached = cache.get(key);
  const age = cached ? Date.now() - cached.storedAt : Infinity;
  if (cached && age >= 0 && age < cacheTtl) return cached.value;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const request = (async () => {
    const result = await withLastGoodState(`photo-catalog:${key}`, () => fetchCatalog(base));
    if (!result.fromCache) retainRecent(key, result.value);
    return result.value;
  })().finally(() => inFlight.delete(key));

  inFlight.set(key, request);
  return request;
};
