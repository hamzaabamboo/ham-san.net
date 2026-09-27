# Home

- **URL:** `/{locale}`. The root `/` redirects here using the preferred locale, falling back to `en`.
- **Source:** `apps/astro/src/pages/[locale]/index.astro`, styles in `src/styles/home.css`
- **Layout:** `MainLayout` (bar, rail, footer)

## Purpose

This is the first page a visitor sees. It says who Ham is in one sentence, shows one of Ham's own portraits straight away, and routes the visitor to work (projects), hobbies and photos.

## Anatomy

Reference comps: `stitch_exports/4878703984446574546/02_the-personal-workshop-homepage.png` and `07_the-builders-workshop-homepage.png`.

```
┌──────────────────────────────────────────┬───────────────┐
│ [PERSONAL SITE]                          │┌[LATEST CAPTURE]┐
│ Building for the web,                    ││ latest named  │
│ driven by curiosity.   (italic amber)    ││ portrait      │
│ I spend as much time in a darkroom …     │├───────────────┤
│ [VIEW MY WORK]  [EXPLORE MY HOBBIES]     ││ Name (italic) │
│                                          ││ EVENT  ALL PHOTOS
├──────────────────────────┬───────────────┴───────────────┤
│ CURRENT FOCUS            │ AVAILABILITY                  │
│ Homepage refresh         │ ■ Open to freelance work.     │
├──────────────────────────┴───────────────────────────────┤
│ How I work ───────────────────────────────────────────── │
│ ┌ Good design is practical. ─────┐ ┌ tools ───────────┐  │
│ └ CLEAR  USEFUL  MAINTAINABLE ───┘ └──────────────────┘  │
│ Featured projects ────────────────────────────────────── │
│ [card] [card] [card]                                     │
│ Life ─────────────────────────────────────────────────── │
│ [Darkroom printing]  [Skill toys]                        │
│ Recent photos ────────────────────────────────────────── │
│ [photo] [photo] [photo] [photo]                          │
│ ALL PHOTOS ↗                                             │
└──────────────────────────────────────────────────────────┘
```

1. **Hero.** `Eyebrow home.operational-status`, then the h1: `home.hero-heading-prefix` plus `home.hero-heading-emphasis` on its own line in italic amber. Subtitle `home.hero-subtitle`, primary CTA `home.view-my-work` → `/projects`, secondary CTA `home.explore-hobbies` → `/hobbies` (uppercase). The right column is a bordered figure: the newest named gallery portrait at its own aspect ratio with a `home.photos-latest` chip, then the name in italic display and a mono meta row (event, "All photos").
2. **Status row** (`StatusRow`). Current focus and availability, mono labels, pinging amber square.
3. **How I work** (`SectionHeading home.bench-heading` with `home.bench-subtitle`). A manifesto card (one amber italic phrase) with three uppercase mono principle chips beside a tools card.
4. **Featured projects** (`home.featured-projects`). Up to 3 projects, preferring ones with a screenshot; a project without one gets the grid-line monogram plate.
5. **Life** (`home.life-heading`). Two grid-line plate cards with a glyph, a display-face title and an amber mono "Open" link.
6. **Recent photos** (`home.photos-heading`). The newest photo of each of up to four other people, excluding the hero's person, as bordered cards with the name and a mono event line; "All photos" link below.

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

- Follow the comps: eyebrow chip, italic amber emphasis line, 1 px `--atelier-line` borders between hero, status row and sections.
- The hero never shows CMS clip art (`introductionImage`). Any hero `<img>` must be a gallery image (`data-kameko-image`); `tests/round22-contracts` checks this.
- Photos are never cropped: the hero frame and every Recent photos frame take `aspect-ratio` from the photo's real width and height.
