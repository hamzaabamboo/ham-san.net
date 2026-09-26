import type { APIRoute } from 'astro';
import { escapeXml } from 'utils/xml';
import { graphQLSdk } from '~/graphql';

export const prerender = false;

const SITE_URL = 'https://ham-san.net';
const LOCALES = ['en', 'ja', 'th'];

const STATIC_ROUTES = [
  '/',
  '/projects',
  '/notes',
  '/hobbies',
  '/about',
  '/contact',
  '/tags',
  '/events'
];

export const GET: APIRoute = async () => {
  let cmsUnavailable = false;
  const urls: string[] = [];

  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      const path = route === '/' ? `/${locale}` : `/${locale}${route}`;
      urls.push(`  <url><loc>${escapeXml(SITE_URL + path)}</loc></url>`);
    }
  }

  try {
    const data = await graphQLSdk.fetchProjects({ limit: 75 });
    const projects = data?.projects ?? [];
    for (const project of projects) {
      const slug = (project as Record<string, unknown>).slug as string | undefined;
      if (!slug) continue;
      for (const locale of LOCALES) {
        const href = `${SITE_URL}/${locale}/projects/${encodeURIComponent(slug)}`;
        urls.push(`  <url><loc>${escapeXml(href)}</loc></url>`);
      }
    }
  } catch {
    // GraphQL unavailable: serve the static routes, but do not cache a truncated sitemap.
    cmsUnavailable = true;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // A truncated sitemap served as 200 is read by a crawler as authoritative, which can
  // deindex every project page. `rss.xml.ts` already returns 503 in the equivalent branch.
  return new Response(sitemap, {
    status: cmsUnavailable ? 503 : 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': cmsUnavailable ? 'no-store' : 'public, max-age=3600',
      'CDN-Cache-Control': cmsUnavailable ? 'no-store' : 'public, max-age=3600, must-revalidate'
    }
  });
};
