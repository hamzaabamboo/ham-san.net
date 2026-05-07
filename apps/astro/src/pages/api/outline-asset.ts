import type { APIRoute } from 'astro';
import { outlineApiToken, outlineServerUrl } from '~/utils/outline-api';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response('Missing asset id', { status: 400 });
  }

  const outlineBaseUrl = outlineServerUrl.replace(/\/api$/, '');
  const upstreamUrl = `${outlineBaseUrl}/api/attachments.redirect?${url.searchParams.toString()}`;
  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Authorization: `Bearer ${outlineApiToken}`
    }
  });

  const headers = new Headers();
  for (const key of ['content-type', 'content-length', 'cache-control', 'etag', 'last-modified']) {
    const value = upstreamResponse.headers.get(key);
    if (value) {
      headers.set(key, value);
    }
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers
  });
};
