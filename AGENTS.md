## Build & Run

- Install: `bun install`
- Astro dev: `cd apps/astro && bun run dev -- --host 0.0.0.0`
- Astro build: `cd apps/astro && bun run build`
- Astro lint: `cd apps/astro && bun run lint`
- Astro format check: `cd apps/astro && bun run format`
- Workspace check: `bun run check`

## Validation

- Primary gate for the Stitch workstream: `cd apps/astro && bun run build`
- Route verification must use `agent-browser`
- Compare implemented pages against `stitch_exports/4878703984446574546`
- Validate one route at a time
- Do not batch shell commands for this workstream
- Build success is not sufficient; visual and functional verification are required in the same loop
- The default Ralph build loop must re-plan, implement, verify, and write notes in one iteration

## Operational Notes

- The active workstream is Astro fidelity against Stitch project `4878703984446574546`
- Treat the repository code as the product source of truth
- Treat the Stitch export HTML and screenshots as design reference for composition, hierarchy, spacing, and tone
- Preserve real repo behavior; do not replace working systems with fake visual replicas
- Use relevant available skills when they materially improve planning, implementation, or validation
- The normal loop should not depend on a separate planning run before doing useful work
- Preserve multilingual quality across English, Japanese, and Thai
- Remove invented brand language that is not present in the Stitch comps
- Do not hide layout or interaction failures behind "content gap" language
- Hover states and hover colors must be deliberate and usable, not noisy
- Fallback states must still feel designed
- Keep this file operational only
