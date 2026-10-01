# Room production — full handoff, 2026-10-02

Production stopped at owner request. Goal is paused, not completed. No new model edits or candidate integration occurred during wrap-up. This document records current evidence and continuation instructions; `conductor/CURRENT_TASK.md` remains the sole live index.

# PART I — TASK CONTRACT AND LIVE STATE

## 1. Task contract

Required eventual outcome: every specified room item receives its own interpreted PNG, actual model, polish and original-photo/current-render comparison; all authorized interactions work on the actual models. One item per PNG. Each plush individually. Side-by-side comparison required. Generated hidden details are interpretation, never proof of photo fidelity.

Current authority: stop production, preserve outputs and document all remaining work. No commit, push, deployment, merge, server start/stop or new model work authorized. Resume only after owner direction. Rejected candidates must not be imported merely to make the room appear complete.

Precedence: latest owner decisions and photographs, model/product specifications, current geometry and runtime evidence. Do not rewrite specifications to fit broken models or stale harness naming.

Authoritative requirements: `conductor/room-spec.md`, `conductor/room-model-design-spec.md`, `conductor/room-reference-map.md`. Original photos immutable. Confirmed room width5.05m and owner floorplan preserved: two openings on same wall, darts between them; desk/keyboard on left, shelves/display on right, entrance lower left, storage lower right. No clothes hanger; no invented faces/text/logos on generated small-object prints. Clear cases span two adjacent shelf columns; plush small among displays; hobby props may occupy low table.

## 2. Repository and working tree

| Field | Current evidence |
| --- | --- |
| CWD | `/Users/vittayapalotai.tanyawat/code/ham-san.net` |
| Branch | `dev` |
| HEAD | `82ee5ef570f24b8368fa3158535e34d6441e6416` |
| Remote/base currency | Not fetched or assessed; no currency claim |
| Dirty state | Full path list: `docs/room-handoff-2026-10-02/git-status.txt` |
| Ownership | Mixed inherited room work and current edits; do not reset/stash broadly or attribute every dirty file to this slice |
| Source | `assets/room/room-v2.blend`,16881383bytes |
| Public GLB | `apps/astro/public/models/room.glb`,17266980bytes |
| Exact public twin | `assets/room/room-v2-unique85.glb` |

Fresh source SHA256: `6eec1114f0a2e0d0ccb2eb69ac284178b28a8680060f45d356a6468b15a5bbc1`.
Fresh version85/public SHA256: `e9d97e76410d80e8b3982711d709525c78c63f94f9fc8b97732899914aac62a5`.
Hash receipt and decoded stand85 export node: `docs/room-handoff-2026-10-02/verification.json`.

## 3. Environment and operating rules

Native official Blender Lab MCP answered during handoff. Live scene `Scene.001`,1505objects; filepath empty. Saved production file above is authoritative on disk. Unsaved default Scene retained; do not destructively load/reset/restart Blender. Live dirty state recorded in `scene-inventory.json`; exact live/source equivalence is not proven by filepath or source hash.

Native `mcp__blender__execute_blender_code` only. Never `_for_cli`, Blender CLI, custom socket/client or Python MCP workaround. Result must be a dictionary. Execute edits/save/audits/export/render sequentially. Scripts deriving root from `bpy.data.filepath` require explicit production path substitution because live filepath is empty.

CPU limits:2threads,16Cycles samples for individual acrylic renders. `UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2` for compression. Last disk check12GiBfree; recheck before heavy work. Do not delete source/photos/checkpoints/caches broadly.

Port4321 has no listener at handoff. No server started. Owned `room-model-gallery` browser closed. Remaining sessions belong to other tasks and were not controlled. Browser CLI requires `AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic"` on every command, one isolated owned session, no native application URL clicks. Current headed launch/display proved unreliable: CLI success initially followed by about:blank; screenshot alone did not prove owner-visible window. Authorized `open -a` activated Chrome for Testing earlier; do not repeat without current authorization. macOS GUI automation prohibited.

# PART II — EXECUTION AND ARTIFACTS

## 4. Chronological action ledger

This records material actions in the available current-context continuation. Earlier production is indexed by project checkpoints below; exhaustive earlier command history was not reread or reconstructed.

| Phase | Exact action/command | Output/state | Replay |
| --- | --- | --- | --- |
| Gallery | `agent-browser skills get core --full`; subsequent bounded reads450–1050,1051–1700,1701–2425 | CLI core read; stub1–EOF | Read only |
| Gallery | `AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic" agent-browser session list` | Existing unrelated sessions | Safe |
| Gallery | `agent-browser --session room-model-gallery --headed open file:///Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/model-output-gallery.html` with required environment prefix | Success followed by about:blank on subsequent command | Do not count as visibility proof |
| Gallery | Reopened exact file, expanded `article details`, scrolled to fan; screenshot `assets/room/model-gallery-browser.png` | Actual fan render inspected | Requires browser authority |
| Gallery recovery | `agent-browser doctor --offline --quick`, exact session close/relaunch with `AGENT_BROWSER_HEADED=true`; `open -a` exact Chrome for Testing application and gallery file | Native application activation exited0; owner visibility not confirmed | Do not repeatedly restart |
| Stand84 | Native exact object metadata/topology check, actual six-view and input inspected, assignment registry refreshed |932tris;0topology defects;109stands/84PNGs | Read only; do not reassign |
| Stand84 | Native physics scene audit → scene audit → export wrapper with restoration | Source/public updated through compression | Export method below |
| Stand85 | Built-in imagegen, one transparent full-length silver-bob/teal-ivory figure; copied to `assets/room/art/gen/stand-85.png` | Own PNG; alpha0–254,corner0 | Already generated |
| Stand85 | Native `ACRYLIC_ASSIGNMENT={"object":"Bay r20 stand 0","png":"assets/room/art/gen/stand-85.png"}` then `exec` assign script |756tris/0boundary/nonmanifold/zeroarea; source saved | Do not rerun applied assignment |
| Stand85 | Native renderer `ACRYLIC_SPEC` object/base,production_only=True,output=`acrylic-bay-r20-0-unique85-integrated` | Actual6views + standaloneGLB | Renderer safe, costs CPU |
| Stand85 | Actual six-view image inspected; BVH against4neighbor stands |0surface hits; clear side faint; front/back print retained | Local finding only |
| Stand85 | Fresh native physics audit |233floating candidates,725AABB intersections,16sinks,0wall/drift/curve | Screening only |
| Stand85 | Fresh native scene audit |1505objects,739246renderabletris | Budget fails |
| Stand85 | Native export with shape/night/selection restoration | `room-v2-web.glb` | Source unchanged by intentional model editing |
| Compression | `UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2 bunx --package @gltf-transform/cli gltf-transform webp assets/room/room-v2-web.glb assets/room/room-v2-web-webp.glb --quality 88 --effort 20` |165.09MB→35.74MB; terminal completion observed | Foreground only |
| UV removal | `node assets/room/strip_unused_uv.mjs assets/room/room-v2-web-webp.glb assets/room/room-v2-web-stripped.glb` |550unusedUV channels removed; exit0 | Different input/output required |
| Compression | `UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2 bunx --package @gltf-transform/cli gltf-transform meshopt assets/room/room-v2-web-stripped.glb assets/room/room-v2-unique85.glb --level high` |35.69MB→17.27MB; finished output observed | Keep versioned outputs |
| Sync | Parsed GLB JSON; required exact node `Bay r20 stand 0` and revision `stand-85-individual-v1`; copied verifiedbytes to public and compared | Exact public parity | Copy only verified candidate |
| Gate | `NODE_OPTIONS=--max-old-space-size=2048 bun tools/room-harness/build/check-build.mjs --item ACRYLIC-STAND --json` |exit1,4fails | Does not refresh Blender |
| Plush discovery | Read `outputs/plush-15-review.md`; inspected `plush-15-budget-8000-side.png` | Visible side texture transition; no repair made | Immediate next production target |
| Wrap-up | Git status/HEAD, source/public hashes, native scene inventory, port4321, browser sessions | Current receipts below | No production changes |
| Stop | Closed exact owned browser; Goal paused | No task browser retained | Resume only on instruction |

## 5. Method and decisions

Acrylics use own alpha PNGs traced into closed front/back/side contour meshes,3mm thickness,0.65mm clear margin,4mm tab,0.5mm insertion into existing base. Existing transforms/base/roomTarget retained. Recovery mesh stored and old mesh fake-user preserved. Original photographs remain untouched.

`assign_acrylic_png.py` saves Scene.001 via `bpy.data.libraries.write` to temporary file then replaces `room-v2.blend`; does not destroy unsaved default Scene. Individual renderer copies evaluated actual production stand/base into temporary scene and removes generated scene/datablocks in finally. Actual six orthographic views do not establish whole-room placement/photo acceptance.

Uniqueness count comes from actual texture image paths normalized through `bpy.path.abspath`, not potentially stale custom-property strings. Prior relative/absolute mismatches and old atlas manifests gave false counts. Current registry:109stands/85distinctPNGs/24repeats.

No rejected plush or unresolved props were bulk-integrated during stop. Model presence and file count cannot establish acceptance. Existing room remains the saved continuation baseline.

## 6. Files and artifacts

Complete project-output path/size inventory: `docs/room-handoff-2026-10-02/artifacts.json` (dependency caches excluded). It enumerates standalone GLBs, renders, design PNGs, comparisons, scripts and local model outputs; multiple versions remain historical. Live scene object inventory: `scene-inventory.json`. Neither inventory supplies a complete original-room-item denominator.

| Path | State / verification / continuation |
| --- | --- |
| `assets/room/room-v2.blend` | Saved production includes stand85; native scene metadata checked; preserve |
| `assets/room/room-v2-unique85.glb`;public model | Exact twins; stand85 revision decoded; browser render not current-proven |
| `assets/room/art/gen/acrylic-live-assignments.json` |109assignments/85PNGs; actualtextures inspected |
| `assets/room/art/gen/stand-65.png` through85 | Individual replacements;73 uses `stand-73-cutout.png`; other73 variants rejected/intermediate |
| `assets/room/design-sheets/acrylic-bay-r20-0-comparison.md` |85input/actual render comparison; source and public synchronized; exported revision verified |
| `assets/room/design-sheets/acrylic-bay-r20-0-unique85-integrated.png` | Actualsixviews inspected, no visible halo; clear edge faint |
| `tools/room-harness/image-to-3d/outputs/acrylic-bay-r20-0-unique85-integrated.glb` | Standalone85actualmodel; topology verified native |
| `assets/room/assign_acrylic_png.py`;`parametric_acrylic.py` | Applied assignment and contour implementation; known limitations internal holes/disconnected pieces |
| `tools/room-harness/image-to-3d/render_parametric_acrylic.py` | Actualobject renderer; temporary scene cleanup; CPU2/samples16 |
| `assets/room/export_room_v2.py`;`strip_unused_uv.mjs` | Serialized pipeline, explicit filepath required; restore Open/night/selection |
| `tools/room-harness/build/audit-latest.json`;`physics-latest.json` | Current85saved-source audits; screening is not mesh-contact proof |
| `assets/room/design-sheets/fan-01-integrated-vents.png`;outputs/fan-01-integrated-vents.glb | Folded desk fan, grille/rotor/hinge/handle/base; native/public integrated; photo polish unfinished |
| `outputs/plush-01-review.md` through15-review.md | Individual rejection details; none accepted/integrated as finished replacements |
| `outputs/plush-15-budget-8000.glb` and front/side/back PNGs |8000tri candidate, actual side inspected; texture transition remains; don't overwrite raw/baked baseline |
| `outputs/jump-rope-01-v2.glb`;design-sheets/jump-rope-01-comparison.md |6668tris/3meshes, cleaned crossing; regular coil/dimensions interpreted; integration pending |
| `outputs/pen-holder-01*`;design-sheets/pen-holder-01-comparison.md |156tri clear candidate; overlayreviewonly; proportions/integration pending |
| `outputs/sombrero01-review.md` |3248tri openfold candidate; gaps/angular tips unaccepted; integration pending |
| `assets/room/design-sheets/README.md` | Individual input index incl.plush01–35drafts; draft presence not acceptance |
| `assets/room/model-output-gallery.html`;model-gallery-browser.png | Historical gallery336GLB versions/685renders at creation; later85andexports not indexed; not interactive3Dviewer |
| `conductor/room-model-checkpoints.md`;room-books-fidelity.md | Applied one-shot scripts and earlier model proof index; do not blindly replay |
| `apps/astro/src/components/home/room-play-physics.ts`;room-play-props.ts | Kendama/juggling/penlights/cardistry/pen spinning code added; actual runtime unverified |
| `room-play.ts`;room-runtime.ts`;room-copy.ts` in same folder | Session registration, movement/pointerlock and en/ja/thcopy; browser verification pending |
| `docs/HANDOFF_2026-09-10_SHRINE_MODEL.md` | Historical method/constraints; its126counts/hashes/scene/provider permission are stale; do not use as current truth |
| `room-v2-web.glb`;room-v2-web-webp.glb`;room-v2-web-stripped.glb` | Current85intermediates retained because stop arrived; disposable only after verified source/public parity and owner-scoped cleanup |

Paths beginning `outputs/` above mean `tools/room-harness/image-to-3d/outputs/`.

# PART III — EVIDENCE AND FAILURES

## 7. Verification matrix

| Requirement | Evidence | Current result | Remaining |
| --- | --- | --- | --- |
|85unique acrylic inputs | Actualtexture registry |85/109;24repeats | Remainingnamedstands, original identity/optics |
| Stand85mesh | Native756tris,0topologydefects,6actualviews,4neighborBVH0 | Saved/integrated | Fullshelf placement/optics |
| Public85parity | Hash+decodedexactnode | Verified | Browser decode/render |
| Plush01–35 | Own drafts;01–15actualcandidate families/reviews |0finished replacements accepted/integrated | Geometry/cloth/embroidery, allremainingactualmodels |
| Fan | Own input/actualmodel/reargrille/vents | Integrated | Angularlip/color/material/photoacceptance |
| Everyroomitem | Specs+photos+comparisonindex | Incomplete; totaldenominator not established | Exhaustive original-item reconciliation |
| Trianglebudget | Freshsceneaudit |739246/450000 FAIL | Optimizeactualgeometry without detailloss |
| Bounds | check-build | Stagefloor/back FAIL | Reconcile export-excludedBlockout with verification scope; no silentweakening |
| Physicalcontact | FreshAABBscreening |233float/725pairs/16sinks; meshproofmissing FAIL | Actualevaluatedmeshcontact/support disposition |
| Acrylicmanifest | check-build |0/120expected FAIL | Obsoleteobject/materialmapping; inspectactualinventory and issue-route |
| Playability | Sourcecode | Not currentbrowser-proven | Happy/miss/retry/reset/exit, desktop/mobile, en/ja/th |
| Whole-roomappearance | Historicalrenders | Not accepted | Currentmatched-camera room/shelf/topview comparisons |

## 8. Failures and traps

- Sequential acrylic variants and per-item full exports displaced unfinished plush/every-item work. Do not mistake bounded acrylic progress for room completion.
-336galleryGLBs are versions/recovery/rejected candidates, not336completeditems. Whole-roompercent unavailable; never invent a denominator.
- Old126atlas mapping matches none of currentCase/Bayobjects. Do not apply it; current109stands/85PNGs is the actual count.
- PNGviewer may display hidden RGBglow under alpha0. Check alpha and actualmaterialrender before needless regeneration.
- `AUDIT_SCOPE` must be `scene`: absentRoomHome collection produces falsezeroaudits. Livefilepath empty requires explicitsource substitution.
- Shape/Open and backdrop visibility/selection must restore in finally afterexport. Prooflights must not save into production.
- Meshopt warned about out-of-rangeTEXCOORD_0 and skipped quantization for thosechannels; don't treat warning as failedexport or UVfidelityproof.
- TripoSRraw meshes nonwatertight, mergedgarments/falsefeet/smoothcloth; terminalteardown sometimes stalled and wasinterrupted. Oldhandle is not anactivejob. Never blindrestart/modeloverwrite.
- Plush15bake/export crash cause unproven. Prior guardedharness amendments weren't rerun; avoid staleUVpointers, capture reports beforeexport, verify reimport.
- Browserlaunch success and screenshot did not establish owner-visiblewindow. Exactownsession closed; don't touch unrelatedsessions.
- One-shotmodel scripts already applied: curtain topology/cloth/drape/clearance, bluecurtains, rackcontacts, entryframe, fan/refinements, shrinelayout. Readcheckpointindex and guard before anyreplay.

## 9. Limitations and blockers

No nativeBlenderconnectionblocker at handoff. Production stops because ownerrequestedstop, not technicalimpasse. No completeper-itemacceptanceledger,0finishedplushreplacementsintegrated,24repeatedacrylicinputs,unintegratedprop candidates and4globalgates remain. Public asset proves localbytes, not runtimebehavior. Browserverification requires renewedownerrequest; serverstart remains unauthorized. Originalhiddengeometry unobserved and interpreted; no literalphotoperfectclaim.

# PART IV — RESUME WITHOUT REDISCOVERY

## 10. Immediate next action

Only after ownerresumes: from repositoryroot, verify threecurrenthashes against `docs/room-handoff-2026-10-02/verification.json`, then make native readonlyscene check. Preserve anydrift; neverreset. Inspect `outputs/plush-15-budget-8000-side.png` and original `assets/room/design-sheets/plush-15-source-crop.jpg`; repair actualfront/sideclothtransition in a separatecandidate withmatchedcamera proof beforeintegration. If currentcandidate differs, preserve andinspectit beforechoosingrepair.

## 11. Remaining ordered work

1. Reconcile every required item against the room specifications and original photographs. Preserve owner removals. Distinguish physical items, mesh parts and output versions. Record each item's PNG, model, comparison, integration and interaction status; the complete denominator is still missing.
2. Repair plush 15's visible front-to-side material transition. Start from the saved 8,000-triangle candidate, preserve front embroidery, and produce a separate candidate. Compare actual front, side and back views against the original crop. Check topology, UVs, budget and portable GLB reimport before integration.
3. Resolve plush 01–14 defects listed in their individual reviews. Plush 16–35 still need actual models. Inspect each separately, place accepted models at appropriate display scale, verify support and case containment, and render the current room context. No finished plush replacement has been accepted or integrated.
4. Finish the sombrero, jump rope and pen holder candidates against originals, then integrate their actual geometry into the room with contact and roomTarget checks. Inspect the artifact inventory for other required props that remain standalone.
5. Replace the remaining 24 repeated acrylic inputs individually: Bay r20 stands 1–4; r21, r22, r23 and r30 stands 0–4. Next input 86 targets `Bay r20 stand 1`; inspect its actual mapping first. Generate its own PNG, build the contour, inspect six actual views and neighboring contacts, then save. Preserve the base and transform.
6. Polish the fan's angular front lip and color; curtain drape; furniture, books, cases, posters, penlights, towels and lighting. Compare every item against originals with matched cameras. Preserve applied scripts and settled layout. Residential window backgrounds and time-dependent lighting remain required.
7. Reduce the current 739,246 renderable triangles toward the 450,000 budget by inspecting the largest contributors and optimizing actual meshes. Compare before and after; do not remove required items or raise the budget to hide failure.
8. Reconcile obsolete acrylic mapping and export-excluded Blockout bounds through the project's issue/specification route. Produce evaluated mesh contact and support evidence for the 233 floating candidates, 725 intersection candidates and 16 sinks. Separate intentional assembly contacts from actual defects.
9. After accepted changes, complete save, physical audit, scene audit, export, compression, UV removal, public synchronization and validation in order. Verify exact exported nodes and hashes. Inspect current whole-room, top-view and shelf renders against the floorplan and photographs.
10. When browser work is authorized, verify every playable model: darts, Rubik, piano, typing, yoyo, kendama, juggling, penlights, cardistry and pen spinning. Check actual hit geometry, misses, retries, scoring, reset, exit, movement locking and camera restoration. Verify curtains, closet, lighting, HTML overlays, mobile navigation and English/Japanese/Thai behavior in the real runtime.
11. Run required existing validation with resource caps, obtain fresh independent review and owner acceptance. Complete the Goal only after every item and interaction is proved. Deployment remains separate.

## 12. Command cookbook

Runcommandsonebyone, no concurrentnativeedits/saves/renders.

```sh
git status --short --branch
git rev-parse HEAD
df -h .
shasum -a 256 assets/room/room-v2.blend assets/room/room-v2-unique85.glb apps/astro/public/models/room.glb
```

Native statecheck:

```python
import bpy
result = {'scene':bpy.context.scene.name,'filepath':bpy.data.filepath,'dirty':bpy.data.is_dirty,'objects':len(bpy.context.scene.objects)}
```

Native physics then scene audit, each separatecall:

```python
from pathlib import Path
root=Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
AUDIT_SCOPE='scene'
exec((root/'tools/room-harness/build/physics_audit.py').read_text().replace('bpy.data.filepath',repr(str(root/'assets/room/room-v2.blend'))))
```

Replace physics_audit.py withaudit_scene.py in nextcall. Source save must precede audits. Preserve the unsaved scene using the existing library-write method instead of loading over it.

Native exporter wrapper, after source save and both audits:

```python
from pathlib import Path
import bpy
root = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
selected = list(bpy.context.selected_objects)
active = bpy.context.view_layer.objects.active
shape = [(o.data.shape_keys.key_blocks['Open'], o.data.shape_keys.key_blocks['Open'].value) for o in bpy.data.objects if getattr(getattr(o, 'data', None), 'shape_keys', None) and 'Open' in o.data.shape_keys.key_blocks]
night = bpy.data.objects.get('Backdrop night')
hidden = night.hide_render if night else None
try:
    exec((root / 'assets/room/export_room_v2.py').read_text().replace('bpy.data.filepath', repr(str(root / 'assets/room/room-v2.blend'))))
finally:
    for key, value in shape:
        key.value = value
    if night:
        night.hide_render = hidden
    bpy.ops.object.select_all(action='DESELECT')
    for obj in selected:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = active
```

```sh
UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2 bunx --package @gltf-transform/cli gltf-transform webp assets/room/room-v2-web.glb assets/room/room-v2-web-webp.glb --quality 88 --effort 20
node assets/room/strip_unused_uv.mjs assets/room/room-v2-web-webp.glb assets/room/room-v2-web-stripped.glb
UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2 bunx --package @gltf-transform/cli gltf-transform meshopt assets/room/room-v2-web-stripped.glb assets/room/room-v2-uniqueNEXT.glb --level high
NODE_OPTIONS=--max-old-space-size=2048 bun tools/room-harness/build/check-build.mjs --item ACRYLIC-STAND --json
```

NEXTmustbeexplicitnewversion; verify beforepubliccopy. Check-build4fails expectedcurrently, not acceptablefinalstate. No newtestscreated. Astrobuild onlywhen authorizedresumedverification andafterdiskcheck.

## 13. Handoff receipt

Written2026-10-02JST. Goalpaused byexplicitstop. Source/publichashes,exported85node,native1505objectstate,Gitbranch/HEAD/status,port4321 andownbrowsercleanup checked. Sources:canonicalrecord,currentconversation,hand offskill1–167EOF,plush15review/sideimage,actualstand84/85inputs/renders,export/audit/UVscripts and historicalshrinehandoff(methodonly; currenthashes/counts overrideit). No prior-sessionlogsread; no rawchatpersisted. Historicalledger not reconstructed.

Durable outputs: thishandoff, canonicalrecord, scene-inventory.json,artifacts.json,git-status.txt,verification.json. Postwrite verification: fullhandoffread, hashreceipt parity/node assertions, allindexedpaths existence, privacy/secret scan. Explicitunverified: every-itemdenominator/photoacceptance, allplushintegration, standalonepropsintegration, fullcontact/budget/bounds/acrylicmapping, runtime/mobile/locales/build/deploy. No completionclaim.
