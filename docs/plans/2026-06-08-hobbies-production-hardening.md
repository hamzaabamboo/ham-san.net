# Hobbies Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the hobbies experience as a production-ready external-Markdown + custom-component system with verified visual quality across English, Japanese, and Thai.

**Architecture:** Keep Outline as the content source and Astro as the route boundary. Keep custom hobby embeds as self-contained React islands selected from Markdown directives, inferred source content, and frontmatter. Improve quality through small verified passes: audit first, patch one bounded issue, browser-check the real route, run gates, commit, push, and record evidence before moving on.

**Tech Stack:** Astro, React islands, Panda CSS, styled-system, Outline API, Bun tests, `agent-browser`

---

## Operating Rules

- No implementation starts without updating this plan or a task-local note with what route, file, and failure is being addressed.
- Each task produces one focused commit unless it is an audit-only task.
- Each UI task must use the live API via `cd apps/astro && bun run dev -- --host 0.0.0.0` and `agent-browser`.
- Each visual task verifies one route at a time before moving to the next route.
- Scratch screenshots and browser artifacts stay in `/tmp`, not the repo.
- Stop the dev server and close browser sessions before final handoff.
- Do not mark the full goal complete until every requirement in the checklist below has direct evidence.

## Current Evidence Baseline

- Branch is `main`; latest pushed commit before this plan is `c63f02d fix: localize hobby source headings`.
- Existing focused tests cover embed directive parsing, source cleanup, localized labels, card ordering, and source-heading localization.
- Existing live checks have covered:
  - `/en/hobbies`
  - `/ja/hobbies`
  - `/th/hobbies`
  - English and Thai Camera detail
  - nested Wishlist detail route
- Known remaining risk areas:
  - Mobile layout and text wrapping for Thai/Japanese metadata and pills.
  - Every embed type needs a live route check, not only Camera.
  - Inactive/parked detail pages need visual checks, not only overview copy checks.
  - The full requirement checklist has not been audited end-to-end after the latest commits.

## Requirement Checklist

- [ ] External Markdown remains the main content source from Outline.
- [ ] Markdown slot directives can embed custom components in the main content stream.
- [ ] Supported components are present and visually checked: photo gallery, Twitter/feed links, Rubik algorithm viewer, typing stats, piano chord player, darts board, link library, field notes fallback.
- [ ] Frontmatter supports embed selection, embed labels, status, updated date, banner/image, and source descriptions.
- [ ] Active/inactive pages are derived from real source metadata or actual source presence; no fake activity metrics.
- [ ] Nested hobby pages work for parent and child routes, with correct parent navigation.
- [ ] Category descriptions are consumed without cringe/generic copy leaking into public UI.
- [ ] Overview and detail pages have deliberate fallback visuals when media is missing.
- [ ] No `Ham-san` remains in public UI; brand is `Ham`.
- [ ] Thai uses `งานอดิเรก`, not `ความสนใจ`, for hobbies.
- [ ] Thai/Japanese typography and metadata do not look broken or forced-uppercase.
- [ ] Mobile and desktop layouts have no horizontal overflow, clipped labels, or overlapping content.
- [ ] Live API testing is documented for every page class.
- [ ] Full gates pass: focused tests, lint, format, build.

---

## Task 1: Route Inventory And Evidence Matrix

**Files:**
- Create: `/tmp/ham-hobbies-route-audit.json`
- Modify: `docs/plans/2026-06-08-hobbies-production-hardening.md`

- [x] **Step 1: Start the dev server**

Run:
```bash
cd apps/astro && bun run dev -- --host 0.0.0.0
```

Expected:
```text
Local    http://localhost:4321/
```

- [x] **Step 2: Capture live route inventory from the English overview**

Run:
```bash
agent-browser --session ham-hobbies-audit open 'http://localhost:4321/en/hobbies'
agent-browser --session ham-hobbies-audit eval '(() => JSON.stringify([...document.querySelectorAll("a[href*=\"/hobbies/\"]")].map((a) => ({ text: a.innerText.replace(/\s+/g, " ").trim(), href: a.href }))))()' > /tmp/ham-hobbies-route-audit.json
```

Expected:
```text
/tmp/ham-hobbies-route-audit.json contains all root hobby links rendered from live Outline data.
```

- [x] **Step 3: Document route classes**

Append a short `Route Audit` section to this plan with:
```markdown
## Route Audit

- Overview routes: `/en/hobbies`, `/ja/hobbies`, `/th/hobbies`
- Detail routes sampled:
  - Camera: `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284`
  - Typing: `/en/hobbies/f28e6219-f8ea-4801-bbca-7fd3f0686da5`
  - Music: `/en/hobbies/db3c4b0f-40a1-4132-9732-442ce3b27236`
  - Darts: `/en/hobbies/ce3055fa-eff2-487f-bd6f-3860dde96bae`
  - Rubiks: `/en/hobbies/abdbab31-794f-43c6-bef0-852e1748494e`
  - Pen Spinning inactive: `/en/hobbies/6ea8f3bd-83ca-40dd-b477-a62291a7f75b`
  - Kendama inactive: `/en/hobbies/e99d3767-6bc4-4af1-b0be-995633815e85`
  - Geoguessr: `/en/hobbies/bd49f03c-f554-46af-bcda-33983b677d7e`
- Nested routes sampled:
  - Wishlist: `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284/doc/56788e14-b36e-4efd-aaa6-d723a95e3e37`
  - Research: `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284/doc/afadc37a-c249-44ef-a692-da70b529ce6e`
```

- [x] **Step 4: Stop server and commit audit-only update**

Run:
```bash
lsof -nP -i tcp:4321 | awk '/LISTEN/ {print $2}' | xargs kill
git add docs/plans/2026-06-08-hobbies-production-hardening.md
git commit -m "docs: add hobbies route audit plan"
git push
```

Expected:
```text
Branch is pushed and worktree is clean.
```

## Route Audit

Evidence captured on 2026-06-08 from live `http://localhost:4321/en/hobbies` using `agent-browser --session ham-hobbies-audit`.

- Evidence file: `/tmp/ham-hobbies-route-audit.json`
- Browser errors: none from `agent-browser --session ham-hobbies-audit errors`
- Overview routes to keep in the QA set: `/en/hobbies`, `/ja/hobbies`, `/th/hobbies`
- Root detail routes from live Outline data:
  - Camera: `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284`
  - Typing: `/en/hobbies/f28e6219-f8ea-4801-bbca-7fd3f0686da5`
  - Music: `/en/hobbies/db3c4b0f-40a1-4132-9732-442ce3b27236`
  - Darts: `/en/hobbies/ce3055fa-eff2-487f-bd6f-3860dde96bae`
  - Rubiks: `/en/hobbies/abdbab31-794f-43c6-bef0-852e1748494e`
  - Pen Spinning inactive: `/en/hobbies/6ea8f3bd-83ca-40dd-b477-a62291a7f75b`
  - Kendama inactive: `/en/hobbies/e99d3767-6bc4-4af1-b0be-995633815e85`
  - Geoguessr: `/en/hobbies/bd49f03c-f554-46af-bcda-33983b677d7e`
- Nested routes retained from earlier live Camera child-page checks:
  - Wishlist: `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284/doc/56788e14-b36e-4efd-aaa6-d723a95e3e37`
  - Research: `/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284/doc/afadc37a-c249-44ef-a692-da70b529ce6e`

---

## Task 2: Mobile Thai And Japanese Layout Pass

**Files:**
- Modify: `apps/astro/src/pages/[locale]/hobbies/index.astro`
- Modify: `apps/astro/src/components/hobbies/hobbyStyles.tsx`
- Modify: `apps/astro/src/index.css`
- Test: live browser screenshots in `/tmp`

- [ ] **Step 1: Verify the current mobile failure before editing**

Run:
```bash
cd apps/astro && bun run dev -- --host 0.0.0.0
agent-browser --session ham-hobbies-mobile set viewport 390 844
agent-browser --session ham-hobbies-mobile open 'http://localhost:4321/th/hobbies'
agent-browser --session ham-hobbies-mobile eval '(() => JSON.stringify({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, badThai: /ความสนใจ/.test(document.body.innerText), cards: [...document.querySelectorAll("a[href*=\"/hobbies/\"]")].slice(0, 8).map((a) => a.innerText.replace(/\s+/g, " ").trim()) }))()'
agent-browser --session ham-hobbies-mobile screenshot /tmp/ham-hobbies-th-mobile-before.png
```

Expected:
```text
The JSON records whether horizontal overflow exists and whether Thai terminology is correct.
```

- [ ] **Step 2: Patch only confirmed layout issues**

Allowed changes:
```ts
const hobbyCardPill = css({
  whiteSpace: { base: 'normal', md: 'nowrap' },
  overflowWrap: 'anywhere'
});
```

Allowed CSS-only Thai override:
```css
html:lang(th) .hobby-meta,
html:lang(th) .hobby-meta * {
  font-family: var(--font-body) !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
}
```

Do not change data fetching or content parsing in this task.

- [ ] **Step 3: Verify mobile after editing**

Run:
```bash
agent-browser --session ham-hobbies-mobile open 'http://localhost:4321/th/hobbies'
agent-browser --session ham-hobbies-mobile eval '(() => JSON.stringify({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, badThai: /ความสนใจ/.test(document.body.innerText), genericEnglish: /Profiles and links|Stats and gear|Parked for now|Pictures, gear/.test(document.body.innerText) }))()'
agent-browser --session ham-hobbies-mobile screenshot /tmp/ham-hobbies-th-mobile-after.png
agent-browser --session ham-hobbies-mobile open 'http://localhost:4321/ja/hobbies'
agent-browser --session ham-hobbies-mobile eval '(() => JSON.stringify({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, genericEnglish: /Profiles and links|Stats and gear|Parked for now|Pictures, gear/.test(document.body.innerText) }))()'
agent-browser --session ham-hobbies-mobile screenshot /tmp/ham-hobbies-ja-mobile-after.png
```

Expected:
```text
scrollWidth <= clientWidth for both routes, no bad Thai term, no generic English fallback copy.
```

- [ ] **Step 4: Run gates and commit**

Run:
```bash
bun test apps/astro/tests/hobby-labels.test.ts apps/astro/tests/hobby-content.test.ts apps/astro/tests/hobby-cards.test.ts
cd apps/astro && bun run lint
cd apps/astro && bun run format
cd apps/astro && bun run build
git add apps/astro/src/pages/[locale]/hobbies/index.astro apps/astro/src/components/hobbies/hobbyStyles.tsx apps/astro/src/index.css
git commit -m "fix: polish localized hobby mobile layout"
git push
```

Expected:
```text
All gates pass and the commit is pushed.
```

---

## Task 3: Every Embed Type Live QA

**Files:**
- Modify only if a route reveals a concrete bug:
  - `apps/astro/src/components/hobbies/embeds/PhotoGalleryEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/TwitterFeedEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/RubikAlgorithmsEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/TypingStatsEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/PianoChordsEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/DartsBoardEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/LinkLibraryEmbed.tsx`
  - `apps/astro/src/components/hobbies/embeds/FieldNotesEmbed.tsx`
- Test: `apps/astro/tests/hobby-content.test.ts`
- Test: `apps/astro/tests/hobby-labels.test.ts`

- [ ] **Step 1: Open each root detail route in English**

Run Camera:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-camera-desktop.png'
```

Run Typing:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/f28e6219-f8ea-4801-bbca-7fd3f0686da5'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-typing-desktop.png'
```

Run Music:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/db3c4b0f-40a1-4132-9732-442ce3b27236'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-music-desktop.png'
```

Run Darts:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/ce3055fa-eff2-487f-bd6f-3860dde96bae'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-darts-desktop.png'
```

Run Rubiks:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/abdbab31-794f-43c6-bef0-852e1748494e'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-rubiks-desktop.png'
```

Run Pen Spinning:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/6ea8f3bd-83ca-40dd-b477-a62291a7f75b'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-pen-spinning-desktop.png'
```

Run Kendama:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/e99d3767-6bc4-4af1-b0be-995633815e85'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-kendama-desktop.png'
```

Run Geoguessr:
```bash
agent-browser --session ham-hobbies-embed-qa open 'http://localhost:4321/en/hobbies/bd49f03c-f554-46af-bcda-33983b677d7e'
agent-browser --session ham-hobbies-embed-qa eval '(() => JSON.stringify({ title: document.title, h1: document.querySelector("h1")?.innerText, text: document.body.innerText.slice(0, 1600), errors: [] }))()'
agent-browser --session ham-hobbies-embed-qa errors
agent-browser --session ham-hobbies-embed-qa screenshot '/tmp/ham-hobby-geoguessr-desktop.png'
```

Expected for each route:
```text
No browser errors, no fake metrics, no generic fallback copy, and the correct embed module appears.
```

- [ ] **Step 2: Patch concrete embed bugs only**

Patch only if one of these concrete failures appears in Step 1:

- A module renders no useful content even though `body`, `links`, `images`, or `nestedPages` contain source data.
- A module renders invented sample data instead of source data.
- A module shows fallback copy when source data is present.
- A module overflows or overlaps at the checked viewport.
- A module label is untranslated in Japanese or Thai when it comes from UI chrome.

Do not invent sample data. Empty states must be designed but honest.

- [ ] **Step 3: Add or extend focused tests**

If parsing or labels change, add tests to:
```text
apps/astro/tests/hobby-content.test.ts
apps/astro/tests/hobby-labels.test.ts
```

Run:
```bash
bun test apps/astro/tests/hobby-content.test.ts apps/astro/tests/hobby-labels.test.ts apps/astro/tests/hobby-cards.test.ts
```

Expected:
```text
All focused tests pass.
```

- [ ] **Step 4: Full gates and commit**

Run:
```bash
cd apps/astro && bun run lint
cd apps/astro && bun run format
cd apps/astro && bun run build
git add apps/astro/src/components/hobbies apps/astro/src/utils apps/astro/tests
git commit -m "fix: harden hobby embed modules"
git push
```

Expected:
```text
All gates pass and the commit is pushed.
```

---

## Task 4: Nested And Inactive Page QA

**Files:**
- Modify only if a concrete bug is found:
  - `apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro`
  - `apps/astro/src/components/hobbies/embeds/FieldNotesEmbed.tsx`
  - `apps/astro/src/utils/hobby-content.ts`
  - `apps/astro/src/utils/hobby-labels.ts`
- Tests:
  - `apps/astro/tests/hobby-content.test.ts`
  - `apps/astro/tests/hobby-labels.test.ts`

- [ ] **Step 1: Verify nested routes**

Run:
```bash
agent-browser --session ham-hobbies-nested-qa open 'http://localhost:4321/en/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284/doc/56788e14-b36e-4efd-aaa6-d723a95e3e37'
agent-browser --session ham-hobbies-nested-qa eval '(() => JSON.stringify({ backText: [...document.querySelectorAll("a")].find((a) => a.innerText.includes("Back") || a.innerText.includes("กลับ"))?.innerText, body: document.body.innerText.slice(0, 1600), slashArtifact: [...document.querySelectorAll("li")].some((li) => /^\\\\+$/.test(li.innerText.trim())) }))()'
agent-browser --session ham-hobbies-nested-qa errors
```

Expected:
```text
Back link returns to the parent hobby, no slash-only list item appears, no browser errors.
```

- [ ] **Step 2: Verify inactive pages**

Run:
```bash
agent-browser --session ham-hobbies-inactive-qa open 'http://localhost:4321/en/hobbies/6ea8f3bd-83ca-40dd-b477-a62291a7f75b'
agent-browser --session ham-hobbies-inactive-qa eval '(() => JSON.stringify({ title: document.title, body: document.body.innerText.slice(0, 1600), hasFakeMetrics: /\\b0\\s+(LINKS|PAGES)\\b/i.test(document.body.innerText) }))()'
agent-browser --session ham-hobbies-inactive-qa screenshot /tmp/ham-hobby-pen-spinning-inactive.png
```

Expected:
```text
Inactive state is honest and designed; no fake 0-metric pills are shown.
```

- [ ] **Step 3: Patch, test, gate, commit if failures exist**

Run after any patch:
```bash
bun test apps/astro/tests/hobby-content.test.ts apps/astro/tests/hobby-labels.test.ts apps/astro/tests/hobby-cards.test.ts
cd apps/astro && bun run lint
cd apps/astro && bun run format
cd apps/astro && bun run build
git add apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro apps/astro/src/components/hobbies apps/astro/src/utils apps/astro/tests
git commit -m "fix: harden nested and inactive hobby pages"
git push
```

Expected:
```text
Only commit if there are actual code changes; otherwise document audit evidence in this plan.
```

---

## Task 5: Final Completion Audit

**Files:**
- Modify: `docs/plans/2026-06-08-hobbies-production-hardening.md`

- [ ] **Step 1: Re-run route class checks**

Run:
```bash
agent-browser --session ham-hobbies-final open 'http://localhost:4321/en/hobbies'
agent-browser --session ham-hobbies-final open 'http://localhost:4321/ja/hobbies'
agent-browser --session ham-hobbies-final open 'http://localhost:4321/th/hobbies'
```

Expected:
```text
Each overview route loads from the live API.
```

- [ ] **Step 2: Run final gates**

Run:
```bash
bun test apps/astro/tests/hobby-content.test.ts apps/astro/tests/hobby-labels.test.ts apps/astro/tests/hobby-cards.test.ts
cd apps/astro && bun run lint
cd apps/astro && bun run format
cd apps/astro && bun run build
```

Expected:
```text
All commands exit 0.
```

- [ ] **Step 3: Fill the requirement checklist**

Update every checkbox in `Requirement Checklist` with evidence paths or command outputs.

- [ ] **Step 4: Commit audit documentation**

Run:
```bash
git add docs/plans/2026-06-08-hobbies-production-hardening.md
git commit -m "docs: record hobbies production audit"
git push
```

Expected:
```text
Audit is pushed and the worktree is clean.
```

- [ ] **Step 5: Only then consider the active goal complete**

Required evidence:
```text
Every requirement checkbox is checked with current evidence, all gates pass, browser sessions closed, dev server stopped, and git status is clean.
```
