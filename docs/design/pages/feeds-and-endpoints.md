# Feeds and endpoints

These routes have no visual design, but they are part of the site's public surface.

## RSS: `/{locale}/rss.xml`

- **Source:** `apps/astro/src/pages/[locale]/rss.xml.ts`
- **Content:** Outline `shares.list`, one `<item>` per public note (title, link to `/{locale}/notes/{id}`, excerpt). The channel title and description come from `note.rss-title` and `note.rss-description`.
- **Caching:** `Cache-Control: public, max-age=3600`. When Outline fails it returns 503 with an empty item list and `no-store`.

## Sitemap: `/{locale}/sitemap.xml`

- **Source:** `apps/astro/src/pages/[locale]/sitemap.xml.ts`
- **Content:** every static route for `en`, `ja` and `th`:
  - `/`, `/projects`, `/notes`, `/hobbies`, `/about`, `/contact`, `/tags`, `/events`, `/photos`, `/room`;
  - plus one entry per project.
- **Caching:** 3600 s. When the CMS fails it returns 503 with static routes only, so crawlers don't treat a truncated list as authoritative.
- `/photos` and `/room` were added on 2026-09-27.

## Outline asset proxy: `/api/outline-asset?id=…` (also `/{locale}/api/outline-asset`)

- **Source:** `apps/astro/src/pages/api/outline-asset.ts`
- **Behaviour:** proxies `attachments.redirect` with the server-side Outline token and an 8 s timeout.
- **Caching:** success returns `CDN-Cache-Control: public, max-age=604800, immutable`. A missing id returns 400; upstream failure returns 504.

## Root redirect: `/`

- **Source:** `apps/astro/src/pages/index.astro`
- **Behaviour:** redirects to `/{preferredLocale}`, falling back to `/en`.
