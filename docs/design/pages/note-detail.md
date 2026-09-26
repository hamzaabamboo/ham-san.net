# Note detail

- **URLs:** `/{locale}/notes/{shareId}` and `/{locale}/notes/{shareId}/doc/{docId}`
- **Source:** `apps/astro/src/pages/[locale]/notes/[...slug]/index.astro`
- **Layout:** `MainLayout`

## Purpose

This page is for reading one note in full, with its contents, details and neighbouring notes.

## Anatomy

```
[Contents rail]   [NOTE]                         ┌ Details ─────────┐
(≥3 headings)     Title (display)                │ Published        │
                  lede / banner                  │ Collection       │
                  markdown body                  │ Reading time     │
                  ← Previous entry  Next entry → │ Tags             │
                                                 └──────────────────┘
                                                 [Back to notes]
                                                 [Read in Outline ↗]
```

## Data and caching

- Outline `documents.info` (`withLastGood('note:{share}:{doc}')`) and sibling `documents.list`.
- **Missing note:** status 404.
- **Upstream unavailable:** status 503.
- **Either case:** `CDN-Cache-Control: no-store`. Otherwise 86400 s.

## States

- **Not found:** `note.status-not-found` with `note.not-found-*`.
- **Unavailable:** `note.status-unavailable` with `note.empty-*`.
- **Siblings unavailable:** an inline notice.

## Interactions

- The table of contents highlights the current heading on scroll (`aria-current`).
- "Read in Outline" opens a new tab.

## Rules

- The "Note" eyebrow stays; it names the section on a detail page.
- The table of contents only appears with three or more headings.
- Long code and chord blocks keep the mono face. Prose keeps the body face at line-height 1.7.
