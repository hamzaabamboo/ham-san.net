# ham-san.net design system

This is the reference for how every page on ham-san.net looks and behaves. Each page has its own document in [`pages/`](pages/). The palette follows the Atelier design system in `stitch_exports/4878703984446574546/01_design-system.md`. This document records the decisions made on top of it, including the 2026-09-27 polish pass.

## Principles

1. **Real content or nothing.** Never show a placeholder that pretends to be content: no ghost letters, monogram tiles, empty image plates or icon-in-a-box cards. When an item has no image, the layout drops the image slot instead of filling it.
2. **Photography carries the personality.** The site belongs to a web builder who also shoots event portraits. Where a page needs imagery, it uses Ham's own photos from the gallery before any decoration.
3. **Amber is a signal, not decoration.** `--atelier-accent` marks interactive or current things: primary buttons, the current language, the active rail item, links inside text, and the brand frame. It is never used to colour one word of a headline.
4. **Say it once.** A page title is not preceded by a chip that repeats it. Chips exist only where they add context (a detail page naming its section, a status, a hashtag).
5. **Sentence case.** Buttons, links, navigation and section titles are in sentence case in the body or display face. Tracked uppercase mono is reserved for small data labels (dates, counts, tag pills, metadata).
6. **Link to the source.** Photos are shown straight from X and every one links to its original post. Nothing is re-hosted.

## Brand

| Asset | Source | Output |
| --- | --- | --- |
| Mark (header, drawer, room) | `apps/astro/src/components/brand/BrandMark.tsx` | inline SVG + "Ham" wordmark |
| Favicon | `apps/astro/scripts/brand/favicon.svg` (16-unit grid) | `public/favicon.svg`, `public/favicon-64.png` via `icon.html` |
| Touch icon | `apps/astro/scripts/brand/touch.html` | `public/apple-touch-icon.png` (180×180) |
| Social image | `apps/astro/scripts/brand/og.html` | `public/og-default.png` (1200×630) |
| Master mark | `apps/astro/scripts/brand/mark.svg` (32-unit grid) | reference |

**The mark** is a block H held between two amber framing corners, top-left and bottom-right. It reads as a viewfinder or crop marks, tying Ham's photography to the builder side. Geometry on a 32-unit grid:

- Corners: `M2 2h9v2H4v7H2z` and `M28 21h2v9h-9v-2h7z`, filled `--atelier-accent`.
- H: `M9 8h4v6h6V8h4v16h-4v-6h-6v6H9z`, filled `currentColor` (normally `--atelier-fg`).
- The favicon is redrawn on a 16-unit grid (not scaled) inside a `#131313` tile with 3-unit radius, so every edge lands on a pixel at 16 px.

**The wordmark** is "Ham" in `--font-display` (Newsreader), weight 560, 23 px in the header, letter-spacing −0.01em. It is never uppercased, tracked or set in mono. Below 640 px only the mark is shown; the link keeps `aria-label="Ham"`.

**Regenerating PNGs:** open each HTML source in a browser at the exact output size (64×64, 180×180, 1200×630) and screenshot the viewport. Do not scale the 32-grid mark down to make a favicon.

## Colour

All colours come from the `--atelier-*` custom properties in `apps/astro/src/index.css`, mirrored as Panda tokens in `src/theme/tokens/atelier.ts`. Raw hex values in components are defects; `@pandacss/no-hardcoded-color` warns on them.

| Token | Value | Role |
| --- | --- | --- |
| `--atelier-bg` | `#131313` | page background |
| `--atelier-surface-lowest` | `#0e0e0e` | rail, image plates, viewer |
| `--atelier-surface-low` | `#1c1b1b` | raised panels, active rail item |
| `--atelier-surface` / `-high` / `-highest` | `#201f1f` / `#2a2a2a` / `#353534` | cards, hover fills, chips |
| `--atelier-fg` | `#e5e2e1` | primary text, the H of the mark |
| `--atelier-fg-muted` | `#c7c6c6` | secondary text |
| `--atelier-outline` | `#9f8e78` | tertiary text, data labels |
| `--atelier-line` | `#524533` | borders and rules |
| `--atelier-accent` | `#ffb000` | the only signal colour |
| `--atelier-accent-soft` | `#ffd597` | secondary amber text |
| `--atelier-on-accent` | `#432c00` | text on amber |
| `--atelier-danger` | `#ffb4ab` | errors |

Image treatments are tokens too: `--atelier-image-rest` (graphite at rest), `--atelier-image-hover`, `--atelier-image-plate` (true colour), `--atelier-image-preview` (room preview) and `--atelier-image-dimmed` (room behind an open panel). Gallery photos are shown at true colour, with no filter.

## Typography

| Face | Token | Use |
| --- | --- | --- |
| Newsreader | `--font-display` | page titles, section titles, the wordmark, person names in the gallery |
| Manrope | `--font-body` | body text, buttons, navigation, form fields |
| JetBrains Mono | `--font-code` | small data labels only: dates, counts, tag pills, metadata |

Japanese and Thai fall back to installed system faces (`Hiragino`, `Yu`, `Noto` stacks) and are never letter-spaced or uppercased. The `html:lang(ja|th)` rules in `index.css` enforce this.

Scale in use:
- page title (`PageMasthead`): `5xl` (3rem), `7xl` (4.5rem) from `md`, line-height 0.92;
- section title (`SectionHeading`): `3xl`, `4xl` from `md`, with an inline rule to the right;
- body: 1rem, line-height 1.7 for prose;
- buttons: 1rem, weight 700;
- data labels: 10–12 px mono.

Weights must be ones the font request actually serves; `apps/astro/tests/atelier-fonts.test.ts` checks this.

## Layout

```
┌───────────────────────────────────────────────────────────────┐
│ [mark] Ham                                  EN  JA  TH        │  bar (4rem, fixed)
├──────────────┬────────────────────────────────────────────────┤
│ ▸ Projects   │                                                │
│   Notes      │   content column                               │
│   Hobbies    │   max 1280px, inset 2rem                       │
│   Events     │                                                │
│   Photos     │                                                │
│   Room       │                                                │
│   About me   │                                                │
│   Contact    ├────────────────────────────────────────────────┤
│  rail 16rem  │ ©2023–2026 Ham            GitHub LinkedIn RSS …│  footer
└──────────────┴────────────────────────────────────────────────┘
```

- **Bar** (`Navigation.astro`): the brand on the content edge and the language switcher showing all three languages. The current one is underlined in amber (`aria-current`). Between 900 and 1023 px the bar also carries the page links.
- **Rail** (`DesktopSidebar.astro`, ≥1024 px): navigation only, with icon plus sentence-case label. The current page gets a 4 px amber left rule on `--atelier-surface-low`.
- **Drawer** (`Sidebar.tsx`, <1024 px): opened from the bar's menu button. It holds the mark, the same links and a three-button language switcher.
- **Footer** (`Footer.astro`): copyright and GitHub, LinkedIn, RSS and Sitemap links, aligned to the content column.
- **Breakpoints:** 640 (bar switcher appears), 700 (gallery and home photo grids go to two columns), 900 and 1024 (rail replaces the bar links).
- **The room** (`/room`) is full-bleed with its own overlay header and does not use this shell.

## Components

| Component | File | Contract |
| --- | --- | --- |
| `PageMasthead` | `components/common/PageMasthead.astro` | Optional `eyebrow`, `heading` (h1), optional `lede`. Index pages pass no eyebrow. |
| `Eyebrow` | `components/common/Eyebrow.astro` | Small mono chip. Only used for context: detail page section, hobby status, events kicker, photo hashtag. |
| `SectionHeading` | `components/common/SectionHeading.astro` | h2 in the display face followed by a hairline rule. The only section-title form on the site. |
| `BrandMark` | `components/brand/BrandMark.tsx` | Mark plus wordmark. Must stay crisp at 32 px (`shapeRendering="crispEdges"`). |
| Buttons | `.home-hero-cta`, `.contact-submit-btn`, `.not-found-*` | Sentence case, body face, 1rem, weight 700. Primary is amber on `--atelier-on-accent`. |
| Chips/pills | status, tags, meta | Mono 10–12 px uppercase, 1 px `--atelier-line` border. |
| Project card | `components/projects/ProjectCard.tsx`, projects page | Image only when the project has one; otherwise a text card. The link reads "Open project" / "View project" in sentence case. |
| Gallery tile | `pages/[locale]/photos/index.astro` | Justified collage tile at the photo's real aspect ratio, linking to the X post, with an expand button that opens the viewer. |

## Imagery and third-party content

- **Gallery photos** come from `apps/astro/src/constants/kameko-posts.json` (post metadata only) and load from `pbs.twimg.com`. Every tile links to the original post on X. The page adds `referrerpolicy="no-referrer"` and `draggable="false"`, blocks the context menu on images, and hides a tile whose image fails to load, so posts deleted on X drop off the site.
- **The home hero** shows the latest named portrait, and the home "Recent photos" strip shows the newest photo of each other person. Both link to X.
- **CMS images** (projects, hobbies) come from the Strapi/Outline APIs. When an image fails to load, its frame is removed; no fallback art is drawn.
- **The gallery cache** is refreshed with `cd apps/astro && TWEETAPI_IO_API_KEY=… bun run fetch:kameko`. This is one request per run and never refetches a known post. `KAMEKO_DEEP=1` is a paid full sweep that needs the owner's approval.

## Motion

- Motion answers an action: hover scale on photo tiles (1.025), caption fade on hover or focus, and the room's camera transitions.
- There is no scroll-triggered entrance animation.
- `prefers-reduced-motion` disables tile and caption transitions.

## Accessibility

- Every interactive element has a visible `2px` amber focus outline.
- Brand links carry `aria-label="Ham"`. Language links carry `lang` and `hreflang`, and the current one carries `aria-current`.
- Gallery tiles: the link is labelled "Open on X: {names · event · date}", and the expand button "View photo: …".
- The viewer is a native `<dialog>`: Escape closes it, ←/→ navigate, swipe on touch, and the close and previous/next buttons are labelled.
- Touch targets are at least 44 px in the shell.

## Copy rules

- Name things by what the visitor gets ("Open on X", "All photos", "Send message").
- Do not invent claims. Status lines such as availability or "current focus" appear only if Ham states them.
- Empty states say what is missing and what to do. Do not apologise, and do not use "parked" or "coming soon" filler.
- EN, JA and TH are all maintained in `libs/i18n/{en,ja,th}`. `apps/astro/tests/atelier-fonts.test.ts` (i18n reachability) fails on keys that nothing renders.

## Verification

| Check | Command |
| --- | --- |
| Contract tests | `bun test --max-concurrency=2 apps/astro/tests` (from repo root) |
| Type check + build | `cd apps/astro && bun run build` |
| Lint | `cd apps/astro && npx eslint <files>` |
| Visual | run `bun run dev -- --host 127.0.0.1 --port 4321`, then screenshot every route in [`pages/`](pages/) at 1440×900 and 390×844 |

Page documents: [home](pages/home.md) · [about](pages/about.md) · [contact](pages/contact.md) · [events](pages/events.md) · [hobbies](pages/hobbies.md) · [hobby detail](pages/hobby-detail.md) · [namecard](pages/namecard.md) · [notes](pages/notes.md) · [note detail](pages/note-detail.md) · [photos](pages/photos.md) · [projects](pages/projects.md) · [project detail](pages/project-detail.md) · [room](pages/room.md) · [tags](pages/tags.md) · [tag detail](pages/tag-detail.md) · [not found](pages/not-found.md) · [feeds and endpoints](pages/feeds-and-endpoints.md)
