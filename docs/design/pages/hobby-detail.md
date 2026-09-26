# Hobby detail and hobby sub-pages

- **URLs:** `/{locale}/hobbies/{rootId}` and `/{locale}/hobbies/{rootId}/doc/{childId}` (for example Music → Trombone)
- **Source:** `apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro`, styles in `src/components/hobbies/hobbyStyles.tsx`, embeds in `src/components/hobbies/`
- **Layout:** `MainLayout`

## Purpose

This page shows one hobby's notes: a title, a short description, the body, related sub-pages, and an interactive module when the hobby has one (darts board, chord player, Rubik's algorithms, typing stats, photo gallery links, link library).

## Anatomy

```
← Back to hobbies            (sub-pages: ← Back to parent hobby)
[ACTIVE] (or ACTIVE / module name)
Music                                        [banner, only if the note has one]
Trombone / Piano / Transcriptions
LAST UPDATED / JUN 2, 2026
┌ body markdown / interactive module ┐ ┌ Related pages ┐
└────────────────────────────────────┘ └───────────────┘
```

## Data and caching

- Outline `documents.info` (`withLastGood('hobby:{id}')`) and `documents.list` for child pages (`withLastGood('hobby-children:{parent}')`).
- Status codes and cache headers come from `getHobbyDetailResponse()` in `src/utils/hobby-detail-response.ts`: 503 or no-store when unavailable, and a redirect to `/{locale}/404` for a missing id or a malformed `doc` segment.

## States

- **CMS unavailable:** `hobbies.status-unavailable` with `hobbies.empty-description`.
- **Child list unavailable:** an inline status notice.
- **No body and no children:** a `hobbies.empty-source-state` panel linking back to the hobby list.

## Interactions

- `HobbyInteractiveEmbed` mounts as a React island (`client:visible`) when the note declares an embed type.
- A banner image that fails to load removes its whole frame.

## Rules

- The banner frame renders only when the note has a banner. There is no letter-mark fallback (removed 2026-09-27).
- The eyebrow here is contextual (status and module) and stays.
- Embeds follow the Atelier palette: amber for interactive state only.
