# Current task

## Active contract

Continuation of the room-model checkpoint under the current user request. This slice covers the owner-authorized Rubik contract reconciliation, clear-case material namespace repair, serialized native export, and current native proof; no full-room acceptance. No push/deploy/merge/PR, browser/server, macOS automation, audio/device changes, or commit authority is implied.

2026-09-26 live: owner goal = room hugely complete, simplified version of the real room, every asset polished, nothing mock or unfinished; read the docs, invent nothing. Props are hand-modelled per photo crop (assets/room/model_plush_chibi.py, model_plush_lying_pillow.py, textures_src_plush_panels.py, generate_pc_wall_papers.py), rendered at full resolution against the crop, then reviewed by read-only subagents whose claims are verified against the photo before acting. Settled decisions still win over reviewers: shrine two-column case layout, floorplan, desk length, rear-window closed state (runtime opens by day), penlight glow (DELTA-02).

Start with [2026-09-26 handoff](../docs/HANDOFF_2026-09-26.md) sections 1–3 and 10; older base: [intern handoff](../docs/HANDOFF_2026-09-10_SHRINE_MODEL.md). Exact prior calls: [action appendix](../docs/room-model-handoff-2026-09-10/actions.md). This file is the only live tracker; handoffs and receipts are historical checkpoint evidence.

## Immediate next action

Art restore (2026-09-26): approved art only — `illustrated-posters-minimal.png` (closet anime/portrait prints, blue-dress tapestry), `acrylic-insert-minimal-atlas.png` (desk group poster, framed/leaning/photo prints, wall cards), `book-spine-reference-atlas.png` (shelf spine print A/B; room-facing UV fix kept). Retired to `Room superseded art additions`: shelf-wall taped posters + tapes, entry poster sleeve + tapes. Outputs of generate_wall_illustrations.py and generate_book_spine_atlas.py are not approved (ART-01/AST-11) and must not be reapplied. Renders: tools/room-harness/evidence/build/work/v_art_*.png. Next: owner review; browser check only if asked.

Live browser pass (2026-09-26): all room functions tested in agent-browser + CDP touch emulation; ledger tools/room-harness/evidence/browser-20260926/README.md. Fixed: clear-case acrylic (runtime configureAcrylicCase), stale nav anchors for rubik/yoyo/penspinning/kendama/cardistry/typing, closet tag on entry wall + darts tag on floor mat removed, closet hit volume 1.4 m, setPointerCapture guard. build + check-build pass. Committed on branch room/remodel-2026-09-26 (not pushed); handoff docs/HANDOFF_2026-09-26.md. Next: owner review; vibe reference images needed (unreadable temp path); dev server was started only for this pass and is stopped.

The historical checkpoint manifest was verified before continuation. Its only mismatch is this intentionally updated live tracker; current source/export hashes are recorded below. Continue from the primary `assets/room/room.blend`; do not reset the dirty worktree or open the recovery copy over live work.

2026-09-26 progress: dart corner, penlight wall, PC wall, shelves, low table, entry and closet zones rebuilt by hand from the owner photos over rounds 2–5 (details in tools/room-harness/evidence/build/item-audit-20260926/README.md and round4/README.md). Settled layout kept.

## Latest settled model requirements

- Each acrylic stand has distinct artwork; 126 visible print assemblies currently map to 126 IDs.
- Clear-case group spans two adjacent furniture shelf columns horizontally.
- Plush is smaller and integrated into the shrine.
- Small hobby props may be on the low table; old PC Rubik anchor is subordinate to this direction.
- Lead owns all design/model/texture/Blender edits. Delegation only for independent code/reading under explicit scope.
- Preserve confirmed 5.05 m width and owner floorplan; two openings on one wall; no clothes hanger or generated faces/text/logos; original photos immutable.

## Checkpoint state

- Source `assets/room/room.blend`: 2026-09-26 browser-pass save (nav/tag fixes); SHA256 prefix `c71e82a24dcc39ec`.
- Live Blender is clean after the native proof cleanup. Recovery copy `assets/room/checkpoints/room-shrine-handoff-20260910.blend` saved via native copy=True; SHA256 `6c424a23474e533778d095f5c42ef7b30c1e4f3a7b59b545e329d76cfc9e719d`. Source bytes unchanged. Snapshot is not a new accepted export baseline.
- Public GLB SHA256 prefix `1b14b54190220da0` (46.8 MB lean); check-build failed 0; audit 441,960 renderable tris / 450,000.
- Physics (latest): floating 33, wall 11, intersections 117; sinks, curve hits, collider drift zero. Raw warnings unresolved.
- Pre-edit check-build had exactly two failures: PC-RUBIK obsolete desk anchor and ACRYLIC-CASE material-name mismatch (`Room/Case clear polished`). Contract reconciliation is recorded; native material rename is applied and the serialized save/audit/export/strip/copy chain passes with zero check-build failures.
- Continuation verification: checkpoint revision is `e3da2b74eaa0e11a97af5feb9eb473e93c9c90db`; latest native filepath is the primary source, dirty=false after shelf proof cleanup, 126 visible unique artwork IDs, layout version 1, and no `RoomWebExport` collection.
- Contract reconciliation: stable `Desk Rubik` names and `roomTarget=rubik` remain; `room-spec.md`, `room-model-design-spec.md`, and `build-plan.json` now record the owner-authorized low-table placement with the existing `[665,140,825,300]` anchor and tolerance 50.
- Native render evidence: `shelf-current-final-clean-20260910-front.png` directly shows the current shelf; `shelf-top-display-truss-final-20260910-front.png` and `shelf-top-display-truss-final-20260910-oblique.png` show the corrected lattice; `shelf-open-bay-u2r3-tiered-20260910-front.png` shows the active multi-height open-bay stands and riser; `right-wall-detail-clean-20260910-front.png` shows penlights/towels; current-head shrine/table proofs are `shrine-final-20260910-current-front.png`, `shrine-final-20260910-current-oblique.png`, `hobby-table-final-20260910-current-oblique.png`. Older un-suffixed final proofs are historical relative to this SHA. Native placement remains x≈3.20–3.23 right-wall grid and four folded towels x≈3.17–3.23.
- Native per-object audit passes: all staged table families have zero footprint/contact violations and retain targets; 126 manifest IDs are unique and name-matched; no print lacks UVs, has out-of-range UVs, or has degenerate evaluated contour faces; all 72 clear-case assemblies are contained in six cases; `Room/AcrylicClear case polished` is present; 164 active shelf spine front faces use the neutral reference atlas with zero UV/material violations, and every six-run group has a measured nonzero gap.
- Truss correction: post-edit physics returned to 20/11/70 floating/wall/intersections, with 0 sinks, curve hits and collider drift.
- One-shot `refine_shrine_layout.py` already applied. Do not bypass its guard. Acrylic replay MUST supply `ACRYLIC_ARTWORK` from `acrylic-unique-assignments.json`; defaults restore repeated old art.
- Yoyo tether, frame UVs and case material include one-off native edits. Scripts alone do not reconstruct final source. Do not replay from scratch.
- Recovery-copy filepath has an extra directory and breaks source-script root derivation; keep primary source active.
- Native official Blender Lab MCP responds on 9876. No CLI/custom client fallback or reconnect request without a fresh failure.
- Commit scope is explicit room source/recovery/exports, used textures, scripts/harness dependencies, proof images, selected specs/rules and handoff. Unrelated app/theme/locale/workflow changes remain untouched. Original photos and old raw-chat handoff are not staged.

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

## Resume sequence after renewed modeling direction

1. Verify integrity and native state.
2. Reconcile owner-authorized table placement with PC-RUBIK contract; rename case material to compatible `Room/AcrylicClear case polished` without changing physical shader. Done.
3. Save → native physics → native audit → native export → UV strip → public copy → check-build. Done: physics raw warnings remain 20 floating/11 wall/70 intersections, structured failures remain zero, and check-build exits 0.
4. Render final shrine/table with readable lighting and no specular obstruction; inspect all stand UVs and full case containment. Current-head shrine/table views are refreshed and inspected after the shelf pass.
5. Continue broader room requirements with source-grounded evidence. Current next slice: broader shelf-density audit; final top-display, clean full-shelf and open-bay riser proofs are current; native save/physics/audit/export/strip/copy/check-build are green; browser/servers/external writes require their own current authority.

## Handoff gates and coverage

- Named handing-off-pro-max: 1–167/EOF. Current look-at-the-screen 1–60/EOF and verification-before-completion 1–120/EOF.
- Full handoff reread 1–175, 176–350, 351–518/EOF after writing. Current scene/scripts, source/export hashes, failed gate, original index and historical handoff reconciled. Final integrity/staged/commit verification is recorded by the checkpoint artifacts and actual Git tree.
- Detailed source/skill/history coverage and remaining gaps are in handoff section 13. Only exact current-project session tool records were extracted; no reasoning/raw user messages or unrelated-project histories persisted.
- Historical coverage: model-design-spec 1–512/EOF, reference-map 1–110/EOF, physics 1–172/EOF, audit 1–105/EOF, UV strip 1–104/EOF. Broader room-spec not fully reread by this lead; no whole-product audit claim.
- No browser session, development server, review post, deployment, push or commit in this continuation. Existing checks were reused; no new tests were created. Model remains unfinished; current native/export proof is a recoverability and model-slice boundary only.
