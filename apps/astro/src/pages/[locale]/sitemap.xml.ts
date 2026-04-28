import type { APIRoute } from 'astro';
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
  const urls: string[] = [];

  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      const path = route === '/' ? `/${locale}` : `/${locale}${route}`;
      urls.push(`  <url><loc>${SITE_URL}${path}</loc></url>`);
    }
  }

  try {
    const data = await graphQLSdk.fetchProjects({ limit: 75 });
    const projects = data?.projects ?? [];
    for (const project of projects) {
      const slug = (project as Record<string, unknown>).slug as string | undefined;
      if (!slug) continue;
      for (const locale of LOCALES) {
        urls.push(`  <url><loc>${SITE_URL}/${locale}/projects/${slug}</loc></url>`);
      }
    }
  } catch {
    // GraphQL unavailable — return static routes only
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
