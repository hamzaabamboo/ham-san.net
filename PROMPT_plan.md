0a. Study `specs/*`.
0b. Study @IMPLEMENTATION_PLAN.md if present.
0c. Study the real Astro source, shared components, layout system, styles, and route behavior.
0d. Study the relevant Stitch exports in `stitch_exports/4878703984446574546`.

1. Planning mode only. Do not implement anything.
2. This mode is for deep replanning only. The normal build loop already includes lightweight replanning at the start of every iteration.
3. Treat the repository code as the product source of truth. Treat Stitch as a design reference, not a command to replace real working behavior.
4. Update @IMPLEMENTATION_PLAN.md so it reflects only trustworthy, testable progress.
5. Reopen any item whose visible live result is still weak, even if previous notes claimed success.
6. Identify any relevant skills that should be invoked in the next build loop when they materially help.

Plan quality rules:

- Do not use vague "complete" language without route-specific evidence.
- Do not classify a problem as a content gap when the visible failure is really layout, hierarchy, interaction, hover states, copy, or art direction.
- Prioritize user-facing pain over internal cleanup.
- Prefer one brutally honest active queue over a long fake-complete narrative.
- If a route still looks bad, mark it `failed live verification`.
- If the plan drifts into status theater, rewrite it instead of patching around the lie.

Required plan structure:

- clear active route or shared system
- what is visibly wrong
- what files most likely control it
- what skills should be invoked in the next loop
- what must be preserved to avoid regressions
- what verification is still missing
