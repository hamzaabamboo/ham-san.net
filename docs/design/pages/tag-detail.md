# Tag detail

- **URL:** `/{locale}/tags/{slug}`
- **Source:** `apps/astro/src/pages/[locale]/tags/[slug]/index.astro`
- **Layout:** `MainLayout`

## Purpose

This page shows everything connected to one technology: the jobs where Ham used it and the projects built with it.

## Anatomy

```
← Tags
[Tags]
CSS
Frontend
Experience ───────────────────────────────────────────
┌ Arsaga Partners  Frontend Engineer | dates  tags ──┐
│ description / sub-projects / bullets               │
└────────────────────────────────────────────────────┘
…
Projects ─────────────────────────────────────────────
[ProjectCard] [ProjectCard] [ProjectCard]
```

## Data and caching

- `graphQLSdk.getTagBySlug({ slug })` wrapped in `withLastGood('tag:{slug}')`, with a fallback that searches About data for an alternate slug.
- An unknown tag redirects to `/{locale}/404`. Unavailable gives 503 with no-store. Otherwise 86400 s.

## States

- **Unavailable:** `note.status-unavailable` with `common.tags-empty-*`.

## Rules

- Project cards use `ProjectCard`: an image only when one exists, and a sentence-case "Open project" link with no arrow glyph.
- The "Tags" eyebrow stays; it names the section on a detail page.
