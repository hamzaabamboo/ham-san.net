# Room checkpoint archive (historical, 2026-09-10 room.blend)

Moved out of CURRENT_TASK.md on 2026-09-28. Evidence only; not live state.

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

## Handoff gates and coverage

- Named handing-off-pro-max: 1–167/EOF. Current look-at-the-screen 1–60/EOF and verification-before-completion 1–120/EOF.
- Full handoff reread 1–175, 176–350, 351–518/EOF after writing. Current scene/scripts, source/export hashes, failed gate, original index and historical handoff reconciled. Final integrity/staged/commit verification is recorded by the checkpoint artifacts and actual Git tree.
- Detailed source/skill/history coverage and remaining gaps are in handoff section 13. Only exact current-project session tool records were extracted; no reasoning/raw user messages or unrelated-project histories persisted.
- Historical coverage: model-design-spec 1–512/EOF, reference-map 1–110/EOF, physics 1–172/EOF, audit 1–105/EOF, UV strip 1–104/EOF. Broader room-spec not fully reread by this lead; no whole-product audit claim.
- Commits exist on `room/remodel-2026-09-26` and `dev`; nothing pushed or deployed. Dev servers and browser sessions are started only for owner-requested checks and stopped afterwards.
