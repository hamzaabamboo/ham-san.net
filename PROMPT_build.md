0a. Study `specs/*`.
0b. Study @IMPLEMENTATION_PLAN.md and correct any dishonest completion claims before choosing work.
0c. Study the relevant Stitch exports in `stitch_exports/4878703984446574546`.
0d. Study the real Astro route, shared components, styles, data dependencies, and current product behavior before editing.
0e. Verify against the live dev app at `http://127.0.0.1:4321`, not against memory, screenshots in chat, or previous loop notes.

This development loop is an always-open full-cycle loop. Every iteration must do all of this in one go:

1. Re-plan briefly at the start of the loop.
2. Dogfood one broken, weak, or missing route on the live dev app.
3. Implement one meaningful increment for that route or shared system.
4. Re-dogfood the live result in the same loop.
5. Write an honest loop note before exiting.

Re-planning rules inside the build loop:

- Correct stale, dishonest, or contradictory status in @IMPLEMENTATION_PLAN.md before choosing work.
- Reopen any route or component whose visible result is still weak, misleading, placeholder-like, or missing.
- Identify the single highest-priority problem for this iteration.
- Identify any relevant skills available in the environment or repo that should be used for this task. Use them when they materially help. If a relevant skill exists and you do not use it, explain why in the loop note.
- Treat user-reported regressions as real until disproven on the live dev app.

Source-of-truth rules:

- Treat the repository code and the repo's real behavior as the product source of truth.
- Treat Stitch as a design reference for composition, hierarchy, spacing, tone, and visual language only.
- Do not break or replace real repo-native behavior just to imitate a mockup literally.
- Do not replace functioning systems like namecards, navigation, content flows, route structure, or data behavior with fake visual replicas unless the real behavior is preserved.

Implementation rules:

- Choose exactly one route or one shared interaction system per loop.
- Before editing, identify:
  - what is visibly wrong right now
  - which exact files control that behavior
  - what must be preserved so the product does not regress
- If a route is missing data, design and implement an intentional fallback page state instead of calling the route complete.
- Fix the user-facing problem, not just tokens, labels, or internal cleanup.
- Do not hide layout, hierarchy, hover, spacing, art-direction, or copy failures behind "content gap" language.
- When the route includes real product artifacts, render the real artifact or a faithful preview of it. Do not replace it with fake summary slabs.

Verification rules:

- Use `dogfood`-style route testing on every reopened or missing page.
- Use `agent-browser` for route verification.
- Validate one route or one shared interaction system at a time.
- Do not run `bun run build`, `astro build`, or any build step in this loop.
- Do not treat a clean build as evidence of correctness.
- Do not batch shell commands for route verification.
- Compare the result against both:
  - the relevant Stitch export
  - the repo's intended product behavior
- Check desktop and mobile when the route is user-facing.
- Capture concrete evidence in `dogfood-output/` for failures that should stay reopened.

Design and UX bar:

- The website must feel good-looking and perfectly usable first.
- Hover states must be deliberate, restrained, and useful.
- Hover colors must improve clarity and emphasis, not create noisy amber spam.
- Fallback states must still look designed, not unfinished.
- Every page must read as a finished page, not a loose collection of boxes.
- Mobile must be intentionally designed, not just stacked desktop.
- Do not write cringe copy, fake system jargon, or forced constructivist labels unless they are clearly supported by the existing product and the Stitch reference.

Self-check before claiming success:

Ask whether the live result still has any of these failure modes:

- broken or regressed real functionality
- ugly or noisy hover states
- bad hover colors
- awkward spacing or dead air
- weak hierarchy
- cringe or unnatural copy
- placeholder-looking fallbacks
- desktop-only thinking with poor mobile results
- design that still does not read as a finished page
- route is missing entirely or still reads like an unstyled scaffold
- real product artifact is replaced by placeholder summary content

If any of those are still obviously true, do not mark the task complete.

Required loop note format in @IMPLEMENTATION_PLAN.md:

- timestamp
- target route or shared system
- skills invoked
- exact files changed
- what visible problem was being fixed
- what was preserved to avoid regressions
- validation performed
- live result status: `verified live`, `implemented but not reflected live`, `failed live verification`, or `blocked by content`
- next blocker

Completion rule:

- A route is only `verified live` when it is both visually strong and functionally intact in the live dev app.
- `blocked by content` is not a completion state for this workstream. Missing-content routes still need deliberate fallback design and live verification.
