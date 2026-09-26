# Projects

- **URL:** `/{locale}/projects`
- **Source:** `apps/astro/src/pages/[locale]/projects/index.astro`
- **Layout:** `MainLayout`

## Purpose

This is the catalogue of Ham's web projects and experiments: active work first, then inactive work and earlier work.

## Anatomy

```
Work & Experiments.                          (h1, no eyebrow)
Web projects, small tools, and experiments I have worked on.
┌ Active 18 ┬ Inactive 24 ┬ Latest 2025 ┐
Active ─────────────────────────────────────────────
[screenshot card] [screenshot card]
[text card      ] [screenshot card]   (image only when one exists)
Inactive ───────────────────────────────────────────
[compact card] [compact card] [compact card]   (first 9)
Earlier work ───────────────────────────────────────
list of the remainder
```

Active cards show a 16:9 screenshot (optional), title, year, category chip, tech tags, a description and a "View project" link in sentence case.

## Data and caching

- `graphQLSdk.fetchProjects({ limit: 75 })` via `requireProjects`, wrapped in `withLastGood('projects')`.
- When unavailable: HTTP 503 with `no-store`. Otherwise 86400 s.

## States

- **No projects:** `project.status-unavailable`, `project.empty-title` and `project.empty-description`.

## Rules

- There are no monogram plates or watermark letters. A project without a screenshot renders as a text card (removed 2026-09-27).
- A screenshot that fails to load removes its frame (`onerror`).
- Screenshots sit in the graphite rest treatment and come to colour on hover (`--atelier-image-rest` and `--atelier-image-hover`).
