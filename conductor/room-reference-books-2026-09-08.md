# Shelf reference annotation

要求・状態・受入れ証拠は[room-spec.md](room-spec.md)の正規要求台帳を参照する。本書は棚写真の観察記録だけを保持する。

- Source archive: `/Users/vittayapalotai.tanyawat/Downloads/Photos-1-001 (2).zip`
- Inspection copy: `/tmp/ham-room-reference-5wqZux` (temporary, not a project asset)
- Scope: both 3000x4000 JPEGs were opened at full useful resolution on 2026-09-08. The archive is a shelf-detail supplement, not a replacement for the room floorplan.
- Git boundary: the archive and extracted images stay outside the repository. This note records observations only.

## `PXL_20260908_051921621.jpg`

- White modular shelving fills the frame, with turquoise/teal bay backings and white uprights/edges.
- Upper bays contain tightly layered acrylic goods, packaged standees, postcards, envelopes, and a few small boxes. The arrangement is dense but grouped by bay; it is not a row of identical colored blocks.
- Middle bays mix clear sleeves, folders, paper goods, a cylindrical container, and vertically stored merchandise. Several items lean or overlap while remaining supported by the shelf.
- Lower bays contain manga/books, albums, clear storage sleeves, and a framed item. The visible book lanes are tight with small, irregular gaps.
- Book spines are mostly pale white/cream with narrow black or colored typography and occasional red/blue/green bands. They are not saturated solid-color volumes.

## `PXL_20260908_051924187.jpg`

- A second white bookcase is packed almost edge-to-edge with Japanese books, magazines, and tankobon. Shelves use mesh-like boards and substantial white frames.
- The upper row contains mixed magazine/book heights with mostly light spines, sparse color accents, and fine vertical text. A few volumes lean; the majority are aligned.
- The lower row contains a continuous manga run with numbered white spines, creating a coherent collection band rather than random single objects.
- A framed portrait and flat paper goods interrupt the book rows at deliberate positions; the interruptions are sparse and readable.

## Required scene correction

- Keep the floorplan placement unchanged unless a new placement source contradicts it. This archive corrects shelf composition and materials, not wall coordinates.
- Replace the current rainbow block-book look with tightly packed, varied-width white/cream spine families, fine dark title marks, restrained colored bands, occasional leaning volumes, and organized magazine/tankobon/album groupings.
- Retain a few teal-backed display bays and clear acrylic pieces above/among the books. Use transparent thickness and silhouette-specific bases for acrylic items; do not turn the shelf into opaque cubes.
- Preserve readable negative space for interaction targets and keep book meshes inside their bay bounds. No clipping through boards, upright supports, or neighboring books.

## Current implementation observation

- After the current public model reload, the headed browser decoded a 32,878,180-byte GLB and still showed repeated pale spine blocks rather than the source categories: dense acrylic cubbies, translucent labeled binders, grouped magazines, face-out art, sleeves, and leaning white-spine rows.
- The shelf fidelity is therefore failed for the current render and remains open for `AUTH-02`, `AST-04`, `AST-05`, and `AST-16`. Restoring the poster atlas does not satisfy this shelf comparison. This is a current observation, not a second requirement ledger.
