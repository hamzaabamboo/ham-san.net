# Hobbies

- **URL:** `/{locale}/hobbies`
- **Source:** `apps/astro/src/pages/[locale]/hobbies/index.astro`
- **Layout:** `MainLayout`

## Purpose

This is an index of Ham's hobbies (camera, typing, music, darts, Rubik's, posture, pen spinning, kendama, GeoGuessr, cardistry, drawing, yo-yo), each linking to its notes.

## Anatomy

```
Hobbies                                     (h1, amber eyebrow chip above)
Camera, music, typing, puzzles, darts, maps, and reference notes.
──────────────────────────────────────────────────────────────
[C] Camera                      [ACTIVE] [UPDATED …] [12 LINKS · 3 PAGES]
Wishlist / Research
──────────────────────────────────────────────────────────────
[P] Pen Spinning                [INACTIVE] [UPDATED …]
──────────────────────────────────────────────────────────────
```

Each row starts with an image tile (the hobby's image, or a grid-line plate with its display-face initial), then an optional content-type label, the title (display face), a description (only when the hobby has source content) and meta pills for status, last updated, and link and page counts.

## Data and caching

- Outline `documents.list` over the `hobbies-collection` from `getOutlineSettings()`, paginated and wrapped in `withLastGood('hobbies:list:{locale}')`.
- When unavailable: HTTP 503 with `CDN-Cache-Control: no-store`. Otherwise 86400 s.

## States

- **Unavailable:** `hobbies.status-unavailable`, `hobbies.empty-title` and `hobbies.empty-description`.
- **Empty collection:** `hobbies.status-empty`, `hobbies.empty-none-title` and `-description`.

## Rules

- Missing media renders the grid-line letter plate: deliberate fallback art, never an empty box (spec 03, comp 11).
- Hobbies without source content show the `hobbies.overview-empty-page` description.
- Row hover: a faint amber wash and underlined title, both driven from `hobbyRow` and `hobbyCardTitle`.
