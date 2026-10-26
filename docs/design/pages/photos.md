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

- 写真一覧は `src/utils/photo-catalog.ts` から Strapi の `photo-catalog` と `kameko-posts` を読み込む。画像は引き続き X の URL を使用する。Git の JSON は移行用の入力としてのみ残し、実行時のフォールバックには使用しない。
- 本番移行は未完了。先に CMS スキーマを反映し、`scripts/import-kameko-catalog.mjs --input <snapshot> --write` で全件を移行・照合してからフロントエンドを切り替える。既存の ADR 0003 は旧構成の記録。
- **Parser** (`parseKamekoPosts`), for the template `date / event / name @handle / caption / #tags`:
  - Legacy date formats `M月D日（曜）` and `YYYY-MM-DD` are supported.
  - Names come from `name @handle` lines, known names (subsequence match for typos and nicknames), and performer hashtags (the `performerTags` map).
  - Handles are canonicalised per name, and event spellings that differ only in spacing are merged.
  - Entries without a name are dropped.
- CMS 読み込みは同時リクエストを共有し、60 秒間キャッシュする。取得に失敗した場合は過去に取得できた CMS データを使用する。初回取得も失敗した場合は 503 と `no-store` を返し、検索結果が空であるかのように表示しない。
- `CDN-Cache-Control: public, max-age=60, must-revalidate`。
- **Refresh:** `cd apps/astro && bun run fetch:kameko`。`STRAPI_API_TOKEN`、`PRIVATE_BACKEND_API_URL` または `PUBLIC_API_URL`、`TWEETAPI_IO_API_KEY` を実行環境で設定する。
  - A catalog refresh requires running the fetcher, checking the metadata diff, and verifying the refreshed entries in the gallery. Viewer or layout changes alone do not refresh the catalog.
  - アカウント、検索条件、確定済みウォーターマークは CMS から取得する。全ページの取得後に投稿を upsert し、読み戻して照合してからウォーターマークを更新する。途中失敗時は既存投稿の最大日付で検索範囲を進めない。
  - `KAMEKO_DEEP=1` runs a full Latest+Top sweep. It is paid, so use it only with the owner's approval and a credit estimate.
  - The key lives in `with-meets-reminder/.env`. It is read at runtime only and never written to this repo.

## Interactions

- **Tile click** opens the X post in a new tab. That is the primary action, and it works without JavaScript.
- **Expand button** (top-right of each tile, 44px, visible on hover or focus, always visible on touch) opens the full-screen viewer:
  - a `<dialog>` with the `name=large` image from X;
  - names, date and event, and the caption;
  - "Open on X";
  - ←/→ keys, swipe, Escape, and backdrop click to close.
- **Filters** are plain links and a GET search form, so every lookup has a URL.
- **Protection:** the context menu and dragging are blocked on images, and a tile whose image fails to load hides itself (post deleted on X).

## Responsive

- Collage row height is 18rem on desktop and 9rem at ≤700 px (2–3 photos per row).
- Tile captions always show the person's name; the event line appears on hover or focus.
- The search form has a visible Search button and a Clear link when a query is set; facet chips are 44px tall; a Back to top link ends the grid.
- When failed images hide tiles, the result line and the viewer's previous/next skip them, and the empty message shows if none remain.
- Viewer navigation buttons are hidden at ≤700 px in favour of swipe.

## Rules

- **Never crop:** tiles use `aspect-ratio: var(--w) / var(--h)` from the photo's real size. A browser check confirms that tile width/height equals the photo ratio.
- **Never re-host:** images are always served from `pbs.twimg.com` with `referrerpolicy="no-referrer"`.
- **Never guess names:** a post without an identifiable person is excluded rather than labelled with an assumed name.
- No stat boxes. Counts live in the one result line.
