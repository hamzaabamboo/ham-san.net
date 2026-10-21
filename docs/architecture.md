# Architecture

How ham-san.net is put together, for anyone changing more than one file. Domain words are defined in [`CONTEXT.md`](../CONTEXT.md), the reasons behind the big choices are in [`docs/adr/`](adr/), and page-level design is in [`docs/design/`](design/README.md).

## What is live

| Part | Path | Status |
| --- | --- | --- |
| Website | `apps/astro` | **Live.** Astro 6 SSR with React islands and Panda CSS. |
| CMS | `apps/api` | **Live.** Strapi. Serves projects, the about profile and tags over GraphQL. |
| Old website | `apps/client` | Legacy SvelteKit frontend (Docker target `legacy-client`). Nothing in `apps/astro` depends on it. |
| Shared code | `libs/graphql`, `libs/i18n`, `libs/outline`, `libs/utils` | Used by `apps/astro`. `libs/utils` is also shared with `apps/client`. |
| Unused | `libs/ui-core` | Nx scaffold; nothing imports it. |
| 3D room sources | `assets/room/`, `tools/room-harness/` | Blender scene, generator scripts and the verification harness for `/room`. |
| Planning | `conductor/`, `docs/`, `specs/`, `stitch_exports/` | Specs, handoffs, design references. Not part of the build. |

The workspace is Bun (runtime and test runner) with Nx orchestrating `lint`, `compile` and `build`. `pnpm-workspace.yaml` and `lerna.json` are leftovers; install and run everything with `bun`.

## Request path (apps/astro)

1. **Middleware** (`src/middleware/index.ts`, `redirect.ts`) prefixes the locale (`en`, `ja`, `th`) onto unprefixed paths. It leaves root assets alone (favicons, `og-default.png`, `robots.txt`, `/images/*`). Anything that looks like a locale code but isn't one becomes a 404.
2. **The page** (`src/pages/[locale]/…`) validates the locale, reads its data, and sets `CDN-Cache-Control` per branch (ADR 0006).
3. **Data reads** go through `withLastGood` / `withLastGoodState` (`src/utils/cms-cache.ts`): an in-process map of up to 256 keys that serves the last good value when an upstream throws.
4. **Layout:**
   - `MainLayout` for the site shell (bar, rail, footer);
   - `BaseLayout` for the full-bleed room;
   - `NamecardLayout` for namecards.
5. **Islands** hydrate only where needed: the drawer `Sidebar`, `Carousel`, hobby modules, and the room runtime.

## External systems

| System | Reached from | Env var names |
| --- | --- | --- |
| Strapi GraphQL | `src/graphql/index.ts` (typed SDK generated from `libs/graphql/**/*.gql` by `codegen.yml` / `codegen.prod.yml`) | `PRIVATE_BACKEND_API_URL`, `PUBLIC_API_URL` |
| Outline | `src/utils/outline-api.ts` (client from `libs/outline`); settings document parsed by `outline-settings.ts`; attachments proxied by `/api/outline-asset` | `PRIVATE_OUTLINE_SERVER`, `PRIVATE_OUTLINE_API_TOKEN`, `PRIVATE_OUTLINE_SETTINGS_DOCUMENT_ID` |
| Eventernote | `src/utils/eventernote-report.ts`: HTML scrape of the public profile with a 24 h in-module cache; no key | none |
| twitterapi.io | `scripts/fetch-kameko.mjs` only, run by hand; writes `src/constants/kameko-posts.json` (ADR 0003) | `TWEETAPI_IO_API_KEY` (lives in `with-meets-reminder/.env`; never commit it) |
| X image host | the browser loads `pbs.twimg.com` directly (ADR 0002) | none |

All upstream calls have short timeouts: 7 s for GraphQL and Outline, 12 s for Eventernote, 8 s for the asset proxy.

## The photos data flow

1. `scripts/fetch-kameko.mjs` searches X for posts by @HamP_punipuni with the photo hashtags. It skips post IDs already in the cache and merges new posts into `src/constants/kameko-posts.json` (commit this file).
2. `src/utils/kameko.ts` parses each post's text into a photo entry: shoot date, event, the named people, caption and tags. It drops any post that names nobody (ADR 0004).
3. `/photos` and the home page read those entries at render time, so there is no API call per request.

## The 3D room pipeline (Blender → browser)

Order matters; each step reads the previous step's output.

1. Edit `assets/room/room.blend` in Blender through the Blender Lab MCP (port 9876). The live objects are in the `RoomHome` collection.
2. Save, then in Blender run `tools/room-harness/build/physics_audit.py` and `audit_scene.py`. They write `physics-latest.json` and `audit-latest.json`.
3. In Blender, run `assets/room/export_room_web.py`. It writes `assets/room/room-web-current.glb`, keeping `room*` custom properties such as `roomTarget` and `roomNavigation`.
4. `node assets/room/strip_unused_uv.mjs assets/room/room-web-current.glb assets/room/room-web-lean.glb`
5. Compress for the web and publish: `bunx @gltf-transform/cli webp assets/room/room-web-lean.glb /tmp/room-webp.glb --quality 88`, then `bunx @gltf-transform/cli meshopt /tmp/room-webp.glb apps/astro/public/models/room.glb --level medium` (about 47 MB to 9 MB). Do not use `gltf-transform optimize`: its flatten, join and simplify steps drop node names and `room*` extras. Meshopt quantises vertices, so the runtime loads with `MeshoptDecoder` and bakes animated curtain meshes back to float parent-space vertices before moving them.
6. Fit texture density: `node tools/room-harness/fit_texture_density.mjs <meshopt.glb> apps/astro/public/models/room.glb`. Each texture is capped at about 2400 px per metre of the largest object using it (512 px minimum, 2048 px maximum). Names, extras, transforms and accessors are kept. On the 2026-10-21 model this took the file from 22 MB to 12 MB and decoded texels from 207 M to 65 M.
Acrylic stand prints are 1024x1536 transparent PNGs in `assets/room/art/gen/` (one per stand, no faces, text or logos). Generated prints on a chroma-green background are keyed with `node tools/room-harness/key_acrylic_print.mjs <in.jpg> <out.png>` and assigned in Blender with `assets/room/assign_acrylic_png.py`; `acrylic-inputs.json` records each print's stand and source.
7. `node tools/room-harness/build/check-build.mjs --json` checks the audit against `build-plan.json`. It must report `failed: 0`.
8. The browser: `src/components/home/room-runtime.ts` (Three.js) loads `/models/room.glb`. It renders on demand: nothing is drawn while the view is still. While the camera or an animation moves, it renders without post-processing at a motion pixel ratio that adapts to frame time (0.75 to the device ratio, capped at 2). About 160 ms after motion stops it draws one full-resolution frame, through the GTAO ambient-occlusion pass on desktop pointers. Raycasts use `three-mesh-bvh` trees built in idle time after load (curtains are excluded because their vertices move), and hover picking runs at most once per frame. It reads `Floor base.roomNavigation` for entry, colliders and close-up targets, and `roomTarget` for clickable objects. Pure logic such as the day/night phase and darts scoring lives in `room-logic.ts` and is unit-tested.

Requirements for the room live in `conductor/room-spec.md` and `conductor/room-model-design-spec.md`. The live task record is `conductor/CURRENT_TASK.md`.

## Tests and gates

- `bun test --max-concurrency=2 apps/astro/tests` (from the repo root) runs the contract suite. It includes design contracts (`round*-contracts`, `asset-contracts`, `atelier-fonts`), CMS resilience, i18n key reachability, and room logic. A failing contract usually means a design decision changed. Update the test to the new decision in the same commit, and say so.
- `cd apps/astro && bun run build` runs `astro check` then `astro build`; 0 errors is the gate.
- Visual changes need a real browser check (see `docs/design/README.md#verification`).

## Deploy

- **CI** (`.github/workflows/ci.yml`, every push) runs `codegen:prod`, `check` and `bun test`.
- **Deploy** (`.github/workflows/deploy.yml`, push to `main` or manual):
  - builds Docker images (`Dockerfile` targets `astro` and `api`) and pushes them to `registry.ham-san.net`;
  - SSHes to the VM to run `pre-deploy.sh`, `deploy-frontend.sh` and `deploy-backend.sh`;
  - runs a PageSpeed check.
- Production runs the Astro Node standalone server (`ASTRO_ADAPTER=node`). The Netlify adapter and `netlify.toml` only apply when that variable is unset.

## Gotchas

- `libs/i18n/{en,ja,th}/project.json` are locale strings for the Projects page, not Nx project files.
- The tags page always reads English CMS data, because tag names are locale-independent.
- `withLastGood` is per process. After a restart during an outage, pages show their unavailable state until the upstream recovers.
- Namecard pages intentionally ignore the site design system (ADR 0005).
