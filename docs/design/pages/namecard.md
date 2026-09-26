# Namecard

- **URLs:**
  - `/{locale}/namecard` redirects to `/{locale}/namecard/default`.
  - `/{locale}/namecard/{variant}` is one card page.
  - `/{locale}/namecard/all` shows every card, front and back.
- **Source:** `apps/astro/src/pages/[locale]/namecard/`, card data in the `NAMECARDS` and `NAMECARD_PAGE_LINKS` constants
- **Layout:** `NamecardLayout` (its own theme, `theme-color #bf99b0`), not the site shell

## Purpose

These are Ham's fan-community namecards (HamP / ハムP), shared at events: identity, oshi, social links and a QR code. Each variant is a different card design.

## Anatomy

- **Variant page:** a language switcher, then the name (`name-card.name`), subtitle and message, then a grid of social links, then the card preview linking to `/all` and "View other namecards", then decorative character art.
- **All page:** a grid of every variant's front and back, each linking to its variant page. It is print-ready (`@page` margins).

## Data and caching

- Static constants only; no CMS.
- No `CDN-Cache-Control` override.

## Rules

- These pages deliberately use Ham's own card artwork, colours and typography. Do not apply the Atelier palette or the site brand mark here.
- An unknown variant redirects to `/{locale}/404`.
- External links open in a new tab (`rel="noreferrer"`).
