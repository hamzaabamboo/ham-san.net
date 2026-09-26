# About

- **URL:** `/{locale}/about`
- **Source:** `apps/astro/src/pages/[locale]/about/index.astro`
- **Layout:** `MainLayout`

## Purpose

This is the professional profile: what Ham does, where Ham has worked, education, skills, and how to get in touch.

## Anatomy

```
A generalist who builds for the web.        (h1, no eyebrow)
lede
┌ sidebar ─────────────┐  Experience ─────────────────────
│ Current stack chips  │  ● Frontend Engineer   card
│ Education            │  ○ Software Engineer   card
│ How I work           │  ○ …                   (timeline)
│ Skills / Tools       │
└──────────────────────┘
Closing statement (two paragraphs)
Focus · Location · Availability · Contact (credentials grid)
```

1. The hero: `about-me.hero-title` and `about-me.hero-summary`.
2. The experience timeline (`common.experiences`): company, role, date range, tag chips and a description.
3. The sidebar: current stack (`about-me.current-stack`), education (`common.education`), methodology (`about-me.methodology`), skills and tools.
4. The closing statement (`about-me.bio-integrity`, `about-me.bio-subtractive`).
5. The credentials grid, including a `mailto:hello@ham-san.net` link.

## Data and caching

- `graphQLSdk.fetchAboutMe({ locale })` wrapped in `withLastGood('about:{cmsLocale}')`.
- `CDN-Cache-Control` is 3600 s, or 60 s when the CMS is unavailable.

## States

- **No experiences:** the timeline shows `about-me.timeline-empty-title` and `-description`.
- **Missing education or skills:** the section shows `common.records-pending`.

## Rules

- No decorative name plate. The "Ham / WEB / UI" wireframe box was removed on 2026-09-27.
- No page eyebrow. The h1 is the page's name.
- Availability and focus copy must be Ham's own statement; re-confirm it with Ham before changing it.
