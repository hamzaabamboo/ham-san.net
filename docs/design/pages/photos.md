# Photos

- **URL:** `/{locale}/photos`, with `?person=`, `?event=`, `?tag=` and `?q=` filters (combinable, shareable)
- **Source:** `apps/astro/src/pages/[locale]/photos/index.astro`, parser in `src/utils/kameko.ts`, styles in `src/styles/photos.css`, fetcher in `apps/astro/scripts/fetch-kameko.mjs`
- **Layout:** `MainLayout`

## Purpose

This is Ham's event portrait gallery: posts on X by @HamP_punipuni tagged `#カメコしてみた` or `#百瀬安由未`, or legacy posts tagged `#蓮ノ空` together with `#zweigen`/`#ツェーゲン`. Only posts that name at least one person are included. Every photo stays on X and links to its post.

## Anatomy

```
[#カメコしてみた]
Photos
Portraits I shot at events and posted on X …
Search photos [__________________]
People  [All] [百瀬安由未 64] [楡井希実 15] …
+ Events 29        (collapsed unless an event filter is active)
+ Tags 32          (collapsed unless a tag filter is active)
277 photos · 127 posts   Clear filters
┌──────────┬────────┬──────────────┐   justified collage:
│          │        │              │   each tile keeps its photo's
├───────┬──┴──────┬─┴───────┬──────┤   real aspect ratio,
│       │         │         │      │   rows fill the width
└───────┴─────────┴─────────┴──────┘
Photos load from X and link to their original posts …
Posted by @HamP_punipuni · Updated Sep 27, 2026
```

## Data and caching

- `kamekoEntries` comes from `src/constants/kameko-posts.json`, a committed cache holding post metadata and `pbs.twimg.com` media URLs. No image files are stored.
- **Parser** (`parseKamekoPosts`), for the template `date / event / name @handle / caption / #tags`:
  - Legacy date formats `M月D日（曜）` and `YYYY-MM-DD` are supported.
  - Names come from `name @handle` lines, known names (subsequence match for typos and nicknames), and performer hashtags (the `performerTags` map).
  - Handles are canonicalised per name, and event spellings that differ only in spacing are merged.
  - Entries without a name are dropped.
- `CDN-Cache-Control: public, max-age=3600, must-revalidate`.
- **Refresh:** `cd apps/astro && TWEETAPI_IO_API_KEY=… bun run fetch:kameko`.
  - One twitterapi.io search request covering all hashtag combinations, `since_time` the newest cached post. It skips known IDs.
  - `KAMEKO_DEEP=1` runs a full Latest+Top sweep. It is paid, so use it only with the owner's approval and a credit estimate.
  - The key lives in `with-meets-reminder/.env`. It is read at runtime only and never written to this repo.

## Interactions

- **Tile click** opens the X post in a new tab. That is the primary action, and it works without JavaScript.
- **Expand button** (top-right of each tile, visible on hover or focus, always visible on touch) opens the full-screen viewer:
  - a `<dialog>` with the `name=large` image from X;
  - names, date and event, and the caption;
  - "Open on X";
  - ←/→ keys, swipe, Escape, and backdrop click to close.
- **Filters** are plain links and a GET search form, so every lookup has a URL.
- **Protection:** the context menu and dragging are blocked on images, and a tile whose image fails to load hides itself (post deleted on X).

## Responsive

- Collage row height is 18rem on desktop and 9rem at ≤700 px (2–3 photos per row).
- On touch, tile captions show names only.
- Viewer navigation buttons are hidden at ≤700 px in favour of swipe.

## Rules

- **Never crop:** tiles use `aspect-ratio: var(--w) / var(--h)` from the photo's real size. A browser check confirms that tile width/height equals the photo ratio.
- **Never re-host:** images are always served from `pbs.twimg.com` with `referrerpolicy="no-referrer"`.
- **Never guess names:** a post without an identifiable person is excluded rather than labelled with an assumed name.
- No stat boxes. Counts live in the one result line.
