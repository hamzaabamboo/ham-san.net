# Current task

## Active contract

Owner resumed model integration: every room item must faithfully match original photographs and room specifications, with generated references, modelling and fresh direct comparisons. Every room item must also support the authorized interactions. Fan incomplete.

- Source: `assets/room/room-v2.blend`; saved Scene.001 via native library write, default unsaved Scene preserved. Live filepath empty; exporters/audits require explicit source path. Viewport unavailable.
- Product requirements: `conductor/room-spec.md`; modelling requirements: `conductor/room-model-design-spec.md`; placement: `conductor/room-reference-map.md`.
- Original photographs authoritative; generated hidden details are interpretation.
- Preserve all settled owner removals and floorplan. Do not recreate clutter removed earlier.
- Main handles modelling/design; production edits serialized.
- No publication/server/system/audio/macOS automation authorized. 
- Native Blender MCP only; no CLI, custom client or socket workaround.

## Model checkpoint index

Prior mic, entry shelf, chair, laptop/tablet, fan, mouse and tote changes: conductor/room-model-checkpoints.md. All guarded scripts there applied once; do not rerun. Fan incomplete. Book changes: conductor/room-books-fidelity.md. Photo acceptance open.

## Public export and validation boundary

Public `apps/astro/public/models/room.glb` = `assets/room/room-v2-placement-20261002.glb`: 21,966,176 bytes, SHA-256 `3744b739f9ae82b4b22af0694c4ab88ca1b185743b15659ea25f962123851215`; source `room-v2.blend` SHA-256 `8568164da58110742a09c621d3dd1844be18289fbda7242ae7f5cc9ceb81ba00`. All20 generated candidate roots present; placement pass 2026-10-02 verified in decoded node transforms. Existing upgrades retained.

Export pipeline: native assets/room/export_room_v2.py → WebP88 → UV strip → meshopt public GLB. Restore shape values, backdrop visibility and selection; remove only new intermediates.

Inventory1281 export objects/739246 scene tris;450000budget fails. Blockout Stage excluded from public; full-scene bounds findings persist. Spec unchanged.

Physical producer uses scene scope, evaluated vertices, real shell/floor bounds and nine navigation collider groups with3cm padding; excludes export-excluded collections. AABB screening is not contact/support proof. check-build rejects screening and cross-family collision suppression. source-gate-lower-albums-20260930.json exit1: provenance passes; triangle budget, item coverage/anchors, bounds and physical gate fail. Manifest prefixes may be obsolete; inspect actual inventory before missing-item claims. Preserve owner removals/namecard.

Off-room templates hidden/public-excluded; pennantx3.244 saved/exported. display-wall-correction-20260930.png/outlying-objects-20260930.json inspected.

Rack junction refine_penlight_rack_contact.py applied once; never rerun. Saved/public synchronized. rack-shelf-corrected-audit-20260930.json and rack-shelf-clearance-20260930.png inspected: intended grid/floor/ceiling contacts only; no shelf/hanging/skirting hits. Shelf/grid/hanging positions preserved. Photo fidelity open.

Kendama gap0.5mm unchanged. refine_entry_frame_contact.py applied once; never rerun. entry-jamb-before/after-20260930.png and entry-jamb-audit-20260930.json inspected: gap0/zero degenerate faces; saved/public synchronized. Wall/floor screening candidates zero; contact/support proof incomplete.

### Curtains

Balcony topology/cloth/drape/clearance scripts applied once; do not rerun. Original Plane.068/069/mesh backups/Basis/Open/materials preserved. Fresh reference/before/topology/cloth/drape/clearance images inspected. Photo drape still too regular. refine_balcony_curtain_clearance.py moves panels/rail192 mm roomward, narrows left edge inside wall, updates runtime center metadata and separates closed seam10 mm. balcony-clearance-audit-20260930.json: half/open no external surface hits; closed final seam0/external surfaces clear. Camera/settings restored, production saved. Clearance synchronized via WebP88/UV-strip/meshopt; public metadata verified. Full-scene contact proof open.

Blue original033326574 inspected;033311397 is entry rack, contradicting spec index. No spec rewrite. refine_blue_curtains.py applied once; never rerun. Variable folds/header, hemz0.12m provisional. blue-curtains-before/after-20260930.png and blue-curtain-audit-20260930.json inspected; open/closed/half surfaces clear, no degenerate faces, minz>0.1199m; curtain-half-open-audit-20260930.json. Saved/public synchronized; cloth/photo acceptance open.

Port4321 last checked: no listener. Server permission pending; do not start. Browser proof old.

## Playable room work

Existing darts, rubik, piano, typing, yoyo sessions exist; historical browser proof is not current. Required additions: kendama, juggling, penlights, cardistry and pen spinning on actual models. HTML minigame replacements, fake props, proxy hitboxes and autoplay scores are not acceptable. Preserve page overlay and exit/reset behavior across English/Japanese/Thai. Rug must not block walking; model itself supplies hit geometry.

- Main changed `room-runtime.ts`: play cursor is none; pointer unlock/error/cancel respects active play. Browser verification pending.
- `/root/props_play` is interrupted. Main reviewed the complete current `room-play-props.ts`; penlight Groups, card extraction/remapping/disposal, selection/reveal and pen pointer/center handling are corrected in source. Main added actual-surface pen support and full-dt substeps. Sessions are wired; runtime remains unverified.
- `/root/interaction_audit` is interrupted. Main corrected `room-play-physics.ts` using decoded current asset measurements. Kendama/juggling resolve the actual nodes and support multimaterial Groups; cup contact, following positions and full-dt handling are present. Kendama now uses ring-derived cord length, preserved tube cross-sections, perpendicular slack bow, world-up launch and retryable misses. Both sessions remain subject to real browser verification.
- Main integrated five PlayId/session registrations, en/ja/th control copy, juggling target/label/focus routing, actual ball metadata and user-visible initialization failure recovery. TS formatted; real browser proof pending.
- Original refine_chair_cushion.py restored exactly; new seat code refine_chair_v2_seat.py. Preserve original back-pad script.

## Skill coverage

Full-read coverage: GYST1–EOF reread for evaluated-mesh correction, look-at-screen1–60, brainstorming, real-testing-evidence, openai-docs, imagegen; handoff1–232; model spec1–514; prompting1–112; sample-prompts1–422. Browser skill stub1–EOF/core1–2425 fully read. Current request authorizes isolated headed browser gallery; no server start. Original-detail required on both view_image and image helper. No tests created.

## Latest settled model requirements

- Each acrylic stand requires distinct artwork. Current native Case/Bay inspection:109prints use85image paths,24repeats. Old126unique claim invalid; artwork reconciliation pending.
- Clear-case group spans two adjacent furniture shelf columns horizontally.
- Plush is smaller and integrated into the shrine.
- Small hobby props may be on the low table; old PC Rubik anchor is subordinate to this direction.
- Lead verifies delegated models before integration.
- Preserve confirmed 5.05 m width and owner floorplan; two openings on one wall; no clothes hanger or generated faces/text/logos; original photos immutable.

## Remaining acceptance and immediate next action

Every item needs original-photo/current-render comparison; `tools/room-harness/item-compare/items.json` groups families only. Sheets remain drafts. Scope: identities, shell/openings, floorplan, furniture, books/cases, acrylic art, plush, penlights/towels, hobby props, posters, lighting.

Remaining: top-view/floorplan/physical inspection, every item comparison, public synchronization, real interaction/browser proof, mobile/locales, required build/validation and independent review.

Active: individual interpreted six-view PNGs for every room item, including each plush; isolated parallel modelling authorized. Retain observed identity and design hidden surfaces without further reference requests. One item per PNG, sequential generation, source/generated side by side before advancing. Rejected atlases do not establish coverage. Design index: assets/room/design-sheets/README.md. Originals immutable; no inference downloads. Bottom sleeves saved, public prior lower-album version. Acceptance open.

## 2026-10-21 page performance and HUD (current)

- Request: 3D page slow and visually poor; ux-heuristics and antislop (global mode during) applied; finish lingering work.
- Done, uncommitted on dev: render on demand, adaptive motion pixel ratio, AO only on settled frame, three-mesh-bvh raycasts, frame-coalesced hover, label occlusion applied (room-runtime.ts). HUD rebuilt: header Leave room, HH:MM clock, bottom toolbar with state squares, reticle only when locked, near-distance hobby labels, panel header = section name, focus race fix so Escape closes during load (RoomHome.astro, room-copy.ts en/ja/th). tools/room-harness/fit_texture_density.mjs applied to public GLB: 21.97 MB to 12.13 MB, SHA-256 adbef16ce3a181c3054cf9afb91e9f473fecab0714e3f97f164e87427b371715, structure identical to previous public GLB. Docs: docs/architecture.md step 6/8, docs/design/pages/room.md.
- Verified in headed agent-browser (session ham-room): retina 2880x1800 25-26 fps before, idle zero draw and 58-60 fps while looking after; en/ja/th desktop, 402px mobile no overflow; every toolbar control, Leave room, Escape/close panel; play sessions darts, rubik, piano, typing, yoyo, penspinning, cardistry, penlight, juggling start on real models.
- Kendama fixed in runtime: Kendama string is a capped closed tube (49 rings x 12, two 12-gon caps); room-play-physics withoutEndCaps drops triangles on circles shared by more than two edge-adjacent triangles before ring detection. Browser: session starts, cord deforms, toss and drop counted.
- Darts anchor fixed in source: export_room_v2.py excludes Darts mat* and Carrot plush* from target centres; exported darts position [0.795,1.4799,-1.6652].
- Contact defects fixed via native MCP 2026-10-21 (Blender 5.2.2 opened by owner; file opened directly, saved by library write): Dart stand uprights 1/2 moved (+-0.010 x, +0.013 y) onto post axis/face; Mic shock mount elastic 1-4 added (8-seg 1.2 mm cords, Black steel, roomTarget copied from Microphone) touching mic and ring; Live towel fold 1/2 +0.01365 x into their clips (0 towel overlap). Lanyards intentionally untouched (handoff 2026-10-02 section 5). Same-camera before/after renders inspected.
- Source room-v2.blend SHA-256 7ab8d257e70067b4e254540fbe45997b8a368cc6645b738b55cd7fc0f4604c26; audits: physics screening floating176/intersections550/sinks17/wall0 (unchanged), scene 1582 objects/671236 tris. Export, webp, strip_unused_uv, meshopt to assets/room/room-v2-contact-20261021.glb, fit_texture_density to public room.glb: 12,134,916 bytes, SHA-256 de6bdebaca5eea5568a882079c10148d566919d162201ed98e748ce22f393220, 1203 nodes (stray default Blender Cube from the 2026-10-02 export no longer present). Browser: room loads, darts marker on board, kendama starts, towels/panel checked, no console errors.
- Plush: owner decision 2026-10-21 accepts all 15 installed plush candidates at room scale; close-up defects recorded in tools/room-harness/image-to-3d/outputs/plush-*-review.md stay as known limits, no further polish required. Generation is local TripoSR on CPU (no paid API).
- Committed locally on dev 2026-10-21 at owner request; not pushed.

## Native candidate review

Production1572: all15 plush GLBs and5standalone props installed as candidates in Generated models integrated; placeholders hidden reversibly. Per-plush reviews (all unaccepted): tools/room-harness/image-to-3d/outputs/plush-01..15-review.md. Placement pass 2026-10-02 details: docs/HANDOFF_2026-10-02_PLACEMENT.md (open: dart stand uprights 7mm off posts, lanyard hook fits, mic shock mount clearance). WIP image-to-3d/design-sheets/item-compare/intermediate GLB/blend/photos stay gitignored local-only; never commit (public repo).

## Individual design references

Index assets/room/design-sheets/README.md and individual comparison files authoritative. Main inspected pyramid01v2/organizer01v2/desk01v2/chair01v2: prior shape/view corrections retained; hidden surfaces/dimensions/perspective provisional, all unaccepted. Coverage incomplete. Air-conditioner01 PNG/comparison saved; source/output inspected: silhouette retained, rear/intake inferred; v2 top/bottom parallel footprint projections improved. Draft unaccepted. Ceiling-light01-v2 PNG/comparison inspected: flatter diffuser/reduced underside exposure, hidden screw details removed; dimensions/elevation angle provisional. Laptop01-v3 inspected: side thin edges/top broad display removed; lidstrip depth/keylayout inferred/front perspective, unaccepted. Plush02 source/input inspected: blankeyes retained, heart accents/fringe fuller than source. Actual outputs/plush-02-triposr-128.glb exported40604tris/19.565sec/3.27GB/nonwatertight; CLI interrupted afterreport exit1, session38414 terminal. 02rawrenders pending; outputs/plush-02-review.md. Tablet01-v4 inspected: portrait/paleedge/sideheight/topwidth now aligned, dimensions/rear provisional. Close original033233767 inspected: portrait tablet/pale edge, laptop lighter gray metal/pale lip/Japanese keys; laptopv3 lightergray metal/pale lip corrected/main inspected; top lid depth remains approximate. Keyboard01 sheet/source inspected/comparison saved: compactblack raisedkeys retained, occluded layout/feet/slope interpreted, side scale/perspective provisional. Boom01v3 maininspected/comparison: both longsections nowpresent, extendedpose interpreted; sideangles/topbottom overlap provisional. Microphone separate. Plush01 source/v3/input independently inspected: face/2feet retained, thicker regular hair/body interpreted. Actual outputs/plush-01-triposr-128.glb42536tris/19.243sec/peak3449585664bytes/nonwatertight; CLI interrupted exit1. Review outputs/plush-01-review.md. Closedtrial61holes/42654tris reimportaudit0boundary/nonmanifold/zeroarea; crossingsunchecked. Main3views confirmsblackpinholesremoved; blurredface/crateredsoles/meltedrear remain. Production restored unsaved. Face texture/v2 actual3views inspected: sharp eyes/smile/cheeks improved, jaggedboundary clipslefteye/sideseam reject. outputs/plush-01-face-trial-v2.glb42654tris/4233facepolys; reimportvisualpending. Nextcleanface-hairboundary/garment/soles/budget. 06 false-sole-v2 main3views/audit inspected7872tris/0defects; circularpatch/cutedge rejected. Coverage incomplete.

Jump-rope01 comparison assets/room/design-sheets/jump-rope-01-comparison.md. Nativejump-rope-01-v2.pngsixorthoviews sameGLB/scale independentlyinspected; priorgeneratedsheet rejected. Actual outputs/jump-rope-01-v2.glb6668tris/3meshes; centercrossing removed, main3views/reimport inspected, seam-weldaudit0boundary/nonmanifold/zeroarea. Regularcoil/dimensions interpreted; crossings/integration/playability open. Production unchanged; coilshape/coverage open.

Pen-holder01 sheet/actualGLB156tris/0boundary/nonmanifold/zeroarea; mainoriginal/sheet/3renders inspected. comparison assets/room/design-sheets/pen-holder-01-comparison.md. Sourceoccluded/dimensions inferred; sheet perspectives/bottommarks unsupported, top/sideactualtoo faint. Mainreimport3contrastviews/audit156tris/0defects inspected: frostedblur rejects. ClearGLB.025 reimport/samecamera inspected: checkeredges nowvisible, frostedblur reduced. Nativepen-holder-01-v3.pngmaininspected: labelledactualfeature-edgeoverlay makesrim/base/all6orthoviews readable. Overlayreviewonly; sourceproportions pending. Integration/playability open. Production unchanged.
