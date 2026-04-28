# Live Audit

Date: 2026-04-28 JST
Target: Astro live app at `http://localhost:4321`
Reference: `stitch_exports/4878703984446574546`

## Implementation Lock

Locked on 2026-04-28 JST.

- This file is the canonical record of what is deliberate, what was jank, and what remains a product/data decision.
- Do not regress the locked behavior without adding a new decision entry.
- Do not claim a route is clean without fresh `agent-browser` evidence and a matching verification note here.
- Current verification gate: `cd apps/astro && bun run build` plus live route checks.
- Latest build evidence: `0 errors`, `0 warnings`, `0 hints`, server build complete.

## Rules

- No route is verified without fresh browser evidence.
- Every finding gets route, viewport, evidence path, and fix status.
- Stitch screenshots/HTML are reference for composition, hierarchy, spacing, and tone.
- Code cleanup follows evidence. No blind rewrites.
- Divergence from Stitch is allowed when it preserves real repo behavior or improves the live product. It must be documented as deliberate.
- Jank is any accidental visual break, wrong route, misleading state, collapsed layout, raw debug/content leak, or unverified claim.

## Decision Ledger

| ID | Area | Classification | Decision | Rationale | Action |
| --- | --- | --- | --- | --- | --- |
| D-001 | Global chrome | deliberate divergence | Keep live top nav labels `Projects / Notes / Hobbies / About me / Contact` instead of Stitch's varied `Journal/Garden/About` labels. | Live IA is clearer and maps to real routes. Stitch labels are mood boards, not always product-accurate. | Documented, no code change. |
| D-002 | Global chrome | jank/design mistake | Sidebar `ENV_STAT`/`System_Online` style labels overstated the app state. | CMS-backed routes can be unavailable while chrome claims a system is online. That undermines route state honesty. | Fixed to plain `Status` / `Site ready` so chrome only claims the local shell is mounted. |
| D-003 | Homepage | deliberate divergence | Keep live home closer to Stitch 07 than Stitch 02. | Stitch has two home concepts; live site chose the builder/workshop variant, which fits the current industrial portfolio direction. | Documented, no immediate code change. |
| D-004 | About | deliberate divergence + fixed jank | Keep real résumé/CMS content, but use Stitch 08's dossier hierarchy: identity/spec panel first, deployment history second. | The content is legitimate product data; the previous column order made the page read like a plain résumé instead of a dossier. | Layout hierarchy fixed; title/copy remains a product choice. |
| D-005 | Projects taxonomy | needs product call | Live data supports active/inactive; Stitch/spec call for commercial/personal lab. | Renaming active/inactive to commercial/personal would be dishonest unless the CMS data supports that classification. | Keep labels until data model or mapping is defined. |
| D-006 | Project cards | jank/design mistake | Inline-sized card links caused collapsed archive cards. | This was accidental layout behavior, not design. | Fixed. |
| D-007 | Tags cards | jank/design mistake | Inline-sized tag links caused cramped metadata and `10projects`-looking labels. | This was accidental layout behavior, not design. | Fixed. |
| D-008 | Hobbies index | jank/design mistake | Primary fallback zone read empty because the first card width collapsed to `0px` and fallback art overflowed. | This was accidental layout behavior, not design. The fallback dominates the bento composition, so it must look intentional when CMS images are absent. | Fixed: hobby card links are full-width grid items and the fallback is a visible camera archive plate. |
| D-009 | Hobby detail | jank/design mistake | Bare URLs rendered as long text blocks. | External references should be actionable and visually controlled without changing the exact destination. | Fixed: Markdown auto-links standalone/raw URL labels as `Open <domain>` while preserving hrefs. |
| D-010 | Notes detail | jank/design mistake | Planned note-detail slug redirected to 404. | Cannot claim Stitch 09 parity without a real detail route or designed unavailable state. | Fixed: stale/unavailable note slugs render a designed `Notes Unavailable` state at the requested URL. |
| D-011 | Events | deliberate preservation + fixed framing | English locale includes Japanese source content from the CMS archive. | The source archive is legitimate content, but it must be framed so mixed-language records do not look like locale breakage. | Fixed: raw URLs are cleaned and a localized source note frames the table. |
| D-012 | Browser overlay | external/session contamination | Floating control strip appears in screenshots but not DOM snapshots. | It is not an app element, so do not chase it in source unless DOM evidence appears. | Track only. |
| D-013 | Contact form | jank/design mistake | Empty submit reloaded `/en/contact` with empty query params and no validation while the copy claimed encrypted/private-server transport. | That was fake functionality and false security framing. | Fixed: form uses required fields, `mailto:hello@ham-san.net`, and honest mail-client copy. |
| D-014 | Project CMS copy | jank/content mistake | `Receipt Parcer` typo and incomplete description `Parse receipt screenshots into` shipped from CMS data. | The live page should not expose obvious typo/incomplete copy even if upstream data is dirty. | Fixed with display-level cleanup: `Receipt Parser` and `Parse receipt screenshots into structured expense data.` |
| D-015 | Real note detail | jank/design mistake | A real note detail expanded mobile page width to `11266px`. | Markdown table/image content must not break the page viewport. | Fixed: note detail grid/Markdown wrappers now constrain width; wide tables/images scroll inside content. |
| D-016 | Site copy | jank/content mistake | The live site used fake ops/atelier/protocol language and a few inflated CMS descriptions. | The portfolio should read grounded and honest. Decorative system language is only acceptable when it names a real control or state. | Fixed across visible i18n, route labels, chrome, fallback states, contact, note labels, 404, and project display copy. |
| D-017 | Base-regression audit | jank/feature regression | Events disappeared from global navigation, and Contact lost direct Email/Facebook/Discord/Eventernote links compared with `main`. | The routes still existed, but discoverability and direct contact channels regressed during the redesign/copy cleanup. | Fixed: Events restored in top nav, desktop sidebar, and mobile drawer; Contact direct links restored with grounded labels. |
| D-018 | Namecard detail | jank/design mistake | `/en/namecard/default` expanded mobile document width to `408px` on a `375px` viewport. | The fixed 91mm printable card is legitimate, but it must not force page-level horizontal scroll on phones. | Fixed: printable card is contained in a horizontal scroll wrapper; card dimensions remain unchanged. |
| D-019 | Implementation lock | deliberate baseline | Current implementation is locked as the accepted baseline after final route, copy, regression, and namecard checks. | Future work needs a fresh audit note before changing route IA, contact channels, namecard dimensions, or the grounded copy direction. | Locked on 2026-04-28 JST with build, diff, live browser, and namecard-flow evidence. |
| D-020 | Contact namecard preview | fixed regression + deliberate presentation | Contact must preview the real default namecard, not fabricated mini cards. The preview is frozen on the front face and scaled on narrow screens. | `main` used the real `InteractiveNamecard`; the redesign's `Digital card`/`Print card` tiles were invented content. The dedicated `/namecard/default` route keeps the interactive/spinning behavior, while contact needs a stable, inspectable preview that does not overflow mobile. | Fixed: Contact uses `InteractiveNamecard data={NAMECARDS[0]}`, links to `/[locale]/namecard/default`, removes fake preview text, scales to `343px` at 375px viewport, and disables preview animation only inside Contact. |
| D-021 | Clean dogfood fixes | fixed jank | The clean dogfood run found three medium issues: mobile drawer background scroll/focus leakage, low-contrast default namecard page text, and English placeholders/options on JA/TH contact forms. | These were real product issues visible from the browser, not design divergences. | Fixed: drawer now locks scroll and inerts background content; default namecard page uses a darker readable panel and keeps decorative art behind content; contact placeholders and subject options are localized in English, Japanese, and Thai. |

## Screen Matrix

| Screen | Stitch Reference | Desktop | Mobile | Locale Checks | Findings | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `/en/` | `02`, `07` | `dogfood-output/stitch-live/screenshots/home-desktop.png` | `dogfood-output/stitch-live/screenshots/home-mobile.png`; final 375px overflow check passed | en checked | F-001 | deliberate divergence |
| `/en/about` | `03`, `08` | `dogfood-output/stitch-live/screenshots/about-desktop-after.png` | `dogfood-output/stitch-live/screenshots/about-mobile-after.png`; final 375px overflow check passed | en checked | F-002 | clean with documented divergence |
| `/en/projects` | `04` | `dogfood-output/stitch-live/screenshots/projects-desktop-after.png` | `dogfood-output/stitch-live/screenshots/projects-mobile.png`; final card widths `341px`, overflow check passed | en checked | F-003, F-004 | clean with taxonomy product call |
| `/en/projects/ham-san-net-1` | product route | `dogfood-output/stitch-live/screenshots/project-detail-desktop.png` | final 375px overflow check passed | en checked | none | clean |
| `/en/projects/receipt-parser` | product route | live route checked | final 375px overflow check passed; typo/incomplete description cleaned | en checked | F-012 | clean |
| `/en/notes` | product route | `dogfood-output/stitch-live/screenshots/notes-desktop.png` | final 375px overflow check passed | en checked | F-005 | clean |
| `/en/notes/hasunosora-starter-pack` | `09` | `dogfood-output/stitch-live/screenshots/note-detail-unavailable-desktop.png` | `dogfood-output/stitch-live/screenshots/note-detail-unavailable-mobile-final.png`; final 375px overflow check passed | en checked | F-006 | clean unavailable state |
| `/en/notes/2ed18204-56d0-4631-a884-d5f17b52bcc8` | product route | live route checked | `dogfood-output/stitch-live/screenshots/note-real-mobile-clean-final.png`; final 375px overflow check passed | en checked | F-013 | clean |
| `/en/hobbies` | `05`, `11` | `dogfood-output/stitch-live/screenshots/hobbies-desktop-clean-pass-6.png` | `dogfood-output/stitch-live/screenshots/hobbies-mobile-clean-final-2.png`; final card width `341px`, overflow check passed | en checked | F-007 | clean |
| `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284` | product route | `dogfood-output/stitch-live/screenshots/hobby-detail-desktop-clean-pass-3.png` | `dogfood-output/stitch-live/screenshots/hobby-detail-mobile-clean-final.png`; final 375px overflow check passed | en checked | F-008 | clean |
| `/en/contact` | `12` | `/tmp/ham-san-contact-desktop-final.png` | `/tmp/ham-san-contact-mobile-final.png`; final 375px overflow check passed; real namecard preview restored | en checked | F-014, F-020 | clean |
| `/en/namecard/default` | product route | live route checked | final 375px overflow check passed | en checked | F-017 | clean |
| `/en/tags` | product route | `dogfood-output/stitch-live/screenshots/tags-desktop-final.png` | final card width `343px`, overflow check passed | en checked | F-009 | clean |
| `/en/tags/react` | product route | `dogfood-output/stitch-live/screenshots/tag-react-desktop.png` | final 375px overflow check passed; back link points to `/en/tags` | en checked | F-010 | clean |
| `/en/events` | product route | `dogfood-output/stitch-live/screenshots/events-desktop-clean-pass.png` | `dogfood-output/stitch-live/screenshots/events-mobile-clean-final.png`; final 375px overflow check passed | en checked | F-011 | clean with documented archive framing |
| `/en/not-found-smoke` | product route | live route checked | pending | en checked | F-015 | clean copy |

## Findings

### F-001 `/en/`

Desktop has a non-DOM floating browser control strip in screenshots. App snapshot does not include it, so it is tracked as session contamination until proven otherwise. Home composition is closer to Stitch 07 than 02, but brand/copy still diverge from the exported comps.

### F-002 `/en/about`

Live page keeps real résumé/CMS content but now follows Stitch 08's dossier hierarchy: subject reference, institution, and methodology read first; deployment history follows as the larger right column on desktop. Mobile has zero horizontal overflow at 375px.

### F-003 `/en/projects`

Project section taxonomy uses `Featured Work` and `Archive`, while Stitch/spec require a commercial/personal lab split. Data model currently exposes active/inactive, not a verified commercial/personal discriminator.

### F-004 `/en/projects`

Archive cards collapsed because grid children were inline-sized anchors. Fixed by making project links block/full-width. Evidence: `projects-desktop-after.png`.

### F-005 `/en/notes`

Notes route renders designed offline state. Persistent sidebar previously reported `System_Online`, making the environment status misleading; this now says `Site ready`.

### F-006 `/en/notes/hasunosora-starter-pack`

The planned note-detail slug no longer redirects to `/en/404`. It renders a designed unavailable state at `/en/notes/hasunosora-starter-pack`; mobile verification returned `h1: Notes Unavailable`, `is404: false`, and `375px` document width.

### F-007 `/en/hobbies`

Hobbies route now renders full-width bento cards. The primary fallback zone is an intentional camera archive plate instead of a blank/overflowing panel. Final desktop evidence: `hobbies-desktop-clean-pass-6.png`; final mobile evidence: `hobbies-mobile-clean-final-2.png`.

### F-008 `/en/hobbies/:id`

Hobby detail no longer renders long raw URL text. Markdown keeps exact hrefs but displays raw URL anchors as `Open <domain>`. Desktop verification found zero horizontal overflow and link labels such as `Open photos.app.goo.gl`, `Open imaging-resource.com`, and `Open lenstip.com`.

### F-009 `/en/tags`

Tag cards collapsed because grid children were inline-sized anchors. Fixed by making tag links block/full-width and rendering the project-count label as one string. Desktop evidence: `tags-desktop-final.png`; 375px overflow check passed.

### F-010 `/en/tags/react`

Back link previously said `Return to About me`, which is the wrong parent route for a tag detail page. Fixed to link back to `/[locale]/tags` with the localized Tags label.

### F-011 `/en/events`

Events content deliberately preserves the mixed-language CMS archive and now frames it with a localized source note. Raw URL labels are cleaned. Mobile verification returned `rawUrlText: false` and `375px` document width.

### F-012 `/en/projects/receipt-parser`

The project title and description were visibly dirty from CMS data: `Receipt Parcer` and `Parse receipt screenshots into`. Display cleanup now renders `Receipt Parser` and `Parse receipt screenshots into structured expense data.` Mobile verification returned `parcer: false`, `incomplete: false`, and `375px` document width.

### F-013 `/en/notes/2ed18204-56d0-4631-a884-d5f17b52bcc8`

A real note detail rendered correctly but expanded the mobile document to `11266px`. Markdown and note-detail layout wrappers now constrain the page; wide table/image content remains scrollable inside its container. Final mobile verification returned `widePage: false` and `375px` document width.

### F-014 `/en/contact`

The contact form previously submitted empty GET params and claimed fake encrypted/private-server handling. It now uses required fields, `mailto:hello@ham-san.net`, and copy that says what actually happens. Empty-submit verification kept the route at `/en/contact` and focused `contact-name`.

### F-015 site copy cleanup

Removed visible fake-console and inflated language such as `ATELIER.LOG`, `NAV_INDEX`, `ENV_STAT`, `signal_intercept`, `node_status`, `Initiate_Contact_Protocol`, `RUNNING_SIMULATION`, `taxonomy_index`, and the fake encrypted/contact framing. Replaced it with plain route labels, honest fallback states, grounded project descriptions, and localized English/Japanese/Thai copy. Decorative watermark letters are hidden from accessible names where they were polluting browser snapshots.

### F-016 base branch regression audit

Compared current implementation against `main` using a clean worktree at `/tmp/ham-san-main`. No route files from `main` were lost; AboutMe was moved out of the pages folder, and this branch adds Thai locale, RSS, sitemap, 404, and Outline asset proxy routes. Two user-facing regressions were found and fixed: `Events` was missing from global navigation/sidebars, and Contact no longer exposed Email/Facebook/Discord/Eventernote direct channels. Base contact visual rendering could not be fully compared because the base worktree route errors locally without the current env/runtime setup, but source and current live snapshots confirmed the channel regression and fix.

### F-017 `/en/namecard/default`

Namecard detail had mobile page-level overflow: `408px` document width on a `375px` viewport. The fixed physical card width is deliberate for print/namecard fidelity, so the fix contains it inside a local horizontal scroll area instead of shrinking the artifact itself. Final live check returned `body: 375`, `doc: 375`, `inner: 375`.

### F-018 namecard flow integrity

Namecard feature remains intact after the overflow fix. `/en/namecard` redirects to `/en/namecard/default`; variants `default`, `kaho`, `ktk`, `polka`, `polka-new`, and `Honoshi` load; `/ja/namecard/default` and `/th/namecard/default` load with localized titles; `/en/namecard/all` renders 12 card links, front and back for all 6 variants. The physical card dimensions remain `91mm x 55mm`; only the detail-page container changed to prevent page-level mobile overflow.

### F-019 full UI consistency pass

Removed the remaining visible fake/status/version framing from Contact, About, Home, and navigation: no `v2.0.4-stable`, `transport: mailto`, `Inventory_Tools`, `Subject_Reference`, `AXONOMETRIC_VIEW_01`, `Homepage V3`, or fake site-online copy remains in the rendered UI. Contact direct channels stayed intact, the namecard feature stayed linked, footer links gained larger tap areas, focus states were restored on contact fields, and mobile Events table content now wraps instead of clipping or expanding the page. Project listing cards now surface fetched tags and link metadata, so the project backend fields are not silently discarded on the listing surface.

### F-020 `/en/contact` namecard preview

The contact page had replaced the real namecard preview with fabricated cards labeled `Digital card` and `Print card`. That was a feature regression from `main`, not a deliberate design choice. Contact now renders `InteractiveNamecard` with `NAMECARDS[0]`, links to `/en/namecard/default`, scales the 91mm card to fit a 375px viewport, and freezes the contact preview on the front face so visual verification is stable. The dedicated namecard route remains interactive.

### F-021 clean dogfood follow-up

Clean dogfood output lives at `dogfood-output/clean-2026-04-28-1628/report.md`. The three reported medium issues were fixed in the current implementation. Mobile drawer verification now returns only drawer controls in the interactive snapshot, `shell-drawer-open: true`, `bodyPosition: fixed`, background children inert, scroll still `0` after a scroll attempt, and focus on `Close menu`. JA/TH contact snapshots now show localized subject options and placeholders. `/en/namecard/default` now keeps the same route/content while placing the profile panel on a darker readable surface and keeping decorative character art behind the content stack.

## Final Verification

- `cd apps/astro && bun run build` completed on 2026-04-28 JST at 15:11 JST with `0 errors`, `0 warnings`, `0 hints`, and server build complete.
- `cd apps/astro && bun run lint` completed on 2026-04-28 JST at 16:00 JST with exit code 0.
- `cd apps/astro && bun run build` completed on 2026-04-28 JST at 16:02 JST with `0 errors`, `0 warnings`, `0 hints`, and server build complete.
- `cd apps/astro && bun run lint` completed on 2026-04-28 JST at 16:18 JST with exit code 0.
- `cd apps/astro && bun run build` completed on 2026-04-28 JST at 16:21 JST with `0 errors`, `0 warnings`, `0 hints`, and server build complete.
- `cd apps/astro && bun run lint` completed on 2026-04-28 JST at 17:10 JST with exit code 0.
- `cd apps/astro && bun run build` completed on 2026-04-28 JST at 17:15 JST with `0 errors`, `0 warnings`, `0 hints`, and server build complete.
- Dogfood fix verification on 2026-04-28 JST: `agent-browser` checked `/en/contact`, `/ja/contact`, `/th/contact`, and `/en/namecard/default` at 375px. Drawer scroll/focus/background inert checks passed; JA/TH contact subject options were localized; default namecard kept Twitter/link content, no page-level overflow, and captured `/tmp/ham-namecard-fixed-2.png`.
- Contact namecard restore check on 2026-04-28 JST: `agent-browser` opened `/en/contact` at 375px and verified no `Digital card`/`Print card` text, real `@HamP_punipuni` content, link to `/en/namecard/default`, and no page-level overflow. Playwright visual/DOM check captured `/tmp/ham-san-contact-mobile-final.png` and `/tmp/ham-san-contact-desktop-final.png`; contact preview width was `343px` on a `375px` viewport, preview animation was `none`, console errors were empty, and `/en/namecard/default` still exposed 13 links with Twitter/Discord content.
- Final Playwright visual/DOM sweep checked `/en`, `/en/projects`, `/en/hobbies`, `/en/about`, `/en/contact`, `/en/notes`, `/en/events`, `/en/namecard/default`, `/ja`, and `/th` at `1440x1000` and `375x812`; all returned matching document/client widths, no console warnings/errors, and no targeted cringe/status copy. A follow-up mobile `/en/events` check after table wrapping returned no offscreen interactive elements.
- Final `agent-browser` snapshots checked `/en/events`, `/en/contact`, `/en/namecard/default`, and `/en/projects`; route titles rendered correctly, contact fields/channels were present, namecard links were present, and project cards exposed tags/link metadata.
- `git diff --check` completed cleanly after the copy cleanup.
- Live `agent-browser` snapshots checked `/en/`, `/en/projects`, `/en/contact`, `/en/about`, `/en/hobbies`, `/en/notes`, `/en/tags`, and `/en/nope` after the cleanup.
- Text scan after cleanup found no matches for the targeted fake-console vocabulary (`ATELIER`, `NAV_INDEX`, `ENV_STAT`, `Protocol`, `Transmission`, `Payload`, `RUNNING_SIMULATION`, `taxonomy_index`, `cutting edge`, fake encrypted/security copy, and related terms).
- Base-regression live checks on 2026-04-28 JST: `main` ran at `http://127.0.0.1:4322`; current branch ran at `http://localhost:4321`; snapshots verified Events in top nav/sidebar/mobile drawer and restored Contact direct channels.
- Visual screenshots captured under `/tmp/ham-regression-shots/` for base/current home and current contact desktop/mobile.
- Final mobile overflow pass at 375px checked `/en/`, `/en/projects`, `/en/contact`, `/en/events`, `/en/about`, `/en/hobbies`, `/en/notes`, `/en/tags`, and `/en/namecard/default`; all returned document width `<= 375px`.
- Final namecard integrity pass checked redirect, all 6 variants, `/en/namecard/all`, English/Japanese/Thai default pages, and browser console/errors; no route failure or page-level overflow found.
- Final mobile overflow checks passed at `375px` for `/en/`, `/en/about`, `/en/projects`, `/en/projects/ham-san-net-1`, `/en/projects/receipt-parser`, `/en/notes`, `/en/notes/hasunosora-starter-pack`, `/en/notes/2ed18204-56d0-4631-a884-d5f17b52bcc8`, `/en/hobbies`, `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284`, `/en/contact`, `/en/tags`, `/en/tags/react`, and `/en/events`.
- Internal status checks returned `200` for the core EN routes, `ja`/`th` home routes, namecard routes, RSS, and sitemap.
- Mobile menu flow passed: open menu, tap Hobbies, navigates to `/en/hobbies`, drawer closes, width remains `375px`.
- Contact validation passed: empty submit stays on `/en/contact`, focuses `contact-name`, and flags required fields.
- Browser screenshots were captured under `dogfood-output/stitch-live/screenshots/`.
