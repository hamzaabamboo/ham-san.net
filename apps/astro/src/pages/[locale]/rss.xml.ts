import type { APIRoute } from 'astro';
import { outlineClient } from '~/utils/outline-api';

export const prerender = false;

const SITE_URL = 'https://ham-san.net';

export const GET: APIRoute = async () => {
  let items = '';

  try {
    const shareRequest = await outlineClient.POST('/shares.list', {
      body: { sort: 'createdAt', direction: 'DESC', limit: 25 },
      headers: { Authorization: undefined as unknown as 'Bearer hoge' }
    });

    const articles = shareRequest.data?.data ?? [];
    const esc = (s: string) => s.replace(/[<>&]/g, (c) =>
      c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'
    );

    items = articles
      .map((share) => {
        const s = share as typeof share & {
          documentTitle?: string;
          documentSummary?: string;
        };
        const title = s.documentTitle ?? 'Untitled';
        const pubDate = s.createdAt
          ? new Date(s.createdAt).toUTCString()
          : new Date().toUTCString();
        const link = `${SITE_URL}/en/notes/${s.id ?? ''}`;
        const description = esc(s.documentSummary?.slice(0, 280) ?? '');

        return `    <item>
      <title>${esc(title)}</title>
      <link>${link}</link>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
      })
      .join('\n');
  } catch {
    // CMS unavailable — return empty feed
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ham's Web — Notes</title>
    <link>${SITE_URL}/en/notes</link>
    <description>Public notes from a personal knowledge base.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/en/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
