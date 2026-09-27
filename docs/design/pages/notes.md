# Notes

- **URL:** `/{locale}/notes`, with an optional `?page=N`
- **Source:** `apps/astro/src/pages/[locale]/notes/index.astro`
- **Layout:** `MainLayout`

## Purpose

This is the list of public notes from Ham's Outline knowledge base: chord charts, reviews, guides and drafts.

## Anatomy

```
Notes                                        (h1, amber eyebrow chip above)
Public notes from my personal knowledge base …
┌ Total notes 32 ┬ Collections 7 ┬ Latest June 2026 ┐
┌ Latest note (page 1 only) ──────────────────────────┐
│ ハナ咲けばユメ駆ける - コード   趣味 | June 2026        │
└─────────────────────────────────────────────────────┘
[note card] [note card]
[note card] [note card]  …
                                   [Older notes →]
```

## Data and caching

- Outline `shares.list`, fetched in pages with `retryOnce` and wrapped in `withLastGood('notes:list')`.
- An invalid `page` redirects to the base URL; a page past the end redirects to the last valid page.
- `CDN-Cache-Control` is 86400 s when the list loaded, otherwise 60 s.

## States

- **Loaded but empty:** `note.status-empty` with `note.empty-none-*`.
- **Fetch failed:** `note.status-unavailable` with `note.empty-*`.

## Rules

- Card titles use the display face. Japanese titles are not letter-spaced.
- The meta line (collection | date) sits at the bottom of each card (`mt="auto"`) so cards in a row align.
- The featured card appears on page 1 only.
