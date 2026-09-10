# Current task

## Active contract

Intern handoff and local Git checkpoint of room-model progress. Modeling paused; Goal paused. No full-room acceptance. Latest owner permission covers the local commit and recovery save-copy, not push/deploy/merge, more modeling, browser/server work, macOS automation, or audio/device changes.

Start with [full intern handoff](../docs/HANDOFF_2026-09-10_SHRINE_MODEL.md), sections 1–3 and 10. Exact prior calls: [action appendix](../docs/room-model-handoff-2026-09-10/actions.md). This file is the only live tracker; handoffs and receipts are historical checkpoint evidence.

## Immediate next action

Run from repository root:

```sh
shasum -a 256 -c docs/room-model-handoff-2026-09-10/checkpoint.sha256
```

Then use native Blender MCP to inspect filepath/dirty state; preserve unexpected differences. Resolve this checkpoint revision with `git log -1 --format='%H %s' -- docs/HANDOFF_2026-09-10_SHRINE_MODEL.md`. Do not reset the dirty worktree or open another scene over unsaved work.

## Latest settled model requirements

- Each acrylic stand has distinct artwork; 126 visible print assemblies currently map to 126 IDs.
- Clear-case group spans two adjacent furniture shelf columns horizontally.
- Plush is smaller and integrated into the shrine.
- Small hobby props may be on the low table; old PC Rubik anchor is subordinate to this direction.
- Lead owns all design/model/texture/Blender edits. Delegation only for independent code/reading under explicit scope.
- Preserve confirmed 5.05 m width and owner floorplan; two openings on one wall; no clothes hanger or generated faces/text/logos; original photos immutable.

## Checkpoint state

- Source `assets/room/room.blend`: saved 18:52:57 JST, SHA256 `1a5fa57aee689ee9c9e4355f60b0cb8ed316c828ad99848abc2c9138cf3814bc`.
- Live Blender is dirty. Recovery copy `assets/room/checkpoints/room-shrine-handoff-20260910.blend` saved via native copy=True; SHA256 `6c424a23474e533778d095f5c42ef7b30c1e4f3a7b59b545e329d76cfc9e719d`. Source bytes unchanged. Snapshot is not a new accepted export baseline.
- Lean/public GLB both 34,380,684 bytes, SHA256 `bc117074122ac5481f766be31835f1dda12d01feef987dd879edf1dd3261ed98`. Raw 35,799,544 bytes.
- Native audit: 392,092 renderable triangles; 2,062 renderables. Physics: floating 20, wall 11, intersections 70; sinks, curve hits and collider drift zero. Raw warnings remain unresolved.
- Fresh check-build exits 1: PC-RUBIK obsolete desk anchor; ACRYLIC-CASE material-name mismatch (`Room/Case clear polished`). Neither repaired during handoff. No false passing status.
- Final unobstructed shrine and current table renders are missing. Cycles shrine has a proof-light reflection; table image predates final yoyo/cup/ticket/contact corrections.
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
| MODEL-SHELF | AST-04,AST-05,AST-08,AST-16,DELTA-01,DELTA-02,DELTA-07,DELTA-13,DELTA-16 | Checkpointed partial: unique stands, two-column cases; final visual proof open | Rebuild shelf as dense, source-like organized clusters with readable elevated 雛壇 risers; books are in scope because current forms are too thick and spine texture is weak. |
| MODEL-GEOMETRY | GEO-01,GEO-02,GEO-03,GEO-04,GEO-05,GEO-06,GEO-07,GEO-08,GEO-09,GEO-10,AST-10,LIT-01,LIT-02,LIT-03,LIT-04,LIT-05,LIT-06,DELTA-05,DELTA-09 | Historical/open; no current acceptance from this checkpoint | Confirmed geometry only: windows, curtains, darts/mats, desk/keyboard, balcony, table/beanbag, closet, posters, shadows; owner floorplan fixed. |
| MODEL-DETAILS | AST-06,AST-07,AST-09,AST-09a,AST-09b,AST-12,AST-14,AST-17 | Checkpointed partial: smaller shrine plush and table props; other details open | After shelf passes, ground plush; restore penlights/towels to the right-wall zone; preserve PC/camera/uchiwa. |
| EXPORT-SHELF / EXPORT-GEOMETRY / EXPORT-DETAILS | VAL-01 | Saved/raw/lean/public synchronized; two build-contract failures | Keep runtime export synchronized from `assets/room/room.blend`; never serve an older GLB. |
| INPUT-01 | UX-01,UX-02,UX-08,UX-09,UX-10,UX-19 | Historical/open; no current acceptance from this checkpoint | Audit pointer-lock, camera entry, mouse look, unlock/Escape, focus freeze, and fallback in `room-runtime.ts`; no model/assets/routes. |
| UX-EXAMINE | UX-03,UX-11,UX-12,DELTA-03 | Historical/open; no current acceptance from this checkpoint | Verify or repair Resident Evil-style examine overlay, hover hints, object selection while pointer-locked, and lie-down/chill PC view. |
| UX-ROOM-CONTROLS | UX-13,UX-14,UX-15,UX-17,DELTA-05,DELTA-06,DELTA-08 | Historical/open; no current acceptance from this checkpoint | Verify or repair Tokyo curtain, lights/switch, light/dark toggle, closet, and static loading. |
| UX-DARTS | AST-03,UX-16,DELTA-12 | Historical/open; no current acceptance from this checkpoint | Implement and verify the minimum playable darts throw/result loop with board and mat coordinates. |
| UX-MOBILE | UX-07,UX-18 | Historical/open; no current acceptance from this checkpoint | iPhone 15 viewport entry/navigation/tap path. |
| CONTENT-01 | UX-04,UX-05,UX-06,CNT-01,CNT-02,DELTA-14 | Historical/open; no current acceptance from this checkpoint | Verify object-to-route mapping for Projects, Notes, Hobbies, Events/attendance, Namecard/About/Contact, camera, and every confirmed hobby target across en/ja/th. |
| CONTENT-02 | CNT-03,DELTA-11 | Historical/open; no current acceptance from this checkpoint | Replace bare iframe-looking previews with the integrated HTML overlay shell and preserve existing routes. |
| ATLAS-01 | AST-11,AUTH-02,AUTH-03,DELTA-10 | Historical/open; no current acceptance from this checkpoint | Seven `apps/astro/public/room-concept/room-item-atlas-{shell-openings,pc-keyboard,darts-plush,shelf-collection,display-wall,center-lower,hobby-objects}.png`; one numbered panel per model item. |
| BUILD-HARNESS | AUTH-05,GEO-10,VAL-01,VAL-02,AST-*,DELTA-10 | Native working; check-build fails PC-RUBIK and ACRYLIC-CASE | `tools/room-harness/build/`, native `.blend`, local public GLB, `PHOTO_*` cameras |
| FINAL-01 | VAL-02 | Not complete; room/model/runtime acceptance open | Run upper-view geometry audit, photo closeups, current GLB/browser proof, independent review, then required build/lint/checks. |

## Resume sequence after renewed modeling direction

1. Verify integrity and native state.
2. Reconcile owner-authorized table placement with PC-RUBIK contract; rename case material to compatible `Room/AcrylicClear case polished` without changing physical shader.
3. Save → native physics → native audit → native export → UV strip → public copy → check-build.
4. Render final shrine/table with readable lighting and no specular obstruction; inspect all stand UVs and full case containment.
5. Continue broader room requirements with source-grounded evidence. Browser/servers/external writes require their own current authority.

## Handoff gates and coverage

- Named handing-off-pro-max: 1–167/EOF. Current look-at-the-screen 1–60/EOF and verification-before-completion 1–120/EOF.
- Full handoff reread 1–175, 176–350, 351–517/EOF after writing. Current scene/scripts, source/export hashes, failed gate, original index and historical handoff reconciled. Final integrity/staged/commit verification is recorded by the checkpoint artifacts and actual Git tree.
- Detailed source/skill/history coverage and remaining gaps are in handoff section 13. Only exact current-project session tool records were extracted; no reasoning/raw user messages or unrelated-project histories persisted.
- Historical coverage: model-design-spec 1–512/EOF, reference-map 1–110/EOF, physics 1–172/EOF, audit 1–105/EOF, UV strip 1–104/EOF. Broader room-spec not fully reread by this lead; no whole-product audit claim.
- No new tests, browser session, development server, review post, deployment or push. Model remains unfinished; local checkpoint is a recoverability boundary only.
