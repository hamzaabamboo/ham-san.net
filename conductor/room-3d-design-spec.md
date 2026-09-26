# Minimal 3D Room Render Specification

Status: visual gate before Blender editing. This is an implementation contract, not a mood board. All dimensions below are normalized scene units derived from the owner floorplan proportions; they are not claims about measured room dimensions.

## 1. Non-negotiable outcome

Render one compact rectangular main room that is immediately recognizable from the owner floorplan and reference photographs. Keep the geometry minimal, but keep the distinctive relationships and collection density. Do not add a generic bedroom, plants, piano, bed, sofa, extra desk, extra window, kitchen, or decorative filler.

Production order:

1. Generate and approve a static visual concept in the browser.
2. Build the bounded Blender scene below with native Blender MCP.
3. Capture native front, oblique, and close-up renders.
4. Export the saved `.blend` to one synchronized GLB.
5. Recheck the same views in the browser before adding interaction polish.

No Blender save/export is allowed before the concept gate passes.

## 2. Source authority

1. Latest owner floorplan (`owner-floorplan-v2 / 2026-09-07 15:20:59`) controls placement.
2. Owner corrections control shape and orientation: straight desk, two openings on one upper wall, left-facing PC desk, keyboard entrance-side, central darts stand, right-wall shelf, penlight/towel wall, balcony edge.
3. Supplied room photographs control furniture silhouettes, materials, and lighting cues.
4. Supplied shelf photographs and `room-reference-books-2026-09-08.md` control shelf categories, density, book proportions, and acrylic arrangement.
5. The browser references (Bruno Simon, Shahbaj Sheikh, FreeCodeCamp) control interaction vocabulary only.
6. Existing implementation, rejected renders, generic AI output, and CSS mockups cannot override the sources above.

The visual concept must be generated image-to-image from the supplied owner panorama plus room and shelf close-ups. It must preserve the owner-specific low ceiling, two curtain colors, darts over the packed plush rack, upright keyboard, monitor/laptop desk with Rubik's cube, teal mesh shelf bays, clear display boxes, distinct idol/anime goods, penlight grid, long live towels, signed posters, camera gear, entry and closet. Simplification reduces mesh count, loose clutter, and graphic detail; it cannot replace these categories with generic characters, stock furniture, or a different room.

### 2.1 Minimal graphic grammar

Every poster, uchiwa, acrylic insert, book spine, towel graphic, and small printed prop uses the minimum visual information needed to identify its source category. Use flat color fields, silhouette, one dominant accent, and at most a few structural marks. Do not render faces, readable text, logos, costume details, photographic texture, gradients, or dense linework. Preserve only the source object's dominant silhouette, aspect ratio, palette family, and one distinguishing motif. A graphic passes when it reads at normal approach distance and thumbnail scale; individual character likeness and collectible artwork fidelity are out of scope.

## 3. Normalized room coordinate system

Use a right-handed Blender scene with floor `z=0`, ceiling `z=3.0`, room width `x=10.0`, room depth `y=6.4`, wall thickness `0.15`. These are implementation scale values only. Preserve the floorplan ratios and relative positions if later calibrated to measured dimensions.

| Element | Normalized placement | Required geometry |
| --- | --- | --- |
| Main room | `x=0..10`, `y=0..6.4` | Four continuous boundaries; no kitchen mesh. |
| Upper wall | `y=6.4` | Two openings on this same wall: balcony opening left, second window right. Use wall segments around openings, not a paper backdrop. |
| Darts | between openings, centered on upper wall | Freestanding vertical stand, circular board, three visible darts, lower plush shelf, straight mat aligned on `-y`. |
| PC desk | left wall, beside left opening | Straight rectangular white top, T legs, thick monitor/riser, laptop, keyboard in playing position, mouse, sockets. Chair is on the desk's right. |
| Keyboard | left wall, entrance-side of desk | Separate stand; keys face into the room in an obvious playing orientation. |
| Shelf | right wall, upper-to-middle span | Large white modular frame with teal bay backs and mesh-like boards. The shelf is a collection wall, not a sparse cabinet. |
| Penlights/towels | right wall below/entrance-side of shelf | Separate fixed display grid. Penlights stand vertically and emit when on. Long live/event towels hang from wall rails; no clothes hanger. |
| Low table | in front-left of shelf | Low rectangular floor table; never a square placeholder. |
| Beanbag | below the low table toward room center | One low rounded beanbag, clear floor contact. |
| Entry | lower-left wall | Door/entry boundary remains visible. |
| Closet | lower-right wall | Sliding closet door; open/closed state later. |
| Posters | left wall, right wall, lower wall | Three or four restrained minimal illustrated graphics, each visible from a normal approach and not blocked by furniture. |
| Balcony | through left upper opening | Floor slab, pale sill/low wall, metal rail, both side edges, residential street background. |

Keep a clear walking channel from entry to the desk, darts mat, low table, shelf, and closet. Do not use camera perspective to hide a broken wall or a missing balcony edge.

## 4. Geometry budgets

The budgets keep the scene implementable while preserving the reference read.

| Category | Hero geometry | Instanced/LOD geometry | Hard limit |
| --- | --- | --- | --- |
| Architecture | wall segments, floor, balcony edge, two window frames, two curtain tracks | none | 30 renderable objects |
| PC zone | desk top/T legs, chair, monitor, laptop, keyboard, mouse, sockets | cable bundle as one low-detail curve | 24 objects |
| Darts zone | stand, board, mat, three darts, three plushies | dart pins as one instanced mesh | 16 objects |
| Shelf frame | uprights, boards, teal backs, base/side trim | repeated boards linked, not duplicated geometry | 24 objects |
| Shelf books/paper | 12 unique thin spine meshes, 4 magazine/album covers, 4 folder/sleeve profiles | 60–90 linked instances, 3 LODs | 120 visible items |
| Acrylic collection | 8 unique silhouette inserts, clear plate, base, three-level riser | 24 hero stands plus 48 low-detail linked stands | 72 visible stands |
| Penlight/towel wall | 4 penlight body variants, one hook rail, 3 towel meshes | 12–16 penlight instances | 24 visible items |
| Room identifiers | 3–4 poster planes, 1–2 uchiwa, camera, Rubik's cube, yoyo, kendama, cards | no random filler | 16 objects |

The visible shelf should feel packed because categories are grouped and instances are tightly supported, not because identical rectangles are multiplied. Every hero object must have a real support/contact surface.

## 5. Shelf construction

### 5.1 Frame

Use a white modular frame with three columns and four rows in the visible hero area. Boards are thin white mesh-like shelves; bay backs are matte teal. Keep the outer uprights and floor contact in every review frame.

### 5.2 Books and paper

Use thin book proportions: spine width `0.035–0.09`, height `0.28–0.52`, depth `0.18–0.24` in normalized shelf units. Most spines are white/cream. Add fine dark spine marks and restrained red/blue/green bands through one packed atlas, not a random color per block. Group into:

- continuous numbered manga lanes;
- mixed-height magazines/tankobon with a few controlled leans;
- albums/folders/sleeves with visible cover thickness;
- sparse face-out print or framed interruption.

Reject thick blank slabs, rainbow rows, floating books, raw photo planes, or empty bays used to hide missing work.

### 5.3 Acrylic stands and 雛壇

Each hero stand is one parametric assembly:

1. silhouette-shaped printed insert;
2. transparent plate with real thickness and polished edge;
3. fitted base with stable contact;
4. one of three stepped riser heights.

Arrange each upper display bay as a cluster of 5–8 distinct stands: rear high, middle supported, front low. Vary silhouette, height, base width, and small rotation within the cluster. Do not use identical six-across rows, opaque cubes, black silhouette cards, cloudy glass, or unsupported plates. The clear plate must remain readable against the teal backing.

## 6. Materials and textures

Use a small PBR material set:

- `WallPlaster`: warm neutral, roughness `0.82`.
- `FloorWood`: warm wood, roughness `0.55`, tiled atlas with controlled seam scale.
- `PaintedWhite`: shelf/desk, roughness `0.48`, bevel `0.01–0.02`.
- `ShelfTeal`: matte teal bay backing, roughness `0.7`.
- `PaperSpineAtlas`: pale spine families, fine marks, restrained bands, sRGB color space.
- `AcrylicClear`: alpha blend, transmission/refraction enabled where supported, IOR about `1.45`, alpha not milky, visible edge thickness.
- `CurtainCloth`: warm neutral cloth, two-sided, roughness `0.78`, continuous folds.
- `PenlightEmission`: body material plus per-instance emissive color/intensity.

Posters, uchiwa, acrylic inserts, shelf paper goods, and towels use the minimal graphic grammar in section 2.1. Each graphic is a flat 2–4 color composition with a distinct silhouette or band layout and no more than a few identifying marks. Use a restrained atlas of source-grounded variants; do not paste full photographs onto planes, invent readable text, preserve facial or costume detail, or reuse one graphic for every item.

## 7. Lighting and exterior

Use one sun/area key through the openings, one low-intensity ambient fill, and localized penlight/room-light emitters. The runtime has two deterministic phases using `Asia/Tokyo`:

- Day: neutral daylight, visible residential street, PC-side left curtain closed as requested, room lights low.
- Night: warm interior pool, cool/dim exterior, penlights visibly emitting, curtains manually or automatically open/closed.

Exterior is a restrained residential street card/panorama with houses, roofs, utility lines, trees, balcony floor, rail, and atmospheric depth. It is not a blank gradient or a generic space skybox.

## 8. Browser concept gate

The browser proof must show generated raster concept art, not CSS rectangles pretending to be a 3D room. Use one route with three real images or image states:

1. Minimal room render: wide 3/4 view proving both openings, central darts, left desk/keyboard, right shelf/display wall, low table, beanbag, entry, closet, posters, and walk channel.
2. Shelf close-up: front/oblique view proving teal bays, thin books, clear acrylic, three-level risers, and intentionally reduced graphic marks.
3. Examine crop: darkened focused view proving a single hero acrylic/book cluster, subject-led framing, reduced silhouette/palette graphics, and HTML explanation panel.

The route is labelled `DESIGN CONCEPT — NOT THE BLENDER SCENE`. It may contain text beside the images, but it must not use HTML/CSS primitives as the visual substitute. Capture all three states in the headed browser at the same desktop viewport. Reject any image with invented furniture, wrong wall relationships, blank shelf areas, oversized books, cloudy acrylic, cropped windows, or a missing balcony edge.

## 9. Blender and GLB implementation

- Build with native Blender MCP only; no Blender CLI or Python MCP client.
- Keep collections separated: `Architecture`, `Furniture`, `ShelfFrame`, `ShelfContent`, `AcrylicHero`, `RoomDetails`, `Lights`.
- Use linked duplicates/Geometry Nodes for repeated books, penlights, and low-detail stands. Do not apply modifiers to every instance.
- Keep UVs inside atlases; preserve sRGB/linear intent and alpha modes through GLB export.
- Use bevels only on silhouette-critical edges. Apply transforms before export. Check object bounds and support contact in Blender, not only in the browser.
- Target GLB: under `50 MB`, under `450k` triangles, under `150` draw calls in the default view, and no duplicate full-resolution meshes for repeated content.
- Required proof before delivery: native full-front room, native top/oblique layout, native shelf close-up, GLB material inspection, browser render parity, and no clipping/intersection.

## 10. Interaction stays after visual acceptance

Only after the static visual gate passes: WASD/pointer lock, click-to-examine with movement lock, Resident Evil-style HTML overlay, Escape restore, lie-down PC view, curtains, left/right light switches, closet, mobile tap movement, and darts mini-game. Interaction cannot be used to hide a bad render or incorrect placement.

## 11. Explicit rejects

- Generic CSS mockups presented as 3D proof.
- Generated scenes that add plants, beds, sofas, pianos, extra desks, extra windows, or kitchen geometry.
- Layouts that move the desk, keyboard, darts stand/mat, shelf, penlight/towel zone, entry, closet, or posters away from the owner floorplan.
- Empty or random shelf content, repeated rainbow blocks, thick books, cloudy acrylic, floating stands, raw photo planes, detailed character/photo graphics, or placeholder silhouettes.
- Blender edits or GLB exports before the browser concept is accepted.
