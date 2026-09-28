# Current task

## Active contract

Continuation of the room-model checkpoint under the current user request. This slice covers the owner-authorized Rubik contract reconciliation, clear-case material namespace repair, serialized native export, and current native proof; no full-room acceptance. No push/deploy/merge/PR, browser/server, macOS automation, audio/device changes, or commit authority is implied.

2026-09-26 live: owner goal = room hugely complete, simplified version of the real room, every asset polished, nothing mock or unfinished; read the docs, invent nothing. Props are hand-modelled per photo crop (assets/room/model_plush_chibi.py, model_plush_lying_pillow.py, textures_src_plush_panels.py, generate_pc_wall_papers.py), rendered at full resolution against the crop, then reviewed by read-only subagents whose claims are verified against the photo before acting. Settled decisions still win over reviewers: shrine two-column case layout, floorplan, desk length, rear-window closed state (runtime opens by day), penlight glow (DELTA-02).

Start with [2026-09-26 handoff](../docs/HANDOFF_2026-09-26.md) sections 1–3 and 10; older base: [intern handoff](../docs/HANDOFF_2026-09-10_SHRINE_MODEL.md). Exact prior calls: [action appendix](../docs/room-model-handoff-2026-09-10/actions.md). This file is the only live tracker; handoffs and receipts are historical checkpoint evidence.

## Active slice (2026-09-28): item-by-item mockup match + council

Request ledger (current session, in order):
1. Model and texture every spec item per floorplan + spec; Blender scene must match what it should be — in progress.
2. Goal: room complete, photo-perfect to the mockup/spec panels, no compromise — in progress.
3. Detailed per-item spec rendering and 1:1 implementation; full image item-by-item comparison; fully working room model — comparison sheets exist for all 54 items (tools/room-harness/item-compare/sheets, untracked media); keep updating after every fix.
4. Council until all EXTERNAL models say it is good — round 1-2 used internal subagents only; external-model round (Codex CLI, read-only, scratch dir) still required; signed VERDICT per the-council skill; verify every finding before fixing.
5. Work systematically with a feedback loop: one item, render, look, fix, re-render — no batch autopilot, no guessing, no procedural slop.
6. Art must resemble the owner's items: generate only from crops of the owner's photos or approved atlas; re-check against the original image.
7. Plush must not look creepy: nesoberi rebuilt (sleeping faces); owner re-check pending.
- Source: assets/room/room-v2.blend; export via assets/room/export_room_v2.py -> webp -> meshopt -> apps/astro/public/models/room.glb; check-build failed must be 0.
- LOCKED 2026-09-28 ~17:45 JST at the owner's instruction to lock, commit and hand off. HEAD 5217725 on dev, tracked tree clean. Resume from [HANDOFF_2026-09-28.md](../docs/HANDOFF_2026-09-28.md) section 10. Council round 3 was stopped unfinished (no verdict); rounds 1-2 findings were verified and fixed or rejected (see handoff section 7). Dev server left running on 4321 (PID 71225) for the owner; browser sessions closed.
- 3D play: darts, rubik, piano (7ffced5), typing race (ee0654e), yoyo with string physics (3427bf1) done and browser-played; kendama, juggling, penlights, cards, pen spinning open.
- Owner direction round 5 (2026-09-28, active): scrap the HTML panel minigames entirely; the examine panel only shows the page. Hobby play must happen in the 3D room with real physics on the actual models (darts thrown into the board, yoyo, kendama, juggling, rubik layer turns with csTimer keys, piano keys, PC keyboard typing race on the monitor, pen spinning, penlights). Also: visible translucent hit volume near the rack photo frame, no crosshair/cursor, hitboxes must be the model itself, and the desk rug blocks walking. Dev server for the owner runs on port 4321.
- Non-actions: no push/deploy/merge, no dev server start, no macOS automation, no Artifact publishing, no Codex runs inside the repo.
- Disk: exports one at a time; delete room-v2-web.glb and the webp intermediate right after.
- Archived checkpoint detail: [room-checkpoint-archive-2026-09-10.md](room-checkpoint-archive-2026-09-10.md), [room-checkpoint-archive-2026-09-28.md](room-checkpoint-archive-2026-09-28.md).

## Site polish and photos (2026-09-27, branch `dev`)

`/[locale]/photos` renders `apps/astro/src/constants/kameko-posts.json` (post metadata only; images hotlinked from pbs.twimg.com, each card links to its X post, cards hide if the image is gone). Included: posts by @HamP_punipuni tagged #カメコしてみた, #百瀬安由未, or #蓮ノ空 with #zweigen/#ツェーゲン, with photos and at least one named person (parser in `src/utils/kameko.ts`). Refresh: `cd apps/astro && TWEETAPI_IO_API_KEY=… bun run fetch:kameko` (incremental, 1 request, skips known IDs); `KAMEKO_DEEP=1` is a full paid sweep — only with owner approval and a credit estimate. Key lives in with-meets-reminder/.env; never write it to this repo.

Site polish: room moved to `/[locale]/room`, home is the conventional page (`[locale]/index.astro`, ex-overview). New brand mark (block H between two amber framing corners) in `BrandMark.tsx`; sources and renders in `apps/astro/scripts/brand/` → `public/favicon.svg`, `favicon-64.png`, `apple-touch-icon.png`, `og-default.png`. Placeholder visuals removed (home ghost-H panel, Life icon cards, hobby/project monogram tiles, about name plate, StatusRow, room design prototype route); home hero and Recent photos use gallery portraits. Design docs: `docs/design/README.md` + `docs/design/pages/*.md` (every route). Contract tests updated; `bun test apps/astro/tests` 362/362, `bun run build` 0 errors. Next: owner runs `/ask-matt` for whole-codebase documentation.

## Latest settled model requirements

- Each acrylic stand has distinct artwork; 126 visible print assemblies currently map to 126 IDs.
- Clear-case group spans two adjacent furniture shelf columns horizontally.
- Plush is smaller and integrated into the shrine.
- Small hobby props may be on the low table; old PC Rubik anchor is subordinate to this direction.
- Lead owns all design/model/texture/Blender edits. Delegation only for independent code/reading under explicit scope.
- Preserve confirmed 5.05 m width and owner floorplan; two openings on one wall; no clothes hanger or generated faces/text/logos; original photos immutable.

## Authority and broader work

[room-spec.md](room-spec.md) remains the only product requirement ledger; [room-model-design-spec.md](room-model-design-spec.md) governs model requirements; [room-reference-map.md](room-reference-map.md) records placement. Existing accepted atlases are reference aids, not replacements for original photos. Latest owner instructions override stale lower-level anchors. The older September 10 handoff's CLI/process/hash claims are historical.

All following work remains open unless this checkpoint state above provides exact scoped evidence. Prior browser images, counts and hashes are not current proof.

| Task | Requirement IDs | Current evidence boundary | Scope retained |
| --- | --- | --- | --- |
| HARNESS-01 | AUTH-03,AUTH-04,AUTH-05,DOC-01,DOC-02,DOC-03 | Historical/open; no current acceptance from this checkpoint | Project-owned `tools/room-harness/`; sole tracker/ledger; native export, browser evidence, receipts, decoder checks. |
| POSTER-01 | ART-01,AST-11,DELTA-04 | Historical/open; no current acceptance from this checkpoint | Preserve current room geometry; keep the accepted transform-only `illustrated-posters-minimal` planes on the left PC, right shelf, and bottom entry walls, with the left Closet anime illustrated print normal flipped to interior (+X), then verify the public copy. |
| POSTER-02 | AST-15 | Historical/open; no current acceptance from this checkpoint | Fresh headed `ham-room-live` check of left-wall, right-wall, lower-wall posters and entry camera after the model/design correction using the POSTER-01 public GLB. |
| VISUAL-01 | AUTH-01,AUTH-02,AST-01,AST-02,AST-13,DELTA-10,DELTA-15 | Historical/open; no current acceptance from this checkpoint | Audit supplied photos/archives for shelf, desk, curtains, darts, keyboard, acrylic, plush, penlights/towels, balcony, closet, table/beanbag, shadows, posters, and materials. |
| MODEL-SHELF | AST-04,AST-05,AST-08,AST-16,DELTA-01,DELTA-02,DELTA-07,DELTA-13,DELTA-16 | Checkpointed partial: current spine pass, corrected top-display truss, focused proof and clean full-shelf proof are saved and visually inspected; broader density/riser proof remains open | Preserve dense source-like organized clusters with readable elevated 雛壇 risers; current active books are narrowed, spaced, and atlas-mapped; source-visible low black top-display lattice is present without changing artwork or case layout. |
| MODEL-GEOMETRY | GEO-01,GEO-02,GEO-03,GEO-04,GEO-05,GEO-06,GEO-07,GEO-08,GEO-09,GEO-10,AST-10,LIT-01,LIT-02,LIT-03,LIT-04,LIT-05,LIT-06,DELTA-05,DELTA-09 | Historical/open; no current acceptance from this checkpoint | Confirmed geometry only: windows, curtains, darts/mats, desk/keyboard, balcony, table/beanbag, closet, posters, shadows; owner floorplan fixed. |
| MODEL-DETAILS | AST-06,AST-07,AST-09,AST-09a,AST-09b,AST-12,AST-14,AST-17 | Checkpointed partial: smaller shrine plush, table props, and active right-wall penlight/towel assemblies; focused proof and other details open | Preserve the source-like right-wall penlight grid and towels; preserve PC/camera/uchiwa; continue shelf/riser/detail inspection. |
| EXPORT-SHELF / EXPORT-GEOMETRY / EXPORT-DETAILS | VAL-01 | Saved/raw/lean/public synchronized; current structured check-build failures zero | Keep runtime export synchronized from `assets/room/room.blend`; never serve an older GLB. |
| INPUT-01 | UX-01,UX-02,UX-08,UX-09,UX-10,UX-19 | Historical/open; no current acceptance from this checkpoint | Audit pointer-lock, camera entry, mouse look, unlock/Escape, focus freeze, and fallback in `room-runtime.ts`; no model/assets/routes. |
| UX-EXAMINE | UX-03,UX-11,UX-12,DELTA-03 | Historical/open; no current acceptance from this checkpoint | Verify or repair Resident Evil-style examine overlay, hover hints, object selection while pointer-locked, and lie-down/chill PC view. |
| UX-ROOM-CONTROLS | UX-13,UX-14,UX-15,UX-17,DELTA-05,DELTA-06,DELTA-08 | Historical/open; no current acceptance from this checkpoint | Verify or repair Tokyo curtain, lights/switch, light/dark toggle, closet, and static loading. |
| UX-DARTS | AST-03,UX-16,DELTA-12 | Historical/open; no current acceptance from this checkpoint | Implement and verify the minimum playable darts throw/result loop with board and mat coordinates. |
| UX-MOBILE | UX-07,UX-18 | Historical/open; no current acceptance from this checkpoint | iPhone 15 viewport entry/navigation/tap path. |
| CONTENT-01 | UX-04,UX-05,UX-06,CNT-01,CNT-02,DELTA-14 | Historical/open; no current acceptance from this checkpoint | Verify object-to-route mapping for Projects, Notes, Hobbies, Events/attendance, Namecard/About/Contact, camera, and every confirmed hobby target across en/ja/th. |
| CONTENT-02 | CNT-03,DELTA-11 | Historical/open; no current acceptance from this checkpoint | Replace bare iframe-looking previews with the integrated HTML overlay shell and preserve existing routes. |
| ATLAS-01 | AST-11,AUTH-02,AUTH-03,DELTA-10 | Historical/open; no current acceptance from this checkpoint | Seven `apps/astro/public/room-concept/room-item-atlas-{shell-openings,pc-keyboard,darts-plush,shelf-collection,display-wall,center-lower,hobby-objects}.png`; one numbered panel per model item. |
| BUILD-HARNESS | AUTH-05,GEO-10,VAL-01,VAL-02,AST-*,DELTA-10 | Native working; current check-build exits zero; raw physics warnings remain | `tools/room-harness/build/`, native `.blend`, local public GLB, `PHOTO_*` cameras |
| FINAL-01 | VAL-02 | Not complete; room/model/runtime acceptance open | Run upper-view geometry audit, photo closeups, current GLB/browser proof, independent review, then required build/lint/checks. |

## Resume sequence

Model steps 1–5 of the September pass are done (see Checkpoint state). Browser pass 2026-09-26 verified darts, mobile tap, room controls, examine overlays and locales (evidence README under `tools/room-harness/evidence/browser-20260926/`). Next: owner review of the polish pass on `dev`.

