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
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Authorization: `Bearer ${outlineApiToken}`
      },
      signal: AbortSignal.timeout(8000)
    });
  } catch {
    return new Response('Asset upstream unavailable', { status: 504 });
  }

  const headers = new Headers();
  for (const key of ['content-type', 'content-length', 'cache-control', 'etag', 'last-modified']) {
    const value = upstreamResponse.headers.get(key);
    if (value) {
      headers.set(key, value);
    }
  }

  // This proxy serves every Outline image on the site. Without an explicit CDN header it
  // is a guaranteed miss, so each byte re-streams through the origin on every request.
  if (upstreamResponse.ok) {
    headers.set('CDN-Cache-Control', 'public, max-age=604800, immutable');
    if (!headers.has('cache-control')) {
      headers.set('Cache-Control', 'public, max-age=86400');
    }
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers
  });
};
