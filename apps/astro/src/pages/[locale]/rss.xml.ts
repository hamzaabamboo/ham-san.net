import type { APIRoute } from 'astro';
import { useTranslations, validateLocale } from '~/i18n/utils';
import { outlineClient } from '~/utils/outline-api';
import { requireOutlineOk } from '~/utils/outline-response';

export const prerender = false;

const SITE_URL = 'https://ham-san.net';

export const GET: APIRoute = async ({ params }) => {
  const locale = validateLocale(params.locale) ? params.locale : 'en';
  const t = useTranslations(locale);
  let items = '';
  let cmsUnavailable = false;

  try {
    const shareRequest = await outlineClient.POST('/shares.list', {
      body: { sort: 'createdAt', direction: 'DESC', limit: 25 },
      headers: { Authorization: undefined as unknown as 'Bearer hoge' }
    });
    requireOutlineOk(shareRequest, 'shares.list');

    const articles = shareRequest.data?.data ?? [];
    const esc = (s: string) =>
      s.replace(/[<>&]/g, (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'));

    items = articles
      .map((share) => {
        const s = share as typeof share & {
          documentTitle?: string;
          documentSummary?: string;
        };
        const title = s.documentTitle ?? t('note.untitled');
        const pubDate = s.createdAt ? new Date(s.createdAt).toUTCString() : undefined;
        const link = `${SITE_URL}/${locale}/notes/${s.id ?? ''}`;
        const description = esc(s.documentSummary?.slice(0, 280) ?? '');

        return `    <item>
      <title>${esc(title)}</title>
      <link>${link}</link>${pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ''}
      <description>${description}</description>
    </item>`;
      })
      .join('\n');
  } catch {
    cmsUnavailable = true;
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${t('note.rss-title')}</title>
    <link>${SITE_URL}/${locale}/notes</link>
    <description>${t('note.rss-description')}</description>
    <language>${locale}</language>
    <atom:link href="${SITE_URL}/${locale}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    status: cmsUnavailable ? 503 : 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': cmsUnavailable ? 'no-store' : 'public, max-age=3600'
    }
  });
};
