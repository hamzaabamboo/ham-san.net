# Room placement and clipping pass — full handoff and methodology, 2026-10-02

Everything required to resume this task without rediscovery. This is not a summary. The earlier `docs/HANDOFF_2026-10-02_ROOM.md` stays as the historical record of the acrylic/plush work. Its hashes and counts are superseded by this document.

# PART I — TASK CONTRACT AND LIVE STATE

## 1. Exact task contract

- Latest request: integrate the generated models into the room properly. Every item must be correctly placed with no clipping, every wired/hanging item must hang from something, and walking physics must be correct. Then clean the working tree, push everything that is not WIP, and write this handoff.
- Required completion: generated models are integrated without intersections or floating; source is saved; public GLB is exported and synchronized; non-WIP work is committed and pushed to `origin/dev`; working tree is clean.
- Explicit non-actions: no dev server started; no deploy; no PR; no `build-plan.json` rewrite (name-pattern drift goes through the issue route); room photos are never committed (the repo is public); WIP intermediates are never committed.
- Authority this session: Blender edits, save, export and public sync; commit and push to `dev`. The owner chose to commit source and gitignore everything else, with nothing deleted from disk.
- Source of truth, in precedence order: original photos (local only, ignored) → `conductor/room-spec.md` / `conductor/room-reference-map.md` → `assets/room/room-v2.blend` (Scene.001) → public GLB.

## 2. Ground truth: repository and working tree

| Field | Value | Evidence |
|---|---|---|
| Working directory | `/Users/vittayapalotai.tanyawat/code/ham-san.net` | `pwd` |
| Branch | `dev`, tracking `origin/dev` (git@gh-personal:hamzaabamboo/ham-san.net.git, PUBLIC) | `git status -sb`, `gh repo view` |
| HEAD before commit | `82ee5ef` | `git rev-parse HEAD` |
| Commit/push | One commit on `dev` with this pass plus the earlier uncommitted session work (runtime TS, production scripts, textures, docs) | `git log -1`, `git status` |
| Ignored WIP (on disk, not committed) | `tools/room-harness/image-to-3d/` (≈1,600 files, generated-model pipeline), `assets/room/design-sheets/`, item-compare `work/ panels/ sheets/ current/ photos/`, `assets/room/*.glb|*.blend|*.blend1` except tracked ones, `generated-*`, galleries, `stand-02-print-v2*`, `stand-73{,-clean,-green,-v3}.png`, `tools/room-harness/build/fix-*`, `docs/room-handoff-2026-10-02/` dumps, `docs/ref/` | root `.gitignore` sections "Room reference media" and "Room work in progress" |
| Private photos (ignored) | `assets/room/current-room-*.jpg`, `tools/room-harness/reference-*/`, `assets/room/textures/*-reference-*.png`, `*-source-crop.*` inside design-sheets, `tools/room-harness/evidence/` (via `tools/room-harness/.gitignore`) | `git log --all --name-only` showed no photo was ever committed |

## 3. Environment and operational rules

- Blender: the native Blender Lab MCP is live. The live scene is `Scene.001`, `bpy.data.filepath` is empty, and an unsaved default `Scene` is preserved. Never load over it. Save with `bpy.data.libraries.write(tmp, {scene}, path_remap='RELATIVE_ALL', fake_user=True, compress=True)` and then `Path(tmp).replace('assets/room/room-v2.blend')`.
- Scripts that derive the repo from `bpy.data.filepath` need `.replace('bpy.data.filepath', repr('<repo>/assets/room/room-v2.blend'))`. Audits need `AUDIT_SCOPE='scene'` set in the same exec. Without it, `audit_scene.py` writes `objects: 0`.
- MCP results must be a dict. The export call prints >100 KB of stdout; read the `result` with `jq`.
- Disk: 98% full (≈9–11 GiB free). Run `df -h .` before export. The compression chain writes ≈280 MB.
- No dev server for room work without owner approval. Port 4321 is not listening. Port 3000 belongs to the owner's courta Next app; do not touch it.
- agent-browser: prefix `AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic,--mute-audio"`. Sessions `dogfood-*`, `courta-*`, `joseki` belong to other projects; leave them. This task's `gallerycheck` session is closed.

# PART II — COMPLETE EXECUTION RECORD

## 4. Chronological action ledger

| # | Action (native MCP unless shell) | Why | Result | Rerun? |
|---|---|---|---|---|
| 1 | Rendered `Plan top cam`, `Shelf cam`, `Desk cam`, `Dart cam`, `Table cam` to `tools/room-harness/build/fix-*-before.jpg` | See the actual state | Pen cup inside laptop; sombrero floating in front of rack; carrot plush floating | Yes |
| 2 | BVH overlap of the 46 meshes in `Generated models integrated` against all visible meshes | Generated-model clipping | Only hits: `Clear pen holder01` and `Scissors *` against `Laptop *` | Yes |
| 3 | Downward ray support test per generated root | Floating check | Plush rest on rack rods (≤6 mm); sombrero 19 cm above mat; gold pen 1.2 cm above cup floor | Yes |
| 4 | Translated `Generated pen holder`, `Generated gold pen`, `Generated scissors`, `Desk pen 2/3/4` by y −0.06; rotated scissors π about Y around its centre; set all mins to z 0.7238 (cup floor 0.7233) | Clear the laptop; blades down | Holder y 0.375–0.425; laptop starts at y 0.46 | No (applied) |
| 5 | Moved `Generated sombrero` to centre x 1.04, z 0.725, brim back y 1.4695 | Photo `PXL_20260908_033126602` shows the hat hanging at the rack's front-right corner under the top shelf | bbox (0.92,1.374,0.623)–(1.16,1.4695,0.827) | No |
| 6 | Room-wide support sweep (1155 meshes, 1015 roots; nearest other mesh ≥3 mm in both directions) | Find every floater | 83 real candidates | Yes |
| 7 | Defined `settle(root, dir, max)` in `bpy.app.driver_namespace` (BVH ray from group vertices along dir and reverse from neighbours, stop at 0.5 mm) | Contact placement | — | Helper only |
| 8 | Settled down: `Carrot plush v3` (−0.187, floor), `Mochi white` (−0.019 onto plush 01), `Generated plush 03`, `Top frame 0/1/2` (−0.02), `Camera Tamron 70-300 lens`, `Outdoor AC unit`, `Keyboard key r*` (≤4 mm), `U4 pen 1–4` | Remove floating | Applied | No |
| 9 | `Rack photo frame` settle fell 13.4 cm through the wire shelf → reverted +0.1339, then −0.0011 by hand | Wire-shelf ray miss | Rests at z 0.9805 | No |
| 10 | Settled `Tapestry blue dress` +y 0.0219 (onto curtain), `Pennant flag` +x 0.0112 then −0.0012, `Entry door lever` −y 0.0115, both curtain rails −z (0.0206 / 0.0175) onto the curtain tops | Hanging contact | Applied | No |
| 11 | Reverted bad settles: `Case top riser` (it went into the stand bases), `Penlight grid pole 0` (into foot/cap), all `Lanyard row1 *` (rays slip between grid wires, so they crossed the grid) | Settle created crossings | Restored to x min 3.2148 and the original z | — |
| 12 | Created `Window curtain rail bracket 1–3` (x 1.23/2.14/3.06, y 1.81→1.8995, z 2.2214–2.2374) and `Balcony curtain rail bracket 1–3` (x −1.6/−0.68/0.3, y 1.618→1.6395, z 2.2245–2.2405) in collection `Curtains`, material `Aluminium frame` | Rails floated 8 cm off the wall | Applied | No (would duplicate) |
| 13 | `U4 cup noodle pen cup`: deleted the top cap face and added a Solidify modifier `Cup wall` (0.003, offset −1, rim); `U4 cup noodle band`: deleted the 2 cap n-gons; pens seated at z 1.1084; pen 4 moved (+0.002, +0.002) | The cup was a solid capped cylinder with pens stabbed through the lid | 0 crossings | No |
| 14 | Room-wide BVH pair sweep plus penetration depth (parity test) | Find visible clips | 657 pairs, 164 deeper than 3 mm; most are assembly joints | Yes |
| 15 | `Juggling ball 1` (+0.02 x), `Juggling ball 0` (+0.004, −0.028); a −z settle went to the tote bottom, so it was reverted and the balls settled toward the ken instead | Balls were inside `Rack kendama ken` | Touching the ken at 0.5 mm | No |
| 16 | `Tapestry portrait cord/dark/rods` and `Pennant flag` +y 0.0695 | They overlapped `Closet casing` (y −1.85…−1.776) | 0 crossings | No |
| 17 | `Balcony sheer` vertices with world z > 2.0955 clamped to 2.0955 | It went 5.5 cm into `Balcony door shutter box` | 0 crossings | No |
| 18 | Final sweep diff against step 14 | Regression proof | 0 added pairs; 8 removed | Yes |
| 19 | shell: edited `assets/room/export_room_v2.py` so the darts-stand collider includes `meshes('Carrot plush')` | The carrot on the floor must block walking | Collider minZ −1.86, maxZ −1.2831 | — |
| 20 | Saved through library write (`room-v2-placement-save.blend` → `room-v2.blend`) | Persist | sha256 `8568164d…ba00` | Yes |
| 21 | Physics audit, then scene audit (see cookbook) | Required before export | physics: floating 176, intersections 550, sinks 17, wall 0 (AABB screening); scene: 1578 objects, 671,124 tris | Yes |
| 22 | Export wrapper → `room-v2-web.glb` (187 MB) | Export | ok, dirty false | Yes |
| 23 | shell: webp q88 → 47.0 MB; strip_unused_uv → 46.98 MB; meshopt high → `assets/room/room-v2-placement-20261002.glb` 21.97 MB | Compression | ok; TEXCOORD_0 out-of-range quantization warning (known) | Yes, with a new output name |
| 24 | shell: parsed the GLB JSON chunk for node translations and the `Floor.extras.roomNavigation` darts-stand collider | Verify the export | Matches the new placements | Yes |
| 25 | shell: `cp` to `apps/astro/public/models/room.glb` | Public sync | sha256 `3744b739…1215`, 21,966,176 B | — |
| 26 | shell: `check-build.mjs --json` | Gate | exit 1 (see §7) | Yes |
| 27 | Rendered `fix-*-after*.jpg`; wrote `tools/room-harness/build/fix-gallery.html` (ignored); opened it at the owner's request; agent-browser `gallerycheck` confirmed 12/12 images load, then closed | Owner review | Inspected | — |
| 28 | shell: prettier `--write` on `apps/astro/src/components/home/room-*.ts`; eslint clean; tsc showed no errors in room files | Commit gate for the runtime code | ok | Yes |
| 29 | shell: appended ignore rules to `.gitignore`; committed; pushed | Clean tree | See `git log -1` | — |

## 5. Methodology and decision record

- Evaluated world meshes only (`evaluated_get(depsgraph).to_mesh()` × `matrix_world`). Bounding-box screening in `physics_audit.py` is not contact proof.
- Clipping is a BVH `overlap` between meshes with different root parents. Depth is the nearest-surface distance for vertices that are inside by ray parity. Coplanar contacts count as overlaps at depth 0, so the 649 remaining pairs are joints (shelf boards into posts, darts in the board, cables through the grommet, rail ends into walls, stand bases under acrylic).
- Floating means a root whose nearest other mesh is ≥3 mm away in both directions (group vertices to neighbours, and neighbour vertices to the group).
- Settle traps: thin wire/grid geometry lets rays slip through. Always re-run the overlap check after a settle and revert crossings.
- Placement fidelity: sombrero placement follows the rack photo. The carrot was given floor support rather than an invented hanging position. Lanyard and hook fits were left untouched because the original design intentionally intersects the hooks.
- Preserve: every generated candidate root and its `clippingRecoveryMatrix` property; owner removals; 5.05 m width and floorplan.

## 6. Files and artifacts

| Path | Role | Change | Verification |
|---|---|---|---|
| `assets/room/room-v2.blend` | Production source | Placement pass + brackets + hollow cup | sha256 `8568164da58110742a09c621d3dd1844be18289fbda7242ae7f5cc9ceb81ba00` |
| `apps/astro/public/models/room.glb` | Public model | = `room-v2-placement-20261002.glb` | sha256 `3744b739f9ae82b4b22af0694c4ab88ca1b185743b15659ea25f962123851215` |
| `assets/room/export_room_v2.py` | Exporter | darts-stand collider includes `Carrot plush` | Decoded collider checked |
| `tools/room-harness/build/physics-latest.json`, `audit-latest.json` | Audits | Regenerated from the saved source | Source hash matches |
| `apps/astro/src/components/home/room-play*.ts`, `room-runtime.ts`, `room-copy.ts` | Play sessions from earlier work | Prettier only in this pass | lint/tsc clean; browser not verified |
| `assets/room/art/gen/stand-65…85.png`, `stand-73-cutout.png`, `assets/room/speaker-cloth-weave.png` | External textures the blend references | Newly committed | Blender external-image list (131 paths, none missing) |
| `tools/room-harness/build/fix-*.jpg`, `fix-gallery.html` | Before/after renders | Local only, ignored | Inspected |
| `conductor/CURRENT_TASK.md` | Live record | Placement pass state | — |

# PART III — EVIDENCE, FAILURES, AND HONESTY

## 7. Verification matrix

| Claim | Layer | Evidence | Result | Unverified |
|---|---|---|---|---|
| Generated models do not clip | Evaluated BVH | Step 2 + step 18 sweeps | 0 crossings | — |
| No new clips anywhere | Evaluated BVH diff | Step 18 | 0 added, 8 removed | — |
| Items rest or hang | Two-way nearest + rays | Step 6, settles | Fixed list above | Dart stand uprights 7 mm off the posts; mic inside its shock mount with 9 mm clearance; towel folds 1.2 cm from clips |
| Public GLB matches the source | Decoded JSON nodes + hash | Step 24 | Pass | Not rendered in a browser |
| check-build | Script | Step 26 | FAIL: BUDGET-TRIS 671124/450000, BOUNDS-ROOM (Stage floor/back), PHYSICS-AUDIT screening-only, GEO-* anchors, and ~35 item checks at 0 objects because `build-plan.json` namePatterns are obsolete (e.g. ACRYLIC-STAND expects `Acrylic stand*`, the scene has `Case stand NN` / `Bay rNN stand N`) | Plan must be reconciled through the issue route |
| Play sessions and walking | Browser | — | Not run | All |

## 8. Failures, traps, and rejected approaches

| Item | Symptom | Cause | Do not repeat |
|---|---|---|---|
| Wire-shelf settle | Photo frame fell 13 cm through shelf 4 | Rays slip between wires | Check overlap after a settle; place by hand on wire tops |
| Riser settle | +0.5 mm put the riser into 5 stand bases | The riser already touched its legs, and the 0.5 mm gap pushed it upward | Skip settling when contact already exists |
| Pole settle | Pole went into its foot and cap | Same ray slip | Reverted |
| Lanyards ±x/+z | Crossed the grid wires | Same | Reverted; leave them |
| Juggling balls −z | Dropped to the tote bottom, hidden | No support in between | Settle toward the ken instead |
| Pen lift search | No z clears the pens | The cup was solid with a capped band | Hollow the container first |
| `audit_scene.py` without `AUDIT_SCOPE` | `objects: 0` | Defaults to collection `RoomHome` | Set `AUDIT_SCOPE='scene'` |
| Export result | 130 KB MCP output overflow | glTF log in stdout | Read with `jq '.result'` |
| "Push everything" literal | 178 MB file, 2.2 GB, private photos | GitHub 100 MB limit; public repo | Commit source only; ignore WIP/photos |

## 9. Known limitations and blockers

- Browser proof needs owner approval to start `cd apps/astro && bun run dev -- --host 0.0.0.0` (this needs fresh authority every time).
- `build-plan.json` drift needs an owner/issue decision. Do not silently edit it.
- Triangle budget overshoot (671k vs 450k) needs an owner decision on budget or decimation.

# PART IV — RESUME WITHOUT REDISCOVERY

## 10. Immediate next action

In the repo, run `git status --short | wc -l`; expect 0. Then use native MCP `{'scene':bpy.context.scene.name,'filepath':bpy.data.filepath,'dirty':bpy.data.is_dirty}` and expect `Scene.001`, `''`, `False`. If the scene is dirty, inspect it before saving anything.

## 11. Remaining ordered work

1. Small contact defects: dart stand uprights (y 1.765–1.79) versus posts (y 1.803–1.827); mic shock mount clearance; towel folds versus clips. Edit, re-sweep, save.
2. Plush 15 side material transition and the remaining unaccepted plush reviews (see `conductor/CURRENT_TASK.md` "Native candidate review").
3. Replace the 24 repeated acrylic inputs (next: `Bay r20 stand 1`).
4. Open an issue to reconcile `build-plan.json` namePatterns and Blockout bounds.
5. With owner approval: browser proof of the room, play sessions, mobile, en/ja/th.

## 12. Command cookbook

Native audits, one call each, after a save:

```python
from pathlib import Path
root=Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
AUDIT_SCOPE='scene'
exec((root/'tools/room-harness/build/physics_audit.py').read_text().replace('bpy.data.filepath',repr(str(root/'assets/room/room-v2.blend'))))
```

Repeat with `audit_scene.py`. For the export wrapper, use `docs/HANDOFF_2026-10-02_ROOM.md` §12 unchanged.

```sh
df -h .
UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2 bunx --package @gltf-transform/cli gltf-transform webp assets/room/room-v2-web.glb assets/room/room-v2-web-webp.glb --quality 88 --effort 20
node assets/room/strip_unused_uv.mjs assets/room/room-v2-web-webp.glb assets/room/room-v2-web-stripped.glb
UV_THREADPOOL_SIZE=2 RAYON_NUM_THREADS=2 bunx --package @gltf-transform/cli gltf-transform meshopt assets/room/room-v2-web-stripped.glb assets/room/room-v2-<NEXT>.glb --level high
cp assets/room/room-v2-<NEXT>.glb apps/astro/public/models/room.glb
NODE_OPTIONS=--max-old-space-size=2048 bun tools/room-harness/build/check-build.mjs --json
```

## 13. Handoff receipt

- Written: 2026-10-02 03:4x JST. Live state checked: HEAD `82ee5ef` before commit, branch `dev`, port 4321 closed, Blender scene `Scene.001` clean after save.
- Sources: `conductor/CURRENT_TASK.md`, `docs/HANDOFF_2026-10-02_ROOM.md` (§3, §12 read), `assets/room/design-sheets/README.md` (sombrero section), the rack photo, `export_room_v2.py`, `check-build.mjs` (L1–130), `physics_audit.py` header.
- No prior-session history read. No user chat copied.
- Unverified: browser/runtime, play sessions, mobile/locales, the small contact defects in §11.1.
