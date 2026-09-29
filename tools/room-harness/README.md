# Room verification harness

Project-owned static verification entry point with no Codex, plugin, or external-tracker dependency. Passing machine checks does not approve the room's appearance, density, interaction, or completion.

## Run

Run from the repository root.

```sh
bun tools/room-harness/check.mjs
bun tools/room-harness/check.mjs --evidence tools/room-harness/evidence/room-receipt.json
GOMAXPROCS=1 UV_THREADPOOL_SIZE=1 bun tools/room-harness/check.contract.mjs
```

Exit codes:

- `0`: `--help`, or all static checks and evidence-link checks pass. This is not room acceptance.
- `1`: GLB, hash, freshness, shelf/poster reference, requirement mapping, or evidence check failed or is missing.
- `2`: unknown, missing, or duplicate CLI argument.

`--help` prints usage only. `--evidence` accepts one repository-relative JSON path. Running without arguments still exits `1` after static checks because evidence is not verified.

Evidence images are decoded before a receipt can pass. The checker invokes `/usr/bin/sips -Z 2048 -s format bmp` through `decode-image.mjs`, validates the resulting BMP header and length, and removes its temporary directory. There is no package or browser fallback; a missing decoder or invalid raster fails closed.

`comparison.reference.source` must be a repo-relative path that resolves to a contained regular file; its SHA-256 is computed from that exact file. Private references must be staged manually under the ignored project evidence directory when needed. This harness never copies or imports reference files. Private photos and generated evidence are never added to Git; tracked project documents may serve as process references.

## Build harness (native Blender loop)

`tools/room-harness/build/` fences the Blender build so an agent cannot drift from the floorplan, the item cards, or the budgets.

- `build-plan.json`: gates G1–G8 in build order, proof cameras, global budgets, and one contract per model-sheet ID (name pattern, floorplan anchor box in owner-floorplan units, min objects, max triangles, required `room*` props, required materials, thickness or variety rules). Anchors are converted to scene units at check time from the `Floor base` mesh bounds, so no metric assumption is baked in.
- `audit_scene.py`: run inside the live Blender through the native MCP (`exec(open('<repo>/tools/room-harness/build/audit_scene.py').read())`). Writes `build/audit-latest.json` (ignored by Git) with every `RoomHome` object: bounds, triangles, materials, props, collections.
- `check-build.mjs`: `bun tools/room-harness/build/check-build.mjs [--gate G3-COLLECTION | --item BOOK-MANGA] [--json]`. Exit `0` only when every selected item passes; `1` on any failure; `2` on a plan or calibration error. Passing is a structural gate, not visual acceptance.
- `render_proofs.py`: run inside Blender through MCP with `PROOF_ONLY={'PROOF_SHELF_FRONT', ...}` and `PROOF_TAG='<item>'` set first. Renders the plan's proof cameras to `evidence/build/<camera>-<tag>.png` and restores the scene render settings. The lead must open every proof and compare it with the photos before an item is marked done.
- `physics_audit.py`: run inside Blender through MCP. Writes `build/physics-latest.json` with three lists over the export set: `floating` (bottom face not resting on floor or another object's top within 2 cm with at least 25 percent footprint overlap, and not wall-mounted or enclosed), `wall_penetration` (AABB outside the room envelope), and `intersections` (pairwise AABB overlap above 30 percent of the smaller object, same-assembly parts skipped). Structural members (boards inside uprights, hung penlights, wall cards) show up as floating and must be judged by eye; contents, plush, books and props must be clean before an export.
- `PROMPT_room_build.md`: the one-item loop prompt for the delegated builder, with the hard fences and the audit → edit → check → proof → save order.

Bridge layout: the lead's Claude session talks to the Blender Lab extension `bl_ext.user_default.mcp` on `127.0.0.1:9876`; the delegated Codex builder talks to the ahujasid `blender_mcp` addon on `127.0.0.1:9877` (`codex exec -c mcp_servers.blender.env.BLENDER_PORT=9877`). Blender must be launched with `--online-mode` for the Lab bridge to auto-start. Only one agent edits at a time; the lead re-audits after every delegated slice.

## Authority and mapping

- Requirements and acceptance conditions: `conductor/room-spec.md`
- Work, ownership, dependencies, and the `Requirement IDs` column: `conductor/CURRENT_TASK.md`
- Source: `assets/room/room.blend`
- Export: `assets/room/room-web-current.glb`
- Lean/public: `assets/room/room-web-lean.glb`, `apps/astro/public/models/room.glb`
- Runtime sources: `apps/astro/src/components/home/room-runtime.ts`, `room-copy.ts`, `room-logic.ts`, `RoomHome.astro`
- [Reference comparison protocol](comparison.md)
- [Ask-for-comment protocol](ask-for-comment.md)

The checker extracts all requirement IDs from the ledger and marks IDs absent from the actual `Requirement IDs` column in `CURRENT_TASK.md` as `TASK-MAP: not_verified`. An ID appearing only in historical prose does not count as mapped.

## Evidence JSON schema

`schemaVersion` is `1`; `receipts` is an array. One receipt is required for every requirement ID in the ledger. Each receipt has the following shape.

```json
{
  "schemaVersion": 1,
  "receipts": [
    {
      "specId": "ART-01",
      "status": "verified",
      "publicHash": "<current-public-room-glb-sha256>",
      "sourceHashes": {
        "assets/room/room.blend": "<sha256>",
        "assets/room/textures/illustrated-posters.png": "<sha256>",
        "conductor/room-spec.md": "<sha256>",
        "apps/astro/src/components/home/room-runtime.ts": "<sha256>",
        "apps/astro/src/components/home/room-copy.ts": "<sha256>",
        "apps/astro/src/components/home/room-logic.ts": "<sha256>",
        "apps/astro/src/components/home/RoomHome.astro": "<sha256>"
      },
      "capturedAt": "<ISO-8601-after-current-source-and-export>",
      "reviewer": "<named-reviewer>",
      "observation": "<neutral-observation-of-the-current-evidence>",
      "browser": {
        "url": "http://127.0.0.1:4321/en",
        "modelHash": "<current-public-room-glb-sha256>",
        "decodedBodySize": 0,
        "reloaded": true
      },
      "images": [
        {
          "path": "tools/room-harness/evidence/before.png",
          "sha256": "<sha256-of-before-image>"
        },
        {
          "path": "tools/room-harness/evidence/after.png",
          "sha256": "<sha256-of-after-image>"
        }
      ],
      "posterObjects": [
        "Blue banner illustrated print",
        "Closet anime illustrated print",
        "Closet portrait illustrated print"
      ],
      "comparison": {
        "kind": "visual",
        "reference": {
          "source": "<repo-relative-reference-file>",
          "region": "<reference-region>",
          "sha256": "<64-lowercase-hex>"
        },
        "criteria": [
          {
            "id": "<criterion-id>",
            "expected": "<reference-grounded-expectation>",
            "observed": "<current-artifact-observation>",
            "verdict": "pass",
            "regressions": []
          }
        ],
        "review": {
          "author": "<different-from-reviewer>",
          "reviewer": "<independent-reviewer>",
          "observation": "<neutral-review-observation>",
          "reproducedBy": "<reviewer>",
          "reproduction": "<reproduction-result>"
        },
        "before": {
          "path": "tools/room-harness/evidence/before.png",
          "sha256": "<sha256-of-before-image>",
          "artifactHash": "<before-artifact-sha256>",
          "conditions": {
            "position": [0, 0, 0],
            "target": [0, 0, 0],
            "fov": 60,
            "viewport": [1280, 720],
            "renderer": "<renderer>",
            "lighting": "<lighting>",
            "curtains": "<curtain-state>",
            "locale": "<locale>",
            "sceneTime": "<scene-time>",
            "exposure": 0
          }
        },
        "after": {
          "path": "tools/room-harness/evidence/after.png",
          "sha256": "<sha256-of-after-image>",
          "artifactHash": "<current-public-room-glb-sha256>",
          "conditions": {
            "position": [0, 0, 0],
            "target": [0, 0, 0],
            "fov": 60,
            "viewport": [1280, 720],
            "renderer": "<same-renderer>",
            "lighting": "<same-lighting>",
            "curtains": "<same-curtain-state>",
            "locale": "<same-locale>",
            "sceneTime": "<same-scene-time>",
            "exposure": 0
          }
        }
      }
    }
  ]
}
```

`posterObjects` is required only for `ART-01` and must match the exact names and order. For visual and behavior receipts, the checker validates `publicHash`, every `sourceHashes` entry, image SHA256, image format (PNG/JPEG/WebP), repository-owned file identity, local browser URL, reload, public GLB byte size, capture time, reviewer, and observation. Process receipts retain source-fingerprint, reference, reviewer, and observation checks without requiring browser or image evidence; any supplied images are still validated. Mismatched hashes, future or invalid capture times, missing receipts, duplicate IDs, escaping symlinks, and arbitrary text passed as image evidence do not pass. A capture predating source modification times produces a warning when content hashes still match; modification time alone does not invalidate evidence.

The `comparison` record is required for every receipt. `kind` is `visual`, `behavior`, or `process`. Visual and behavior records require a real reference, nonempty criteria with `verdict: "pass"` and empty `regressions`, independent `review`, browser evidence, and linked `before`/`after` images with matching capture conditions. Before and after must use distinct capture paths resolving to different files. Identical image bytes additionally require a nonempty `comparison.unchangedReason`, verified by independent review. `after.artifactHash` must equal `publicHash`; behavior additionally requires nonempty `actions` and `returnState`. Process records are nonvisual: browser and image evidence are optional, but source fingerprints, a real reference, reviewer, and before/after observations remain required; any supplied images are still validated. `GEO-*`, `AST-*`, `ART-*`, and `LIT-*` receipts must use `kind: "visual"`; the other current ledger prefixes are `AUTH`, `UX`, `CNT`, `DOC`, `VAL`, and `DELTA` and are not forced to one kind by this shape gate.

This receipt check verifies only evidence-to-artifact linkage. Independent review must verify screenshot fidelity, visibility of all three posters in the actual screen, occlusion, shelf/photo match, and browser interaction. The poster GLB check is limited to the `Restored illustrated poster set` material, the `illustrated-posters` PNG, and the exporter-merged `Web Blue banner illustrated print` reference; it does not approve the three Blender objects or their Web visibility.

## Placeholder example

Replace every `<...>` in the schema above with real values. The following example is intentionally incomplete and is neither product evidence nor a passing receipt.

```json
{
  "schemaVersion": 1,
  "receipts": [
    {
      "specId": "ART-01",
      "status": "verified",
      "publicHash": "<NOT-A-HASH>",
      "sourceHashes": {},
      "capturedAt": "<NOT-A-TIMESTAMP>",
      "reviewer": "<PLACEHOLDER>",
      "observation": "<PLACEHOLDER-NOT-EVIDENCE>",
      "browser": {
        "url": "http://127.0.0.1:4321/en",
        "modelHash": "<NOT-A-HASH>",
        "decodedBodySize": 0,
        "reloaded": false
      },
      "images": [],
      "posterObjects": []
    }
  ]
}
```

Keep photos and temporary screenshots out of Git. Use only project-owned evidence captured against the current artifacts. Do not complete a requirement from an old browser view, old GLB hash, build success, labels, or filenames.
