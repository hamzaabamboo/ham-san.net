# Historical Astro fidelity record

## Request (this session)
Apply the mattpocock skill set, sweep the repo, and raise the design to peak quality.
Then, explicitly: unslop the code, the process and the design; fix the logo; fix the cocky
tone; fix the performance problem; and convene the council to check whether it is still
slop.

## Scope and permissions
- apps/astro is the product surface; libs/i18n carries the copy.
- Local edits only. No push, no deploy, no PR. Nothing has been committed.

## Root cause behind "it still looks bad"
The repository owns an authoritative design system, `The Builder's Atelier`
(`stitch_exports/4878703984446574546/01_design-system.md`): thirteen named colours,
grayscale surfaces, amber as the only signal colour, strict 0px radius.

It was in force nowhere. The palette existed as 593 raw hex literals across 32 files
spanning 55 distinct colours, of which only 13 were on-system. The rest included stock
Tailwind defaults and six near-duplicate blacks. Panda's semantic tokens still pointed at
the Park-UI mauve ramp, so the body painted a purple-tinted `#121113` behind an html
gradient of neutral `#131313`.

The guardrail that would have prevented this already existed and had been switched off:
`'@pandacss/no-hardcoded-color': 'off'`.

## Delivered

### Colour system
- `--atelier-*` custom properties in `apps/astro/src/index.css` as the single source of
  truth, mirrored by `apps/astro/src/theme/tokens/atelier.ts`.
- Dark-mode `bg`/`fg`/`border` semantic tokens retargeted onto that palette.
- 748 hex literals replaced; 45 off-system `rgba()` hues normalised to amber.
- Guardrail re-enabled at `warn`, documented in `AGENTS.md`.

### Design
- Brand mark replaced with the designed asset extracted from `06_brand-icon-h.png`.
- The favicon was still Astro's default logo; replaced, plus an apple-touch icon.
- Duplicate brand mark between top bar and sidebar removed.
- Eyebrow labels were using a surface colour as text at roughly 1.3:1 contrast; fixed.
- Hero cut from four lines to two; section headings dropped to `4xl` so the h1 keeps a
  hierarchy step above them.
- CMS imagery pulled into the graphite system at rest, full colour on hover.
- Hobby embeds and tiles de-rainbowed; hobby monogram promoted so tiles differentiate.
- Nav `backdrop-filter` removed: the system specifies hard-edged elevation, not blur.

### Copy
- Gatekeeping register removed across en/ja/th on home, about and contact, so the three
  pages no longer contradict each other on availability.

### Performance (measured, not estimated)
- Material Symbols was requested with full variable-axis ranges: 3,967,040 bytes. Removing
  the ranges serves 320,688 bytes with identical glyph coverage.
- English font CSS 152,975 -> 1,019 bytes gzipped by scoping the Noto faces to the locales
  whose stylesheets actually name them.
- Namecard font CSS 212,626 -> 120,515 bytes gzipped.
- Nav scroll listener made passive and rAF-coalesced.
- Project card images now request a card-sized CMS derivative and carry intrinsic size.

### Process
- `conductor/CURRENT_TASK.md` is this file, replaced in place.
- 156 tests existed but no target ran them and CI never invoked them. Root `test` script
  and a CI step now run the full suite.
- Added `apps/astro/tests/atelier-fonts.test.ts` guarding the locale font contract, the
  icon-font axis regression and the custom-property set. Both guards were proven
  red-capable by reintroducing the real regressions.

## Council
Seven read-only auditors: correctness, requirement fidelity, verification (the mandatory
core) plus performance, i18n/locale regression, scope/regression and design fidelity.

Defects they found that were real and are now fixed: two failing tests (one from the
favicon removal, one asserting a hex literal the sweep replaced); twelve files left
unformatted, which is CI's only gate; the namecard losing its Thai and Japanese faces
because its layout imports `index.css`; `fg.muted` and `fg.subtle` collapsed to one value;
`atelier.ts` not actually mirroring the CSS block; orphaned i18n keys and an orphaned
`SpecLabel` component; a Japanese string left as a noun list terminated with a full stop;
two off-system tints.

Enumeration also caught 168 lines of unrelated Outline API drift that `bun install` pulled
into `libs/outline/schema.ts`. Reverted.

## Open, needs a decision from the user
1. **Availability wording.** Stitch comp 02 reads "Accepting selective freelance work".
   The de-cocking removed "selective" in all three locales, which changes a factual claim
   about availability rather than only its tone. Two auditors flagged it. Current state:
   "Open to freelance work".
2. **Missing comp sections.** Comp 07 has two further benches and a third status cell.
   Both carry invented figures (a specimen count, a 65% capacity meter), so they were not
   built rather than fabricating data.
3. **Darkroom claim.** Pre-existing: home copy claims darkroom printing while the camera
   hobby content is entirely digital.

## Gates (all run this session, from the repo root unless noted)
- `bun test` — 181 pass, 0 fail, 29 files.
- `cd apps/astro && bun run build` — 0 errors, 0 warnings, 0 hints.
- `cd apps/astro && bun run lint` — 0 errors, 50 warnings (untokenised amber `rgba()`
  washes and the deliberate namecard hex).
- `cd apps/astro && bun run format` — clean.

## Council round 2

Same seven lenses re-run on the fixed tree, with secrets folded into the scope lens
because `.github/workflows/ci.yml` had entered the diff.

Defects found and fixed:
- The `fonts.ts` refactor removed an export `atelier-fonts.test.ts` still imported, so the
  suite was red and that file's assertions were silently not running.
- `home.about-me` was deleted from all three locales, but `apps/client` still renders it
  through `AboutMe.svelte`. Restored in all three.
- The namecard font-family stack was edited, which is a frozen path. Reverted, along with
  `pages/[locale]/namecard/all.astro`. The namecard now requests only the one family it
  actually applies, which is a pure payload win with no rendering change.
- `token(colors.bg.canvas)` was shipping literally into production CSS. `token()` is not a
  CSS function and `index.css` is not processed by Panda, so the browser dropped it.
- `SmoothScroll` was a `client:only="react"` island on every page for a component that
  rendered `null`. Replaced with a deferred module script; Lenis is now a 17.7 KB
  code-split chunk. The only island on every page is now the mobile drawer; `Carousel`
  and `HobbyInteractiveEmbed` remain route-scoped islands, both `client:visible`.
- The restored hobby-row hover border used the same token as the resting border, so the
  transition animated nothing.
- `ProjectCard` passed both width and height, flipping `getMediaUrl` into `fit=inside` and
  under-serving non-4:3 sources. Now constrains one axis like every sibling call site.
- `body::after` painted a white soft-light film, off-system and fully occluded.
- Section h2 and the manifesto h3 were the same size; `StatusRow` emitted extra `h2`s.
- Doubled hairlines where a section's `borderTop` met the previous `borderBottom`.
- Dead `.holographic-sheen` rules carrying an off-system white.
- Prettier failed on 12 files, which is CI's only gate; `tests/` was outside lint and
  format scope entirely.

New guards, each proven red-capable by reintroducing the real regression:
locale font coverage, icon-font axis ranges, custom-property definition, Panda/CSS token
mirror, and i18n key parity across en/ja/th.

## Council status: NOT a clean round

Round 2 findings were fixed, but a third round was not run, so no round has come back
clean. Under the council protocol this is not a pass.

## Round 3
Ten findings across correctness, requirement fidelity, i18n, performance, scope and
design. All fixed.

Requirement fidelity (4): `og:image`/`twitter:image` were gated on a prop no page passed,
so every share card was imageless — a 1200x630 card built from the brand mark is now the
default; the Japanese hero CTA still read as self-praise while en/th were neutral;
`HobbyInteractiveEmbed` hydrated `client:load` unlike every sibling island; and this
record carried a stale claim about remaining islands.

Correctness (1): `as="h3"` on the status row skipped a heading level between the `h1` and
the first `h2`; reverted so the outline is valid.

Design (6): `colorPalette: 'blue'` in `global-css.ts` seeded the Radix blue ramp as the
document palette, so inline code and link hovers rendered blue — a second signal hue in a
system that permits only amber. `mark` was blue too. Nav labels used the display serif in
italic where the system pairs serif headings with sans UI. The manifesto `h3` matched the
section `h2` size, and italic was the default voice on every heading rather than an
emphasis device. Featured-project titles were not headings.

Performance (11 raised, 7 fixed): the events heatmap constructed two `Intl.DateTimeFormat`
objects per calendar day across the entire history and discarded 90% of the result —
measured at 1,040 ms versus 5.7 ms hoisted, on the SSR request path. `/events` was the only
data page with no `CDN-Cache-Control`. The namecard requested four weights of M PLUS 1p
where two are used. The icon stylesheet was a second render-blocking round trip for under a
kilobyte. Project detail requested full-resolution CMS originals. The gallery rail had no
lazy or decoding hints. Native `scroll-behavior: smooth` fought Lenis on the same scroller.

i18n (3): the About availability row answered an availability question with an employment
type, and did not match the home status cell in any locale. The Japanese hero CTA still
read as self-praise while en and th were neutral.

Scope (4): `lint:fix` was not widened alongside `lint`; dead CSS and dead style keys were
recoloured instead of deleted.

Verification (6): asset references, the share-card contract, hydration directives, media
bounds and the scroll listener had no guards; the colour guardrail was `warn` with no
ceiling, so it could never fail CI.

New guards added this round, each proven red-capable by reintroducing the real regression:
referenced static assets must exist on disk, share cards must emit an image
unconditionally, no island may hydrate eagerly, every `getMediaUrl` call must constrain a
dimension, the nav listener must stay passive and frame-coalesced, native smooth scrolling
must not return, the token mirror must match by name and value in both directions, and
locale key sets must match including nesting. `lint` is now pinned at its 50-warning
baseline, so any new hardcoded colour fails CI.

## Round 4
Twenty-four findings across seven lenses. All fixed.

Two were my own guardrails being theatre. The `--max-warnings=50` ceiling never ran in CI
because the nx `lint` target overrides the package script, and the nx executor ignores its
own `maxWarnings` option even when set — proven by injecting a 51st hardcoded colour and
watching `nx run astro:lint` pass. The root `check` script now runs the ceilinged lint
directly, proven to fail on a 51st warning. Separately, two tests I wrote could not catch
their own defect: the media-bounds guard only inspected calls that already passed an
options object, so `getMediaUrl(url)` slipped through, and the reduced-motion guard proved
textual ordering rather than nesting, so hoisting the import out of the guard still passed.
Both rewritten and proven red.

One was a regression I introduced during round 4 itself: deferring the whole font
stylesheet also deferred the `.material-symbols-outlined` rule, so icons painted as the
literal words "menu", "dark_mode", "north_east" before swapping. The icon face is now its
own small non-deferred request with `display=block`; verified in a browser that zero icons
render as literal text while the deferred text faces still load.

Also fixed: the report module still constructed `Intl.DateTimeFormat` per day and per event
— the round-3 fix had only touched the page, leaving ~264 ms of SSR time; the Outline asset
proxy set no CDN header at all, making every image a guaranteed origin miss; the contact
page rendered uncached with no request-time data; eight i18n keys rewritten this session
were rendered by nothing and are now deleted; Japanese register defects in the about row
and status heading; a Thai nav label that was a dangling preposition; the last ambient
amber glow layer; pure black in the drawer scrim; amber spent on a wordmark and a
copyright line rather than on signals; the homepage h1 matching its h2 at the base
breakpoint; italic still the default voice of the largest type; and featured-project titles
that were not headings.

Guards added, each proven red-capable: the document palette must stay amber, the namecard
must request only two weights, every data page must set a CDN header, the asset proxy must
be cacheable, the icon face must not be deferred, and the text stylesheet must stay
deferred.

## Round 5
Nineteen findings across seven lenses. All fixed, and two of my own claims were wrong.

**Correction: nx does honour `maxWarnings`.** Round 4 recorded that the nx eslint executor
ignores the option. That was false — the earlier test captured `tail`'s exit code rather
than nx's. Measured properly: `nx run astro:lint` exits 0 at 50 warnings and 1 at 51. The
workaround appended to the root `check` has been removed as redundant, and the guard now
asserts the ceiling on `apps/astro/project.json`, which is the target CI actually runs.

**Correction: the namecard applies only M PLUS 1p.** A round-5 auditor said the detail page
inherits `index.css` and therefore applies Manrope and the locale Noto faces, so I added
them. A second auditor disputed it. The browser settled it: `NamecardLayout`'s unlayered
`<style is:global>` beats `@layer base`, and the computed `font-family` on
`/ja/namecard/default` contains neither. The addition was reverted along with the test that
had locked it in. I should have checked before acting on the first claim.

**My font deferral was reverted.** `media="print" onload` never fires when ClientRouter
re-inserts the link on a locale switch, so JA/TH faces would never apply in SPA navigation,
and deferring introduced FOUT with no metric-matched fallback. The `/ja` payload stays a
recorded open item rather than being "fixed" by a change that cost more than it saved.

**My media-bounds guard was still broken** despite a round-4 claim that it was proven red.
It only flagged by an accidental lazy match; replayed at real call sites it returned green.
Rewritten with paren balancing and re-proven by stripping the options object at two real
call sites.

Also fixed: the events cache header was set before the try/catch, so one upstream timeout
pinned a degraded page at the edge for an hour; `.blocky-shadow-hover` laid a graphite film
over the amber CTA on hover, degrading the one interaction amber exists to signal; the
carousel indicator still resolved through the Park-UI mauve ramp; twenty-six heading roots
outside the homepage still carried blanket italic; the manifesto h3 tied with the section h2
at the base breakpoint; twelve more orphan i18n keys; an English contact label reading
"Availability" over a reply-time body; a Japanese label naming a metric where the value is
an artist; the RSS channel had no brand image; and `ThemeToggle`, `BrandMark.compact` and
the out-of-scope `apps/client` favicon were dead surface or scope leakage.

Guards hardened: three glob-driven tests could pass by matching nothing and now assert
corpus floors; two assertions were tautological; the `mark` and `scroll-behavior` guards
matched file-wide rather than the rule they name; and the guardrail path itself is now
guarded, so deleting the CI test step or raising the ceiling fails the suite.

## Round 6
Twenty-two findings. Fixed, with two rejected on runtime evidence.

The largest was a second signal hue that survived every previous colour sweep:
`--global-color-focus-ring` was never defined, so Park UI's recipes fell back to `#005fcc`
and painted a blue keyboard focus ring on eight pages. Defined against the accent and
verified in a browser at `#ffb000`.

Also fixed: four unlayered italic heading roots in `events-report.css` which additionally
defeated the ja/th italic suppression and forced synthesised oblique on faces that have no
italic; the hobby detail `h1` and the project card `h3`, both still italic and the latter
contradicting the homepage treatment of the same content; `/about` had no h2-to-h3 step from
`md` up; a border colour used as body text at roughly 2.0:1 on two homepage sites; dead
`.shell-nav-brand` amber rules and a dead nav-link italic suppression; and formatting churn
I introduced in `project.json`.

Two cache-header defects the guard was blind to: the project detail 503 branch and the tag
detail failure branch shipped with no edge directive, and the sitemap swallowed a CMS
failure and cached a truncated result for an hour.

Corrections to my own round-5 work: the ja label I changed named the wrong metric, since the
card ranks attendance rate while the card above it ranks raw count; the ja/th attendance
sub-line concatenated value-then-label, which is English word order, and now interpolates
through a template key; and the ja availability value carried a bare intra-phrase space that
disagreed with its twin in home.json.

**Rejected on evidence.** An auditor claimed the namecard `h1` resolves to Noto Serif JP
through `@layer base`, contradicting the round-5 browser check. Re-measured: the `h1` on
`/ja/namecard/default` computes to M PLUS 1p, because `NamecardLayout` carries an unlayered
`html.namecard-document h1..h6 { font-family: inherit }` rule the auditor's reasoning
missed. The finding and its paired test recommendation were dropped.

Guards hardened again: the CDN-header guard was a bare substring blind to the exact
round-5 regression and to both live gaps above, and the ceiling guard did not check that
root `check` still runs the lint target. Both rewritten and proven red by reintroducing the
real regressions.

## Round 7
Fourteen findings. All fixed.

Two were my CDN guard still being inadequate, and one showed my round-6 "proven red" claim
was over-broad again: I had proved it against the header-before-catch regression but never
against a missing failure branch, which it could not see because it only inspected the
first header set in a file. It also "checked the value" through a clause satisfied by any
colon in the following 400 characters. Rewritten to collect every set, extract each value
by paren balancing, validate every literal on both arms of a ternary, and require a
degradable page to have an uncacheable or conditional path. Proven red against both the
deleted failure-branch header and a bogus directive value. Two false positives it initially
produced were themselves investigated and rejected: `hobbies/[...slug]` carries status and
directive together in one computed object, and `notes/[...slug]` covers three status
assignments with one if/else — both better patterns than the rule assumed.

Also fixed: three heading sites hardcoded `Newsreader, serif`, which lives in
`@layer utilities` and therefore beat the `html:lang(ja|th) h1..h6` rules in `@layer base`,
so Japanese and Thai headings fell back to generic serif while the Noto face was still
downloaded; the contact placeholder composited to 2.35:1; a border colour used as text at
2.00:1 on the project detail meta row; the heatmap scroll handler interleaved layout reads
with style writes and was not frame-coalesced; two English and one Thai label named a day
count over a percentage value; three Japanese counter phrases inserted a space between
numeral and counter; the `/about` heading tie from `md` up; the markdown heading ladder had
h4 tying with h3 and h5 with h6 at the offset every long-form page uses; the key orphaned by
last round's template-key introduction; and dead nav-link italic selectors.

## Round 8
Ten findings. All fixed.

Two showed round-7 fixes that had only partially landed: my `/about` heading replace matched
one form and silently skipped two headings in other forms, and the `Newsreader, serif`
cascade fix covered three heading sites but left four prose sites and four CMS-title sites
with the same defect — a literal font family in `@layer utilities` beating the
`html:lang(ja|th)` rules in `@layer base`, so Japanese and Thai copy fell back to a generic
face while the Noto font was still downloaded.

The CDN guard was blind again, in a new way: it scanned only `index.astro`, so the sitemap
and RSS endpoints were outside its corpus and the round-6 sitemap regression it was credited
with covering was unguarded. Widened to `.ts` endpoints, taught the object-literal header
shape, and proven red by dropping the directive from both. RSS also had no edge directive at
all; added.

Also fixed: a tag-detail markdown block with no heading offset, which emitted a real `h1` at
48px nested inside an `h2`; an item title rendering larger than the section heading that
groups it; and the fifth cumulative-artist chart series drawn in the border colour at 2.00:1,
below the 3:1 floor for a graphical object that carries meaning.

Sixteen orphaned i18n keys deleted — the fourth hand-deletion this session, so a reachability
guard now resolves literal `t()` call sites across both apps and fails on any stranded key,
skipping namespaces reached by template interpolation. Proven red by injecting one.

## Round 9
Ten findings across both auditors. All fixed.

One was a regression I introduced in round 8: the font-family rewrite invalidated
`html:lang(ja) [class*='ff_Newsreader']`, a selector coupled to the Panda utility class
name, so Japanese prose on four pages silently lost phrase-aware line breaking. The rule
now targets elements instead of a generated class name.

The cascade defect had six more instances: five unlayered `'Manrope', sans-serif`
declarations in `index.css` covering the hero CTA, contact inputs, select options and every
sidebar nav label, plus the 404 description. All tokenised.

My reachability guard from round 8 was largely theatre: it exempted a whole namespace as
soon as one template call touched it, which skipped `common` and `hobbies` — 62% of all
keys, and the only two namespaces with orphans. Twenty-four stranded keys survived it.
Rewritten to resolve dynamic keys from source, with the CMS-derived skill categories
enumerated explicitly rather than exempting their namespace, and proven red by injecting a
key into the previously-exempt namespace. The keys it then found were deleted.

Also fixed: nine sites still concatenated a number, a space and a bare unit in English word
order, which is ungrammatical in Japanese and Thai; the markdown heading ladder is now keyed
on the offset so the top never outsizes its container and no level falls to or below body
size; and the CDN guard pinned its corpus size exactly, since its floor had one file of
margin and a mutation that dropped a file out could have gone silent.

Templating the day unit broke a second usage where the same key was a bare label under a
numeric value, which shipped a literal `{n}日` to the page. Caught in the browser, split
into separate bare-label and count-phrase keys; the now-unused singular label was then
caught by my own reachability guard and deleted.

## Round 10
Eleven findings. All fixed.

The best of the session came from the panel, not from me: the Newsreader request omitted
the `ital` axis, so it served zero italic faces. Every italic in a design system whose only
emphasis device is italic — the hero emphasis, the manifesto, the note ledes, the 404
numeral — was a browser-synthesised slant of the roman. Measured: 0 italic faces before, 3
after, at a cost of about 60 bytes gzipped. Verified in the browser that a real italic face
now loads and the emphasis span uses it.

My reachability guard was still hiding a dead key. Its `quoted` fallback accepted any bare
lowercase string anywhere in source, so `hobbies.explore` passed because `'explore'` is a
Material Symbols icon name at `events/index.astro:343`. The fallback is replaced by reading
the actual lookup tables in `utils/hobby-labels.ts`, `common.others` was added to the
enumerated CMS categories where it had been missing, and the tightened guard immediately
surfaced the dead key. Proven red again afterwards with a key that is not an icon name.

Also fixed: the note previous/next titles were italic on Manrope, which has no italic face,
so they rendered as a synthesised sans oblique for English only while ja/th were upright —
three locales disagreeing on one element; a project card title that outsized the section h2
grouping it; a markdown offset-2 ladder that tied with its enclosing heading at the base
breakpoint; an About education heading at or below body size; Japanese using 出席率, the
register of compulsory attendance, for live-event participation where every neighbouring
string uses 参加; and a Thai count of people with no classifier.

## Round 11
Ten findings. All fixed, with one claim corrected on measurement.

Two were unguarded guards. The round-10 italic fix — the session's flagship — had no test at
all, so reverting it left the whole suite green, and a stale comment documented the pre-fix
string for a future reader to restore. And the reachability guard's replacement extractor
still harvested every quoted string in `hobby-labels.ts`, including the `field: 'label' |
'description'` union members and `Intl` options like `'numeric'`/`'gregory'`; seven of eight
injected orphans passed it. The extractor now matches right-hand sides only, and the italic
axis is guarded and proven red.

The mono slot had the same cascade defect as the serif and sans slots, unnoticed for four
rounds: 168 literal `JetBrains Mono, monospace` declarations across components, pages and
inline styles, on locale-bearing UI labels. JetBrains Mono carries no CJK or Thai, so
Japanese labels like 個人サイト and 稼働状況 fell through to the browser's generic monospace.
`--font-code` now has ja/th fallbacks and every literal routes through it; verified in the
browser that the Japanese label resolves to `JetBrains Mono, Noto Sans JP, monospace`.

Also fixed: the About education heading was still `sm`, below body size — round 10 raised the
structurally identical experience heading and I recorded it as done; the project card title
rendered in the display serif where every other project surface uses bold uppercase sans, so
the same content had two faces depending on the route; the heatmap ramp made a one-event day
1.2:1 against an empty cell, below the 3:1 floor for a meaningful graphic; markdown body
images reserved no space before decode; and an English label promised a day count over a
percentage value.

**Correction on measurement.** An auditor reported that the italic was pinned at weight 400
while headings are semibold, causing synthetic bold on the emphasis spans. Measured in the
browser: every italic element computes to weight 400 and the loaded faces are variable ranges
`400 800`, so no synthetic bold was occurring. The axis was widened anyway — it is correct
and 57 bytes gzipped smaller — but the reported failure was not live and is not claimed as a
fixed bug.

## Round 12
Thirteen findings across two auditors. All fixed. Two auditor claims were wrong on the facts
and are recorded as corrections rather than fixes.

**The mono token was never in force.** `recipes/code.ts` and `recipes/kbd.ts` set
`fontFamily: 'code'`, which names no token, so Panda emitted the literal invalid declaration
`font-family:code` into the shipped sheet. Every inline `<code>` therefore fell back to the
browser default. Routing them to the `mono` token exposed a second, larger defect: `theme.extend`
concatenates onto the preset stacks, so `--fonts-sans`, `--fonts-serif` and `--fonts-mono` all
resolved to the preset generic first and could never deliver Manrope, Newsreader or JetBrains
Mono. `theme/tokens/fonts.ts` had been inert for the whole session. Nothing consumed it, so it
was deleted and both recipes now point at `var(--font-code)`; verified in the browser that a
`<code>` on `/ja` resolves to `JetBrains Mono, Noto Sans JP, monospace`.

**The font-literal guard found eleven live regressions on its first run.** The new test bans
literal family names outside the token definitions, and immediately caught eleven
`Newsreader, serif` / `Manrope, sans-serif` declarations across the home, about, projects and
hobbies pages plus `hobbyStyles.tsx` — all emitted into `@layer utilities`, which outranks the
`html:lang(ja|th)` overrides in `@layer base`. This is the fourth round in which this defect
class appeared; it is now guarded rather than swept.

**The mobile drawer shipped the whole i18n corpus.** `Sidebar.tsx` imported `useTranslations`
to render four strings, pulling all ten namespaces in three locales into its chunk: 73,166 B
raw / 20,021 B gzip on every mobile page view. The four labels and the locale list now arrive
as server-resolved props. Measured after: 4,188 B raw / 1,755 B gzip, with no CJK or Thai
string left in the chunk. Verified in the browser at 390x844 that the drawer opens, all four
Japanese labels render, all three locale links resolve, Escape closes it, scroll lock releases
and focus returns to the trigger.

Also fixed: a stale `localStorage` value could still strip `.dark` and render the site on the
Park-UI mauve and red light ramps with no control left to switch back (the toggle was deleted
earlier this session), so the script is gone and `class="dark"` is hard-coded; three orphaned
components, one of which was the only reason the mauve `segment-group` recipe stayed in the
sheet; the heatmap legend's first swatch was 1.08:1 against its panel and simply did not
render; eighteen `/events` panel headings were `h2` inside sections whose head was also `h2`,
flattening the outline on the largest page; the homepage featured description was italic
display serif where every other project surface renders it upright sans; `index.css` was
outside the only formatting gate CI runs; markdown images were letterboxed into a fixed 16:9
box; the reachability extractor was narrowed to the three copy tables and the real key prefix;
and three locale labels named an activity or a count over a percentage or aggregate value.

**Two corrections.** The auditor reported `Carousel.tsx` carried the same i18n cargo as
`Sidebar`; it does not import i18n at all, and a string probe of its chunk found no CJK or
Thai. And it grouped `highlight-head` with the panel heads; it occurs once and is the section
head of `#highlights`, so it stays `h2`. Renaming its CSS selector was my error, caught by
measuring in the browser rather than by reading the diff — the same measurement also caught
that the rule carrying the panel heading size was `.event-report__panel h2`, which I had not
renamed, leaving all fourteen headings at 16px. The ladder now measures 38.4 / 28.16 / 24 px.

## Round 13
Twenty-nine findings across two auditors. Twenty-five fixed; four are recorded below as
needing a decision rather than closed. Two auditor claims were wrong and are corrected.

**Every CMS image transform on the site was a no-op.** `getMediaUrl` appended
`?format=webp&q=75&h=...`, and the origin discards the whole query string: measured
`?w=1` returning the same 783,526 bytes as the bare URL. So the round-3 guard requiring
every call to "constrain a dimension" had been validating a parameter the server throws
away — a guard that could never fail for the reason it existed. Strapi does write real
derivative files and records them in `formats`, so `media.gql` now selects `width`,
`height`, `size` and `formats`, and a new `resolveMedia` picks the lightest derivative that
still covers the rendered box. It refuses a derivative that is heavier than the original,
which happens: `aibou_4`'s `medium_` is 41,056 B against a 40,294 B original, so that one
correctly keeps the original while its neighbours drop to `medium_`. Homepage project
images measured **1,072,603 -> 697,141 B, 35% off**. All `getMediaUrl` call sites in
`apps/astro` are gone; the guard now asserts that and that every `resolveMedia` call passes
a literal target width.

**The a11y guard I rewrote in round 12 was blind.** Its `[\s\S]*?` was unbounded, so after
deleting the overlay's `aria-label` the regex walked ten lines past the element and matched
the close button's label instead — verified by making exactly that deletion and watching all
three assertions pass. The overlay could have shipped with no accessible name. It now slices
to the element before asserting, and was proven red against the same deletion.

**The font-literal guard was written against two spellings, not the defect class.** The
auditor replayed nine realistic reintroductions through its regex and it caught two. It
required a trailing generic, so `Newsreader, Georgia, serif`, `"Manrope", sans-serif` and
`JetBrains Mono, Noto Sans JP, monospace` — the round-11 mono defect in its stacked form —
all sailed through. It now extracts every `font-family`/`fontFamily` value by delimiter and
rejects any of the seven real family names, and was proven red against four shapes the old
one missed. Corpus counts on both new guards are pinned exactly (282 files, 30 hobby keys)
rather than left as floors with 50-70% slack.

**Five more labels named a count over a percentage value** — the defect class rounds 7, 9, 11
and 12 each closed one instance of. `events-report-without-favorites`, `-weekend-events`,
`-weekday-events`, `-multi-event-days` and `-multi-venue-days` all sit over `pct1(...)`; all
five are now share-form in all three locales. `events-report-activity-heatmap` also read
"Active days", identical to `events-report-active-days` on the same page, and now names what
it actually labels.

**Tone and cross-locale consistency.** ja/th stated a normative rule (べき / ควร) where en
states a personal effort; ja/th instructed the visitor to be concise before making contact
where en does not; ja/th claimed competence (得意分野 / ถนัด) where en names a topic (Focus);
and th used two different words for the availability row that en and ja align on. All
brought onto the English register. The availability value also carried a second, unrelated
fact (kanji study) under a label that names availability; removed in all three locales.

**Latin text rendered in a different face per locale.** `html:lang(ja)` put Noto first, and
Noto Sans JP carries Latin glyphs, so Latin runs — project names, "GitHub", "VS Code" —
rendered in Noto on `/ja` and Manrope on `/en`. `/th` had the same shape. The Latin face now
leads in both; it carries no CJK or Thai glyphs, so those runs still fall through to Noto.
Verified in the browser on `/ja`.

Also fixed: the `#highlights` section head sat off the ladder and tied with the panel `h3`
below it at 390, 600 and every width from 1512 px up (the round-12 "38.4 / 28.16 / 24"
claim held only at the one width measured); the heatmap legend's first key reached just
1.62:1 even after round 12's border, and now uses the outline token at 5.41:1; seven
`aria-label`s sat on bare `div`s where they are not exposed at all; a 684x326 ambient amber
wash on `/contact` was the largest amber area on the page in a system where amber is the
only signal colour; the asset-existence guard scanned three hand-listed files out of ~294
and missed two real references; the round-12 drawer chunk fix had no guard, so reverting it
was silent; markdown images were upscaled to the column and had a saturation filter applied
to user content; and the offset-2 markdown heading ramp rendered all six levels identically.

**Two corrections.** The auditor reported `--fonts-sans/serif/mono` as dead-but-harmless;
they are dead, but the same report's recommended `fontFamily: 'sans'` spelling is exactly
the trap that produced round 12's `fontFamily: 'code'` bug, so the tokens stay unused rather
than being reintroduced as a supported spelling. And it grouped the `/events` `highlight-head`
with panel heads; it is the section head of `#highlights` and correctly stays `h2` — only its
size was wrong.

## Round 14
Thirteen findings from the correctness auditor, all fixed. The round-13 image work was the
main casualty: it was correct on the homepage and wrong or unproven everywhere else.

**`resolveMedia` had four defects and no behavioural test.** Reproduced all four directly:
(1) the server prefix was decided once from the original URL and then applied to the
derivative, so an absolute original returned a host-less relative derivative path —
`https://cdn.x/a.png` with a relative `medium` yielded `/uploads/medium_a.png`; (2) the
comparator sorted on `size ?? width`, mixing kilobytes with pixels, so a format missing its
size sorted last and the wider, heavier file won — measured `large` (1000px) chosen over
`medium` (750px); (3) `resolveMedia(banner, 1200, ...)` on the project detail page needed
1800px against a ladder whose largest rung is 1000px, so every call there silently returned
the original and the migration bought nothing on that route; (4) `formats` delivered as a
JSON string fell through to the original. Each URL now resolves independently, ranking is on
width alone with `size` used only to reject a derivative heavier than the original, the
detail page targets 640 (960 needed, inside the ladder), and JSON-string `formats` parse.

**The guards for that code were substring greps.** They asserted that the character
sequences `entry.size < file.size` and `entry.width >= needed` appear somewhere in
`media.ts` — satisfied by a comment, and green with all four defects live. Replaced with
`libs/utils/media.test.ts`: ten behavioural cases over null/empty/string/malformed `formats`,
missing `size`, absolute original, absolute derivative, an original smaller than the target,
and a missing server. All four defects were re-introduced one at a time and each turned the
suite red. A guard now also rejects any call site whose `target x 1.5` exceeds the 1000px
ladder, proven red by restoring the 1200 target, and the call-site guard requires the server
argument, without which every URL is origin-relative.

**The font-literal guard, broadened in round 13, still missed the worst shape.** A
`--font-body: 'Manrope', sans-serif` redefinition in `styles/events-report.css` reproduces
the round-7/8/9/11/12 defect exactly — the guard only fired on `font-family`/`fontFamily`,
never on the custom properties those rules exist to protect. It also missed the `font:`
shorthand and a locale ternary (`fontFamily: isJa ? 'Noto Sans JP' : 'Manrope'`), which is
the literal subject matter of this defect class. All four shapes now fail, proven
individually. The `expect(scanned).toBe(282)` pin was also replaced: it made a font test fail
whenever anyone added an unrelated component, with nothing pointing at the cause. It now
takes a floor plus an explicit assertion that the three highest-risk files are in the scan
set, which is what the pin was actually buying.

**A new guard found two things the auditor had cleared.** The `{n}` interpolation guard — the
round-9 regression that until now only manual discipline prevented — needed two corrections
of its own before it was right (the interpolation may sit on an enclosing ternary, and the
`.replace(` call may be split across lines), and is proven red against a label rendered bare.

Also fixed: `BrandMark` put `aria-label` on a bare `span` while hiding its "HAM" text below
640px, so the nav home link had no accessible name on every mobile page — the same
aria-on-generic pattern round 13 fixed on seven `/events` divs and left here; the image now
carries the name. `HobbyTypeGlyph` had the same latent construct. `ProjectCard` fell back to
`src=""`, which resolves to the document URL and costs an extra HTML fetch plus a broken-image
glyph; it now falls back to the monogram. The drawer-corpus guard matched only the `~/i18n/`
alias, so a relative specifier would have reintroduced the 20 KB regression with the guard
green. The asset-existence glob excluded `.css` and `url()` references.

**One correction to round 13.** The offset-2 markdown heading ramp was recorded as fixed; it
was not. `['2xl','xl','xl','xl','xl','xl']` still rendered five of six levels identically. At
that nesting only two sizes sit above body copy, so a full six-step ramp is not available;
it now has three distinct steps with levels 4-6 collapsing, as they already do at offsets 0
and 1. Recorded here accurately rather than as closed.

The design auditor added fifteen findings in the same round; fourteen fixed, one recorded
as a tuning decision and one was already stale.

**The calendar heatmap was a two-tone binary map, not a density map.** `--level` normalised
each day against `maxDailyActivityCount`, a value reached on exactly one day, so 67 of the 75
populated cells sat inside a 3.5-point band of the colour mix — a one-event day and a
two-event day measured **1.08:1** apart. The legend meanwhile advertised five steps the grid
could never produce. Cells now bucket on absolute counts (1 / 2 / 3 / 4+) across the same
60-100% range the legend uses, and the keys were nudged to land exactly on the bucket mixes.
Measured after: five distinct fills, 135 / 43 / 24 / 5 / 3 cells, ~1.3:1 per step instead of
89% of the data crushed into one tone. The grid's own hairline was also still
`rgba(82,69,51,0.8)` at **1.61:1** — round 13 raised the legend swatch and not the chart it
explains — and now matches at 5.41:1, which matters because on the 135 empty cells that
border is the only thing marking that a day exists.

**Round 13's rename traded one label collision for another.** `events-report-activity` and
`events-report-activity-heatmap` both became "Calendar density", rendering as an `h2` and the
`h3` directly beneath it with nothing between, plus a third instance in the rail. The panel
now names the artifact ("Daily grid" / 日別グリッド / ตารางรายวัน) rather than the topic.

**The manifesto emphasis was a no-op in two of three locales.** The span carried only
`font-style: italic`, and ja/th deliberately suppress italic for Noto, so 実用的。 and
ใช้งานได้จริง rendered identically to the surrounding heading while English got emphasis. The
hero span already solved this with the accent colour; the same substitution now applies, and
was verified computing `rgb(255,176,0)` in all three locales.

Also fixed: six `.contact-social-card` tiles still carried an amber wash totalling 140,712
px², 63% of the area removed from the same page in round 12 for exactly this reason, and
carrying no signal; the homepage status cells were `h2` fixed at 24px while the manifesto
`h3` beneath them rendered 36px, an inversion at every width and a tie at 390/600 — now
48/24-36/20 with the h3 below every h2; two Japanese labels named a participation rate over a
share of events, one kanji apart from the adjacent row that *is* that rate; two Thai panel
heads said สัดส่วน ("share") over raw counts, colliding with the eight share-form labels
round 13 introduced on the same page; the projects-index target was 400 against a card
measuring 557px, and the intro-photo target 600 against a 366px box; the homepage profile
photo rested at `saturate(1.12)`, which is the site's hover treatment everywhere else; and en
spelled "namecard" two ways roughly 250px apart.

**One tuning decision, not taken.** `devicePixelRatio = 1.5` costs 345,140 B on the homepage
versus 1.0 for a density that still does not cover a 2x display either way. Recorded with the
numbers rather than changed, since it trades sharpness for bytes on every image on the site.

The auditor also re-reported the project-detail `1200` target; that was already fixed to 640
earlier in the same round, and it noted `media.ts` changing under it mid-audit.

## Round 15
Twelve findings from the correctness auditor. Ten fixed; the two label-collision findings
move to the open list as content decisions. Round 14's own image work was the main casualty
again.

**Round 14's target change was a 66% regression, and the guard could not see it.** Raising
the projects-index target 400 -> 560 was meant to match the measured 557px card. But 560 x 1.5
= 840 exceeds `medium` (750), leaving only `large` (1000), which is heavier than the original
and correctly rejected — so the route fell all the way back to the 2560px, 783 KB original,
where 400 had been selecting the 472 KB `medium`. The detail page's 640 was the same shape.
The ladder guard checked only that `target x 1.5 <= 1000`, i.e. reachability, so it passed
while both routes were no-ops. Root cause: ranking on the density target alone gives no
answer between "covers the box at 1.5x" and "the multi-megapixel original". `resolveMedia`
now has a second tier — a derivative that at least covers the CSS box beats falling back to
the original — and the guard asserts *selection* rather than reachability: it resolves every
call-site target against a representative ladder and fails when a route takes the original,
excepting the detail page whose ~1110px box genuinely exceeds the whole ladder.

**A round-14 fix had not actually landed.** The record credited the asset-existence guard
with covering `.css` and `url()`; the glob was still `{astro,tsx,ts}` and the pattern still
required quote delimiters. Re-applied and proven red by pointing a `url()` at a missing file.

**The drawer-corpus guard could not see the most direct reintroduction.** It matched
`i18n/(ui|utils)`, but the corpus lives behind `i18n/index` — `ui.ts` is itself
`import ui from 'i18n/index'`. Adding that import straight to `Sidebar.tsx` restored the
20 KB chunk with the guard green; proven, then fixed to match any i18n specifier except the
`i18n/path` leaf, which has no imports at all.

Also fixed: `resolveMedia` would swap a still derivative in for an animated GIF (`getMediaUrl`
had an explicit `animated=True` branch that was not carried over), and treated an unknown
original `size` as licence to substitute — the nullable field is selected in the fragment, and
without a baseline no derivative may be swapped in. The `{n}` interpolation guard ignored the
four `{count}` keys, whose only consumer had a `template.includes('{count}') ? ... : \`${value}
${template}\`` fallback that silently emits English word order for a locale missing the
placeholder — the guard now covers every placeholder and the fallback is gone. The font guard
fired inside comments, so an explanatory comment naming a family would fail a font test.
`BrandMark` named the nav link twice ("Ham HAM") above 640px once round 14 gave the img an
`alt`. Project imagery rested at `saturate(1.12)` — the site's hover value — on the card and
the detail banner, while the homepage rests at graphite `saturate(0.32)`; the card now rests
graphite and comes to colour on hover, and the banner rests at true colour.

**Round 14's heading claim did not hold.** "the h3 below every h2" was true only for the
manifesto h3 above `md`. The projects-empty h3 was 24/30 against status h2s at 20/24, and the
featured-card h3 tied them at base. Status cells are now 24/30 and every h3 is strictly below
every h2 at both breakpoints, verified against the generated token values rather than by eye.

The design auditor added nineteen findings in the same round; seventeen fixed, two folded
into the open list.

**A second amber was reaching rendered pages.** `colorPalette: 'amber'` seeds the Radix ramp,
whose alpha steps drift from hue 15.7 to 46.4 degrees while the system accent is 41.4. `a11`
reached `color` and `a7` reached `border-color` on 66 and 132 elements; the solid `11` key
carried the same `#ffca16`. The round-4 guard "the document palette stays amber" had locked
in Radix's amber rather than the atelier accent. All three now resolve to `#ffb000`, verified
zero occurrences of `#ffca16` in the built sheet, and guarded.

**The top navigation broke mid-word for 132px of viewport.** The horizontal nav switched on
at 768px but does not fit until ~834 in Japanese, so every label wrapped — even the
two-character 趣味 split across two lines — and English broke `About me` up to 819. Both iPad
portrait widths sit inside that band. The nav now switches at 900px with `white-space: nowrap`
and the drawer trigger covers the whole gap; verified at 768/820/900 that exactly one of the
two is present and no label wraps.

**A backup restore during guard-proving silently reverted two round-14 fixes.** Restoring
`events-report.css` from a scratchpad copy taken before those fixes put back the 50-100%
heatmap range and the `rgba(82,69,51,0.8)` grid border. Both were re-applied, and every other
file touched by a restore was re-checked against a written list rather than assumed.

**The heatmap legend promised more resolution than the ramp could deliver.** Round 14's four
buckets over a 60-100% mix separated by only 1.27-1.32:1, so the grid read as one amber. Three
buckets over 55-100% give 1.52-1.61:1 per step while keeping empty-versus-populated at
3.66:1, above the 3:1 floor — widening to 30-100% would have improved the steps but dropped
that distinction to 1.97:1, which is the more important signal. Legend trimmed to four keys.
The grid itself was also 210 contentless spans carrying only `title`, which produces no
accessible name, so the whole panel was invisible to assistive technology; it now has
`role="img"` and a described label in all three locales.

**Seven Japanese counter sites had a literal space between numeral and counter** (`13 年`,
`459 イベント`), four from template literals and three from JSX collapsing a newline. All
seven now route through a locale-aware joiner; the `{n}`-templated keys on the same page had
always been correct.

Also fixed: the hero portrait declared `width="1200" height="1200"` on a 297x400 file and
requested a 380px target for a box reaching 686px — it now emits the real intrinsic size from
the resolver and asks for 700, though the source asset genuinely cannot fill the box and that
stays open; the hero was also the only CMS image on the page at full colour while its three
neighbours rest in graphite; `--atelier-line` is 2.00:1 and was the boundary of the six
interactive social cards, now `--atelier-outline` at 5.85:1; Latin-only font stacks left 146
CMS-sourced Japanese nodes on `/en` falling to a browser default, now backed by installed
system CJK faces at zero network cost; `/tags/<slug>` jumped h2 -> h6 because authored
markdown depth was added to the offset absolutely, now ranked on the sequence of levels
actually present; the contact page had two headings for seven visual sections; the
featured-card `h3` tied the status `h2` at base; `.event-report__overview-card h3` rendered
24px against 28.16px for the same rank on the same page; ja `プロジェクト` for the homepage
featured section collided with the nav item and the projects index; ja `週末稼働率` used
equipment-utilisation register; and the `h1`'s two halves concatenated with no separator in
`textContent`.

**Newsreader dropped its `opsz` axis: 516,188 -> 222,564 B for the same six faces, a 57% cut.**
The italic guard had pinned the exact axis list, so it failed a pure payload change that
preserves every face; it now asserts the property it exists for — that `ital` is present and
covers the roman's weight range.

## Round 16
Twenty-eight findings across two auditors. Twenty-five fixed; three folded into the open list.
Three were my own false claims from earlier rounds.

**I reported a red gate as green.** `bun run check` was failing on `astro:format` for three
round-15 files, and I missed it because I grepped the output for `problems|Successfully ran`
instead of reading the exit code — the lint sub-target's passing line printed while the format
target failed. Every gate check from here reads `$?`. This is the proxy-verification failure
this session has been finding in the code, committed in the verification itself.

**"The card now rests graphite" was false for the route that matters.** Round 15's edit landed
in `ProjectCard.tsx`, which is imported by exactly one page — `/tags/<slug>`. The projects
index uses the `.image-archival` CSS class, which still rested at `saturate(1.12)`, the site's
hover value. So the primary listing was the one route still above true colour while the record
claimed the opposite. Fixed there, and in the two other stragglers found by the same sweep
(the note hero image and the hobby detail visuals).

**Three of the seven "counter spacing" sites were never defects.** `.event-report__highlight-totals
span` is `display: grid`, so the numeral and the counter are separate grid items on separate
rows — there was no inline space to remove, and the `{unitGap}` I added there was dead code
that the formatter then reformatted around. Reverted, and the round-15 entry is wrong: four
sites, not seven. The auditor did find a real eighth site the sweep missed — the notes
reading-time line renders `5 分 / 1,234 語` — now routed through the same joiner.

**`/ja/projects` scrolled horizontally at every phone width.** `word-break: auto-phrase` makes
a long Japanese project title unbreakable, and a `1fr` grid track carries an implicit
`min-width: auto`, so that title's min-content set the track to 387px inside a 358px
container — measured `scrollWidth` 404 at both 390 and 320. `/en` and `/th` were unaffected,
which is why fifteen rounds of sweeps missed it. Tracks are now `minmax(0, 1fr)`; verified
`scrollWidth === innerWidth` at 320 and 390.

**The heatmap legend round 15 rebuilt was scrolled out of view.** It sat inside
`.event-report__heatmap-shell`, which is `overflow-x: auto`, so it inherited the 458px grid
width instead of the 357px visible window — at 1280 all four swatches and the "More" label
rendered past the right edge, leaving only "Less" visible. Moved out of the scroller; verified
all four keys now land at x 825-878 inside a 912px edge. The scroller also had no `tabindex`
and no focusable descendant, so its hidden weeks were keyboard-unreachable; it now has
`tabindex="0"` and a described name.

**The heatmap cell border was out-reading the fill it framed.** 1px of `--atelier-outline` is
34.7% of a ~10.4px cell and is brighter than the first populated bucket, so the outline, not
the value, dominated every cell. Softened to `--atelier-line`; the legend swatches are large
enough to keep the stronger border, and the grid carries a text alternative for the
per-cell contrast the softer hairline gives up.

**Five forbidden colour ramps shipped on every page.** `blue`, `red`, `green`, `purple` and
`orange` were registered in `panda.config.ts` for 18,349 characters — 10.5% of the shipped
CSS — in a system that permits one signal colour, and `alert.ts` hardcoded four of them.
Nothing in the product renders Alert. Removed, error tokens retargeted onto `--atelier-danger`,
and the main stylesheet measured **154,589 -> 138,218 B**. Guarded on both vectors (re-registering
a ramp, and a recipe naming one), each proven red.

**`rankOf`, round 15's flagship correctness fix, had no tests and three wrong input classes.**
Extracted to `utils/heading-rank.ts` with ten behavioural cases. It mishandled `~~~` fences
(a `# fake` inside one shifted every real heading down a rank), CommonMark's up-to-three
leading spaces (which ranked the *shallower* level *deeper*), and setext headings. Reverting
to the absolute mapping now fails six cases; each of the three input fixes was proven red
individually.

Also fixed: the `:lang(th)` block overrode the root stack and so lost round 15's CJK
fallbacks, leaving 150 Japanese CMS nodes on `/th` at a browser default; `.image-muted`,
`.image-muted-soft` and `.group-hover-scale` were 415 bytes of CSS with zero references; and
the projects index had no group headings at all — "Active"/"Inactive" rendered as `<p>` at the
same 24px as the 40 project titles beneath them, so the visual grouping had no structural
counterpart. Those are now `h2` with item titles at `h3`/`xl`.

**A correction to my own round-15 contact fix.** Promoting three 10-12px eyebrow labels to
`h2` put one rank at 10, 10, 12 and 24px and promoted only one half of a two-cell grid. The
promotions are reverted; the panels, the social list and the form carry named regions instead,
which gives assistive technology the structure without inventing a heading rank that fights
the type scale.

## Round 17
Eight findings from the correctness auditor, all fixed. The heading-rank module I wrote in
round 16 was the main casualty.

**Six input classes injected a phantom heading level** — the exact defect the module exists to
prevent, in the module built to prevent it. Reproduced all six against the shipped code: an
unterminated fence, an HTML comment, a fence indented one to three spaces, a thematic break
after a list, a `---` after an ATX heading, and YAML frontmatter each added a level that
shifted every real heading down a rank. At `offset={1}` that emits an `h3` directly under an
`h2`; at `offset={2}` an `h4`. Root causes: the fence pattern required a closing fence and
anchored at column zero, and the setext branch accepted any `-{2,}` line after any non-blank
line — which is a thematic break in five of the six shapes. The scanner now strips frontmatter
and HTML comments, consumes indented and unterminated fences (an unterminated fence correctly
swallows the rest of the document, so those headings really are code), and rejects a setext
underline whose previous line is a heading, list item, blockquote or another break. Six cases
added to the suite; four of the fixes proven red individually.

**A guard claimed something it never checked.** The test named "no forbidden colour ramp is
registered **or shipped**" read only `panda.config.ts` and `theme/**`. Measured on the build:
55 tokens for the five hues still ship — but from Panda's base preset, not from the
registrations round 16 removed. Renamed to what it enforces, and extended to fail on any
token *consumer* (`var(--colors-blue-…)` or `{colors.red.…}`) anywhere under `src`, which is
the path by which a second hue actually reaches a page. The preset's own definitions are
recorded as an open item rather than pruned, because replacing the preset token group risks
the spacing and size tokens every recipe depends on. Six ramp files with zero importers
(21,097 B) were deleted.

**`Text as="h2"` changed the typeface on two locales.** Promoting the projects group labels
put them in scope of `html:lang(ja|th) h1..h6`, which pins the display serif, while `/en` has
no equivalent rule — so the same uppercase black-weight "ACTIVE" label rendered sans on `/en`
and serif on `/ja` and `/th`. Both now pin `var(--font-body)` like their sibling card titles.

**Round 16's `:lang(th)` CJK fix reached `body` and not the heading block in the same file.**
The `:lang(ja)` twin carries `'Hiragino Mincho ProN'`; the `:lang(th)` heading rule did not,
so Japanese CMS text landing in a heading on `/th` fell to a generic serif — the same defect
that round recorded as closed.

Also fixed: `.note-hero-image` was given `brightness(0.78)` on top of a pre-existing
`opacity: 0.78` calibrated against the old filter, leaving that surface permanently
double-dimmed with no hover to recover from — and unlike `.image-archival` it has no hover
rule at all; the notes reading-time line interpolated a raw `wordCount`, so it rendered `1234`
where the record claimed `1,234`, and both numbers now go through `Intl.NumberFormat`; the
four `alert` statuses had all collapsed onto amber, so an error would have looked like a
success, and error now carries the danger token; and the media suite's "never narrower than
the box" case asserted a property the two-tier resolver deliberately violates, passing only
because its three targets never reach tier 2 — split into an explicit tier-1 and tier-2 case.

The design auditor added twelve findings in the same round; eleven fixed, one folded into the
open list. It also caught and repaired its own vacuous probe mid-audit — its first contrast
sweep returned `[]` on every page because it bailed on any image ancestor, and `html` carries
a background-image — then re-ran proven red-capable.

**The last Park-UI mauve was reaching a rendered page, inside a soft blur.** Every step of the
shadow scale was `0px Npx Npx {colors.black.a10}, 0px 0px 1px inset {colors.gray.a7}` — and
`gray.a7` is the Radix mauve alpha ramp, measured `rgba(238, 233, 255, 0.25)` at hue 252 on
the live namecard on all three locales. Two design-system violations in one declaration: a
second hue, and an 8px ambient blur where the system specifies hard-edged elevation. The whole
scale is now offset-only in atelier surfaces, matching `.blocky-shadow`; measured after,
the card renders `rgb(14, 14, 14) 4px 4px 0px 0px`.

**`/ja/about` scrolled horizontally at 320px** — the same bare-`1fr` defect round 16 fixed on
`/ja/projects`, on a route the sweep did not reach. Rather than fix a third route later, every
grid template in `apps/astro/src` was converted to `minmax(0, …)` and a guard added. The guard
immediately found four more the regex sweep had missed — double-quoted attribute forms and a
`3fr 9fr` — which is the point of writing it. Verified `scrollWidth === innerWidth` at 320 on
`/ja/about`, `/ja/projects` and `/th/about`.

**Round 16 traded one heatmap contrast defect for another.** Softening the cell hairline to
`--atelier-line` was right for populated cells, where a bright 1px border on a ~10px cell
out-reads the bucket fill — but on the 135 empty cells that border is the *only* mark that a
day exists, and it fell to 1.77:1 while the legend still taught the same state at 5.18:1. No
dark fill can clear 3:1 against a near-black panel without reading as populated, so the fix
splits the two cases: empty cells take the strong outline and a lighter fill, populated cells
keep the soft hairline. Measured after: empty border 5.41:1 against the panel.

**Two formatters printed the same statistic at two precisions.** `percentFormatter`
(0 decimals) and `pct1` (1 decimal) were applied to identical values, so `/events` rendered
"7%" and "6.9%" — each directly above the same `306 / 4,425` fraction. `percentFormatter` is
deleted and both cells route through `pct1`. This was the code-level half of the label
collisions recorded as a content decision; the numeric disagreement needed no decision.

**Round 16's "named regions" shipped as `role="group"`,** which is a grouping role for related
controls and does not appear in a screen-reader landmark rotor — so the fix did not do what
the record said. Now `role="region"`, verified exposing three named landmarks on `/contact`.

Also fixed: the projects-index media target was pinned to a box width only reached at 1920, so
two of seven cards took `large` over `medium` for 219,481 B of avoidable payload — at the
common 1280 width `medium` already gives 1.75x density against the site's 1.5 target; the
`:lang(ja)` mono slot was the only one of six with no installed-system CJK face, and three
stacks disagreed on their Windows serif fallback; and the single graphite treatment was
actually three spellings across six call sites, two of them adjacent visuals on one hobby page
at different brightness, with `.note-hero-image` reaching its darkness by 78% opacity rather
than a brightness filter and so lifting its blacks — all six now route through
`--atelier-image-rest` / `--atelier-image-hover`.

## Logo (goal item, done between rounds 17 and 18)
The brand mark was a 96x96 raster with ~1px strokes rendered at 32x32 — every stroke landed
near a third of a pixel and the mark read as an amber smudge — and its square-and-compasses
emblem carried Masonic semantics the site does not intend. The same emblem was also the
favicon, the Apple touch icon, and the whole share card, so every browser tab and every social
link preview of the site carried it.

Redrawn as axis-aligned rectangles on a 32-unit grid: two piers, an amber lintel and an
exposed base rule — the initial and a structure, in the system's own vocabulary. The nav mark
is now inline SVG (so it inherits `currentColor`, stays crisp at any size and costs no
request), and the three rasters are regenerated from the identical geometry. Verified in the
browser at 32px and at 4x: the H, the lintel and the rule all read.

Brand assets measured **120,199 B -> 14,192 B, 88% smaller** (`og-default.png` alone
73,829 -> 13,254). The orphaned `brand-mark.png` is deleted, the middleware test that used it
as a sample path now points at a live asset, and the asset-existence floor was recalibrated
for the smaller referenced set.

## Round 18
Twenty-two findings across two auditors. Twenty fixed; two arrived already fixed. The guards
written in rounds 16 and 17 were the main casualty — three of the newest ones could be
defeated by shapes that already exist in this repo.

**"Every grid template was converted" was false, and the guard could not have known.** Its
glob was `**/*.{astro,tsx}`, so the two stylesheets were never opened — nine bare `1fr` tracks
were live in `index.css` and `events-report.css`, six of them inside mobile media queries,
i.e. exactly the single-column case that produced the overflow. Two further holes: the value
was read with `[^\n]*`, so a multi-line responsive object was invisible (and round 17's own
conversion had created two of those), and a lookbehind exempted `repeat(2,1fr)` written
without a space — a spelling already used in `profile-cards.tsx`. The guard now scans CSS,
balances braces to read the whole value, and has no lookbehind; all three bypasses proven red,
and it immediately found a ninth offender the sweep had missed.

**The heading scanner still disagreed with the renderer on six input classes**, one of them
introduced by round 17: it stripped YAML frontmatter while the renderer has no frontmatter
plugin, so `title: T` rendered as a visible setext `h2` the scanner could not see. Also raw
HTML blocks, single-`-` setext underlines, blockquoted headings, a four-backtick fence closed
by three, and an HTML comment spanning two code blocks (comments were stripped before fences).
Frontmatter is now stripped before rendering too, so the YAML stops appearing on the page at
all. The decisive change is a **differential test**: 24 markdown shapes run through
`mdast-util-from-markdown` + `micromark-extension-gfm` — the parser family react-markdown uses
— asserting the scanner's set matches the parser's. A hand-written suite only covers shapes
someone thought of, and this module had now been wrong six ways nobody thought of. Three
mutations proven red against it.

**`libs/` was outside every lint and format gate**, which is how a dead import
(`LARGEST_DERIVATIVE_WIDTH`, orphaned when round 15 replaced the ladder guard) and an
unformatted test file both survived a fully green `bun run check`. This is the round-2 finding
recurring on a new path. `check` now runs a prettier pass over `libs/`, and a guard asserts it
stays wired.

**The forbidden-ramp guard had three holes**, each a way a second hue reaches a page while it
stays green: it matched only the literal `blue: blue` spelling round 16 deleted, scanned only
`theme/**/*.ts` so a `colorPalette` prop anywhere else was invisible, and never matched
Panda's own style-prop form `color="red.500"` — which resolves, because the base preset's
ramps still ship. All three closed.

**Five round-17 fixes had no guard at all**, so any of them could revert in silence: the
offset-only shadow scale, the image-token routing, the empty/populated heatmap split, the
`percentFormatter` deletion, and `role="region"` on `/contact`. All five now guarded and each
proven red by reintroducing the exact regression. Writing them immediately found a real
defect: `hobbyThumbnail` carried a seventh image treatment with a `sepia(0.16)` tint.

**One self-inflicted scope breach, caught and reverted.** Wiring `libs/` into the format gate
ran prettier over `libs/outline/schema.ts` — a file generated by `codegen:api` from an
upstream OpenAPI spec — reformatting 16,222 lines. The diff jumped from ~2,000 to ~10,000
lines, which is how it was noticed. Reverted, and both `libs` scripts now exclude the
generated schema so the next `codegen:api` does not fight the formatter.

Also fixed: the LCP element on `/projects` was `loading="lazy"` with no `fetchpriority`
(measured 1836 ms on `/en`, 2648 ms on `/th`, against 520 ms for the homepage hero which does
this correctly); the project detail banner and the carousel were the last CMS surfaces outside
the image tokens, so one asset rendered three ways depending on route; the homepage hero and
`.image-archival` stacked `opacity: 0.92` on top of a token that already contains
`brightness(0.78)`, putting four photographic images at two darknesses in one viewport;
`decimalFormatter` had no `minimumFractionDigits`, so `69.03` rendered as "69%" beside "17.8%"
and "36.1%" in the same ranked column; Japanese printed `最多アーティスト` for two different
metrics that en and th already distinguish; project cards declared a synthetic `960x540` where
the resolver serves 750x422; and the `ja` body stack was the only one of six without a Windows
CJK fallback.

## Performance: the two deferred payload items, now done
The goal names fixing the performance issue explicitly, and these two were the largest
controllable costs left. They were sitting on the deferred list as "decisions"; the decision
had already been given.

**The Material Symbols icon font is gone: 320,688 B on every route, plus a render-blocking
stylesheet, to draw nineteen glyphs.** Replaced with a `Glyph` component mapping the same
nineteen semantic names onto `react-icons/fa`, which was already a dependency and already
rendering inside `.astro` files elsewhere in this repo. The static call sites render to inline
SVG in the SSR output, so they cost no request and no client JS. Migrated seven files;
verified in the browser that twelve inline SVGs render, zero ligature spans remain, and zero
Material requests are made. The old href test is replaced by a guard asserting the font is
absent everywhere rather than merely tuned.

**Noto Serif JP is no longer downloaded: 480,896 B across 18 subset requests to set seven
headings** (the family offers 248 subset files totalling 14.1 MB). The family stays in the
`--font-display` stack, so a visitor who has it locally still gets it, and everyone else falls
through to Hiragino Mincho ProN on macOS or Yu Mincho on Windows — both real CJK serifs — at
no network cost. Verified on `/ja`: the `h1` computes to the Mincho stack, renders as 明朝 in
the screenshot, and `notoserifjp` requests are zero. Noto Serif Thai is kept: it is 175,872 B
across 6 files and Thai system serif coverage is weaker. The locale-coverage guard now
distinguishes a family that is *requested* from one *accepted if locally installed*, and
requires the latter to be followed by a system face so it cannot become a silent dead end.

**One mistake, caught by the build.** The new module was first written to
`components/ui/icon.tsx`, overwriting the Park-UI `Icon` that `toast.tsx` imports. The build
failed on the missing export; the original was restored from HEAD and the new module renamed
to `components/ui/glyph.tsx`.

## Round 19
Twenty-six findings across two auditors. All fixed. The icon migration I had just called done
was the main casualty, and the way it failed is the lesson: I verified a count, not a result.

**Seven of eight `/events` cards drew a chain-link.** Nine icon names reached `Glyph` that
`ICONS` never mapped, and a silent `?? FaLink` fallback turned every one into the same
picture. My verification — "twelve inline SVGs render" — was a homepage count; `/en` has
exactly 12 SVGs and `/events` has 20. I never opened the page. Fixed by mapping the nine, and
structurally by typing `name` as `GlyphName` instead of `string` and deleting the fallback, so
an unmapped name is now a build error. The type immediately caught all three dynamic paths.

**Every glyph had silently changed from outlined to solid.** Font Awesome ships Solid for
these names; the site had been using the *outlined* Material cut, which is what a system built
on exposed structural borders and 1px rules calls for. The migration was justified on payload
alone and never measured the weight change. Now on `react-icons/md` `MdOutline*` — all 25
concepts exist there — and the guard pins the outline family. As a bonus `MdOutlineNorthEast`
is a real diagonal arrow, so the rotation hack is gone.

**The rotation hack was dead at its only call site anyway.** `{...props}` was spread after the
merged `style`, so any call site passing a `style` overwrote the transform — and the only call
site passes one. The homepage featured-project arrows rendered straight up (read: "back to
top") instead of outbound.

**`.atelier-icon-lg` / `-sm` were referenced by three call sites and defined nowhere**, so
those icons rendered 16px grey instead of 36px and 20px amber. Three `/events` icon-sizing
rules were deleted with the font and never replaced, collapsing every glyph there too. Both
now defined and guarded.

**The mobile drawer was absent on every route in dev.** Vite never pre-bundles `react-icons`,
so the client dynamic import of the island 404s and `astro-island` had already emptied its SSR
children — leaving mobile pages with no navigation at all. Fixed with `optimizeDeps`; verified
after clearing `node_modules/.vite` that the trigger is present and the drawer opens on all
three locales.

**The island was shipping 25 icons to draw 8.** `Glyph` indexes one object literal, so Rollup
cannot tree-shake per icon; the drawer now imports its own eight directly. Chunk measured
**13,489 -> 7,085 B raw, 4,692 -> 2,592 B gzip**.

Also fixed: the `LOCAL_ONLY` font escape hatch would have passed while the only Thai face was
dropped — `Hiragino Sans` and `Yu Gothic` matched its `/Hiragino|Yu /` pattern and carry zero
Thai glyphs; it now derives the requirement from a script table, so a Thai family cannot be
dropped at all, proven by reproducing the exact bypass. The forbidden-ramp guard only searched
the `semanticTokens` window, so a ramp registered in the `tokens` block — where ramps actually
go — was invisible. Three more grid-track spellings bypassed the round-18 guard. The scanner
disagreed with the real parser on six further shapes (headings in list items, fences inside
list items and blockquotes, `---` after a table row or link-reference definition, a comment
opening an HTML block); all six are now in the differential corpus. The project detail banner
had been switched to graphite rest in round 17, silently reversing round 15's decision that it
rests at true colour — restored via a third named token rather than an eighth ad-hoc spelling.
Plus: a duplicated bolt glyph in one eight-card grid, three different Japanese counters for one
unit in that same grid, one sub-line ending in a full stop where seven did not, and the inline
brand mark drawing its base rule in `currentColor` where all three rasters use the outline
token.

**Two scope slips, both caught and reverted.** Wiring `libs/` into the gate reformatted a
generated OpenAPI schema (16,222 lines) and cosmetically rewrote a GraphQL query file. Both
reverted; the globs now exclude generated output and `.gql` entirely. `eslint` cannot parse
`libs` — the flat config declares no TS project for those paths — so the lint half of that gap
is recorded below as open rather than faked.

## Round 20 (frozen tree)
Run differently: no new work between rounds 19 and 20, and the auditors were told to verify
the whole current state rather than review a fresh diff. Rounds 16-19 had found 28/20/22/26
findings, which looked like non-convergence but was an artifact — each round was auditing the
work done in that same round. With the tree frozen, the findings changed character entirely:
fewer regressions, more long-standing gaps that nineteen rounds had never looked at.

Sixteen findings from the correctness auditor. The four significant ones were all about the
gates themselves.

**Nothing type-checked, for the entire session.** `tsc` does not check `.astro` files;
`astro check` ran only inside `astro build`; and CI runs `check` and `test`, never a build.
The `compile` script existed but nothing invoked it — and it was itself broken, dying on a
`baseUrl` deprecation before checking a single file. Two type errors were live. Worse, this
falsified round 19's structural claim: typing `name` as `GlyphName` "so an unmapped icon name
is now a build error" was **false**, because no gate ran the type-checker. Fixed the
deprecation, fixed both errors, wired `tsc --noEmit && astro check` into `check` and into the
nx target, and disabled caching on it after nx served a stale pass over a live type error.
Then proved the gate: an unmapped icon name in a page now fails `bun run check`.

**Round 19's dev-drawer fix was inert.** `astro.config.mjs` had two `vite` keys; the object
literal silently kept the last, discarding `optimizeDeps` entirely — confirmed by importing
the config and printing the resolved keys. Merged.

**The outline-vs-solid guard pinned the npm package, not the icon family.** `react-icons/md`
ships the filled cut alongside the outlined one, so swapping `MdOutlineMenu` for `MdMenu` —
the exact regression round 19 called the migration's main casualty — passed with the whole
suite green. It now checks the identifiers, in `glyph.tsx` and in `Sidebar.tsx`.

**A live markdown bug erased whole heading ladders.** An unclosed fence inside a blockquote
was treated as running to EOF, so `> ```js` followed by prose collapsed every heading in the
document to one rank. Quoting a snippet without repeating the closing fence is ordinary CMS
markdown. The regex approach could not express "the blockquote ended", so fence, HTML-comment
and HTML-block handling were rewritten as a single line walk with explicit state. That found
two further precedence bugs: a closing fence inside a blockquote was terminating a top-level
fence, and a list marker was making `- ``` ` look like a closing fence rather than an opening
one.

**The hand-written corpus had now missed nine shapes across three rounds**, so it is no longer
the primary defence: a generated test runs every three-block permutation of 25 real markdown
block types — 15,625 documents — against `mdast-util-from-markdown` and asserts the scanner
agrees. It reports **zero mismatches**, and both fence bugs above were found by it rather than
by inspection. Proven red by reverting each fix.

The auditor also confirmed genuinely clean: `libs/utils/media.ts` and its suite (all six
guarded defect classes go red individually — the strongest suite in the repo), the font
guards, the grid guard, the ramp guard, the shadow guard, the cache-header corpus, the 22
older behavioural suites, scope, secrets, and the namecard body.

The design auditor added twenty-five findings in the same round, and this is the first round
that attacked the user's actual complaint — "lots of shit still looks pretty much shit" —
directly, by looking at every page in every locale rather than measuring tokens. It also
recorded a method correction worth keeping: **a full-page screenshot does not trigger
`loading="lazy"`**, so its first `/projects` capture showed four blank cards. Any earlier
round that judged a page from a naive full-page capture was looking at unloaded images.

**Amber, the single signal colour, was being spent on the opposite of signal in three
places.** Every tag chip on `/tags` and `/tags/[slug]` was amber — 70,035 px² marking ordinary
inventory, while the *same tag names* render grey on the project cards. Eleven of eighteen
project cards with no image fell back to a 96px amber monogram, so the loudest thing on the
primary listing route was amber at maximum scale marking the **absence** of content, with the
real affordance ("VIEW PROJECT →", 11px) disappearing beneath it. And the `/notes` hero card
carried a 219,520 px² soft ambient amber wash — almost exactly the area removed from
`/contact` in round 13 for the same reason. All three now grey; measured after, `/tags` amber
dropped 70,035 -> 7,664 px², and what remains on `/projects` is active nav, year labels and
the affordance itself.

**The footer broke alignment with every element above it at wide viewports** — measured 168px
outboard each side at 1920 and **488px at 2560**, because `.page-shell` is capped at
breakpoint-xl and centred while the footer was full-bleed. Now capped to match: measured 0px
outboard at 2560.

**The skip link printed on every page, over the content.** `position: fixed` elements repeat
on each printed page in Chrome; it appeared twice in the `/about` PDF, over the Education
entry and over the Experience heading. The file already had three `@media print` blocks
hiding nav, sidebar and footer — this was missed. Cards also now carry `break-inside: avoid`.

**One of the "outlined" icons was the solid cut.** `MdOutlineBarChart` is byte-identical to
`MdBarChart` — Material ships no outlined variant — so the "Busiest month" glyph rendered as
solid amber bars beside hairline neighbours, carrying roughly 4x the ink at the same size.
The round-19/20 guards check the identifier prefix, and the prefix is `MdOutline`, so they
passed. A new guard compares the actual path data of each mapped icon against its solid twin,
with two line-art glyphs exempted by name and reason. Proven red.

Also fixed: the darkroom card was labelled with the theme-toggle crescent moon; and
`prefers-reduced-motion` killed three animations *by class name*, so anything added without
one of those names was unprotected — 33 tag chips still transitioned a transform under
reduce. It now neutralises every transition and animation.

**The auditor also confirmed the performance lens is genuinely clean**, re-measuring every
headline claim independently: no Material Symbols request on any route or locale, no Noto
Serif JP on `/ja`, Sidebar island 7,080 B raw / 2,588 B gzip (and at desktop widths the island
never hydrates at all, so it costs nothing there), CLS 0 on three routes, cache headers
correct on all seven checked. Two things it suspected and cleared: the "dead 7,000px sidebar
rail" is a fixed-positioning artifact of full-page capture, not a layout bug.

### Round 20 follow-through
Closed the remaining round-20 findings rather than opening round 21 against unchanged code.

Layout: the project card's title/year row had no `min-width: 0` on the title and no
`flex-shrink: 0` on the year, so an unbreakable Japanese title pushed the year 9px past a
320px viewport and hard against the title — verified fixed, the year now ends at 283px. The
inactive grid used `alignItems="start"`, giving three different card heights per row (170,
191, 142) — now 191/191/191. `/events` carried three icon sizes, one of them 27.2px, off both
the 4px spacing scale and the glyph's own 24px authoring grid — now a single 24px. The
homepage Life-card glyphs were 36px amber against a 10px label, out-reading the text they
label in the signal colour — now 24px outline grey.

Copy: the Japanese 404 title hedged (「見つからないようです」) about a fact the server returned
a 404 for, and contradicted its own h1; English named the same thing "Page" in the tab and
"Path" in the headline. Japanese hobby chips used two counting constructions side by side
(`リンク12件` / `2ページ`) — now consistent.

Type and routing: 157 elements requested JetBrains Mono 500, which was not served, so mono
labels resolved down to 400 and sat a weight step lighter than the Manrope 500 beside them —
now requested. The Thai display stack listed two Japanese faces with no Thai coverage. Print
forced ink-on-paper colours, because Chrome defaults "Background graphics" off and would
otherwise drop the dark canvas while keeping the light text. `/xx/nope` redirected to the
nonsense `/en/xx/nope` before 404ing; a locale-shaped first segment that is not a locale now
404s where it stands, guarded and proven red.

Record corrections: the `/ja` font-CSS figure was 39% off (92,650 B gzip / 414 rules, not
152,608 / 662), and the `html` gradient stack is not "may paint" — measured, it never paints
on any route, because `body` is opaque, full-height and zero-margin everywhere.

## Round 21
Fourteen findings from the correctness auditor, thirteen fixed and one moved to the open list.

**The high-severity finding was a regression I introduced in the round-20 follow-through.** I
removed `'Hiragino Mincho ProN', 'Yu Mincho'` from the `:lang(th)` display and heading stacks
with the rationale "two Japanese faces with no Thai coverage". That rationale is wrong: CSS
font fallback is per-CHARACTER, so a Japanese face listed after `Noto Serif Thai` can never
affect Thai glyph selection — it only ever serves the Japanese runs that CMS data puts on
every locale. Removing it was a pure loss, and it made `/th` the only locale whose headings
had no CJK serif, falling to a generic. This is the third time this exact stack has been
broken and fixed. It is now guarded: every `--font-*` declaration in `index.css` must end in
a system face covering its script, proven red by removing it again. The existing parity guard
could not see it because it harvests only `'Noto …'` families.

**Three font weights were declared but never served.** Manrope maxes at 800 — `wght@900`
returns HTTP 400 from the origin — so the nav brand and two `/projects` group headings
silently resolved down, and `font-weight: 650`/`600` elsewhere snapped to 700. Manrope is now
requested as the variable range `400..800`, the three 900s are 800, and a guard asserts every
weight declared anywhere under `src` falls inside the requested range. Proven red.

**The inactive project card carried the unfixed twin of the row I had just fixed.** Same
missing `min-width: 0` / `flex-shrink: 0`, and because its wrapper has `overflow: hidden` the
year label was clipped out of the card rather than overflowing. Writing the guard then found a
**third** year-label row I had not looked at — already protected, but by different elements.

**The heading scanner had one disagreement class left**, found by a 207,646-document fuzz the
auditor ran with 48 block types: a 4-space-indented ATX heading inside a list item is list
content, not indented code, so the parser emits it and the scanner dropped it — collapsing two
ranks onto one. Fixing it required distinguishing three list states that all look alike: an
indented continuation after a blank line (still in the item), a lazy continuation with no
blank line (still in the item), and a new unindented paragraph after a blank line (item over).
The generator now carries the four block types it could not previously produce, and its
corpus-size assertion — which was tautological, since the loop guaranteed the count — is a
floor plus explicit membership.

Also fixed: every round-20 layout and print fix was unguarded, so all of them could revert in
silence (this is round 18's "five round-17 fixes had no guard" recurring one round later) —
the print block, the universal reduced-motion rule, the footer cap and the card rows now have
guards. The path-data icon guard opened only `glyph.tsx` while `Sidebar.tsx` maps nine icons
directly. The a11y dimension guard used the same unbounded `[\s\S]*?` that blinded the
overlay guard in round 12. The reduced-motion strip was non-greedy to the first nested brace.
The icon-class guard had no corpus floor. Placeholder parity across locales was unguarded —
a `{n}` present in `en` and missing from `ja` would silently drop the number with the suite
green (checked: zero drift today, now guarded and proven red). A middleware allowlist entry
and its test assertion referenced `/manifest.webmanifest`, which has never existed. And the
footer comment stated two things that were false of the code.

The design auditor added twenty findings in the same round — four high — and two of the four
were regressions I had introduced in the round-20 follow-through.

**My print fix made every heading invisible.** Forcing `body { background:#fff; color:#111 }`
only reaches text that *inherits* colour; every card and section paints its own dark surface
through a utility class that `body` cannot override. So the surfaces stayed `#131313` while
inherited text was forced to `#111`, and the rendered `/about` PDF lost its h1, all four h2s,
five job titles and both manifesto paragraphs to black-on-black. The block now inverts at the
surface — `.shell-content`, `.page-shell`, the card classes and the `bg_var(--atelier` utility
attribute — forces every text element to `#111`, and keeps structural rules visible as `#999`
ink. The guard was pinning `body { background: #fff }` as a standalone rule, so it passed
throughout; it now asserts the surfaces and the text separately, proven red.

**My tag-chip fix traded one off-system hue for another.** Taking the chips off amber landed
them on `colorPalette="gray"`, which `panda.config.ts` aliases onto the Radix **mauve** ramp —
so all 33 chips painted a cool purple-grey border (`#3c393f`) and a cool near-white
(`#eeeef0`) beside the warm `--atelier-line` and `--atelier-fg` on the same screen. They now
use the Atelier tokens directly rather than any Park-UI palette.

**`/events` was the largest amber violation on the site and no round had measured it** — 413
amber elements, roughly 540,000 px², about 70x the post-fix `/tags` figure. Amber was the
default fill for every data mark: attendance bars and the trend line over them, month volumes,
venue and artist distributions, the weekday pattern, the calendar grid, all eight peak glyphs.
Graphite is now the default and each ranked chart keeps exactly one amber mark, its leading
value. Measured after: 114 of 120 rank bars graphite with 6 amber leaders, 11 of 12 month bars
graphite with 1 leader, attendance fully graphite. The charts now point at the datum that
matters instead of glowing uniformly.

Also fixed: `/about` spent 136,351 px² of solid amber on a passive manifesto card — larger
than the `/notes` wash removed in round 20 and ~13x the homepage CTA — now a bordered graphite
surface matching its Education sibling; round 20's monogram fix had not been carried to
`/hobbies`, where 12 amber monograms remained; and `.atelier-icon-sm` kept the amber treatment
its `-lg` twin had lost.

**The auditor confirmed the performance lens clean with no new findings**, re-measuring every
headline: no Material Symbols and no Noto Serif JP across 24 route-locale combinations, font
payload within ~1% of the round-20 figures, CLS 0 on three routes, one render-blocking
stylesheet at 27,367 B gzip. It also confirmed the round-20 fixes hold — footer cap, card rows
at 320/390, inactive grid heights, 24px icons, skip link absent from both PDFs, 404 copy, and
Japanese counters.

### Round 21 follow-through
Closed the remaining round-21 design findings.

**Visual coherence.** The same structural role — a section heading — was set four incompatible
ways across two typefaces: Manrope 24px w900 uppercase on `/projects`, Newsreader 24px w800
uppercase with negative tracking on `/contact`, Newsreader 36px w400 on `/about` (except one
sibling at w700), Newsreader 38.4px w400 on `/events`. The `/contact` specimen was the reason
"NAMECARDS" read as a different typeface from "Experience"; it and the `/about` outlier now
match the site specimen. Nine decorative amber left-rules on non-interactive prose across six
routes are now `--atelier-line` — that pattern was a large part of why amber read as "a colour
we use" rather than "the thing to act on". Two of six identical `/tags` category labels were
tinted differently for a distinction the page never expresses, and one of three identical stat
cells on `/projects` and `/notes` used a different colour from its siblings.

**Alignment.** Round 20 capped the footer to the content column but left the nav full-bleed,
so at 2560 its links sat 488px outboard — the exact number that motivated the footer fix. The
nav's inner content is now centred on the same column, accounting for the 16rem sidebar
offset, with the bar and its rule still full-bleed. The first formula under-shot by 48px at
1440 because the centring term goes negative below breakpoint-xl; clamped, and verified
`brand.left - content.left === 0` at 1024, 1440, 1920 and 2560. The footer's own inner padding
was 32px outboard of the content inset and now matches it.

**The monogram mixed scripts.** `projectMonogram` took the first character of each of the
first two words, so 「ぼっちラブカシミュレーター (Bocchi Loveca Simulator)」rendered as **ぼB** —
one kana beside one Latin capital at 96px in a Latin display serif, which reads as broken
text. It now prefers the Latin run when a title has one and otherwise abbreviates within the
title's own script. An existing test had codified `'ぼB'` as correct; that expectation is
corrected in place with the reason, and script-specific cases have their own suite. The type
gate caught an unguarded indexed access in the rewrite, which is the gate earning its place.

### XML endpoints (round-20 findings that had never been fixed)
Round 20 reported these and rounds 20 and 21 both passed over them. Checked before starting
round 22 rather than auditing again on top of them.

**The sitemap interpolated CMS slugs into `<loc>` with no escaping at all.** A single slug
containing `&`, `<` or `>` produces a document that fails XML parsing — which takes the whole
sitemap down for every crawler, not just that one entry. The sibling RSS endpoint defined an
escaper inline for exactly this and applied it to item fields, but not to its own channel
`<title>` and `<description>`, so any future copy containing an ampersand ("Notes & Links")
would break the feed the same way. Both now use one shared `escapeXml` in `libs/utils/xml.ts`,
and the sitemap URL-encodes the path segment as well. Verified by fetching all three endpoints
and parsing the response: valid XML, HTTP 200.

**A truncated sitemap was served as 200.** On a GraphQL failure the route emitted only the
static routes with a success status; a crawler reads that as the authoritative complete set,
which can deindex every project page. `rss.xml.ts` already returned 503 in the equivalent
branch. Now matched, and guarded.

## Round 22

Two auditors on a frozen tree: correctness/verification-quality, and design judgement. Every
finding below was re-verified against the artifact before it was accepted — three of the
auditors' claims did not survive that check and are recorded as rejected.

### The guards for round 21's flagship fix were satisfied by an import statement
`libs/utils/xml.test.ts` asserted `expect(source).toContain('escapeXml')`. Line 2 of the file
under test is `import { escapeXml } from 'utils/xml';`, so every call site could be deleted
with the suite green — reverting the whole XML-escaping fix silently. Confirmed by mutation:
`${escapeXml(href)}` → `${href}` left 281 pass / 0 fail. Same for RSS item `title` and
`description`, and RSS had no 503 guard at all while being cited as the sitemap's reference.

Replaced with a shape check: every `${...}` interpolation inside a `<loc|title|description|
link|url>` tag in either endpoint must be wrapped in `escapeXml`/`esc` or be `SITE_URL`. The
degraded-status assertions now run against both endpoints. Two unescaped fields the old guard
never covered — the item `<link>` and the item `<description>` — were found by writing it and
are now escaped at the tag. All four regressions reproduced and confirmed red.

### heading-rank: the setext rule was reconstructed from the previous line's text
The differential generator joins its blocks with `\n\n`, so it could not produce a document
where a construct is interrupted without a blank line. Adding a single-`\n` join variant
(24,389 → 48,778 documents) immediately surfaced five real disagreements with
`mdast-util-from-markdown`, and fixing those surfaced four more classes behind them.

Root cause: `authoredHeadingLevels` decided "is a setext underline valid here?" by re-testing
the *previous line's text*. That cannot see state. A fence close, an ATX heading, an HTML
block and a blank line all leave a paragraph-looking line behind while closing the paragraph;
a lazy continuation keeps the paragraph at its container's depth, not the continuation line's.
Replaced with real open-paragraph state (`{ depth, inList }`) plus list-block, table,
indented-code and link-definition tracking. Nine shapes fixed, each verified against the real
parser:

- `---` after a closing fence was read as a setext underline (phantom `h2`).
- A blockquote, list item or table interrupting an open paragraph left the paragraph open, so
  a later run at column 0 underlined it.
- A thematic break did not close the container it broke, so nothing after it could open a
  paragraph.
- An indented line with no paragraph open became a paragraph instead of indented code —
  except directly after a link-reference definition, where the parser does make it one.
- A fence opened on a list-marker line, and an HTML block ending a list, were both invisible
  because those branches consumed the line before the list state was computed.
- An ATX heading, fence, comment or HTML block did not end an open table.

All 48,778 generated documents now agree with the parser. The auditor's own worked example
was inverted — it reported the shipped scanner as returning `[1,2]` when that is the mutant's
output and the shipped code was correct — but the coverage gap it inferred was real: the
`<!--` branch could be disabled entirely with the suite green.

### /events spent amber on everything, and marked the wrong datum
Confirmed by reading the CSS, and independently by both auditors:
- Eight `strong` rules set chart values in `--atelier-accent`, so 213 text nodes on the page
  were amber against 3 on the home page and 64 on `/projects`. Amber is the design system's
  only signal colour; used as the body ink for every number it signals nothing. All eight now
  `--atelier-fg`.
- The "one amber leader per chart" rule was `:first-of-type`, which is the leader only in a
  list sorted descending. `weekdayBreakdown` is in calendar order, so the amber bar marked
  **Monday (18)** while the same page states the most active day is **Saturday (185)** — the
  one mark the eye is trained to trust pointed at the wrong datum. `attendance-row:first-of-
  type` is the table's header row, which contains no bar, so that selector was dead. The
  `<details>` continuation lists each painted a false second leader at rank 11.
  The leader is now computed in the template (`data-leader`), from the maximum for the
  calendar-ordered charts and from index 0 for the ranked ones.

### Three round-21 claims in this record were wrong
Checked in source, not taken on the auditor's word:
- "Nine decorative amber left-rules greyed" — `events-report.css:12` and `:198` were
  *tokenised* to `var(--atelier-accent)`, not greyed, and `:198` renders seven times on
  `/events`. Now `--atelier-line`, with a guard banning an amber `border-left` outside a
  `:hover`/`:focus`/`[aria-current]` selector.
- "/hobbies amber monograms fixed" — all twelve were still `--atelier-accent-soft` at 76px.
  Now `--atelier-fg-muted`.

### Other confirmed defects, fixed
- `projectMonogram`: `LATIN` included `\p{N}`, so a trailing year beat the title's own script
  — `推し活記録 2024` → `2`, a lone digit at 96px in a display serif. Now `推し`.
- `tagSlug`: `toKebabCase` strips every non-ASCII character, so a truthy CJK or Thai title
  short-circuited past a usable stored slug and routed every such tag to `/tags/`. Verified by
  probe (`推し活` → `''`). Now falls back to the stored slug.
- `.github/workflows/deploy.yml`: neither path filter included `libs/**` or `package.json`.
  All site copy lives in `libs/i18n`, so a copy-only commit to `main` pushed green and never
  deployed. Both filters extended.

### Rejected after verification
- "HTML comments containing a blank line produce a phantom heading" — did not reproduce; the
  shipped scanner matched the parser. The coverage gap behind the claim was real and is fixed.
- The auditor's `attendance-row` leader "should be moved past the header row" — deleted
  instead. The favourite artist is already named in the panel head, and the goal is less
  amber, not more.

### Gates
`bun test` 291 pass / 0 fail across 36 files. `bun run check` exit 0 (50 lint warnings, the
pinned ceiling). Ten new guards, each proven red by reintroducing the exact regression it
covers.

### Design unification done in this round
- **One page-name scale.** Seven index routes each hand-rolled an h1: `5xl`/`7xl`/`8xl` plus
  a `clamp(..., 7.5rem)` on `/events`, measured at 48 / 72 / 96 / 115px for one role.
  All now `{ base: '5xl', md: '7xl' }` — verified in the browser at 72px Newsreader on every
  route. `/events` also lost `text-transform: uppercase`, which made it the only caps h1 on
  the site. The home hero keeps its smaller step: it is a sentence, not a page name.
- **One section-heading specimen.** `/projects` set ACTIVE/INACTIVE in Manrope extrabold caps
  at 24px against the Newsreader 36px used everywhere else; `/events` section heads were
  38.4px. Both now the `3xl → 4xl` specimen. The `/hobbies` degraded-state heading was a step
  below its `/notes` and `/projects` equivalents and now matches.
- **The passive nav state no longer takes the signal colour.** The active sidebar row was a
  solid 254x48 amber block — visibly the loudest element on every page in my own screenshot,
  louder than the content and than the page's own CTA, for a state the horizontal nav already
  marks with an amber underline. Now an amber left rule on a low surface.

Note: the design report's "five section-heading specimens" counted the `/notes` and
`/hobbies` **card titles** (30px/500) as section headings. Measured in the browser, those are
a different role and were left alone; only the two genuine mismatches were changed.

### Browser verification caught a bug the tests could not
`data-leader={false}` renders in Astro as the ATTRIBUTE `data-leader="false"`, which
`[data-leader]` matches — so the first version of the leader fix marked **all 75** chart
elements amber while every source-level guard passed. Found by measuring computed styles in
the running page, not by reading the diff. Fixed with `|| undefined`, and the guard now
requires that form. Re-verified in the browser: 8 amber bars of 160, and the weekday leader is
Saturday (185), matching the page's own "most active day".

Measured on `/events` after the round: amber text nodes **213 → 31**.

### Round 22 follow-through: the structural design items
- **One left edge.** Measured before: nav brand 32px outboard and footer 24px inboard of the
  content column, constant at 1024/1440/1920/2560 — three structural edges, three values, on
  every page. A `--content-inset: 2rem` token now feeds the nav padding, the footer padding
  and matches the content container. Re-measured: brand = content = footer at 288/288/480/800
  across the four widths.
- **Note detail stopped paying for empty rails.** A 540px article sat between a 220px contents
  rail holding ONE entry (the note's own title) and a 280px rail, on a 3405px page. The rail
  is now conditional on having at least three headings, and the single-entry fallback is
  gone. Verified both branches in the browser: a 0-heading note renders `820px 260px`, a
  19-heading note keeps `200px 580px 260px`.
- **/contact rebuilt.** The 3fr/9fr split left a 268px column ending ~800px above the page
  bottom. Social links are now a full-width `auto-fill minmax(240px, 1fr)` row — the block
  went 570px to 172px tall, four across. Park-UI's `Link` sets `align-items: center`, so
  every label had been centred on an otherwise strictly left-aligned site; now `flex-start`.
  The namecard stage is capped to 40rem instead of floating a 344px card in a 1120px box, and
  the form header is the Newsreader section specimen rather than the site's only filled grey
  bar, which read as a table header.

Two verification notes. The `alignItems` defect was one I first measured WRONG — I checked
`textAlign` on the link (`start`) and concluded the auditor was mistaken; the screenshot
showed centred labels, and the real cause was `align-items` on the flex parent. Reading the
adjacent property is not reading the property. Separately, a conditional
`gridTemplateColumns` prop tripped `@pandacss/no-dynamic-styling`, so the note grid moved
into `index.css` behind a `[data-contents]` attribute and both branches were re-verified in
the browser after the refactor.

## Round 23

### Guards that passed by construction (found by mutating every test)
- **`deploy.yml` red gate.** The guard asserted `verify` was in the deploy job's `needs` and
  stopped. Under `always()`, membership is only half the condition: deleting
  `!contains(needs.*.result, 'failure')` let a **failed test run deploy to production** with
  the suite green. Adding `|| true` to the `bun test` step did the same. Both now asserted.
- **The XML escaping guard I wrote in round 22** was defeated by moving one character:
  `<title>Notes: ${title}</title>` no longer matches an anchor tied to `<title>${`, and
  `<loc>${SITE_URL}/${locale}/projects/${slug}</loc>` passed because only the FIRST
  interpolation was examined. It now scans the whole tag body and requires every `${...}`
  inside it to be escaped; the static-route `<loc>` was made uniform so no exception list
  is needed.
- **The CDN degraded-path check** accepted any value containing `?`. Both arms of
  `cmsUnavailable ? 'public, max-age=3600' : 'public, ...'` start with `public`, so a
  truncated 503 sitemap could be cached at the edge for an hour. The guard now compares the
  arms: the degraded one must be `no-store`/`no-cache` or carry a strictly shorter max-age.
  Hardening it surfaced two pages using a 60s degraded TTL — deliberate, and now expressible.
- **The amber guards matched `var(--atelier-accent)` with a closing paren**, so
  `--atelier-accent-soft` — the exact token round 22 found still live on `/hobbies` — evaded
  them. Widened, and it immediately found `strong[data-kind='context']` still amber.
- **The note-rail guard pinned the mechanism but not the threshold**: `CONTENTS_MIN_ENTRIES`
  could be set to `0` and restore the one-entry rail on every note.

### A live defect the font guard was blind to
`atelier-fonts.test.ts` checked every declared weight against **Manrope's** range with no
idea which family the element used. `BrandMark.tsx` set `fontWeight="800"` on
`var(--font-code)` — JetBrains Mono, requested at `400;500;700` — so the nav brand rendered
synthetically emboldened. The guard is now family-aware, resolving each declaration's family
and checking it against that family's requested set (including the Noto fallback that
`--font-body` and `--font-code` take on ja/th). It immediately found two more: `font-weight:
650` twice in `events-report.css`, and two `800`s on `--font-body` that synthesise on `/ja`.

### heading-rank: two classes the 48,778-document differential could not reach
- **Only a CommonMark type-6 tag interrupts a paragraph.** Every HTML block in the generator
  was `<div>`, which is type 6, so the scanner's "any tag starts a block" rule always agreed.
  `Intro.\n<span>x</span>\n## Section A` returned `[]` against the parser's `[2]` — the
  document's only heading vanished. `<br>`, `<img>` and `<span>` are routine in Outline
  markdown. A type-7 block also requires the line to hold nothing but the tag.
- **Indentation was counted in spaces only.** No generator block contained a tab, so
  tab-indented list content read as top-level text and tab-indented code opened a paragraph a
  `---` could underline. Tabs are now expanded to the 4-column stop.

Fixing these exposed four more container-closing rules (a bare tag line closes the quote or
list item it follows; a blockquote at column 0 ends a list; a table does not; an unindented
ATX heading does). The corpus is now 34 blocks / ~78,000 documents.

**Six divergences remain and are asserted as an explicit set**, not silently tolerated: every
one needs a list PLUS a table, blockquote or bare tag PLUS a tab-indented ATX heading in the
same document. The test compares the mismatch set for equality, so a NEW divergence fails
while these stay visible.

### Design round 23
- **The round-22 left-edge fix aligned the container, not the title.** Measured: eight routes,
  **five different h1 left edges** (288 / 312 / 314 / 322 / 324). Routes carrying a decorative
  header rule were pushed right by the rule plus its own padding, and the home hero by a 24px
  grid inset. A shared `.page-header-rule` now hangs the rule in the gutter. Re-measured: all
  eight titles at 288.
- **The `/hobbies` plates were still amber**, and my own probe had missed it — the accent
  lives in `::before`/`::after`, which `getComputedStyle(element)` does not report. 53 amber
  gradient stops across twelve 144x108 tiles, the largest accent surface on the site. Now
  graphite; verified 0 amber pseudo-elements remain.
- The `/events` year chip kept the solid amber fill the sidebar was demoted from in round 22;
  the `/about` signature plate was the only full-accent border on that page; the third
  `/notes` stat cell was set a step smaller than its two siblings.
- **Faux oblique.** The italic suppression is keyed to `html:lang(ja)`/`:lang(th)`, so Thai
  CMS text inside an `lang="en"` document still got a synthetic oblique from a face with no
  italic. `font-synthesis-style: none` on `body` refuses it regardless of document lang.

### Verified correct, no change needed
Chart values graphite with seven `[data-leader]` marks and none inside `<details>`; weekday
leader Sat and month leader Mar, both true maxima; h1 72px Newsreader on all seven index
routes with `/events` no longer uppercase; `/projects` section headings on the Newsreader
specimen; sidebar active row an amber rule on a low surface; note rail present only above the
threshold; `/contact` links left-aligned and four across with the namecard stage capped.

### Gates
`bun test` 302 pass / 0 fail across 36 files. `bun run check` exit 0. Every guard added or
hardened this round was proven red by reintroducing the exact regression it covers.

## Round 24: the two items previously recorded as blocked

Both were recorded as "blocked on CMS data". That was half right and half an excuse: the
DATA cannot be changed from the repo, but in both cases the blank page was the template's
fault, not the data's.

- **Six hobby detail pages rendered an h1, one sentence, then ~370px of nothing.** The route
  had branches for `bodyParts.length === 0 && childDocuments.length > 0` and for the CMS
  being unreachable, but none for a document that is simply empty. Added a labelled panel
  with the parked-note copy and a route back. Verified in the browser on "Drawing".
- **The homepage hero rendered a stock clip-art illustration on a white ground.** In a
  grayscale-plus-amber system it was the brightest block on the page and beat the amber CTA
  beside it. No treatment fixes that — the graphite filter was already applied, and the
  existing fallback branch renders a "no photo" placeholder, which is not a hero. The hero
  is now a typographic specimen plate (wordmark label, large italic monogram, hairline) that
  needs no asset. **This is a reversible product decision, not a bug fix**: the CMS field and
  `resolveMedia` are untouched, and the removal is commented at the call site with what to
  render to restore it. Two i18n keys were orphaned by it and removed from all three locales
  — caught by the reachability guard, not by me.

While fixing the hobby empty state, the detail hero turned out to carry its own copy of the
amber plate treatment that round 23 greyed on the index: 28 more amber gradient stops plus an
amber headline rule and panel title. Greyed, and the guard now covers both files.

### Round 24 also closed the remaining round-23 design findings
- `/notes` cards were height-matched per row but their content was not, leaving 90-130px dead
  at the bottom of any card whose neighbour had a longer excerpt. The meta line now anchors to
  the bottom; measured 25px below the meta on every card in the row.
- The `/contact` sibling note cards were set in Manrope 14px and JetBrains Mono 10px — two
  identically framed cards, same role, 40% size difference. Unified; mono stays on the clock.
- The `/events` attendance table forced a 30rem row into a 324px card at 390, slicing its own
  values mid-glyph so it read as broken rather than scrollable. Below 520px it drops to
  artist / went / rate. Measured `scrollWidth === clientWidth`.
- The sidebar LANGUAGE card was the lightest surface in the rail — a passive locale readout
  outranking the current-page marker that round 22 deliberately demoted.

### Gates
`bun test` 308 pass / 0 fail. `bun run check` exit 0. Six new guards, each proven red by
reintroducing the exact regression.

## Round 25

The auditor confirmed all eight round-24 claims and then found twelve composition defects.
The top two were mine.

### My own regressions, from the round-24 fixes
- **The new hobby empty state printed the same sentence twice**, ~190px apart in the same
  face — once as the hero subtitle, once as the panel body. A panel added to make the state
  look authored instead made it look like a dump. The panel title already states the
  condition, so the echo is gone and the panel is label plus route back.
- **The `--content-inset` work aligned the homepage hero and nothing below it.** The hero sat
  on 288 while every section under it sat on 312 and the status labels on 344 — under a rule
  that begins at 288. Scrolling, the left margin stepped in and out. The landing page was the
  one route that read misaligned. Three `px` insets and one cell padding removed; all
  headings now measure 288.

### Composition
- **Hobby detail sat on its own gutter.** The container used a 16px inset against the site's
  32px, so navigating `/hobbies` → a hobby shifted the whole column left, and within the page
  the back-link (272), h1 (308) and panel (305) each started on a different line. All three
  now land on 288, with the headline rule hanging in the gutter like every other page header.
- **`/hobbies` rows used the left 42% of a full-width band** — twelve identical L-shaped voids
  under a divider running edge to edge. The row is three columns at md with the chips ending
  on the band's right edge; at base the tile sits inline with the title instead of owning a
  row.
- **`/about` was a card inside a card**: a 2px frame wrapping two 1px-framed blocks, one of
  which carried a third inset amber border — two concentric hairlines 12px apart with nothing
  between them. Outer frame dropped, inset border greyed.
- **The `/events` h1 was bottom-anchored** in a 19rem column, leaving a ~700x220px hole above
  the page title so the eye met the identity card before the page name.
- **The homepage closed on its weakest block**: two 60px strips holding a 16px icon and a 10px
  mono label, after three rich project cards. They now carry the project cards' anatomy —
  plate, display title, one meta line.
- Stat strips stacked into three near-empty bands at 390 (now three-up); the contact social
  grid resolved 4+2 leaving a 560px hole (now 3+3); the stacked hero CTAs were 183px and
  238px (now one right edge); the `/about` specimen glyph hung outside its own frame with the
  descender crossing the rule.

### Two guard bugs found by fixing the design
- A JSX comment block placed inside an element's attribute list is invalid. It broke the file
  silently enough that `bun test` still passed — only `bun run check` caught it, via a
  cascade of "declared but never read" warnings rather than a parse error at the real site.
- The bare-`fr` guard strips `minmax([^)]*)`, which stops at the first `)` of a nested
  `min(100%, 320px)` and then matches the `1fr` that `minmax` already bounds. It flagged a
  correct value. Fixed to balance one level of nesting, and re-verified that a genuine
  `repeat(3, 1fr)` still turns it red.

### Gates
`bun test` 315 pass / 0 fail. `bun run check` exit 0. Seven new guards, each proven red.

### Closed in round 26: the deferred markdown item
It was rated `low` and deferred. Looking at the page showed that was wrong on both counts:
the ENTIRE body of the chord notes — 51 lines on one and 32 on another — was set in Manrope
at a 52px pitch, so the bar columns did not line up and the note read as broken content
rather than a chart.

The fix is deliberately narrow rather than a general heuristic, because a guess inside the
markdown renderer reaches every note on the site. Two shapes only, neither reachable from
prose: a line GFM would have made a table row had it carried a delimiter row (`| E | F#m |`),
and a bracketed section label (`[Intro]`). Those render in the code face; consecutive ones
close up the stack gap so a run reads as one block. Everything else stays prose — verified
on a 112-paragraph prose note, which matched zero lines.

Measured on `/en/notes/33ab9877…`: pitch 52px → 28px, page height 3405px → 2125px, and
`Key: E` correctly stayed prose while the bars around it did not.

The mutation pass found dead code in my own fix: an extra `!text.includes('\n')` clause could
be deleted with the suite still green, because `.` does not match a newline and `$` is
end-of-string, so the regex already rejected a soft-wrapped paragraph. Removed rather than
left in as decoration.

## Round 26

### A bug no source-reading guard could have caught
`.note-feature-card { background: var(--atelier-surface-low), var(--atelier-surface-low); }`
is an invalid `background` shorthand — two bare colour layers — so the browser drops the whole
declaration. The featured "LATEST NOTE" card computed to `rgba(0,0,0,0)` while the ordinary
cards below it sat on `#131313`, making the page's most prominent card the LEAST elevated
element and inverting the one hierarchy `/notes` is built on. Twenty-five rounds of source
inspection missed it; only a computed-style read finds it. Fixed, and guarded by a rule that
bans the two-bare-colour shorthand in both stylesheets.

### The archive ribbon broke row alignment
Stacked above the media box, the ARCHIVE band added 33px, so a five-across project row on
`/tags/css` showed titles at three different tops (3442 / 3454 / 3474). The label is now
overlaid inside the media frame. Fixing that exposed a second cause: the category/date meta
row wraps to two lines for a longer category and one for a shorter one, moving the title
another 20px. It now reserves two lines. Measured after: one baseline per row.

### Amber discipline, again
Every inline markdown link was amber and bold, so a hobby body with twenty links read as
highlighter — and spent the system's only signal colour on prose, while the hero and project
descriptions set the same semantic as body ink with a rule. Body links now match those, with
amber kept for hover.

### Composition
- **`/tags` was the weakest page on the site** — seven identical near-empty full-width bands,
  one of them holding two chips, ~85% empty. The small categories now pair into two columns;
  the page fits one viewport instead of seven bands.
- **The namecard panel was my own regression.** Capping the stage to 40rem in round 24 left an
  empty right half under a heading rule that runs edge to edge. It is now full width with the
  card on the left and the six variants listed on the right, so the space has a job.
- **The 404 was the only centred composition on the site.** Left-aligned to the same 288px
  spine as every other page.

### Rejected after verification
The auditor reported that Thai display type falls out of the serif into the body sans, and
that the `/th` accent line carries a synthetic oblique. Neither reproduces: the `/th` h1
measures 655px against Noto Serif Thai's 655 and Noto Sans Thai's 623, and `font-style`
computes `normal` because an existing `html:lang(th) .font-style_italic` rule already
suppresses it. Recorded so a later round does not "fix" a non-problem.

### A mistake I repeated
A JSX comment block placed inside an element's attribute list is invalid. I did this in round
25, recorded it, and did it again here in `Markdown.tsx`. Comments explaining a change belong
above the element, never between its props.

### Gates
`bun test` 324 pass / 0 fail across 37 files. `bun run check` exit 0. Five new guards, each
proven red.

## Round 27: the four items round 26 left open

- **`/events` distribution bars.** Linear against the series max, the venue list rendered
  125px, 33, 28 and then three identical 15px stubs at the bar's minimum width, so distinct
  values looked equal and the panel read as a rendering failure. Now a square-root scale:
  monotonic, so the order and the leader still hold, but the tail spreads back into steps —
  measured 125 / 65 / 60 / 44 after.
- **`/projects/<slug>` measure.** Prose was capped at 70ch while the link cards above it ran
  the full container width, so the article looked left-shoved in a wider frame with a dead
  right third. The links now sit in a sticky right rail beside the prose, the same shape the
  note detail page already uses.
- **Duplicate navigation.** The top bar and the left rail both listed the same six
  destinations from 1024px up — two complete navigations on screen at all times. Measured at
  four widths before and after; the bar now carries the links only in the 900–1023px window
  where the rail is not yet shown. Every width has exactly one navigation and none was lost:
  800 → drawer button, 950 → bar, 1024 and 1440 → rail. **This is a reversible IA decision,
  not a defect fix** — deleting the `@media (min-width: 1024px)` block in `index.css` restores
  the previous behaviour.
- **Project thumbnails** stay open. Several crop mid-word and others shrink a full-page
  screenshot to illegible noise, but that is asset work in the CMS, not something the repo
  can fix.

### Gates
`bun test` 327 pass / 0 fail. `bun run check` exit 0. Three new guards, each proven red.

## Round 28

Both high findings were mine, and one of them was a fix I had already reported as done.

- **The featured note card.** Round 26 fixed an invalid `background` shorthand by setting it
  to `surface-low` — which is exactly what the ordinary cards already use. So the card went
  from invisible-because-transparent to invisible-because-identical, and I reported the
  hierarchy as restored. It is now `surface-high`: measured `#2a2a2a` against the ordinary
  cards' `#1c1b1b`.
- **The project article measure held only at 1440.** Putting the two-column split at `lg`
  (1024) meant 70ch of prose plus a 280px rail plus the 256px sidebar had to fit in 1024 —
  the prose track collapsed to about 33 characters per line, and between 900 and 1024 it ran
  to 88. The split moved to `xl`, and the single-column state now carries the measure itself.
  Re-measured at four widths: 76 / 69 / 61 / 76 characters.
- **The detail rails were sticky in name only.** `position: sticky` on a stretched grid child
  has nothing to travel, so the rail scrolled away and left two-thirds of a 2000px note
  empty. `align-items: start` on the layout fixes it; the hobby aside already had it.
- The wordmark plate read HAM on `/en` and Ham on `/ja` and `/th`: the locale exemption
  matches `[class*='ls_0.']`, so it caught a Latin-only element carrying a letter-spacing
  utility and killed its `text-transform` as well. Styled by name instead.
- A lone `\` — markdown's hard-break escape — was reaching the DOM as the last line of a
  chord note. Dropped.
- `/tags`: the programming-languages group (five chips) was still taking a full-width band,
  starting the pairing rhythm a row late.

**HMR lag caught me twice this round**: I measured a CSS change 2s after writing it, saw the
old value, and started diagnosing a cascade problem that did not exist. Wait for the reload
before trusting a computed style.

### Gates
`bun test` 332 pass / 0 fail. `bun run check` exit 0. Six new guards, each proven red.

## Round 29: the five items round 28 left open — all closed

- **`/events` rank bars now fill a visible track.** The bar was drawn at its own length with
  no unfilled remainder, so there was no scale on screen and a square-root-compressed bar
  read as a linear one. Each bar is now a gradient inside a full-width track.
- **One masthead component.** Four sibling index pages carried three different eyebrow
  treatments — a boxed amber chip on `/projects`, a bare rule on `/notes` and `/tags`, nothing
  at all on `/hobbies`. `PageMasthead.astro` now renders eyebrow chip, h1 and lede for all
  four; measured identical left edge (288), size (72px), rule and chip on every one.
- **`/hobbies` meta chips sit on fixed axes.** A free wrap broke at a different point on each
  of twelve rows and pushed an orphan chip onto a second line on five of them. Three fixed
  slots — status / updated / counts, with the two count chips merged — measured at exactly
  `960 / 1080 / 1264` on every row, all rows 157px tall.
- **`/tags/<slug>` no longer renders the project card five-up.** 200px minimum → 300px, so the
  card gets 366px instead of ~200 and titles stop wrapping to four lines.
- **The carousel drops its arrows and dots at three slides or fewer**, where the thumbnail
  strip already shows every slide, and the thumbnails grow from 100px to 160px.

Two Panda lessons, both caught by measuring rather than reading: a computed
`gridTemplateColumns` template literal is not extracted at build time, so the thumbnail strip
silently collapsed to a single 1038px column — static classes are required. And the earlier
`no-dynamic-styling` lint on the note grid was the same rule warning about the same thing.

Refactoring the mastheads broke two existing guards, correctly: both asserted against the
page files, and the h1 and the header rule had moved into the component. Repointed rather
than relaxed.

### Gates
`bun test` 337 pass / 0 fail. `bun run check` exit 0. Five new guards, each proven red.

## Round 30

### The fix that created the defect
Round 29 drew the `/events` rank bars inside a full-width track so the scale would be
visible. That was right, and it exposed something worse: with a track, the row reads as a
0-100% axis, and the fill was still the **square root** of a max-relative ratio while the
label beside it was an absolute percentage. So 3.3% drew 51% of the leader's bar. Adding the
track turned an unlabelled ornament into a chart that actively misinformed — the auditor
called it the only place on the site where the design lies.

The tail-collapse that sqrt was introduced to solve is real, but it is a legibility problem
and this was a correctness one. The fill is linear again; the tail keeps a 3px minimum stub
in CSS, and the printed value disambiguates it. Verified: 12.9% → 100%, 3.3% → 25.4%.

### Also fixed
- **Three detail rails, three resting lines**, one of them (`top: 6` = 24px) behind the 64px
  fixed header with its top border clipped, so the panel appeared to start mid-list. All
  three now rest at 96px; measured 96 on the hobby aside after the change.
- **The carousel thumbnail strip stacked at 390.** A fixed 160px track inside a 308px
  container resolves to one column, so three thumbnails stood 504px tall against a 195px
  slide — the control outweighing what it navigates. Below `md` it is a scrollable row;
  measured three thumbs on one row at 117px.
- **Thumbnail selection was quieter than hover**, and being a background colour it was
  invisible on any thumbnail whose image filled its box. Since the arrows and dots are hidden
  below four slides, these buttons are the only control. Selection now carries the accent
  border plus a 2px bar; hover demoted to `--atelier-outline`.
- The `/projects` inactive section switched from 3-up cards to a bare list after nine items
  with no heading — the format break read as a rendering fault. Labelled "Earlier work" with
  the same section rule, in all three locales.
- The widest `/hobbies` count chip overhung the container's right edge by 4px, past every
  horizontal rule on the page; the third axis now right-aligns. Measured 1408 on every row.
- `/contact`'s two bottom peer cards sat on different surfaces; the `/events` "Notable peaks"
  figures were centred inside an otherwise left-aligned page.

### Two guards updated rather than relaxed
The round-27 guard asserted the sqrt scale and the round-19 guard asserted hover carrying the
accent. Both were correct when written and both now pin the wrong contract; each was rewritten
to assert the stronger one, with the reasoning recorded.

### Gates
`bun test` 341 pass / 0 fail. `bun run check` exit 0. Four new guards plus two rewritten,
each proven red.

## Round 31: the four items round 30 left open — all closed

- **One eyebrow chip, everywhere.** The index mastheads were unified in round 29 but the
  detail family had fragmented into four treatments: a bordered chip on `/notes/<id>`, plain
  amber small-caps on `/projects/<slug>`, an indented amber rule on `/tags/<slug>`, a status
  word on `/hobbies/<id>` — and `/contact` had no eyebrow at all while its peer `/about` did.
  Extracted `Eyebrow.astro`, which `PageMasthead` now composes too, so there is exactly one
  definition. Measured: chip and h1 both start at 288 on `/notes/<id>`, `/tags/<slug>`,
  `/contact` and `/about`. `/projects/<slug>` sits at 329 because that page deliberately wraps
  its content in a bordered card — recorded as intended, not fixed.
- **`/tags` no longer orphans a group.** Five secondary groups meant the last sat alone in the
  left cell with the right one empty; an odd last child now spans the full width, so the
  rhythm is full / pair / pair / full. Measured rule edges: 1408, 828+1408, 828+1408, 1408.
- **Inactive project cards pin their chip row.** The card was `display: block`, so equal-height
  cards top-flowed their content and three chip rows in one row landed at three heights. Now a
  flex column with `mt="auto"` on the chips: all three end at exactly 6244.
- **The `/about` closing quote closes the page.** It sat inside the Experience column under
  that column's rule, reading as a footnote to the last job while the left rail ended ~230px
  above it. Now full width below the grid at 288, one step up in size.

### Gates
`bun test` 345 pass / 0 fail. `bun run check` exit 0. Four new guards, each proven red.

## Round 32

Both high findings were regressions I introduced in round 31, and one of them repeats a trap
I had already been caught by.

- **Every inactive project card composed centre-out.** To pin the chip row I changed the card
  from `display: block` to a flex column — and Park-UI's `Link` sets `align-items: center`, so
  title, year, description and chips all centred, nine cards directly beneath a left-aligned
  Active grid. **This is the second time that exact inheritance has bitten me**; the first was
  the `/contact` social cards in round 25, where I also measured `textAlign` instead of
  `align-items` and briefly concluded the auditor was wrong. `alignItems="stretch"`, and the
  guard now names the cause.
- **The hobby detail eyebrow was the one page the "every eyebrow" change missed.** I asserted
  four detail pages and `/contact` and never checked the fifth.
- The `/about` closing rule carried `maxW` on the Stack rather than the Text, so the border
  stopped 224px short of the cards above and the strip below — the page's closing gesture as
  a ragged half-rule.
- The `/hobbies` chip grid used `auto` tracks at base, so the wrapped count chip landed at
  x=39/39/77/80 on consecutive rows at 390 — the fixed axes only ever worked at md.
- `/tags/<slug>` had an unlabelled experience section next to a labelled projects one, with
  card prose running the full 1070px container — about 130 characters a line against ~70
  everywhere else.
- The hobby hero panel and the rail beneath it used different column ratios (7fr/5fr vs
  8fr/4fr), leaving a 75px step in a vertical seam. All three tracks are now `1fr 22rem`;
  measured both boxes starting at 1056.

### A guard failure worth recording
My first version of the inactive-card guard passed with the regression reintroduced, because
the window it searched contained my own comment explaining the fix — which names the prop.
That is the same "guard matches its own rationale" failure I built `stripComments` for several
rounds ago and then did not use here. The guard now strips comments first.

### Gates
`bun test` 350 pass / 0 fail. `bun run check` exit 0. Five new guards, each proven red after
the two that initially failed to fail were corrected.

## Round 33

All six round-32 claims verified independently. Six findings, one high — and it was mine.

### The invisible amber leader
`/events` month-of-year: the one bar the "one amber mark per chart" rule exists to paint was
the only invisible bar on the page. Round 29 changed `[data-leader] i` from a flat fill to a
gradient consuming `--size` as a colour-stop. Sparks encode their value as HEIGHT and emit
`--size` **unitless** for `calc(var(--size) / 100 * 3.5rem)`, so the gradient was invalid —
and an invalid `background` falls back to the initial value, not to the graphite rule
underneath. Measured: `background-color: rgba(0,0,0,0)`, `background-image: none`, against
`rgb(159,142,120)` on all eleven siblings. The horizontal-track gradient is now scoped away
from sparks, which take a flat accent fill.

### Also fixed
- **The masthead rule doubled the sidebar border**: two parallel strokes in the same colour
  6px apart, reading as mis-registration rather than a marginal accent. Suppressed at the
  widths where the sidebar draws that line already; the padding stays so the heading keeps
  its place on the spine. Verified the rule still shows at 900 and the h1 still lands on 288.
- **Thai underlines cut through the lower zone.** A Latin-tuned `text-underline-offset: 4px`
  lands on below-vowels (◌ุ) and descenders (ญ), and `skip-ink` cannot rescue a mark that sits
  on the line. `0.28em` for `:lang(th)` only — measured 6.72px on `/th`, 4px unchanged on
  `/en`.
- **The accent was marking absence.** The 2px amber bar lived in the ProjectCard's *no-image*
  branch, so in a mixed row the eye went to the one card with no artwork. Graphite at rest,
  amber on hover.
- **Two section-header idioms on the home page** — a full-width underline on Featured projects
  against the inline rule used by Life and by `/projects`, `/tags`, `/about` and `/events`.
  Unified on the inline rule.
- The `/tags/<slug>` chip row wrapped to three lines with row gap smaller than column gap.

### Rejected after verification
The auditor reported that `/th` loses the editorial serif and that its accent line synthesises
an italic. Neither reproduces, and this is the second round to raise it: the `/th` h1 measures
**443px against Noto Serif Thai's 443 and Noto Sans Thai's 416**, and `font-style` computes
`normal` with `font-synthesis-style: none`. What is true is that Noto Serif Thai is near-monoline,
so the Thai headline voice reads less editorial than Newsreader — recorded in round 23 as
subjective and not actionable without changing the Thai face.

### A guard I had to re-anchor
Adding a `@media (min-width: 1024px)` block ahead of the nav's own moved the window of a guard
that sliced from `indexOf('min-width: 1024px')`. It now matches `.shell-nav` blocks directly
and asserts exactly one carries `padding-left`. Offsets into a stylesheet are not anchors.

### Gates
`bun test` 355 pass / 0 fail. `bun run check` exit 0. Five new guards, each proven red.

### The auditor's read on convergence
Asked directly whether this reads as designed by someone with taste, the answer was yes — the
0px-radius, exposed-border, graphite-with-one-amber language holds, the serif/mono/sans roles
are unambiguous, and several pages show decisions a template would not make. What it called
the remaining defect class is that the section-header and grid vocabularies were each invented
more than once. It also named three things as **explicitly preference, not defect**, and
declined to change them: the 404 sitting outside the masthead system, the twelve monogram
plates on `/hobbies` being monotonous, and the empty right rail below the OPEN block on a
project page.

## Round 34: the defect class round 33 named

Round 33's closing judgement was that the site reads as designed by someone with taste "who
has not yet written down their own rules" — the section-header vocabulary had been invented
more than once, and that was the highest-leverage change left.

Earlier rounds had unified the section-header LOOK page by page, which is why it kept
drifting: every new section re-invented the form. Five variants were in the tree — an inline
rule, a full-width underline, a `Wrap` with a leading glyph, a bare heading, and a bordered
panel header. `SectionHeading.astro` now owns it (with an optional icon slot, so the `/about`
timeline header did not have to become a sixth variant), and every page composes it.

Converted: home x3, `/projects` x3, `/about` x2, `/contact`, `/tags/<slug>` x2. Card headers
inside bordered panels (`/about` Education, the contact form header) keep their own treatment
— that is a different role, and the guard is scoped to stretching section rules so it does not
force them to converge.

**Zero hand-rolled section rules remain in `src/pages`.**

### A guard that had to get stronger, not just pass
The round-33 guard counted literal `<Box h="1px" flex="1" …>` elements on the home page to
prove the idiom was unified. After the extraction those elements live in the component, so the
guard would have passed for the wrong reason. It now asserts `<SectionHeading>` usage. A guard
written against an implementation detail expires when the implementation improves; this is the
third time this session that a guard needed rewriting rather than relaxing.

### Self-verified before the audit
Measured every ruled section heading across five pages: `36px / 400 / Newsreader` on all of
them, all on the 288 spine (the one at 801 is inside `/about`'s right column, which is
correct). The deliberately excepted panel headers carry the SAME type spec and only omit the
stretching rule, because the panel's own border already draws that line — so the exception
reads as part of the system rather than a case that was missed.

### Gates
`bun test` 357 pass / 0 fail. `bun run check` exit 0. Two new guards, each proven red.

## Round 35: convergence check

Framed as a convergence check, not a defect hunt — the auditor was told a short "clean" is the
most valuable result it can return and that padding wastes the next round. It returned three
findings, labelled one item explicitly as preference and declined to raise it, and **discarded
two of its own suspicions as screenshot artifacts** after checking (`naturalWidth` on the
gallery thumbnails, lazy tiles that do paint). That is the behaviour the framing was for.

### The unification skipped an entire page
All seven `/events` section headers kept a **leading** 2px bar with no trailing rule — a sixth
form. Moving between top-level nav pages the header form flipped, and it flipped seven times
on that one page. The CSS comment even claimed it matched "the site's section-heading
specimen": it had matched the type STEP and kept a competing rule FORM, which is precisely how
this defect class survived so many rounds. All seven now use `SectionHeading`; the dead
`.event-report__section-head` rules are gone.

An eighth heading turned up that the auditor had folded into its count — "Notable peaks" is a
genuine panel header (bordered, with a subtitle and a stats group). It keeps that role and no
stretching rule, but it was on `clamp(…, 2.4rem)` against the system's 2.25rem. Now on the
shared step: every `h2` on `/events` measures 36px/400.

### A one-off surviving inside the unified component
The optional `icon` prop was used exactly once, on `/about`'s "Experience" — while
`/tags/<slug>` renders the *same* label bare. The inconsistency the extraction existed to
remove had reappeared inside the component. Prop removed entirely so it cannot drift back.

### Card CTA baselines
The external-link icon row is a sibling below the link stack; when a project has no links it
collapses, the stack absorbs the slack, and the bottom-pinned CTA drops ~32px below its
neighbours. Reserved its height. Measured across 8 multi-card rows: CTA offset spread 0 in
every row.

### A brittle guard of my own
My first version pinned the exact prop ORDER of a `<Wrap>`. Prettier reorders props, so it
failed immediately on formatting rather than on behaviour. Rewritten to assert the property
on the right element regardless of order.

### Gates
`bun test` 361 pass / 0 fail. `bun run check` exit 0. Four new guards, each proven red.

### The auditor's answers
Asked to state plainly whether any defect remained, whether the site reads as designed by
someone with taste, and what the weakest thing left is: **yes to taste** — it called
`/hobbies` "a genuinely designed artefact" and `/events` "a real dashboard, not a stats dump",
and noted JA and TH hold the same composition without the rules or spacing breaking. No
horizontal overflow at 390 on any of ten routes. The weakest thing was `/events` never joining
the section-header system, which this round closed. The strongest **preference** item — dead
right column on the detail templates — it explicitly refused to raise as a finding, calling it
a sparse editorial choice consistently applied.

## Round 36: terminal verification

All four round-35 fixes verified independently: seven `/events` headers on the shared
component with no leading bar anywhere; "Notable peaks" keeping its panel frame at the shared
36px step; the `icon` prop gone with `/about` and `/tags/<slug>` rendering the same label
identically; and 24 project-card CTAs on `/tags/react` grouping perfectly in threes.

### One defect left, and it was a repeat of a class already fixed
`/events` overview stat values lost their shared baseline whenever a label wrapped: with
`align-content: start` the value row starts wherever the label row ends, so the single
two-line label dropped its number 21px below its row. **This is the same failure the project
cards had when their icon row collapsed** — fixed there one round earlier and still live here.

The first fix was a two-line `min-height` reservation. It held at 1440 and **still broke by
22px at 1180**, where a label wraps to three lines — a reserved height is a guess about how
many lines the copy will take, and the copy is CMS-driven. Replaced with `subgrid`: the
articles share the parent grid's row tracks, so the label row is as tall as the tallest label
in that row and every value starts on the same line by construction. Measured spread 0 at
390 / 768 / 1024 / 1180 / 1280 / 1440, no overflow at any.

That distinction is the round's lesson: reserving space guesses at content, sharing a track
does not.

### Gates
`bun test` 362 pass / 0 fail. `bun run check` exit 0. One new guard, proven red.

### Terminal judgement returned
Asked to answer explicitly, the auditor confirmed the site reads as designed by someone with
taste — "and not marginally" — naming the heading system holding across seven routes, three
locales and both viewports, amber reserved for action and signal, the empty-state hobby tiles
drawn as a designed grid-and-glyph rather than a grey box, and the 404 given the same
editorial weight as a real page. It called the stat-row break "the last loose thread in an
otherwise coherent, opinionated system". That thread is now closed.

## Round 39: orchestrated multi-lens sweep (84 agents)

Seven independent lenses in parallel — desktop composition, mobile composition, cross-locale,
a11y, correctness/guard-quality, performance, content/copy — then EVERY finding through two
verifiers (one refuting by default, one judging whether fixing it improves the product), then
synthesis. 38 raw findings, **20 confirmed**, 18 dropped.

The synthesis named four DEFECT CLASSES rather than a list, which is what made the round
worth running:

**Class A — `cmsLocale` used as a content-availability map.** Pages computed
`locale === 'ja' ? 'ja' : 'en'` then fetched relation-bearing entities in it. Two symptoms,
one rule: `/ja/tags` rendered **4 chips all reading (0)** against 33 with real counts on en
and th (the ja tag entities carry no `projects`/`experiences` relations) — contradicted by
`/ja/tags/<slug>` on the same site; and `/en/about` alone showed the CMS `introduction`,
which is resume boilerplate ("proficient in modern web technologies… Committed to
delivering…") — the only boastful copy on the site, and the one the goal keeps naming. Fixed
as a rule: taxonomy and relations come from one locale, only authored strings are translated.

**Class C — `events-report.css` held four of the round's defects.** A hand-written stylesheet
with its own layout, breakpoints and scroll offsets that never inherited the conventions the
component layer got right: anchors landing behind the 64px nav (`scroll-margin-top: 1rem`),
the mobile rank row collapsing its value to a third line (120 rows × 87px instead of 47px),
charts letterboxing 70px of dead band above and below 117px of drawn chart at 390, and the
selected year chip wrapping to two lines. Measured after: rows 48px, charts 118/127px, chips a
uniform 44px, page height 17,424 → 15,358px.

**Class D — nothing asserted that a referenced i18n key resolves.** The parity script compares
locales against each other, so a key missing from ALL THREE passes. That is exactly how
`name-card.tierlist`, `name-card.tierlist-description` and `name-card.home` shipped as literal
raw key names on the namecard — a page handed to people in person. Keys added in all three
locales, and a new guard walks `NAMECARD_PAGE_LINKS` asserting every `labelKey`/`valueKey`
resolves. The existing reachability guard was also taught about that indirection rather than
exempting the keys.

### A proposed fix that was wrong, caught by measuring
Finding 8 said `/ja` ships 92 KB gz of render-blocking font CSS and proposed
`Noto+Sans+JP:wght@400..700`, claiming 31,334 B. Measured: that variable range is **122,356 B
— larger than the 91,937 B it replaces**, because the ~124 subsets dominate, not the weight
axis. Each weight costs ~30 KB. Weight 500 turned out to have exactly one consumer,
`.shell-nav-link`, which only renders in the 900-1023px window. Normalised it to 400 and
dropped the weight: **93,446 → 62,795 B gz, a third off.** Dropping the family entirely would
have saved all of it, but I could not verify CJK coverage on Windows/Linux from this machine
and tofu is worse than 92 KB — recorded rather than guessed.

### Also fixed
`.badge--size_sm` emitted **no CSS at all** (size passed as a variable, so panda only emitted
the default variant) — sm chips had zero padding at the inherited 14px, larger than the md
chip's 12px; the CONTENTS rail on note detail had `position: sticky` nested in a static Stack
of equal height, so it had zero travel and scrolled away while the DETAILS rail on the same
page stayed pinned; the mobile drawer — the ONLY navigation below 900px — carried
`data-active` but no `aria-current`; the carousel region had `aria-roledescription` with no
accessible name; and `/th/projects` carried a Latin full stop, the only one in ten Thai
catalogues.

### A test that asserted nothing, and my first fix for it also asserted nothing
`link-label.test.ts` checked "ends with the ellipsis, is short enough, contains a word" — all
three hold with the word-boundary logic deleted entirely. I pinned the exact strings; the
mutation pass then showed my new cases still could not see `lastSpace > max * 0.6` relaxed to
`> 0`, because in both of them the two gates agree. Added a case with an EARLY space, where
relaxing the gate returns the stub "ab…". Both mutations now red.

### Gates
`bun test` 375 pass / 0 fail across 38 files. `bun run check` exit 0, 49 warnings under the
50 ceiling. Eleven new guards, each proven red.

### The synthesis on taste
"Yes, and the evidence is in the DROPPED list, not the confirmed one. Seventeen findings died
because the thing they attacked turned out to be a deliberate, internally consistent decision
with a reason behind it… Sites without taste do not generate that many false positives."

## Round 40: terminal verification of the sweep, and four one-line slips

All ten sweep fixes verified independently: `/ja/tags` at 33 chips with real counts and JA
category labels; no resume boilerplate on any locale; real namecard copy in all three; 105
rank rows at exactly 48px with charts matching their viewBox ratio and no letterbox; the
"Notable peaks" anchor landing at top 88 under a 64px nav; both note rails pinned at rectTop
96 at scrollY 4000; sm chips visibly smaller than md with real padding; drawer `aria-current`
on page and locale; the carousel region named; correct per-locale terminal punctuation. Zero
horizontal overflow on 15 routes at both viewports, zero console errors.

Four defects remained, none of them regressions:

- **The note contents rail showed a permanently false active section.** `idx === 0` hardcoded
  the accent onto the first entry, so on a 27,940px note the rail claimed section 1 while the
  reader was eleven sections down — and nothing carried `aria-current`, so it was invisible to
  assistive tech either way. Replaced with a real scrollspy. **My first implementation used an
  `IntersectionObserver` with a thin rootMargin band and marked nothing at all**: a jump-scroll
  can land entirely outside a band narrow enough to select a single heading, and the callback
  then has no intersecting entry to choose. Rewritten position-based — the last heading whose
  top has passed under the nav, with the first entry standing in before that. Verified tracking
  at y=0 / 6000 / 14000 / 22000, marking four different sections.
- The namecard language switcher rendered English / 日本語 / ไทย identically — no weight, no
  `aria-current` — so standing on the page there was no way to tell which language you were on,
  while every other surface marks it.
- "Menu" was the only eyebrow in the rail without the uppercase treatment: an inline style
  beside an uppercase "LANGUAGE" sibling. Reusing `.shell-sidebar-env-label` also inherits the
  `lang(ja)`/`lang(th)` uppercase suppression, so it is correct on those locales too.
- **The skip link put the first 64px of `#main` under the fixed nav** — the exact state a skip
  link exists to avoid. `scroll-margin-top: 88px`, matching the section anchors.

### A guard of mine that was too broad
The sidebar guard asserted the header carried no `font-family:var(--font-code)` inline style —
but the FOOTER carries one legitimately, for the locale value, which is a different role.
Scoped to the header element rather than the file.

### Gates
`bun test` 379 pass / 0 fail across 38 files. `bun run check` exit 0, 49 warnings under the
50 ceiling. Four new guards, each proven red.

### Terminal judgement
"Does it read as designed by someone with taste? — Yes, clearly." The auditor named the
discipline as the evidence: hairline structural borders doing the work shadows would do in a
lazier system, amber reserved for signal rather than sprayed around, and the three faces
assigned by ROLE across three writing systems — including the non-obvious calls, like JA
dropping the italic the EN hero uses and carrying the accent in colour alone. It called
`/events` the tell: 459 records as a dense architectural dashboard that survives 390px intact,
and still recognisably the same site as the near-empty "Drawing" hobby page, "whose empty
state is designed rather than apologised for".

Five items were listed as **preference and explicitly not spent a round on**: the `/th` hero
breaking "VS Code" across lines, the carousel region named "Screenshot" singular for a 3-slide
group, 404 CTAs at 39px against the drawer's 44, tag chips being links on one page and spans
on another, and the empty-hobby panel's action duplicating the back-link above it.

## Round 41: final verification

All four round-40 fixes verified independently. The scrollspy tracks correctly — `aria-current`
lands on entry 0 / 2 / 6 / 10 / 18 at scrollY 0 / 3000 / 9000 / 20000 / 40000, each matching
the section on screen. The namecard switcher marks the right locale in all three. The skip
link puts `#main` at y=64, exactly below the nav.

### My own fix caused one of the two remaining defects
Reusing `.shell-sidebar-env-label` on the header eyebrow gave it the typography I wanted —
and also the `position: absolute` corner-notch rule, which then resolved against
`.shell-sidebar` rather than the env panel. The label hung at `left: -1px` with its own border
off-canvas while `.shell-sidebar-header` sat as an empty 49px band. **Sharing a class shares
everything in it, not the part you were after.** Split: typography on the class, notch
positioning scoped to `.shell-sidebar-env > &`. Both eyebrows now land on left 24 and stay
uppercase-suppressed together on ja/th.

### The last surface outside the eyebrow system
`/events` rendered its hero kicker as bare amber uppercase text at 0.6875rem while every other
hero — home, projects, notes, hobbies, tags, about, contact, tag detail, hobby detail — used
the bordered 10px `Eyebrow` chip. Replaced; the `.event-report__kicker` rule and its two
`lang(ja)`/`lang(th)` selector references are gone. That closes the eyebrow vocabulary the
same way rounds 34-35 closed the section-header one, and for the same reason: `events-report.css`
keeps being the file the last variant hides in.

Also removed a dead `textDecoration` declaration on the namecard switcher — the link recipe
wins, so it never applied. The weight change alone carries the state.

### Gates
`bun test` 381 pass / 0 fail across 38 files. `bun run check` exit 0, 49 warnings under the
50 ceiling. Two new guards, each proven red.

### Final judgement
"Does it read as designed by someone with taste? Yes." The auditor named the discipline: 0px
radius throughout, hairline `#524533` structure instead of shadows, amber reserved for action
and signal, the three faces kept strictly to their roles, and the 404, tags taxonomy and hobby
detail all staying inside the system without templating tells. It classified both remaining
items as "placement/consistency slips, not taste failures".

## Round 42: the same class, missed a third time

All three round-41 fixes verified good — sidebar eyebrows one treatment at left 24 on all
three locales, `/events` hero on the shared chip, namecard switcher legible on weight alone.

Then two defects, and they were **the class I had just reported closed**. Round 41 replaced the
one hand-rolled eyebrow it was shown (`/events`) and I wrote that the eyebrow vocabulary was
closed "the same way rounds 34-35 closed the section-header one". It was not: `/about` still
built its own chip in **grey** (`--atelier-fg-muted`) with narrower padding, and the homepage
built one in **pale tan** (`--atelier-accent-soft`). Three eyebrow colours across eight heroes,
for what is meant to be one component.

That is the third time this session I have fixed an instance and reported the class. The
pattern is now explicit enough to name: **converting the site to a component is not the same
as preventing the next divergence.** The guard added here asserts the CLASS — it scans every
page's hero region for the chip's signature (surface-highest fill + 1px line border + 10px
mono) and fails on any hand-rolled one, rather than checking the two files I happened to fix.
Measured after: all eight heroes at `rgb(255,176,0)`, 10px, 1.2px tracking.

Chips in body content — the homepage's principle row — are deliberately NOT forced to
converge; the guard is scoped to everything above each page's h1, the same way card titles
were left distinct from section headings.

### One I caught before the auditor
My round-41 self-check verified `textTransform` and `fontSize` matched and declared the
sidebar eyebrows fixed. It never checked geometry — which is where the defect was: "Menu" was
207px wide against "Language" at 66, because the notch instance gets shrink-to-fit from
`position: absolute` and the header instance is a block in flow. `width: fit-content` on the
shared class. **Measuring the property you changed is not measuring the element.**

### Guard bugs of my own, both caught by running them
The class guard first flagged three legitimate body-content chips (scoped it to the hero
region), then failed on `/projects` because it matched `<PageMasthead ` with a trailing space
and prettier had wrapped the multi-prop JSX onto the next line.

### Gates
`bun test` 384 pass / 0 fail across 38 files. `bun run check` exit 0, 49 warnings under the
50 ceiling. Three new guards, each proven red.

### Judgement
"Yes. This reads as designed by someone with taste." The auditor found no new structural
failure anywhere in the sweep and classified the two findings as "residue of copy-paste
predating the shared component, not failures of taste".

## HANDOFF WRITTEN — 2026-08-20 13:12 JST

Full continuation artifact: `docs/HANDOFF_2026-08-20.md` (29 KB). This record remains the
canonical live task record; the handoff does not replace it.

Live state at handoff: branch `main`, HEAD `fa3f507` (unchanged all session — nothing committed
or pushed), 146 changed paths, port 4321 free, no dev server running, `bun test` 385 pass /
0 fail, `bun run check` exit 0 at 49 warnings.

Three things a successor must not miss, all recorded in full in the handoff:
- **Disk is at 1.4 GiB free (100% used).** Do not run a production build. The drop is not from
  this session's artifacts (agent-browser 359 MB, of which 346 MB is the shared Chromium binary;
  scratchpad reduced to 19 MB by deleting my own screenshots). Cause not investigated — an
  unscoped filesystem scan is outside the standing scope rule.
- **Five stray PNGs sit in the repo root** — `--viewport`, `drawer.png`, `m-home-{en,ja,th}.png`
  — written by audit subagents into CWD instead of the scratchpad. `git add .` would commit
  them. Removal command is in the handoff cookbook.
- **No commit boundary separates this session's work from the pre-existing dirty tree.** HEAD
  predates the session by a month; the 103 modified files blend both. Review in chunks.

## Round 43

The eyebrow class fix verified: all eight EN heroes measure identically — `rgb(255,176,0)`,
10px JetBrains Mono, `letter-spacing 1.2px`, `padding 4px 12px`, 25px tall, left edge 288 on
every page. `/ja` and `/th` match on every property and correctly drop the transform and
tracking for CJK/Thai, which the auditor noted is right rather than a slip: letter-spaced Thai
breaks glyph clusters.

### One defect: a half-applied override
`/events` sat **8px left of its own page** at ≤520px, in all three locales — eyebrow, h1,
description and identity card at x=8 while every section below started at 16, right edges
agreeing, so it read as broken registration rather than a bleed. The base rule hangs the rail
in the gutter with `padding-left: 1.5rem` against `margin-left: calc(-1.5rem - 2px)`; the
mobile block overrode the padding to `1rem` and left the margin, so the pair stopped
cancelling: -26 + 16 + 2 = -8. This was arithmetic left behind by my own round-25 change,
which introduced the hanging rail and never revisited the route-specific mobile override.

Removed the override. Measured after: hero h1 and the next block both at 16 on en, ja and th.
Verified the result matches the shared `.page-header-rule`, which measures identically at 390
(rule at -10, h1 at 16) — so `/events` is now the same as every other route, and the 2px
border sits fully off-canvas rather than clipped, which is why it has never been visible.

### Gates
`bun test` 385 pass / 0 fail across 38 files. `bun run check` exit 0, 49 warnings under the
50 ceiling. One new guard, proven red.

### Judgement
"Yes." The auditor named the evidence: consistent 0px radius, a single amber signal reserved
for actions and metrics, mono for structural labels against Newsreader for editorial headings,
exposed hairline structure instead of shadow, and rigorous left-edge alignment across eight
routes and three scripts — with `/about`'s timeline, the label-on-border DETAILS panel and the
404 all showing "deliberate hand, not template defaults". It classified the single finding as
"a single-breakpoint arithmetic slip in a route-specific override, not a taste failure", and
listed three further items explicitly as preference.

## Performance re-check after 30+ rounds of design changes

The goal names performance, and it had not been re-measured since the payload work in rounds
17-19. Checked now, and it has not regressed:

- **3 hydration islands, all `client:visible`; zero `client:load` and zero `client:only`** —
  the state the asset-contracts guard pins, still held after every change since.
- **Font requests unchanged and still locale-scoped**: Latin gets JetBrains Mono, Manrope and
  Newsreader; `/ja` adds Noto Sans JP; `/th` adds Noto Sans Thai and Noto Serif Thai; the
  namecard requests M PLUS 1p on its own.
- **A dev-server payload reading is not a production one.** `/events` serves 531 KB in dev,
  which looks alarming until it is broken down: 206 KB is Panda's stylesheet, which dev
  injects inline and production serves as one cached linked file, and **68% of the remaining
  markup (218 KB across 1,441 elements) is Astro's `data-astro-source-file` / `-loc`
  attributes**, which exist only in dev. Real production markup for the heaviest page on the
  site is roughly 100 KB. Recorded because the raw number would otherwise read as a
  regression and prompt a fix for a problem that does not exist.

### Superseded: still open after round 30
- The detail-page family still has four eyebrow treatments (chip on `/notes/<id>`, plain
  small-caps on `/projects/<slug>`, indented rule on `/tags/<slug>`, status word on
  `/hobbies/<id>`), and `/contact` has no eyebrow while `/about` does. The index mastheads
  are unified; the detail ones are not.
- `/tags` has an odd number of secondary groups, so the last one is orphaned in the left
  column with the right cell empty.
- `/projects` inactive cards top-flow their tag chips, so three chips in one row land at three
  heights.
- `/about`'s closing quote sits inside the Experience column rather than closing the page.

### Superseded: still open after round 28
- The `/events` distribution bars use a sqrt scale with no track behind them and no axis
  label, so the compression is invisible and the chart reads as linear.
- The four index mastheads use three different eyebrow treatments; there is still no shared
  masthead component.
- `/hobbies` meta chips wrap at a different point on every row, so the right edge is ragged.
- `/tags/<slug>` renders the project card 5-up where `/projects` renders it 2-up, and adds a
  footer affordance the other does not have.
- The screenshot carousel shows three navigation affordances for two slides.

### Open from round 26, not actioned
- The two `/events` distribution charts scale every bar to the series max, so a 1.8% and a
  1.0% bar are indistinguishable and the panel reads as a rendering failure. Needs a scale
  decision (normalise excluding the leader, or drop the bars for long-tail lists).
- `/projects/<slug>` caps prose at 70ch while the link cards and gallery around it run full
  container width, leaving a dead right third. The note detail page solves this with a rail.
- Project thumbnails are not art-directed: several crop mid-word, others shrink a full-page
  screenshot to illegible noise. This is asset work in the CMS, not a code fix.
- The six nav items appear twice on every 1440 screen (top bar and left rail). Removing one is
  a real UX decision, not a defect fix, so it needs the user's call.

### Deliberately not done, with reasons
- **The homepage hero illustration.** It is CMS content (`introductionImage`), not a repo
  asset, so the illustration cannot be swapped or removed from code without deleting a
  CMS-driven feature. Needs either a replacement asset or a decision to drop the slot.
- **Six hobby detail pages with no body.** Same class: the emptiness is in the CMS data.

### Open from the design report, not yet actioned
The design auditor's judgement is that the token layer is clean and the remaining damage is
compositional — the site was built page-by-page with no shared `PageHeader`, `SectionHeading`,
`ProjectCard` or `StatCell`, so eight routes solved the same four problems differently (h1 at
48/72/96/115px; five section-heading specimens; four project-card treatments; two verbs for
the same link). It also named, with measurements: the homepage hero using a free clip-art
illustration; `/contact` at 1440 carrying a 270x570px void and centre-aligned social links on
an otherwise left-aligned site; note detail at 62% empty rails with a one-entry TOC; `/tags/
[slug]` prose set at 119-131 characters per line; six of twelve hobby detail pages rendering
as empty; nav/content/footer sitting on three different left edges (-32 / +24px, constant at
1024/1440/1920/2560); and three remaining print defects. It reported `/about`, `/notes`, the
`/projects` header and archive list, 404 and `/contact` at 390 as genuinely good.

## Known remaining, in priority order
1. `polka.png` (2424x3126, 4,400,119 B) and `honoshi.png` (1366x2048, 2,218,401 B) are
   together 84% of `dist/`. **The earlier framing of this as pure waste was wrong.** They are
   illustrations on the namecard, which is a print artifact: `NamecardLayout.astro` sizes
   everything in `mm` and carries an `@media print` block. The ~113 CSS px figure is a screen
   measurement; at 300-600 DPI the pixel budget is legitimate. Downsampling would degrade the
   physical print, so this is a product decision, not a safe optimisation. The pages are not
   linked from the site nav and do not load on any product route.
2. QR PNGs total 323,634 B. Same reasoning: a QR code on a printed card needs the module
   edges to survive the printer, so these are not simply oversized either.
3. **Note-page images: 84,838,593 B across 64 images, and CLS measured 0.24.** Both halves
   need one decision. The `/api/outline-asset` proxy streams Outline originals with no
   resize (largest five: 4.3 / 3.9 / 3.8 / 3.6 / 3.5 MB) into boxes of at most 840 px; fixing
   it means adding `sharp` (listed in `pnpm.onlyBuiltDependencies` but **not installed** —
   `import('sharp')` fails) and rebuilding the container, which is an infra call. The layout
   shift has the same root cause: CMS markdown carries no intrinsic dimensions, so nothing
   can reserve the true box. Both variants were measured with an identical full-scroll
   method on the same note: a fixed 16:9 wrapper gives **CLS 0.004** but letterboxes every
   non-16:9 image (a 140x200 portrait rendered into 538x302), while intrinsic sizing renders
   correctly at **CLS 0.24**. The shipped state is intrinsic sizing plus a 220 px floor and
   `content-visibility: auto` (0.306 -> 0.24), i.e. correct rendering with a poor shift
   score. A proxy that resizes and reports dimensions closes both at once.
4. **Five `/events` label collisions, all content decisions rather than defects.**
   (a) `events-report-days-spent` and `events-report-days-active` are byte-identical labels
   over 303/4,425 shown as 7% and 6.8%; (b) `events-report-weekend-rate` and
   `-weekend-events` are both `weekendEvents / totalEvents` at 77% and 77.3%; (c) ja renders
   `最多曜日` for both `events-report-most-active-day` and `-favorite-day`, which display the
   same weekday twice on one page; (d) th uses `วันที่มากสุด` for both `-favorite-day` and
   `-max-day`, two unrelated quantities; (e) `events-report-busiest-month` is rendered twice
   with the same label and value in all three locales. Each is one page cell too many rather
   than a wrong string, so removing or repointing them changes what the page shows.
   Additionally th prints `ใช้งานได้จริง` for both the homepage manifesto emphasis and the
   `bench-principle-useful` chip inside the same card, and `ส่งข้อความ` for both the contact
   form heading and its submit button — those two are pure wording and could be fixed
   without a content decision, but they need a native reading to pick the right register.
5. **The homepage hero portrait has no source large enough.** `introductionImage` is
   297x400 at the origin with no derivative above it, while the rendered box reaches 686px
   at the 768 breakpoint — a 2.31x upscale, 3.46x under-resolved at the site's own 1.5
   density target. The code now asks for 700 and emits the real intrinsic size, so nothing
   further is fixable without uploading a >=1400px source to the CMS.
6. ~~**Noto Serif JP costs 480,896 B across 18 requests to render 7 headings**~~ **Fixed** — no longer downloaded; falls through to the system Mincho. Original text: on the JA
   homepage, inside a 2,354,897 B total font payload on `/ja` (Noto Sans JP is a further
   1,212,496 B across 50 subset requests). All three requested weights are genuinely used,
   so nothing is simply droppable; the options are self-hosting a subset or letting JA
   headings fall to the already-loaded Noto Sans JP, both of which change the typography.
7. **Featured-project descriptions render in English on `/ja` and `/th`.** All three cards on
   the landing page show the English CMS description verbatim beside fully localised chrome.
   Either the CMS needs localised description fields or the description should be suppressed
   on non-`en` locales — a content decision, not a code defect.
8. **`/en` and `/contact` show two complete copies of the navigation** above 1024px: the
   horizontal `nav[aria-label="Primary"]` and the 256px `nav[aria-label="Menu"]` sidebar list
   the same six destinations, plus two language switchers. The sidebar's items end around
   y=400 leaving ~380px of empty rail. Both landmarks are correctly labelled, so this is
   design economy rather than an a11y defect, and collapsing it is a layout decision.
9. **The namecard quotation applies `font-style: italic` to a Japanese string** on `/contact`.
   Neither Manrope nor Hiragino Sans has an italic face, so the glyphs are synthetically
   skewed — the condition the `html:lang(ja|th)` italic suppression exists to prevent,
   bypassed because the page is `lang="en"`. Inside the frozen namecard surface.
10. **Panda's base preset ships 784 colour token definitions, 55 of them for the five hues
    the design system forbids.** Only `amber`, `gray`, `atelier` and `mauve` are consumed
    (186 / 108 / 19 / 4 `var()` references). Removing them means replacing the preset's
    colour token group wholesale, which also carries the spacing and size tokens every
    recipe depends on, so it needs a deliberate migration rather than a sweep. The
    regression vector itself is closed: nothing registers or references a forbidden ramp,
    and a guard enforces both.
11. **The test files are outside the type gate.** `apps/astro/tsconfig.json` `include` is
    `["src", …]`, so `tsc --noEmit` never opens the 33 test files the round-20 gate was
    written to protect. Adding `tests` produces 138 errors, all of them `Cannot find module
    'bun:test'` / `Cannot find name 'Bun'` — neither `@types/bun` nor `bun-types` is
    installed. The fix is a dev dependency plus `"types": ["bun"]`, i.e. a lockfile change,
    not a sweep. Separately `exclude` still covers `src/components/ui/styled/**`, which
    holds `heading.tsx`, modified in this diff and therefore unchecked.
12. **`libs/` is formatted but not linted.** `check:libs` runs prettier only; `eslint libs`
    fails with parsing errors because the flat config declares no TypeScript project for
    those paths. A dead import in `libs/utils/` would still pass a green gate. Closing it
    means adding `libs` as an nx project or giving it its own eslint config — a build-config
    change rather than a sweep.
13. **Thai `name-card.subtitle` says something unrelated to en/ja and makes an employment
    claim they do not.** en and ja are a fan-interest joke reusing "full-time/part-time";
    th replaced it with a factual statement about working full-time in frontend. Rendered
    only on the print namecard route, which is not linked from nav. Needs a native reading
    to restore the construction rather than a mechanical translation.
14. ~~**The brand mark is illegible at the only size it renders.**~~ **Fixed** — see the
    Logo section above. Redrawn as rectangle geometry, shipped as inline SVG plus three
    regenerated rasters, 88% smaller in total.
15. **The namecard leaks `#1F1F5A` navy onto `/contact`** via `--main-color`, painting a
   19x208 spine and an `hr`. It is the only second hue reaching a product page. The namecard
   is a frozen print path, so changing it needs a decision.
16. **`/ja` blocks on 92,650 B gzip of font CSS** (360,507 B raw, 414 `@font-face` rules,
    54 Google Fonts requests) against `/en` at 1,033 B gzip / 42 rules and `/th` at 1,350 B.
    Re-measured in round 20 against the exact URL the page requests; the previously recorded
    152,608 B / 662 rules was 39% off. Still the largest render-blocking cost on JA, and
    still a decision: cutting it means dropping Noto Sans JP weights or self-hosting a
    subset, both of which change the typography.
17. ~~Material Symbols is 320,688 B for ~10 decorative icons.~~ **Fixed** — font removed entirely; see the Performance section above. `react-icons` is already a
   dependency and would make a missing icon a build error instead of literal text.
21. ~~`deploy.yml` does not depend on `ci.yml`~~ **Fixed in round 12.** `deploy.yml` now has
   its own `verify` job running `bun run check` and `bun test`; both container builds and the
   `Deploy` job list it in `needs`. `Deploy` runs under `always()`, so `verify` had to be in
   its `needs` too - otherwise a failed gate reads as "skipped" rather than "failure" and the
   deploy proceeds. Guarded by a test proven red by removing `verify` from `Deploy.needs`.
18. ~~The `html` gradient stack may paint under an opaque `.shell-content`~~ **Resolved in
    round 20 — it never paints.** `body` computes an opaque `rgb(19,19,19)` with zero margin
    and full document height on every route including the shortest, so all four layers are
    100% occluded everywhere while still costing a full-viewport four-layer composite.
    Deleting them is safe; left in place only because it is cosmetic-free dead weight.
19. Availability wording and the darkroom claim need product decisions.
20. `apps/client` is a separate, undeployed consumer of `libs/i18n`. Its `home.hero-text`
   asserts a job title in Japanese where English asserts an interest. Out of the Astro
   product surface, so left for a decision.
