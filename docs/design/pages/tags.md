# Tags

- **URL:** `/{locale}/tags`
- **Source:** `apps/astro/src/pages/[locale]/tags/index.astro`
- **Layout:** `MainLayout`

## Purpose

This page gives an overview of Ham's skills and technologies, grouped by domain, each with a count of related experiences and projects.

## Anatomy

```
Tags                                          (h1, amber eyebrow chip above)
Skills, domains, and recurring themes …
FRONTEND ──────────────────────────────────────────────── (full width)
[REACT (28)] [VUE (3)] [NEXT.JS (13)] …
BACKEND ─────────────────────  PROGRAMMING LANGUAGES ─────
[PHP (3)] …                    [TYPESCRIPT (29)] …
DATABASE ────────────────────  DEVOPS ────────────────────
OTHERS ──────────────────────
```

## Data and caching

- `graphQLSdk.fetchAboutMe({ locale: 'en' })`, which is always English because tag data is locale-independent, wrapped in `withLastGood('about:en')`.
- When unavailable: 503 with no-store. Otherwise 86400 s.

## States

- **Unavailable:** `note.status-unavailable` with `common.tags-empty-*`.
- **Empty:** `common.tags-status-empty` with `common.tags-empty-none-*`.

## Rules

- Only the largest group (Frontend) takes a full-width band. An odd trailing group spans both columns.
- Tag pills are mono uppercase data labels. That is allowed here because they are data, not headings.
