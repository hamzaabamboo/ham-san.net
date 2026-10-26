const pageSize = 100;
const postsPath = '/api/kameko-posts';
const catalogPath = '/api/photo-catalog';

export const postFields = [
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

export const catalogFields = ['account', 'hashtagQueries', 'fetchedAt', 'newestSeenAt'];

const configuredBaseUrl = () => {
  const value = process.env.PRIVATE_BACKEND_API_URL || process.env.PUBLIC_API_URL;
  if (!value) throw new Error('Set PRIVATE_BACKEND_API_URL or PUBLIC_API_URL.');

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('The CMS base URL is invalid.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('The CMS base URL must use HTTP(S) without embedded credentials.');
  }

  parsed.search = '';
  parsed.hash = '';
  parsed.pathname = `${parsed.pathname.replace(/\/+$/, '')}/`;
  return parsed;
};

const writeToken = () => {
  const token = process.env.STRAPI_API_TOKEN?.trim();
  if (!token) throw new Error('Set STRAPI_API_TOKEN before using --write.');
  return token;
};

const responseError = (method, endpoint, status) => {
  const advice =
    status === 401 || status === 403
      ? ' Check STRAPI_API_TOKEN and the Strapi role permissions.'
      : status === 404
        ? ' Check that the Strapi content-type route exists.'
        : status === 400 || status === 422
          ? ' Check that the CMS schema matches the submitted fields.'
          : '';
  return new Error(`CMS ${method} ${endpoint} failed with HTTP ${status}.${advice}`);
};

export const assertWriteConfigured = () => {
  writeToken();
};

export const createKamekoCms = () => {
  const baseUrl = configuredBaseUrl();

  const request = async (method, endpoint, data, allowNotFound = false) => {
    const headers = { Accept: 'application/json', 'Cache-Control': 'no-cache' };
    const options = { method, headers, signal: AbortSignal.timeout(10000) };
    if (data !== undefined) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify({ data });
    }
    if (method !== 'GET') headers.Authorization = `Bearer ${writeToken()}`;

    let response;
    try {
      response = await fetch(new URL(endpoint.replace(/^\/+/, ''), baseUrl), options);
    } catch {
      throw new Error(`CMS ${method} ${endpoint.split('?')[0]} could not be reached.`);
    }

    if (response.status === 404 && allowNotFound) return null;
    if (!response.ok) throw responseError(method, endpoint.split('?')[0], response.status);
    if (response.status === 204) return null;

    try {
      return await response.json();
    } catch {
      throw new Error(`CMS ${method} ${endpoint.split('?')[0]} returned invalid JSON.`);
    }
  };

  const getPostsPage = async (page) => {
    const query = new URLSearchParams({
      'pagination[page]': String(page),
      'pagination[pageSize]': String(pageSize),
      'sort[0]': 'sourceId:asc'
    });
    const response = await request('GET', `${postsPath}?${query}`);
    const pagination = response?.meta?.pagination;
    if (
      !Array.isArray(response?.data) ||
      !Number.isInteger(pagination?.pageCount) ||
      pagination.page !== page ||
      pagination.pageCount < 0 ||
      !Number.isInteger(pagination.pageSize) ||
      pagination.pageSize < 1 ||
      pagination.pageSize > pageSize
    ) {
      throw new Error(`CMS GET ${postsPath} returned invalid pagination data.`);
    }
    if (!Number.isInteger(pagination.total) || pagination.total < 0) {
      throw new Error(`CMS GET ${postsPath} returned invalid pagination totals.`);
    }
    return {
      records: response.data,
      pageCount: pagination.pageCount,
      pageSize: pagination.pageSize,
      total: pagination.total
    };
  };

  const listPosts = async () => {
    const records = [];
    let page = 1;
    let pageCount;
    let total;

    do {
      const result = await getPostsPage(page);
      if (
        (pageCount !== undefined && result.pageCount !== pageCount) ||
        (total !== undefined && result.total !== total)
      ) {
        throw new Error(`CMS GET ${postsPath} changed pagination while reading.`);
      }
      pageCount = result.pageCount;
      total = result.total;
      records.push(...result.records);
      page += 1;
    } while (page <= pageCount);

    if (records.length !== total) {
      throw new Error(`CMS GET ${postsPath} returned an incomplete collection.`);
    }

    return records;
  };

  const getCatalog = async () => {
    const response = await request('GET', catalogPath, undefined, true);
    if (response === null || response?.data === null) return null;
    if (!response?.data || typeof response.data !== 'object') {
      throw new Error(`CMS GET ${catalogPath} returned invalid data.`);
    }
    return response.data;
  };

  return {
    listPosts,
    getCatalog,
    createPost: (record) => request('POST', postsPath, record),
    updatePost: (documentId, record) =>
      request('PUT', `${postsPath}/${encodeURIComponent(documentId)}`, record),
    updateCatalog: (record) => request('PUT', catalogPath, record)
  };
};
