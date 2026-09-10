# Room mouse, acrylic shrine, and hobby table — full handoff and checkpoint, 2026-09-10

Everything required to resume this modeling slice without rediscovering the conversation. This document records engineering actions, decisions and observable evidence; the command appendix is not a replay script.

**Intern start here:** read sections 1–3, run the integrity command in section 10, then follow section 11 in order. Do not restart Blender, rebuild the room, rerun the one-shot layout, or treat the known failing gate as a new connection problem.

# PART I — TASK CONTRACT AND LIVE STATE

## 1. Exact task contract

- Latest request: document the complete work process and continuation state, then commit and lock current progress for an intern. Modeling was paused for this handoff. A recovery save-copy and a local scoped checkpoint commit are authorized. Push, deployment, merge, PR actions and further model changes are not authorized by this handoff.
- The preceding model corrections remain the acceptance contract: each acrylic stand has distinct artwork; the clear-case group spans two adjacent shelf columns horizontally; plush is small and integrated into the shrine; small hobby props may be on the low table.
- The broader room task remains unfinished. The Goal is paused and must not be recreated or resumed from this document.
- Lead ownership: all design, image direction, modeling, texture and Blender edits were lead-owned. Earlier Luna/max assignments were bounded source/harness reading, not authority for model edits. No subagents remained live at handoff verification.
- Required handoff completion: saved source and recovery copy preserved, dependencies and exact hashes recorded, local commit verified, failures and replay hazards explicit, sole live index updated, no unrelated dirty work committed.
- Required eventual model acceptance: actual reference matching, unique printed stands and fitted contours, supported and unobstructed display arrangement, final visible table and shrine proof, physical/structural checks, synchronized export, and owner acceptance. A passing integrity manifest does not satisfy these.
- Non-actions: no reference-photo changes or original-photo commits; no macOS GUI automation; no Blender CLI or custom Python/socket MCP client; no server start/stop; no browser operation without fresh owner direction; no audio/device changes; no invented faces/text/logos on generated prop prints; no clothes hanger; no unrelated app-code changes.
- Preserve the confirmed 5.05 m room width and owner floorplan. Two openings are on the same wall. Do not reopen settled spatial decisions.
- Authority: latest owner requirements → original photos → `conductor/room-model-design-spec.md` → accepted model sheets/atlases → build contracts. Product requirements remain `conductor/room-spec.md`; placement observations remain `conductor/room-reference-map.md`. A lower-authority contract disagreement is not permission to move the model back or weaken a check silently.
- `conductor/CURRENT_TASK.md` is the sole live record. This handoff and its appendix are checkpoint evidence, not competing trackers.

## 2. Ground truth: repository and working tree

| Field | Checkpoint value | Evidence |
| --- | --- | --- |
| CWD / repository | `/Users/vittayapalotai.tanyawat/code/ham-san.net` | `git rev-parse --show-toplevel HEAD` |
| Branch | `main` | `git status --short --branch` |
| Parent HEAD before checkpoint commit | `fa3f507114370a7d0d48a45b39e5939d562c51f9` | fresh local Git read |
| Remote/base/PR currency | Not assessed; no fetch, push or PR operation requested | no remote-currency claim |
| Index before staging | Empty | `git diff --cached --name-only` |
| Pre-existing dirty state | Extensive tracked modifications/deletions across app, theme, locales, tests and workflow files; many untracked room assets | fresh status; preserved, not attributed wholesale to this slice |
| Source | `assets/room/room.blend`, 40,372,257 bytes, saved 18:52:57 JST | disk stat and SHA256 |
| Recovery copy | `assets/room/checkpoints/room-shrine-handoff-20260910.blend`, 40,354,617 bytes, saved 19:09:16 JST | native `save_as_mainfile(copy=True)` returned FINISHED |
| Working Blender state | Correct source path; dirty flag true | native call; do not infer live bytes equal the saved file |
| Raw export | `assets/room/room-web-current.glb`, 35,799,544 bytes | disk stat, native export receipt |
| Lean/public export | Both 34,380,684 bytes, exact same SHA256 | fresh four-file hash check |
| Task-related tracked file | `AGENTS.md` contains prior room rules plus this slice's provider correction | mixed provenance; room rules retained |
| Task-related untracked roots before commit | `assets/`, `conductor/`, public models/concepts, `tools/room-harness/` | explicit files only are staged, not entire roots |
| Other dirty ownership | Unknown/pre-existing unless listed in section 6 | do not reset, stash or include broadly |

Exact SHA256:

| Artifact | SHA256 |
| --- | --- |
| Saved source | `1a5fa57aee689ee9c9e4355f60b0cb8ed316c828ad99848abc2c9138cf3814bc` |
| Recovery copy | `6c424a23474e533778d095f5c42ef7b30c1e4f3a7b59b545e329d76cfc9e719d` |
| Raw GLB | `8f13ef70b2d6ec5d4cffe6802cf3ebe192bc0e1ccffe483bd842f3395cacd3c1` |
| Lean GLB and public GLB | `bc117074122ac5481f766be31835f1dda12d01feef987dd879edf1dd3261ed98` |

The recovery copy preserves the observed dirty live state without overwriting the export-baseline source. It is not a replacement accepted baseline. Do not open it and run scripts whose root calculation assumes `assets/room/room.blend`: its extra directory changes `Path(...).parents[2]`. Review it only when investigating a suspected live-versus-disk difference. Native calls made after export can mark a scene dirty; the exact residual difference was not proven, so neither equality nor lost edits is asserted.

`docs/room-model-handoff-2026-09-10/artifacts.json` enumerates every selected checkpoint file with size, timestamp and hash. The final `checkpoint.sha256` is the integrity authority; documentation changed during authoring, so the earlier inventory's documentation hashes are only historical.

## 3. Environment and operational rules

- Blender 5.2.1 LTS is running. Native official Blender Lab MCP responds. Listener: Blender PID 85434 on 127.0.0.1:9876 at verification. Listener presence alone was not used as proof.
- Canonical tool: `mcp__blender__execute_blender_code`. Do not use the similarly named `_for_cli` tool.
- Correct configured executable: `/opt/homebrew/bin/uv`; arguments: `["--directory", "/Users/vittayapalotai.tanyawat/blender_mcp/mcp", "run", "blender-mcp"]`.
- Configuration variable names: `BLENDER_HOST`, `BLENDER_PORT`, `DISABLE_TELEMETRY`. Keep local host, port 9876 and telemetry disabled. The former `uvx blender-mcp` route selected a different implementation; it is not this addon.
- Configuration was corrected earlier in the task, followed by owner-side MCP reload and a real native response. No installation/restart work remains. This handoff does not authorize changing machine configuration.
- Each native code call has a fresh namespace: import `bpy` explicitly. Assign a dictionary to `result`. A list, string or Blender operator set causes a tool error even if the requested operation already completed.
- All edits, saves, audit and export calls are serialized. No concurrent scene mutation, save, render or export.
- Renderers create temporary lights/cameras and clean them in `finally`. Do not save proof-only lighting. Fresh native inspection found no proof scenes and no `RoomWebExport` collection.
- Viewport at handoff was MATERIAL with scene lights/world enabled; view distance about 0.474. This is not the earlier intended whole-shrine framing, nor browser/Cycles lighting acceptance.
- Disk check: 5.5 GiB available, volume 99% full. Recheck `df -h .` before any heavy output. No automatic cache cleanup or broad deletion.
- No server or browser was started during this modeling/handoff slice. Current browser sessions and HTTP state were not inspected; the older handoff's server-down claim is historical.
- Future explicitly authorized browser work must use one owned `ham-room-live` agent-browser session and the inline prefix `AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic,--mute-audio"`. No real-user Chrome and no non-http(s) navigation.
- Render proof scripts use 24 Cycles samples, fixed 4 threads. Do not launch uncapped test/build suites or parallel render sweeps.
- Current shell is zsh. Old fish/alias warnings in the earlier handoff do not describe this shell.
- Effective local Git identity resolves to Tanyawat Vittayapalotai / hamzaabamboo@gmail.com. Checkpoint commit uses that identity, no agent attribution. A local unsigned checkpoint avoids an OS signing prompt.
- Existing pre-commit hook invokes `pnpx lint-staged`. This unfinished binary-model checkpoint does not claim that app-wide hook passed; explicit native/data checks and staged-content checks are the evidence. No unrequested dependency installation or broad autoformatting.

# PART II — COMPLETE EXECUTION RECORD

## 4. Chronological command and action ledger

The exact current-session tool invocations and bounded material outputs are in [actions.md](room-model-handoff-2026-09-10/actions.md). It contains 310 ordered calls spanning 16:21:24–18:57:00 JST, source lines 1–2629. Call numbers below refer to that appendix. It includes failed setup attempts, source reads, patches, native operations, renders, checks and recovery calls.

Privacy boundaries: no reasoning records or raw user message records are copied. Private identifiers and encrypted agent messages are redacted; historical document/configuration patch bodies are withheld. Mixed patches retain model-code portions. Output excerpts are bounded and explicitly marked. Therefore this is a complete call index for the inspected range, not a claim that every output byte or encrypted delegation prompt is available. Current source files and the detailed methodology below are authoritative for execution.

| Order / phase | CWD | Exact action or appendix range | Purpose | Material result | Rerun safety |
| --- | --- | --- | --- | --- | --- |
| 1–12, 16:21–16:35 | repo | tool/host checks, Goal calls, bounded delegation | recover task access | code-mode host missing; even status-changing calls failed before execution | historical; do not repeat failed blocked-status calls |
| 13–33, 16:37–16:41 | repo | current record, rules, handoff/spec/photos, native discovery | establish requirements and actual tools | source read coverage below | reads safe; old status not current |
| 34, 16:41 | repo | `open -a Blender /Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room.blend` | then-authorized launch | exit 0 | NOT currently authorized; do not repeat |
| 35–128, 16:41–17:15 | repo / named config paths | native retry, addon/provider inspection, official docs, config patch | resolve implementation mismatch | listener existed while wrong client still failed; provider fixed | connection resolved, no new setup |
| 73–80 | repo | patches to `refine_mouse.py`; syntax/read checks | prepare scoped mouse refinement | script authored before live application | current source supersedes intermediate patches |
| 129–138, 17:17–17:19 | repo | real native filepath/scene response; original photo views | verify usable connection and initial geometry | correct file, original 32,718,790-byte source; large screenshot response invalid | inspect only; don't infer old source current |
| 139–155, 17:20–17:26 | Blender | mouse render → apply script → refine controls/seams → multiple proof views → save | restore recognizable shape and contact | four useful views; side-contact correction; preserved target | modifying script requires scoped replay review |
| 156–163, 17:26–17:29 | Blender then repo | audit → native export → `node assets/room/strip_unused_uv.mjs ...` → copy → gate | publish mouse checkpoint locally | intermediate passing checkpoint | superseded artifacts |
| 164–247, 17:29–18:17 | Blender / repo | acrylic baseline → contour prototype → slot/topology/UV refinements → 112-stand propagation → size/tiers/budget checks | replace generic hulls with actual contours | usable geometry; repeated 16-cell prints still violated later uniqueness requirement | do not rerun old atlas defaults |
| 248–259, 18:18–18:22 | repo | horizontal-span clarification, imagegen sources, latest record | settle four owner corrections | two adjacent horizontal shelf columns confirmed | settled; do not ask again |
| 260–261, 18:24 | repo / built-in image generation | full prompts persisted to `acrylic-unique-prompts.json`; four built-in image calls | distinct printable source art | four 1254-square sheets, 128 designs | do not regenerate without need |
| 262–269, 18:26–18:31 | Blender / repo | `refine_shrine_layout.py`, one-shot application, bounds checks, upper-shelf archive correction | two-column case group, small plush, low-table hobby placement | layout version 1; obsolete upper shelf/row archived | one-shot: guard must remain |
| 270–277, 18:31–18:34 | repo / image job | monitored result collection and four copies into project texture paths | retain generated assets | all jobs completed; no pending generation | copy sources private; use committed copies |
| 278–283, 18:35–18:38 | Blender / repo | component mapping, unique assignments, six-sample proof, remaining 120 assemblies | unique art on all 126 stands | 126 mappings / 126 IDs | supply manifest on every contour replay |
| 284–285, 18:39–18:40 | Blender | Rubik scale adjustment, table proof | reduce oversized cube and inspect staging | cube about 59 mm; table image still lacked final yoyo fix | image intermediate |
| 286–288, 18:41–18:42 | Blender | inspect world bounds and `Skill toy yoyo cotton string`; repair body placement and tether | fix body/string separated in world space | tabletop support at z 0.3845001757 | exact one-off repair in appendix 288; do not double-apply |
| 289–290, 18:43 | Blender | evaluated mesh/manifold and case-side bounds scans | verify acrylic topology and fit | no degenerate/invalid closed assemblies in scan, no side-Y penetrations | full 3D container acceptance still missing |
| 291–295, 18:45–18:47 | Blender | four frame UV remaps; shrine proof; physical clear-case material; Cycles proof | remove neighboring-cell fragments and correct transparency | clear shader set; white proof-light reflection obstructs left cases | do not fake clarity with matte/alpha wash |
| 296–302, 18:48–18:52 | Blender / repo | save → physics → inspect sinks/string/cup → `refine_shrine_contacts.py` | fix actual support/contact failures | ticket/cup moved, 72 case assemblies raised, kendama tether rerouted | current scripts omit some one-off edits |
| 303, 18:52:56 | Blender | `bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)`, then isolated exec of `physics_audit.py` | save corrected source and inspect | floating 20, wall 11, intersections 70; sinks/drift/curve hits 0 | serialize; source saved |
| 304, 18:53:12 | Blender | isolated exec of `audit_scene.py` | refresh structural inventory | 2452 audited objects, 392092 renderable triangles | writes audit JSON |
| 305 / 307, 18:53–18:54 | Blender | isolated exec of `export_room_web.py`, then wait for completion | export corrected model | export completed; wrapper returned set and caused error | verify output before repeating |
| 308, 18:55:11 | Blender then repo | inspect raw GLB and temporary collection; `node assets/room/strip_unused_uv.mjs assets/room/room-web-current.glb assets/room/room-web-lean.glb` | confirm actual export and remove unused channels | 74 channels removed; 1,418,860 bytes saved | strip rerun deterministic for unchanged raw |
| 309, 18:55:41 | repo | `cp assets/room/room-web-lean.glb apps/astro/public/models/room.glb` | local runtime asset synchronization | exit 0; later hash equality proven | overwrites only exact public target |
| 310, 18:55:51 | repo | `node tools/room-harness/build/check-build.mjs --json` | aggregate gate | exit 1, two failures below | read-only; expected checkpoint failure |
| Handoff, from 18:57 | repo / native | canonical record + full skill read; current-session tool extraction; fresh Git/native/hash/gate checks; existing proof views | build reliable intern handoff | latest facts distinguish dirty live/source/export | no model fixes |
| Commit request / 19:09 | native | `bpy.ops.wm.save_as_mainfile(filepath='/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/checkpoints/room-shrine-handoff-20260910.blend', copy=True)` with exact-path/existence assertions | preserve unsaved live state | FINISHED; original filepath and source bytes retained | NEVER overwrite existing recovery copy |
| Checkpoint finalization | repo | integrity manifest, staged scope/secret scan, scoped local commit | lock progress for intern | commit identity obtained from Git, not guessed in this document | no push; no release claim |

The appendix extraction itself uses `tools/room-harness/handoff/extract-actions.mjs`: only the explicitly selected current-project session, with a cutoff immediately before the handoff request. No Claude/private older sessions were opened. The older `docs/HANDOFF_2026-09-10.md` was read fully as an existing project artifact, not rewritten or copied wholesale into this checkpoint.

## 5. Methodology and decision record

### Connection and evidence chain

The initial error was a missing Codex execution host, not a Blender modeling defect. Once execution recovered, the installed official addon and the exposed client implementation did not match. A listening socket and even an established TCP connection were insufficient proof. Provider inspection and the owner-supplied official Blender Lab source identified the correct local `uv` server; after configuration/reload, the canonical native filepath and scene calls responded. Repeated manual connection questions had not established that distinction. This is resolved; do not make the intern repeat it.

Large native screenshot payloads failed JSON parsing. Detailed proof therefore used native renders saved directly into the project and direct image inspection. Do not substitute tiny MCP thumbnails, guessed cameras, file existence, or shader settings for visible proof.

### Mouse

- Baseline: plain oval/ellipsoid, poorly placed features, about 7.77 mm above the actual desk surface. The brown protective mat in the photo is a floor/chair mat, not a mousepad.
- Read the actual desk photo and accepted PC atlas, inspected the live mouse and parent transforms, then retained its original pivot and `roomTarget=projects`.
- `refine_mouse.py` builds asymmetric shell/thumb rest, grip, knurled upper/thumb rollers, recessed button channels, side/mode buttons and underside skates. The mode-button position uses evaluated-shell ray intersection.
- Original geometry was preserved in hidden `Room mouse before refinement`, outside the export source. Helpers remain hidden and must stay excluded.
- Intermediate seam protrusion and buried control were corrected. Useful proof: oblique, front, top and the corrected contact-side image. The first side image is unusable.
- Previously measured skate contact is 0 mm; shell clearance about 1.2572 mm. This is mouse-contact evidence, not full desk fidelity.

### Unique artwork and contour geometry

- The initial atlas had 16 repeating designs. Geometry variation alone did not satisfy individual uniqueness.
- Four built-in image generations produced 32 distinct adult, faceless full-body illustrations each: contemporary fashion, pastel concert costumes, formal/tailored outfits, and Japanese-inspired seasonal/robe fashion. Full prompts are in `assets/room/textures/acrylic-unique-prompts.json`.
- Requested 2048-square sheets actually arrived 1254×1254. Geometry code asserts the actual dimensions. Sheets a/b/d have transparent backgrounds; c is opaque white. Masks use alpha when present, RGB foreground threshold otherwise.
- `map_unique_acrylic_artwork.py` finds 4-neighbor connected foreground components, rejects tiny fragments, orders the 32 components per sheet, and stores exact pixel bounds. The mapping has 128 components. `acrylic-unique-assignments.json` maps 126 named assemblies to distinct IDs, interleaving a/b/c/d. c-32 and d-32 are unused spares.
- Inventory: 124 visible `Idol ... print` objects plus two `Desk end rack stand ... print` objects. Both print and plate store artwork IDs, so a naive scan of all tagged objects returns 252, not 252 stands. Filter visible names ending in ` print` for the 126-stand uniqueness check.
- Current `refine_acrylic_contours.py` takes `ACRYLIC_FAMILY`, `ACRYLIC_ARTWORK`, and optional `ACRYLIC_PROFILE_SCALE`. **Omitting ACRYLIC_ARTWORK selects the old repeating atlas.**
- Originals are independent mesh copies in hidden `Room acrylic before refinement`. For objects backed up after layout, `roomShrineOriginalMatrix` restores the pre-layout basis; otherwise later offsets would be applied twice.
- Largest-component extraction prevents a neighboring arm entering the contour. Two-pixel morphological close joins tiny discontinuities. The traced outer boundary is simplified with 2.4 px ink / 3.0 px clear tolerances. Earlier finer outlines exceeded sector budgets.
- Preserve original stand height times profile scale and artwork aspect ratio. Clear border target is about 0.65 mm. Printed insert retains original approximately 0.9 mm thickness; plate approximately 2.25 mm. No generic head caps are restored.
- Blender 5.2 tessellation behavior differed from the initial assumption. Current code uses constrained `delaunay_2d_cdt` with epsilon 1e-7, builds closed front/back/side faces and checks zero-area polygons.
- Bases use 32 segments and three rings with a 0.2 mm top chamfer. The slot is a real EXACT Boolean difference, then WELD at 1e-7. Cutters are hidden but remain modifier dependencies; don't delete them.
- Cutter world matrix resets to identity before the stored placement offset is reapplied. `roomAcrylicPlacementOffset` is required to preserve the widened-case/open-bay moves after regeneration.
- Front `Idol u2r3 r6` profile scale is 0.58 so it does not conceal elevated rows. Case stand profile scale is 1.0.
- Native scans found zero degenerate faces and closed evaluated print/plate/base meshes in the inspected population. Sector counts: 41,552 stand triangles and 66,948 contents triangles at that scan. Global latest audit is 392,092.
- The legacy property `roomAcrylicAtlasCell` is not globally unique for the four-sheet layout. Use `roomAcrylicArtworkId` plus assignment manifest.
- Contour clear material: `Room/AcrylicClear contour`; unique print materials: `Room/AcrylicPrint unique a/b/c/d`. Four generated images are packed and retain project-relative texture paths.
- Six-assembly gallery is actual copied/evaluated geometry, not an image-only mock. It proves a sample's contours/materials, not all cabinet placements or every print's UV correctness.

### Two-column shrine

- Cases comprise three clear-case columns by two vertical levels; the whole group spans two adjacent furniture shelf columns, not two vertical shelves.
- Live/model coordinate span Y = 0.710062866..1.633624762, rear X about 3.2305, depth about 0.300 m. Do not confuse model Y with left-to-right screen direction: room-facing proof reverses the shelf order.
- Case structure was stretched in X/Y, while artwork/content assemblies were translated by base-anchor mapping, not stretched with the cases.
- A shared 11 mm shelf cap bridges the two furniture columns. A leveling support fills the middle cabinet height difference. Structure mapping used the lowest frame bound so the frame rests on the shared cap.
- Case lid top is about z 1.651640654. Orange shelf mascot scale factor 0.40; cream factor 0.32. Approximate final dimensions: orange 0.087×0.12817×0.08317 m; cream 0.072×0.14457×0.04446 m. Lowest mesh points rest on the case lids.
- Four photo frames moved onto the case lids. Their prints later received UV cells 3/5/9/15 from the original atlas with inset margins. This fixes neighboring-cell leg fragments appearing above heads.
- The former upper-right open display `Idol u2r4` and its risers moved onto the left bookcase's top in floorplan coordinates. Its stored offset is approximately Y -0.99375 / Z -0.298875.
- 55 obsolete objects were hidden recoverably: the tall back extension, upper board, mesh strip 13, and 52 `Magazine run 5-` books. No corresponding source datablocks were deleted. Two tall uprights were shortened from their floor anchors to the new cap support level. Original matrices remain stored.
- Physical case shader now `Room/Case clear polished`: alpha 1, transmission 1, roughness 0.025, IOR 1.46. This exact name fails the current build contract. Planned narrow repair: rename it to `Room/AcrylicClear case polished`, preserving the shader. This has NOT been done.
- Current Cycles proof contains a large white disk-like reflection from a temporary area light across the left cases. This is obstructed proof. Move proof lights out of the reflected camera direction; don't cloud the acrylic to hide it.

### Low-table props and contact corrections

- `Low hobby table top`, parent `Layout floor table`: X about 1.680..2.280, Y 0.2969..0.8969, top Z 0.384500176.
- Staged centers: kendama (1.77,0.78), yoyo (1.94,0.80), cardistry (1.77,0.43), penspinning (1.975,0.405), Rubik (2.16,0.78). Root transforms preserve world matrices and reparent to the table layout. Keyboard and PC equipment stay where they were.
- Rubik core/stickers were reduced by 0.5 to about 59 mm. `roomTarget=rubik` retained. The build-plan anchor still points at the PC desk; the owner-authorized table placement is not a geometry failure.
- Existing `Playing card deck/fan 1–3` were already on the table. The two pink decks in the intermediate proof are existing cards plus the moved cardistry set, not an accidental render duplicate.
- Yoyo body and pre-existing string had widely separated world heights. Initial group-bound placement left the body floating outside the table image. Native one-off repair moved the visible yoyo meshes to the tabletop and replaced `Skill toy yoyo cotton string` data with `Yoyo tabletop connected tether`: 12-point Bezier, 0.25 mm bevel, resolution 12, bevel resolution 2. Exact code is appendix call 288.
- **The yoyo one-off repair is in the saved source/recovery copy and appendix, not in refine_shrine_layout.py or refine_shrine_contacts.py.** Frame UV correction and case-material correction likewise include one-off native work. The current .blend is the continuation authority; these scripts are not a complete room reconstruction pipeline.
- `Desk pen cup noodle body/band` plus noodle pens moved from the open shelf to table center (2.18,0.39). The original PC pen cup and desk pens remain on the PC desk.
- `Event ticket` and `Ticket print` moved from a case-support collision to the album-stack top at (1.94,0.596). Event target retained.
- 72 case assemblies were raised approximately 1.5 mm to actual support surfaces. r3 uses the rear step; r1/r2/r4 use the case floor. Stored placement-offset Z was updated so contour reruns do not undo contact.
- Kendama tether was rerouted toward the table back to avoid the existing playing cards.
- Before correction, physics reported 96 intersections, one sink, one curve hit. After final saved corrections: 70 intersections, zero sinks/curve hits/collider drift. Floating 20 and wall-penetration 11 remain raw warnings. The check-build assembly filter does not independently certify every pair.

### Evidence and export

The strict production sequence is source save → physics audit → scene audit → native GLB export → UV removal → exact public copy → check-build → inspect actual visible proof. Temporary proof lighting is excluded from the production save.

`export_room_web.py` evaluates visible `RoomHome` meshes/curves/fonts, applies world matrices, preserves interaction/curtain/closet/navigation extras, groups compatible objects, includes lights, and exports selected GLB. It cleans the temporary collection and restores selection. It does not return a dictionary: `result` is an operator set. Wrap it explicitly at the MCP boundary.

No current browser verification, Astro build, CI, deployment or owner approval was performed for this slice. Old browser images and older hashes in the historical record cannot be used to close those requirements.

## 6. Files and artifacts

Every selected checkpoint path is enumerated in `artifacts.json`; final bytes are locked by `checkpoint.sha256`. The following gives purpose, provenance, changes and continuation rules for each category.

| Exact path or explicitly enumerated set | Role / before → after | Verification | Ownership | Resume |
| --- | --- | --- | --- | --- |
| `assets/room/room.blend` | inherited room → mouse/shrine/table corrections through 18:52 save | hash, native state, audits, scoped proofs | inherited asset modified by lead | primary baseline; preserve |
| `assets/room/checkpoints/room-shrine-handoff-20260910.blend` | absent → non-overwriting live recovery snapshot | native FINISHED and hash | lead checkpoint | review-only recovery copy; root-path trap above |
| `assets/room/room.blend1` | automatic Blender backup | not independently qualified; not selected for commit | application-generated | leave local; don't substitute for known checkpoint |
| `assets/room/room-web-current.glb` | older export → 35,799,544-byte raw export | native metadata and hash | lead-generated from inherited scene | regenerate only after controlled save |
| `assets/room/room-web-lean.glb`; `apps/astro/public/models/room.glb` | older bytes → synchronized 34,380,684-byte model | matching SHA256 | lead-generated | not browser proof |
| `assets/room/refine_mouse.py` | absent → final mouse refinement script | applied, geometry/proofs | lead-authored | preserve backups, parent handling and helper visibility |
| `assets/room/refine_acrylic_contours.py` | absent → contour/slot/UV implementation | native 126-assembly run, topology scan | lead-authored | manifest mandatory; don't call bare defaults |
| `assets/room/refine_shrine_layout.py` | absent → bounded one-shot layout | layout version 1, source inspection | lead-authored | do not bypass already-applied assertion |
| `assets/room/refine_shrine_contacts.py` | absent → support/ticket/cup/kendama repair | final physics | lead-authored | recreates curve data; needless replay adds orphan data |
| `assets/room/map_unique_acrylic_artwork.py` | absent → component manifest builder | 128 components | lead-authored | needs existing Blender images; regenerates metadata |
| `assets/room/render_detail_proof.py` | mouse-only script renamed/generalized → native contextual proof | mouse/shrine/table PNGs | lead-authored | temp scene state restored; still marks dirty possible |
| `assets/room/render_acrylic_detail.py` | absent → isolated assembly/gallery renderer | six sample and earlier 16-gallery | lead-authored | measure after view-layer update; copies modifier cutters |
| `assets/room/export_room_web.py`; `assets/room/strip_unused_uv.mjs` | existing pipeline; unchanged in this slice | full earlier reads and actual execution | inherited dependencies | exact serial cookbook below |
| `assets/room/textures/acrylic-unique-{a,b,c,d}.png` | absent → four generated sheets | visually inspected during generation; packed/native mapping | lead-directed built-in imagegen | retain canonical copies; not regenerated casually |
| `assets/room/textures/acrylic-unique-prompts.json` | full generation prompts | source persisted before generation | lead-authored | describes every intended figure; actual files win for geometry |
| `assets/room/textures/acrylic-unique-map.json` | component bounds and pixel counts | native mapping output | lead-generated | 128 components |
| `assets/room/textures/acrylic-unique-assignments.json` | named stand → unique artwork descriptor | fresh 126 mappings / IDs | lead-generated | necessary for contour replay |
| `assets/room/textures/acrylic-insert-minimal-atlas.png` | existing 16-cell art, unchanged | packed source inspected | inherited | still used for framed prints; not new stand uniqueness source |
| Other model texture paths individually listed in `artifacts.json` | existing scene dependencies, unchanged | fresh native path/packed inventory; paths exist | inherited | included to avoid missing dependencies |
| `assets/room/minimal-shelf-spine-atlas-polished-20260908.png` | existing packed shelf texture | native dependency inventory | inherited | do not replace |
| `tools/room-harness/build/{physics_audit.py,audit_scene.py,check-build.mjs,build-plan.json,render_proofs.py}` | existing harness dependencies | read/used; contract failures documented | inherited, not newly authored here | do not adopt historical CLI instructions |
| `tools/room-harness/build/{physics-latest.json,audit-latest.json}` | latest saved-source measurements | source time/hash and gate | lead-generated | source changed → both need regeneration |
| `AGENTS.md` | existing rules plus native-provider correction and handoff direction | full current read | mixed prior/lead | project operating authority |
| `conductor/{CURRENT_TASK.md,room-model-design-spec.md,room-reference-map.md,room-spec.md}` | live index changed; specifications preserved | source coverage below | inherited requirements; lead updates live record | build-anchor conflict intentionally not silently rewritten |
| `apps/astro/public/room-concept/room-item-atlas-{pc-keyboard,shelf-collection}.png` | accepted visual aids, unchanged | inspected earlier against originals | inherited | source photos outrank generated interpretation |
| `docs/HANDOFF_2026-09-10.md` | older 16:05 handoff, unchanged/local historical artifact | read 1–240 | earlier agent | contains obsolete CLI/current-state claims; not intern execution authority |
| This handoff; `docs/room-model-handoff-2026-09-10/{actions.md,artifacts.json,checkpoint.sha256,verification.json}` | absent → operational checkpoint pack | post-write checks and commit manifest | lead-authored/generated | start here; do not ingest unrelated notes |
| `tools/room-harness/handoff/extract-actions.mjs` | absent → bounded action-ledger transformation | executed against exact selected log only | lead-authored | optional audit utility; not required for model continuation |

Native image-dependency check found three unpacked but existing files: `assets/room/textures/desk-group-poster.png`, `monitor-forest-wallpaper.png`, and `residential-day-panorama.png`. These are included explicitly. Other used file images are packed; canonical external copies are also retained where present.

### Proof inventory

All paths below are under `tools/room-harness/evidence/build/`. Each is individually listed and hashed in the checkpoint pack.

| Files | What they prove / why they do not close acceptance |
| --- | --- |
| `mouse-before-oblique.png` | original plain-mouse baseline |
| `mouse-refined-oblique.png`, `mouse-refined-front.png`, `mouse-refined-top.png`, `mouse-contact-side.png` | useful refined shape/control/contact views |
| `mouse-refined-side.png` | invalid blue/occluded view; NEVER final evidence |
| `acrylic-before-oblique.png`, `acrylic-detail-before.png` | original generic-profile baseline |
| `acrylic-contour-oblique.png`, `acrylic-detail-contour.png`, `acrylic-detail-contour-corrected.png`, `acrylic-detail-slotted.png`, `acrylic-detail-verified-insert.png` | prototype iterations, superseded artwork/geometry details |
| `acrylic-loaded-atlas.png` | loaded original raster atlas, not model proof |
| `acrylic-detail-sixteen-contours.png`, `acrylic-cabinet-contours-oblique.png` | old repeating-art contour tests, superseded |
| `acrylic-full-bay-front.png` | foreground stands concealed rear tiers before scale reduction |
| `acrylic-tiered-bay-front.png` | reduced front row, old 16-art version |
| `acrylic-upper-bay-front.png` | exposed oversized cream plush before latest correction |
| `shrine-two-columns-front.png` | first widened-case arrangement, before final unique art and contacts |
| `acrylic-detail-unique-artwork-sample.png` | six actual distinct assemblies; not all-126 UV proof |
| `shrine-unique-two-columns-front.png` | unique-art shrine, smaller plush, case span, corrected frame UVs; old case shader and cup still on shelf |
| `shrine-clear-case-cycles-front.png` | actual physical transparent case shader; large temporary-light reflection obscures left cases; cup still on shelf |
| `hobby-table-staged-oblique.png` | intermediate table layout; predates repaired yoyo, relocated cup/ticket and final tether/contact fixes |

The last three images were reopened during handoff. Visible observations: six clear case bays sit across two furniture columns; small plush sits among framed objects; distinct contour prints are visible; a large white disk reflection blocks the left case region in the Cycles image; table image shows cube/kendama/cards/pens/albums/crate but not final yoyo/cup/ticket placement. None is claimed as final unobstructed proof.

Original references remain read-only, local and deliberately excluded from Git: `tools/room-harness/evidence/reference-archives-20260908/archive-1/PXL_20260908_033233767.jpg` (desk/mouse), `PXL_20260908_033318171.jpg` (room/shelves), `PXL_20260908_033114085.jpg` (stands), `PXL_20260908_033111450.jpg` (clear cases, despite incorrect PC-desk label in model spec), plus the previously inspected `051921621` shelf detail in the reference set. Intern must use the existing workspace reference copies; if absent on a new machine, obtain the owner-approved source package rather than substituting generated art.

# PART III — EVIDENCE, FAILURES, AND HONESTY

## 7. Verification matrix

| Claim | Required layer | Exact evidence | Current result | Still unverified |
| --- | --- | --- | --- | --- |
| Native connection usable | native application | fresh execute response, filepath, Blender version; listener 9876 | verified | no new setup needed |
| Saved progress recoverable | disk/native/Git | source + recovery copy hashes; native save-copy FINISHED; checkpoint manifest | locked by local commit | recovery-copy scene equivalence to baseline not asserted |
| Distinct stand assignments | manifest + native scene | 126 assignment records, 126 visible print IDs | verified | every individual UV/visual silhouette at cabinet scale |
| No degenerate contour assemblies | evaluated geometry | appendix 289 | scanned population passed | full unrelated room topology |
| Case spans two adjacent furniture columns | geometry + direct image | one-shot layout, shared cap, shrine front image | implemented and visible | final unobstructed material/contact proof |
| Plush size/support | geometry + image | factors/dimensions, case-lid bounds, shrine front | reduced and integrated | owner acceptance |
| Table placement | native scene + image | current bounds, contacts source, intermediate table image | geometry applied | current final table render |
| Contact gate | native audit + harness | `physics-latest.json`, fresh check-build | sinks/drift/curves 0 | floating 20, wall 11 and all raw pairs disposition |
| Full build contract | harness | `node tools/room-harness/build/check-build.mjs --json` | FAIL, 2 items | see section 8 |
| Triangle/object budgets | harness | 392092/450000 tris; 2062/2400 renderables | pass | runtime load and frame-time |
| Export parity | disk hash | lean and public SHA256 identical | verified | browser render/decode/material behavior |
| Model visual acceptance | current native renders + references + owner | existing proofs with limitations above | incomplete | final shrine/table proofs and approval |
| Entire room/spec | item-by-item native/browser evidence | broader requirement ledger | unfinished | other model details, runtime, interactions, content and final review |
| Browser/CI/deploy/build | actual respective runtime | none from this slice | not run | no substitute claim |
| Commit integrity | Git tree + manifest | section 13 post-write receipt | checkpoint, not release | model failures intentionally remain |

## 8. Failures, traps, and rejected approaches

| Failure | Exact symptom / evidence | Cause and disposition | Recovery / do not repeat |
| --- | --- | --- | --- |
| Execution host missing | `failed to spawn code-mode host /opt/homebrew/Caskroom/codex/0.153.4/bin/codex-code-mode-host: No such file or directory (os error 2)` | harness failure before tools ran; repeated blocked-status calls also failed | historical and recovered; no Blender reinstall inference |
| Wrong MCP implementation | `Error getting scene info: Could not connect to Blender. Make sure the Blender addon is running.` despite later listener/established socket | ahujasid client versus official Blender Lab addon | use correct local uv server; confirm actual native response |
| Screenshot JSON truncation | `Unterminated string starting at: line 1 column 61 (char 60)` | large image response | native file render + direct image view; tiny screenshots not detail proof |
| Wrong result type | `The result variable must be a dict, not set` (tool message uses code formatting around result) | operator set leaked through export wrapper after export completed | wrap in dict; inspect file/stat/temp cleanup before rerun |
| Fresh namespace | omitted bpy import / clobbered result locals | each native exec isolated; scripts reuse generic locals | import explicitly; use separate ns dictionaries |
| Wrong tessellation assumption | attempted Vector operations on index triples; zero-area faces | Blender 5.2 behavior and collinear pixel contours | constrained CDT, weld, area and manifold checks |
| Atlas crop leakage | neighboring arm fragments / chopped shapes | broad fixed cell/crop rather than actual component | largest connected component + measured bbox |
| Blank gallery | copies existed but proof framed incorrectly | bounds read before dependency update | update proof view layer before measuring |
| Geometry overbudget | overly dense outline/base bevel | fine tolerance and modifier topology multiplied across many stands | validated 2.4/3.0 px tolerances, baked 32-segment rim |
| Duplicate artwork | 112 stands reused 16 prints | geometry-only uniqueness was insufficient | four unique sheets + manifest, not random resizing |
| Double relocation on regeneration | offset applied on an already moved backup/cutter | post-layout original matrix or unreset cutter basis | preserve original matrix and reset cutter identity |
| Oversized plush / hidden tier rows | old upper/full-bay images | large mascot and front-row scale | reduced plush; r6 scale 0.58 |
| Yoyo missing in table image | body remained elevated while group bbox contacted table | disconnected body/string world bounds | appendix 288 repairs actual meshes and connected tether |
| Cup/ticket/case bases/tether contacts | one sink and one curve hit, many pairs | stale shelf positions and 1.5 mm base support offset | contacts script plus final saved audit |
| `PC-RUBIK` | `2/2 outside floorplan anchor (Desk Rubik cube core, Desk Rubik stickers)` | plan still has PC anchor [0,60,140,320], tolerance 60; latest owner permits table | reconcile owner placement explicitly into authoritative model/build contract; do not move back merely for green |
| `ACRYLIC-CASE` | `no material matching Display acrylic\|Clear acrylic\|Room/AcrylicClear` | new physical material named `Room/Case clear polished` | planned namespace rename `Room/AcrylicClear case polished`; preserve physical shader |
| White circle obscures cases | current Cycles proof | temporary area-light reflection | move proof lights out of specular camera direction; don't change acrylic to matte |
| Save-copy path hazard | checkpoint under extra `checkpoints/` directory | source scripts derive root from saved filepath parents | keep primary file active; don't run scripts from recovery copy |
| Historical handoff authority | old CLI-only instructions, old hashes and review claims | older session/environment | current project native-only rules and this checkpoint override execution method |
| Dirty source versus disk | native dirty flag true after export/inspection | exact residual difference not proven | original saved baseline and separate live snapshot both preserved |
| Privacy in action extraction | source records include chat, encrypted messages, IDs and document contents | indiscriminate log copying unsafe | selected tool fields only, redactions, bounded excerpts, no reasoning/raw user records |
| Oversized live tracker | prior near-16 KiB record with stale claims | accumulated status | current record remains compact index; detailed history here |
| Broad staged work | entire repo already dirty | mixed prior ownership | explicit path list only; initial index empty; verify staged paths before commit |

## 9. Known limitations and blockers

1. No connection blocker remains. Blender is callable; do not ask the owner to reconnect without a fresh native failure.
2. Two contract failures are open but locally actionable when modeling resumes. Handoff/commit intentionally does not repair them.
3. Final unobstructed shrine and current table proof are missing. Existing images predate final contact moves or are reflected/obstructed. This prevents visual acceptance, not checkpoint preservation.
4. Live .blend versus saved baseline difference remains uncharacterized. Recovery copy preserves live state without losing the known export source. Do not discard either.
5. No source photos are committed. They remain local per policy. A different machine lacking them cannot claim photo fidelity until the approved references are supplied.
6. The one-off yoyo, frame-UV and material corrections make scripts incomplete as a from-scratch reconstruction system. Resume from the committed source, not by replaying every script.
7. Raw physics warnings and unrelated room detail findings remain. The older council's chair, keyboard/entry rail, camera, uchiwa, penlight, glass/book/rack findings are hypotheses until freshly inspected; do not mark fixed from old discussion.
8. Broader product runtime work is outside this checkpoint's proof: movement/pointer lock, examine overlays, curtains/time/light behavior, darts gameplay, mobile touch, multilingual route/content overlays and load performance remain in `room-spec.md`/CURRENT_TASK.
9. Browser and server operation need fresh owner scope. Do not start a dev server to close this handoff.
10. Disk is tight. Retained outputs are explicit task artifacts; do not delete original photos or user caches to make room.
11. No immutable file permissions or system locks were installed. The Git commit and hash manifest are the progress lock; normal future edits remain possible and detectable.

# PART IV — RESUME WITHOUT REDISCOVERY

## 10. Immediate next action

In `/Users/vittayapalotai.tanyawat/code/ham-san.net`, run this single read-only command:

```sh
shasum -a 256 -c docs/room-model-handoff-2026-09-10/checkpoint.sha256
```

Expected: every listed checkpoint path reports OK. A mismatch is not permission to reset or overwrite; inspect the exact differing path and compare against the checkpoint commit. Preserve live owner edits. After integrity passes, inspect native filepath/dirty state using section 12. Never automatically open another .blend over a dirty scene.

The checkpoint commit can be identified without a self-referential hash embedded in its own tree:

```sh
git log -1 --format='%H %s' -- docs/HANDOFF_2026-09-10_SHRINE_MODEL.md
```

## 11. Remaining ordered work

1. Verify checkpoint hashes, current native filepath, dirty state and no temporary export collection. Stop on unexplained drift; compare exact artifacts before any mutation.
2. Reopen the current physical case material and build-plan `PC-RUBIK`/`LOW-TABLE` entries. Current table anchor is [665,140,825,300], tolerance 50; calibration comes from floor mesh bounds, not assumed meters. Document the explicit owner-directed Rubik relocation as contract reconciliation; preserve stable target ID. Do not silently weaken a check.
3. On renewed modeling authority, rename the clear case material to the compatible `Room/AcrylicClear case polished` namespace without changing shader values. Update the conflicting Rubik anchor/spec through the project requirement route. Stop if new evidence contradicts the settled two-column/table directions.
4. Save source and run the entire serialized save/audit/export/strip/copy/check chain. Expected: both named failures gone without introducing others; keep raw warnings separate. Do not claim full-room physics from the gate's assembly exclusion.
5. Render final shrine front and oblique using the current scene, temporary lights out of specular reflection, and clear readable exposure. Keep camera matched for before/after. Verify case span, plush support, tier readability, framing, no neighboring-cell UV fragments and all object boundaries.
6. Render final table with repaired yoyo/tether, cup, event ticket and kendama. Verify every prop is on the table/album support, within footprint, visibly distinct and retains its target. The existing table PNG is not sufficient.
7. Inspect all 126 print assignments and cabinet UVs/contours, plus full 3D case containment, not only side-Y boundaries. Retain one distinct artwork per visible stand. Compare against original source photos and accepted aids.
8. Disposition remaining source-grounded room detail findings one item at a time under resumed scope. Use actual current geometry/photo proof; don't rebuild already-present props.
9. Only when the owner requests browser verification: use the owned isolated browser and current public GLB, verify actual load/render/material/interaction behavior, then relevant existing checks with concurrency limits. No browser, server, deployment or new test creation implied by this handoff.
10. Obtain final review/owner acceptance only after current native and runtime evidence exists. Update the sole live record in place; no parallel CURRENT files.

## 12. Command cookbook

Run each shell command separately from the repository root. These are scoped tools, not a batch script.

### Read-only state checks

```sh
git status --short --branch
```

```sh
git diff --cached --name-only
```

```sh
df -h .
```

```sh
lsof -nP -iTCP:9876 -sTCP:LISTEN
```

```sh
node tools/room-harness/build/check-build.mjs --json
```

The last command is expected to exit 1 at this checkpoint with exactly PC-RUBIK and ACRYLIC-CASE. It reads stored audits; it does not refresh Blender.

### Native live check

Send through exposed `mcp__blender__execute_blender_code`, never terminal Blender/Python:

```python
import bpy
bpy.context.view_layer.update()
prints = [o for o in bpy.data.collections['RoomHome'].all_objects
          if o.name.endswith(' print') and o.get('roomAcrylicArtworkId') and not o.hide_render]
result = {
    'filepath': bpy.data.filepath,
    'dirty': bpy.data.is_dirty,
    'prints': len(prints),
    'unique_artwork': len({o['roomAcrylicArtworkId'] for o in prints}),
    'layout_version': bpy.context.scene.get('roomShrineLayoutVersion'),
    'export_collection': bpy.data.collections.get('RoomWebExport') is not None,
}
```

Expected path ends in `assets/room/room.blend`; counts 126/126; layout version 1; export collection false. A dirty flag is not permission to discard changes.

### Authorized save/audit/export chain

Only after deliberate modeling edits and source inspection; strictly one native call at a time.

```python
import bpy
assert bpy.data.filepath == '/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room.blend'
bpy.context.view_layer.update()
saved = bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
result = {'saved': sorted(saved), 'path': bpy.data.filepath}
```

Then native physics:

```python
p = '/Users/vittayapalotai.tanyawat/code/ham-san.net/tools/room-harness/build/physics_audit.py'
ns = {}
exec(compile(open(p).read(), p, 'exec'), ns)
result = ns['result']
```

Then native scene audit:

```python
p = '/Users/vittayapalotai.tanyawat/code/ham-san.net/tools/room-harness/build/audit_scene.py'
ns = {}
exec(compile(open(p).read(), p, 'exec'), ns)
result = ns['result']
```

Then native export with a dictionary boundary:

```python
import bpy
from pathlib import Path
p = '/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/export_room_web.py'
ns = {}
exec(compile(open(p).read(), p, 'exec'), ns)
out = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room-web-current.glb')
result = {
    'export_result': sorted(ns.get('result', [])),
    'bytes': out.stat().st_size,
    'mtime': out.stat().st_mtime,
    'temporary_collection': bpy.data.collections.get('RoomWebExport') is not None,
}
```

Then individual shell commands:

```sh
node assets/room/strip_unused_uv.mjs assets/room/room-web-current.glb assets/room/room-web-lean.glb
```

```sh
cp assets/room/room-web-lean.glb apps/astro/public/models/room.glb
```

```sh
node tools/room-harness/build/check-build.mjs --json
```

```sh
shasum -a 256 assets/room/room.blend assets/room/room-web-current.glb assets/room/room-web-lean.glb apps/astro/public/models/room.glb
```

### Selective contour regeneration — NOT initial resume action

Use only for a named assembly whose geometry is deliberately being changed. Load its existing manifest record first; do not call the script's default old-art path.

```python
import bpy
import json
from pathlib import Path
root = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
family = 'Idol u2r3 r3 s2'
assignments = json.loads((root / 'assets/room/textures/acrylic-unique-assignments.json').read_text())
p = root / 'assets/room/refine_acrylic_contours.py'
ns = {'ACRYLIC_FAMILY': family, 'ACRYLIC_ARTWORK': assignments[family]}
exec(compile(p.read_text(), str(p), 'exec'), ns)
result = ns['result']
```

This changes scene data but does not save. Preserve `roomAcrylicPlacementOffset` and current profile scale. Verify geometry/contact before saving.

### Proof parameters

Context renderer: `assets/room/render_detail_proof.py`; pass a globals dictionary then isolated exec. It defaults to Eevee 800×650; `PROOF_ENGINE='CYCLES'` uses 24 samples / 4 threads.

Shrine target/object: `Clear case c2 l1 front`; target (3.08,0.938,1.41); camera offset (-1.2,0,0.05); ortho scale 1.65. The prior key (-0.7,-0.4,0.5)/100 W/0.9 m and fill (-0.6,0.5,0.3)/70 W/0.8 m caused the reflected white disk. These are historical bad proof parameters, not recommended final lighting. Keep temporary lights inside the actual ceiling/room and outside the reflected viewing direction.

Table target (1.98,0.597,0.435), offset (-0.65,-0.8,0.85), scale 0.85; prior key (-0.5,-0.4,0.7)/60 W/0.75 m, fill (0.4,0.4,0.6)/30 W/0.65 m. Use a new explicit final tag, never overwrite the baseline reference/proof accidentally.

Isolated assembly renderer: `assets/room/render_acrylic_detail.py`; `PROOF_FAMILY` or `PROOF_FAMILIES`, `PROOF_TAG`; four-column gallery keeps real sizes and copies Boolean dependencies. It does not prove shelf placement.

### Recovery

- No native response: inspect exact tool exposure and correct provider configuration; do not infer addon absent from an old error or listener state.
- Export wrapper error: inspect exact raw file stat and absence of `RoomWebExport`; don't blindly rerun.
- Unexpected dirty state: preserve another uniquely named save-copy only with authority; never load/reset over the live scene.
- Hash mismatch after intentional resumed edits: preserve old manifest as checkpoint evidence and document new evidence; do not rewrite history to hide drift.
- No original photos: stop fidelity claims and obtain the approved originals; no invented substitute.
- Never use `git reset --hard`, broad `git add .`, recursive cleanup, Blender CLI, `osascript`, or server restart as a shortcut.

## 13. Handoff receipt

- Authoring began after the 18:57 JST handoff request. The later request explicitly added local commit/checkpoint authority. Model-edit production stopped before handoff; only native save-copy and documentation/integrity work followed.
- Live state verified through native MCP, disk stats/hashes, current Git/index, existing proof views and fresh check-build. Detailed machine-readable evidence: `docs/room-model-handoff-2026-09-10/verification.json`.
- Skill coverage this handoff: handing-off-pro-max 1–167/EOF; look-at-the-screen 1–60/EOF; verification-before-completion 1–120/EOF. The handoff skill required pausing new work and a full continuation document; visual skill caused direct reopening of images; verification skill requires actual staged/commit/hash checks.
- Current handoff reads: initial CURRENT_TASK 1–82/EOF; AGENTS 1–74/EOF; older handoff 1–120 then 121–240/EOF after a combined read truncated; contour script 1–323/EOF; layout 1–164/EOF; contacts 1–77/EOF; component map 1–46/EOF; context renderer 1–77/EOF; gallery renderer 1–92/EOF; check-build 1–147/EOF; export 1–78/EOF; .gitignore and pre-commit hook fully read. Large audit JSON was queried structurally, not claimed fully read.
- Earlier modeling source coverage retained from actual execution ledger: model-design-spec 1–512/EOF, reference map 1–110/EOF, physics 1–172/EOF, audit 1–105/EOF, UV strip 1–104/EOF, accepted PC/shelf aids and named originals. Broader room-spec was not fully reread by this lead; its entire product scope is not claimed audited.
- Earlier skill coverage: GYST 1–27; stop-inventing 1–79; writing-for-agents 1–81; openai-docs 1–38; imagegen 1–315 plus prompting 1–112 and sample-prompts 1–422, all recorded as EOF during the earlier work. They do not imply unrelated skill completion.
- No relevant memory entry was used as modeling authority. No prior-session logs or unrelated-project documents were inspected.
- Old handoff retained locally, not treated as a current source of runtime/process/hash truth.
- Post-write verification target: this document read to EOF; final hash manifest; selected staged-file list and secret/privacy scan; actual local commit tree; no model source/hash drift; exact two expected gate failures still recorded.
- Explicitly unverified: final unobstructed shrine/table appearance, every individual UV at display scale, full 3D case containment, all raw physics warnings, recovery/source scene equality, broader room/product fidelity, browser/build/CI/deploy and owner acceptance.
- A local commit locks this checkpoint. It does not mean the model is finished, and it does not grant the intern external-write authority.
- Final local checkpoint commands (not a request for the intern to repeat them): `git add -f --pathspec-from-file=docs/room-model-handoff-2026-09-10/commit-paths.txt`; `git diff --cached --check`; `HUSKY=0 git -c commit.gpgsign=false -c maintenance.auto=false -c gc.auto=0 commit -m "chore(room): checkpoint shrine model and intern handoff"`. The explicit path list contains no unrelated application-source changes or original reference photos. Local commit verification uses the actual Git tree and hash manifest afterward; no push is performed.

### History tranche ledger

| Tranche | Source / range | What was inspected | Durable destination | Remaining gap |
| --- | --- | --- | --- | --- |
| H0 | Exact current-project session, record lines 1–2784 at first metadata pass | record types, timestamps, lengths and call linkage; no reasoning | this receipt | metadata is not full source reading |
| H1 | Same session, lines 1–2629; 16:21:24–18:57:00 JST | selected tool calls and bounded paired outputs extracted mechanically; 25 user-message records counted but not persisted | actions.md | encrypted agent messages and omitted document/config bodies unavailable |
| H2 | Same extracted range | phase index inspected; decisive host/provider/native/mouse/acrylic/layout/yoyo/save/export/failure actions reread | sections 4–8 and action appendix | no claim that every output byte was manually reread |
| H3 | Current conversation during handoff | latest four model requirements, horizontal confirmation, handoff request and added commit authority reconciled | CURRENT_TASK + sections 1/10/11 | none for active task contract |
