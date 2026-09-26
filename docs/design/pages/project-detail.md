# Project detail

- **URL:** `/{locale}/projects/{slug}`
- **Source:** `apps/astro/src/pages/[locale]/projects/[slug]/index.astro`
- **Layout:** `MainLayout`

## Purpose

This page covers one project: what it is, why it exists, its features, screenshots, and links to the live site and the source.

## Anatomy

```
← Back to projects
┌ banner screenshot (true colour) ─────────────────────┐
[Projects]
Aibou
Side Project | August 2022 – Present
Tags: TYPESCRIPT REACT NEXT.JS WEB WORKER
────────────────────────────────────────────────────────
markdown content                         ┌ Open ────────┐
                                         │ Web  …       │
                                         │ GitHub …     │
Screenshots                              └──────────────┘
[carousel with thumbnails]
```

## Data and caching

- `graphQLSdk.getProjectBySlug({ slug })` wrapped in `withLastGood('project:{slug}')`.
- An unknown slug redirects to `/{locale}/404`. Upstream unavailable gives 503 with no-store. Otherwise 86400 s.

## States

- **Unavailable:** `project.status-unavailable`, `project.detail-empty-title` and `-description`.

## Interactions

- The screenshot carousel is a `Carousel` island (`client:visible`).
- Links in the rail open externally via `LinkItem`.

## Rules

- The banner shows at true colour (`--atelier-image-plate`); it is the page's main product image.
- The "Projects" eyebrow stays; it names the section on a detail page.
