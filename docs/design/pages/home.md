# Home

- **URL:** `/{locale}`. The root `/` redirects here using the preferred locale, falling back to `en`.
- **Source:** `apps/astro/src/pages/[locale]/index.astro`, styles in `src/styles/home.css`
- **Layout:** `MainLayout` (bar, rail, footer)

## Purpose

This is the first page a visitor sees. It says who Ham is in one sentence, shows one of Ham's own portraits straight away, and routes the visitor to work (projects), hobbies and photos.

## Anatomy

```
┌──────────────────────────────────────────┬───────────────┐
│ Building for the web,                    │ ┌───────────┐ │
│ driven by curiosity.                     │ │ latest    │ │
│                                          │ │ portrait  │ │
│ I spend as much time in a darkroom …     │ │ (own ratio)│ │
│                                          │ └───────────┘ │
│ [View my work]  [Explore my hobbies]     │ Name   All photos
│                                          │ Event         │
├──────────────────────────────────────────┴───────────────┤
│ How I work ───────────────────────────────────────────── │
│ ┌ Good design is practical. ─────┐ ┌ tools ───────────┐  │
│ └ Clear  Useful  Maintainable ───┘ └──────────────────┘  │
│ Featured projects ────────────────────────────────────── │
│ [card] [card] [card]                                     │
│ Recent photos ──────────────────────────── All photos    │
│ [photo] [photo] [photo] [photo]                          │
└──────────────────────────────────────────────────────────┘
```

1. **Hero.** The h1 is `home.hero-heading-prefix` plus `home.hero-heading-emphasis`: two lines in one colour with no accent phrase. Below it come the subtitle `home.hero-subtitle`, the primary CTA `home.view-my-work` → `/projects` and the secondary CTA `home.explore-hobbies` → `/hobbies`. The right column is a figure showing the newest named gallery portrait, with the person's name, the event and an "All photos" link.
2. **How I work** (`SectionHeading home.bench-heading`). A manifesto card with three principle chips (sentence case) beside a tools card.
3. **Featured projects** (`home.featured-projects`). Up to 3 projects, preferring ones with a screenshot.
4. **Recent photos** (`home.photos-heading`). The newest photo of each of up to four other people, excluding the hero's person.

## Data and caching

- Projects come from `graphQLSdk.fetchHomePage({ locale })` (Strapi), wrapped in `withLastGood('home:{cmsLocale}')`.
- Photos come from `kamekoEntries` (the static cache `src/constants/kameko-posts.json`); there is no live API call.
- `CDN-Cache-Control` is `public, max-age=3600, must-revalidate`, or `max-age=60` when the CMS is unavailable.

## States

- **CMS down:** the featured projects area shows `project.status-unavailable` with `home.projects-empty-title` and `-description`. The rest of the page still renders.
- **No gallery entries:** the hero figure and the Recent photos section are omitted, not replaced with a placeholder.
- **Photo removed on X:** the image errors and the script hides its figure or list item.

## Interactions

- Photos link to the X post (`target="_blank" rel="noopener noreferrer"`).
- The context menu and dragging are blocked on gallery images.
- CTAs and the photo links have amber `:focus-visible` outlines.

## Responsive

- Below `lg` the hero stacks: text, then photo.
- CTAs go full width at ≤640 px.
- Recent photos is 4 columns (aligned to the top, each at its own ratio), then 2 at ≤700 px.

## Rules

- The hero never shows CMS clip art (`introductionImage`). Any hero `<img>` must be a gallery image (`data-kameko-image`); `tests/round22-contracts` checks this.
- No eyebrow chip, no status row, no availability claim unless Ham states one.
- Photos are never cropped: the hero frame and every Recent photos item take `aspect-ratio` from the photo's real width and height.
