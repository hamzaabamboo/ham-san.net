# Model checkpoints

Applied changes and retained evidence. This is a topic record; conductor/CURRENT_TASK.md controls current scope.

## Current model progress and evidence

### Mic arm and entry shelves

Mic refinement applied once, saved/exported; original033233767 and desk/mic renders inspected. Scoped13-part audit clear; unchanged clamp outside scope.

refine_entry_shelf_topology.py applied once; do not rerun. Four shelves retain original meshes/frame polygons, transforms/materials and33 wires per axis. Diamond sections replaced with smooth8-sided round wires at original1.25 mm radius/grid. Each16928→1880 triangles. entry-rack-round-wires-20260930.png inspected against tote-final and original033311397. Bounds identical, zero-area0; sampled old→new max1.25003 mm/new→old0.36651 mm, not full Hausdorff proof. entry-shelf-topology-audit-20260930.json records values. Saved/public synchronized; metadata verified. refine_entry_bag_contact.py applied once: camera bag lowered14.737 mm to raycast wire support z0.115263 m. Scoped scene BVH: bag touches only lower shelf, tote body clear, handles touch upper shelf only. entry-shelf-contacts-20260930.json and supported-bag render inspected. Full rack fidelity open.

### Chair

Original `archive-1/PXL_20260908_033330798.jpg` shows broad tufted seat cushion. Spec PC-CHAIR also cites `033111450`, which actually shows the shelf; discrepancy identified without rewriting the specification. Existing generated PC-CHAIR panel omits some cushion detail. Back pad is retained because the specification explicitly requires it; full shape/material fidelity remains open.

- `assets/room/refine_chair_v2_seat.py`: changes only cushion vertices from round to rounded rectangular footprint.
- `assets/room/refine_chair_surface.py`: tessellates cushion caps, adds shallow depressions and lowers exaggerated leather normal strength to 0.08.
- Chair scripts applied once; do not rerun.
- Same-camera images: `chair-front-20260930.png`, `chair-after-20260930.png`, `chair-surface-20260930.png`. Latest shows softer grain and subtle cushion depressions. These do not prove full chair acceptance.
### Laptop/tablet fidelity

refine_laptop_input.py, refine_laptop_hinge.py, refine_tablet_edge.py and refine_device_contacts.py applied once; do not rerun. Saved/public synchronized. Original033233767, generated laptop reference and same-camera laptop/tablet/desk-devices renders inspected. Keyboard well/key shapes, Return/arrows/trackpad/dark body improved; legends/top control unresolved, no device model inferred. Hinge/lid overlap corrected, blue tablet rim added, laptop feet/tablet stand contact desk. laptop-hinge-audit/device-contacts-20260930.json scoped checks pass; full acceptance open. Camera/render settings restored; dimensions remain estimates.

### Desk fan — incomplete

Generic foldable handy fan in desk mode confirmed; folded-view render re-inspected. `add_desk_fan.py` and `refine_handy_fan.py` applied once. Saved source has a folded capsule handle, folding hinge, separate five-blade rotor, pink casing and spiral grille. Old desktop fork supports/pivots are hidden. Pen cup/pens retain the 6 cm clearance shift; owner removals preserved. Fresh `work/handy-fan-front-20260930.png` and `handy-fan-folded-20260930.png` inspected. Handle and both front contacts meet the riser at z 0.848999977 m and remain within its footprint; visible raw meshes have no zero-area faces. Rotor radius 0.051 m is below casing inner radius 0.054 m. Scoped external BVH finds only handle/feet-to-riser contacts. Rotor sampled every 5 degrees at 72 angles has no intersections except excluded motor-hub attachment; not continuous swept proof. Reports: handy-fan-audit-20260930.json and handy-fan-rotor-audit-20260930.json. Native save confirmed production path and clean state. Do not rerun guarded scripts. Fan target/session remains unwired; public model contains corrected fan.

### Mouse and entry tote

Mouse surface script applied once, saved/exported; scoped audit passed, silhouette/junction fidelity open. Fresh before/buttons images inspected.

refine_striped_tote.py applied once; original Plane.011 retained. Striped tote now open folded bag with two handles, original stripe material. Original033311397 and entry-rack-before/tote/tote-clearance-20260930.png inspected. Body moved50 mm outward, clears shelf/post; handles narrowed15 mm after clearance render, both post rechecks0. Final scoped scene audit: body clear, handles contact only upper shelf; zero-area0. striped-tote-audit-20260930.json retains trial/recheck evidence. Final narrowed-handle render inspected. Saved/public synchronized; tote metadata and both handles verified. Fabric fidelity incomplete. Rack tote canvas elsewhere untouched.

