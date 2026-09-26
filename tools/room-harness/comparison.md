# Reference, before-change, and after-change comparison protocol

## Scope and authority

Run this procedure before accepting any task that changes shape, placement, density, material, lighting, UI, or interaction. Requirements are authoritative in `conductor/room-spec.md`; execution state is authoritative in `conductor/CURRENT_TASK.md`. Comparison results are evidence, not a second requirements ledger.

For the current harness verification, do not resume production work. Verify that this procedure is executable against the existing references and artifacts.

## Machine-enforced receipt contract

`check.mjs` validates each receipt's `comparison` object through `comparison.mjs`. The object must contain:

- `kind`: `visual`, `behavior`, or `process`.
- `reference`: a repo-relative `source` that resolves to a contained regular file, nonempty `region`, and a lowercase 64-character SHA-256 `sha256` computed from that exact source file. Private references are staged manually under the ignored project evidence directory; this harness never copies or imports them.
- `criteria`: a nonempty array of unique IDs. Each criterion needs nonempty `expected` and `observed`, `verdict: "pass"`, and an empty `regressions` array.
- `review`: nonempty `author`, `reviewer`, `observation`, `reproducedBy`, and `reproduction`; `author` and `reviewer` must differ.

Visual and behavior records additionally need browser evidence plus `before` and `after` captures. Each capture has direct `path`, `sha256`, `artifactHash`, and `conditions` fields. The image path and SHA-256 must point to an entry in the receipt's `images`; `after.artifactHash` must equal the receipt `publicHash`. Before and after paths must differ and resolve to different files; resolved paths are computed by the checker, not supplied as receipt fields. `conditions` contains finite 3-vectors for `position` and `target`, a FOV between 0 and 180, a positive integer `[width, height]` viewport, nonempty `renderer`, `lighting`, `curtains`, `locale`, and `sceneTime`, plus a finite `exposure`. Before and after conditions must be identical. Identical image bytes additionally require a nonempty `comparison.unchangedReason`; independent review must confirm the unchanged state is legitimate. Behavior records also require nonempty `actions` and `returnState`.

Process records are nonvisual: they use nonempty string `before` and `after` observations, source fingerprints, a real reference, reviewer data, and no mandatory browser or image evidence. Any images supplied on a process receipt are still validated. The checker requires `kind: "visual"` for `GEO-*`, `AST-*`, `ART-*`, and `LIT-*`. The remaining current ledger prefixes are `AUTH-*`, `UX-*`, `CNT-*`, `DOC-*`, `VAL-*`, and `DELTA-*`; they are not forced to one kind by this shape gate, so each record's kind must still match its acceptance conditions. This prefix rule is only receipt-shape validation. It does not grant visual or product acceptance.

Every linked evidence image must pass signature, repository-identity, and SHA-256 checks, then decode through `/usr/bin/sips -Z 2048 -s format bmp` in `decode-image.mjs`. The decoded BMP header, declared length, and pixel-data offset are checked; temporary files are removed. No installed Node/Bun image decoder is assumed and no fallback is accepted. A missing `sips` decoder or invalid raster leaves the receipt unverified.

## 1. Fix the comparison target

Choose the task ID, requirement IDs, target objects, acceptance conditions, reference filenames, and reference regions. Distinguish the object, its boundary, and any annotation text in each image before observing it.

- Placement authority: the owner's latest floor plan. Do not replace it with perspective distortion from a wide-angle photo.
- Shape, storage, and display-density authority: photos that actually show the target and the owner's corrections.
- Interaction authority: the corresponding requirements and real browser interaction results.
- Existing good design: identify what must be preserved before changing it. Do not promote an old generated result to authority without checking it.

When references conflict, record which axis conflicts and why one source was selected. An unresolved axis remains `not_verified`. Do not rewrite the specification to match the implementation.

## 2. Preserve the before state

Record the current artifact hash, resolved target(s), target view, capture conditions, and known defects, then save a before image. Include good adjacent objects and interactions in the regression set.

Do not overwrite the before image or reuse its path for the after image. If no before image exists, record the gap. Do not later fabricate an old state and label it as before-change evidence. Identical before/after bytes are valid only when the state is legitimately unchanged and the receipt records why.

## 3. Build comparable views

| Comparison axis | Required view and conditions | What to judge |
| --- | --- | --- |
| Placement and openings | Floor plan and top view with wall and entrance directions aligned | Two openings on the same wall, furniture orientation, adjacency, throwing axis |
| Shelf and density | Full frontal shelf view and close view of each target bay | Storage categories, column fill, thickness/height distribution, front/back display order |
| Shape and material | Frontal and oblique target views including outline and contact surfaces | Toy-like geometry, transparency, UVs, edges, bases, contact, intersections |
| Posters and displays | Frontal close view and normal viewing position | Artwork, resolution, occlusion, wall intersection, display overlap |
| Lighting and curtains | Same camera in day, night, and manual-toggle states | Opening range, gaps, shadows, emission, light position |
| UI and interaction | Same URL, locale, viewport. Before input, during action, and after return | Hints, lock, selection, content, close action, camera restoration |

Match camera position, direction, FOV, viewport size, render method, time, lighting, exposure, and curtain state before and after. Record any condition that cannot be matched and hold judgments affected by it.

Photos and 3D views use different capture systems. Do not invent pixel-difference or estimated-dimension thresholds for photos without exact physical measurements. Compare density by bay-level categories, fill, placement, and intentional whitespace, not by raw object count.

## 4. Confirm the current artifact

For visual and behavior comparisons, after checking export and public GLB consistency, reload the browser and show the current model. Link the loaded model, URL, runtime code, and images in one verification record. Do not use another fetch, an old tab, or a screenshot with a different hash as evidence for the current scene. Process comparisons use source fingerprints and observations instead; browser and images are optional there, but any supplied images remain subject to validation.

Record Blender Material Preview, a render using scene lighting, and Web rendering as separate evidence. Do not use a studio HDRI preview as proof of implemented day/night lighting.

## 5. Judge differences one by one

Fill these fields for every acceptance condition of every requirement.

| Required field | Content |
| --- | --- |
| Target | Task ID, requirement ID, object or UI state, image region |
| Reference | Source and region, expected shape, placement, or behavior |
| Before | Image and hash, observed defect |
| After | Image and hash, actual observation under the same conditions |
| Difference | Resolved points, remaining points, and new regressions separately |
| Verdict | `pass`, `fail`, or `not_verified` with reason |
| Next action | Existing task that fixes the remaining defect, or a newly added task ID |

`pass` requires every needed view and interaction, resolved mismatch against the authority, and the specified regression checks. A remaining difference is `fail`; missing or incomparable evidence is `not_verified`. Do not approve the entire room from one close image.

Example: if the shelf photos show transparent binders, thin magazine groups, and face-out displays but the Web view shows uniform pale blocks, shelf fidelity is `fail` even when hashes match. Restoring the original illustration material alone does not resolve that failure.

## 6. Independently verify and return to the ledger

Give Luna/max the target requirements, reference sources, before/after artifacts, comparison conditions, verification commands, edit restrictions, and exact no-write boundary. Do not provide the production owner's passing conclusion first; have the independent reviewer judge from the references and current artifacts.

The main owner must directly recheck every returned finding. Do not treat subagent agreement or counts as proof. After a fix, repeat the same comparison conditions with new evidence.

Link final evidence to the target task in `CURRENT_TASK.md` and leave unresolved requirements visible. Keep source photos private; when a reference must be checked by the harness, stage it manually as a regular file under the ignored project evidence directory. Keep generated verification images outside Git under `tools/room-harness/evidence/`. The harness does not copy or import private references. Neither private reference photos nor generated evidence may be tracked in Git.
