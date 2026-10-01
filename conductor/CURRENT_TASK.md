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

## Current correction

- Correction: advance each usable individual input through actual mesh generation, polish and source/render comparison; further PNG-only progression is prohibited.
- Durable rule: tools/room-harness/image-to-3d/README.md Production order. GYST full SKILL read through EOF; prior imagegen/reference coverage unchanged.
- Worker stopped on usage limit; native lease released.06 repair3views/audit independently inspected: thirdblacksole removed, flatburgundy circular patch/cutedge still rejected.13portable rejected.02/01native renders next; no integration.
- Individual sheets01-v3–35 plus sombrero/diffuser/fan/camera/bottle/mouse/cube/monitor/riser/remote inspected/comparisons displayed. Drafts/uncertainty: assets/room/design-sheets/README.md and item comparisons. No coverage/fidelity acceptance. Blonde15 budgetGLB inspected but side material transition unresolved; details outputs/plush-15-review.md. Sombrero openfold3248triangles: main inspected all4portable renders/audit; hollow folds visible but gaps/angular tips differ, unaccepted. outputs/sombrero01-review.md.

## Native candidate review

Production1572: all15 existing plush GLBs and5standalone props installed as candidates in Generated models integrated; prior placeholders hidden reversibly. Source saved; public synchronization complete. Photo fidelity and placement review remain open.

-13 details outputs/plush-13-review.md. Portable7288tris/0auditdefects preservesfront but flatblackpanels/cutedge/splitstub rejected. Previous trials rejected for crossings/budget/visibleartifacts. Unaccepted/nointegration.
-14 polishedGLB independently1392064bytes/7998triangles/embeddedtexture/UV. Main source/front/side/back review:front improved; broad bow patch, hard hair seam, flat rear and missing collar trim fail. Unaccepted.
-12 review outputs/plush-12-review.md: main3views/source inspected; singleloop/whiskers improved, smoothcloth/larger eyes reject. GLB1644392bytes/6meshes/7988tris. Unaccepted/nointegration.
-11 review outputs/plush-11-review.md: main3views/source inspected; face/whiskers/loop improved, smoothcloth reject. GLB7894tris/8meshes. Unaccepted.
-Inference teardown stalls; interrupted130/1, no retained job or clean-exit claim. Finder prior authorized open exit0.
-08 outputs/plush-08-review.md: main3views/source inspected, ears/stripes improved, smoothcloth/fullsnout reject. Raw18288tris; unaccepted.
-10 outputs/plush-10-review.md: main3views/source blacknose/rim improved; stretchedbands/ripples/pile reject. Mainaudit7996tris/0defects/finiteUV. Unaccepted.
-09 final3views/source inspected: face improved; smaller eyes/melted hair-cloth boundary/washed accent/dents. Main audit7986tris/zero defects/finiteUV; unaccepted.07 final3views: panels improved; rear false relief/dents/fusedbase; unaccepted. Reviews outputs/plush-09-review.md and plush-07-review.md.
-Placement pass 2026-10-02 (saved/exported/public): evaluated-BVH sweep of all visible meshes. Generated: pen holder/pens/scissors moved 6cm off laptop, scissors flipped blades-down, all seated on cup floor z0.7238; sombrero hung vertically on rack front-right post under top shelf per 033126602 (was floating). Settled floaters to contact: carrot plush (floor), mochi (on plush01), plush03, case-top riser frames, Tamron lens, outdoor AC, keyboard keys, rack photo frame. U4 cup noodle cup and band were solid capped — top caps removed, 3mm Solidify wall, pens seated. Juggling balls moved out of kendama; tapestry/pennant shifted +6.95cm y off closet casing; balcony sheer top clamped below shutter box; curtain rails lowered onto curtains plus 6 new `* curtain rail bracket *` meshes to wall/shutter box. Export collider darts-stand now includes Carrot plush. Sweep diff vs pre-fix: 0 new crossing pairs, 8 visible clips removed; remaining 649 pairs are assembly joints/coplanar contacts. physics-latest screening: floating176/intersections550/sinks17 (lens sink = wire-shelf AABB artefact). check-build fails are build-plan name-pattern drift + triangle budget; plan unchanged pending issue route. Renders tools/room-harness/build/fix-*.jpg inspected. Not done: dart stand uprights 7mm off posts, lanyard hook fits, mic shock mount clearance; browser proof. Full handoff docs/HANDOFF_2026-10-02_PLACEMENT.md. Committed/pushed to origin/dev; WIP (image-to-3d, design-sheets, item-compare work, intermediate GLB/blend, photos) is gitignored local-only, never commit it (public repo).

-06 outputs/plush-06-review.md: reclininginput/main3views sleepyface improved, embroidery/meltedgarment reject. Raw33356tris; unaccepted.

-05 outputs/plush-05-review.md: main3views/source singleeye/fringe improved; smoothcap/meltedgarment reject. Raw33416tris; unaccepted.

-04 main final3views/source inspected: openloop/face/body improved; sidehat spill/plaincap/meltedreargarment/trim absent, unaccepted. Body omission corrected; actual38548tris20.025secpeak3.50GB.03 blankeyes/coralbob input;actual28644tris20.109secpeak3.48GB. Hiddenbody interpreted; inference130afterreport;03 final3views/source inspected: blankface improved; sideblueaccent spill/threefalse soles/meltedgarment fail. Reviews outputs/plush-04-review.md and plush-03-review.md.

## Individual design references

Index assets/room/design-sheets/README.md and individual comparison files authoritative. Main inspected pyramid01v2/organizer01v2/desk01v2/chair01v2: prior shape/view corrections retained; hidden surfaces/dimensions/perspective provisional, all unaccepted. Coverage incomplete. Air-conditioner01 PNG/comparison saved; source/output inspected: silhouette retained, rear/intake inferred; v2 top/bottom parallel footprint projections improved. Draft unaccepted. Ceiling-light01-v2 PNG/comparison inspected: flatter diffuser/reduced underside exposure, hidden screw details removed; dimensions/elevation angle provisional. Laptop01-v3 inspected: side thin edges/top broad display removed; lidstrip depth/keylayout inferred/front perspective, unaccepted. Plush02 source/input inspected: blankeyes retained, heart accents/fringe fuller than source. Actual outputs/plush-02-triposr-128.glb exported40604tris/19.565sec/3.27GB/nonwatertight; CLI interrupted afterreport exit1, session38414 terminal. 02rawrenders pending; outputs/plush-02-review.md. Tablet01-v4 inspected: portrait/paleedge/sideheight/topwidth now aligned, dimensions/rear provisional. Close original033233767 inspected: portrait tablet/pale edge, laptop lighter gray metal/pale lip/Japanese keys; laptopv3 lightergray metal/pale lip corrected/main inspected; top lid depth remains approximate. Keyboard01 sheet/source inspected/comparison saved: compactblack raisedkeys retained, occluded layout/feet/slope interpreted, side scale/perspective provisional. Boom01v3 maininspected/comparison: both longsections nowpresent, extendedpose interpreted; sideangles/topbottom overlap provisional. Microphone separate. Plush01 source/v3/input independently inspected: face/2feet retained, thicker regular hair/body interpreted. Actual outputs/plush-01-triposr-128.glb42536tris/19.243sec/peak3449585664bytes/nonwatertight; CLI interrupted exit1. Review outputs/plush-01-review.md. Closedtrial61holes/42654tris reimportaudit0boundary/nonmanifold/zeroarea; crossingsunchecked. Main3views confirmsblackpinholesremoved; blurredface/crateredsoles/meltedrear remain. Production restored unsaved. Face texture/v2 actual3views inspected: sharp eyes/smile/cheeks improved, jaggedboundary clipslefteye/sideseam reject. outputs/plush-01-face-trial-v2.glb42654tris/4233facepolys; reimportvisualpending. Nextcleanface-hairboundary/garment/soles/budget. 06 false-sole-v2 main3views/audit inspected7872tris/0defects; circularpatch/cutedge rejected. Coverage incomplete.

Jump-rope01 comparison assets/room/design-sheets/jump-rope-01-comparison.md. Nativejump-rope-01-v2.pngsixorthoviews sameGLB/scale independentlyinspected; priorgeneratedsheet rejected. Actual outputs/jump-rope-01-v2.glb6668tris/3meshes; centercrossing removed, main3views/reimport inspected, seam-weldaudit0boundary/nonmanifold/zeroarea. Regularcoil/dimensions interpreted; crossings/integration/playability open. Production unchanged; coilshape/coverage open.

Pen-holder01 sheet/actualGLB156tris/0boundary/nonmanifold/zeroarea; mainoriginal/sheet/3renders inspected. comparison assets/room/design-sheets/pen-holder-01-comparison.md. Sourceoccluded/dimensions inferred; sheet perspectives/bottommarks unsupported, top/sideactualtoo faint. Mainreimport3contrastviews/audit156tris/0defects inspected: frostedblur rejects. ClearGLB.025 reimport/samecamera inspected: checkeredges nowvisible, frostedblur reduced. Nativepen-holder-01-v3.pngmaininspected: labelledactualfeature-edgeoverlay makesrim/base/all6orthoviews readable. Overlayreviewonly; sourceproportions pending. Integration/playability open. Production unchanged.
