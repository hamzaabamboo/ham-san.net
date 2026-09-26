# Contact

- **URL:** `/{locale}/contact`
- **Source:** `apps/astro/src/pages/[locale]/contact/index.astro`
- **Layout:** `MainLayout`

## Purpose

This page gives every way to reach Ham: email, social profiles, namecards, and a message form that opens the visitor's mail client.

## Anatomy

```
Contact me.                                    (h1, one colour)
lede
┌ Direct channels: hello@ham-san.net ┬ Cards on file: 6 ┐
Social links: GitHub LinkedIn Twitter Facebook Discord Eventernote
Namecards ────────────────────────────────────────────────
[card preview]   default / kaho / ktk / polka / polka-neo / honoshi
Send a message ───────────────────────────────────────────
Name  Email / Subject / Message / [Send message]
┌ Before you send ┐ ┌ Replies (+ live UTC time) ┐
```

## Data and caching

- The page is static: the `NAMECARDS` constant and i18n strings. There is no CMS call.
- `CDN-Cache-Control: public, max-age=86400, must-revalidate`.

## Interactions

- The form builds a `mailto:` URL from its fields and navigates to it. Nothing is sent to a server.
- A live UTC clock sits in the Replies card.
- Social links open in a new tab (`noopener noreferrer`).
- **Testing rule:** automated browser tests must never click the `mailto:` link or submit the form. Read the composed URL instead.

## Rules

- The h1 is one colour; there is no amber "me."
- There's no page eyebrow.
- The submit button and panel headings are sentence case in the body face ("Send message", "Before you send", "Replies").
- Namecard previews use Ham's own card artwork and are not restyled to the site palette.
