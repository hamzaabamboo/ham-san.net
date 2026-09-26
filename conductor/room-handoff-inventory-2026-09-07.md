# 3Dホーム引継ぎ — パス状態一覧、2026-09-07

この一覧は引継ぎ中の限定パスに対するGitの実出力。変更内容や完成を証明しない。`M`は追跡済み変更、`??`は未追跡。部屋のスクリプト・モデル・画像は本作業系列の成果物だが、過去の個別作者までは検証していない。StatusRow、Astro設定、その他の製品変更には別作業が含まれ、所有権は不明。取り消さない。conductor/historyの旧Astro資料は列挙のみで今回未読。

取得時点は引継ぎ文書作成前。後から作成した `conductor/room-full-handoff-2026-09-07.md` と本一覧は下記の過去出力に含まれない。両方とも今回の文書成果物であり、現在は未追跡。再取得時は消失と誤判定しない。

取得コマンド:

```sh
git status --short --untracked-files=all -- AGENTS.md apps/astro/astro.config.mjs apps/astro/src/components/home apps/astro/src/pages/'[locale]'/index.astro apps/astro/src/pages/'[locale]'/overview.astro apps/astro/public/models assets/room conductor
```

## G-01 follow-up paths created after the original inventory

These paths were created during the 2026-09-08 G-01 audit and are not part of the historical status block above:

```text
assets/room/densify_shelf_contents.py
assets/room/repair_shelf_density.py
assets/room/fill_shelf_bays.py
assets/room/fill_shelf_top_bay.py
assets/room/refill_shelf_top_display.py
assets/room/repair_shelf_book_edges.py
assets/room/g01-topdown.png
assets/room/g01-layout-objects.png
assets/room/g01-overview.png
assets/room/g01-shelf-front.png
assets/room/g01-shelf-wide.png
assets/room/g01-shelf-wide-after.png
assets/room/g01-shelf-wide-final.png
assets/room/g01-shelf-wide-final2.png
assets/room/g01-shelf-densified.png
assets/room/g01-shelf-final3.png
assets/room/g01-shelf-polished.png
assets/room/g01-shelf-polished-final.png
conductor/room-g01-audit-2026-09-08.md
```

The G-01 images are inspection evidence, not product screenshots. `room.blend` has the shelf-density changes saved through native Blender MCP. The export/sync/browser gate is now complete for this bounded shelf correction: lean/public SHA256 `01fa6c7aaaa0e9c8a965b2b075e55a856d74d340093cd623b2af99ee22782d0e`, fresh headed shelf focus/room return evidence, and empty browser errors. Whole-room gates remain open.

取得後の追記: `assets/room/refine_kendama_cups.py`、`assets/room/refine_card_faces.py`、`assets/room/kendama-cups-inspect.png`、今回のbrowser証拠画像、`conductor/room-full-handoff-2026-09-07.md`はこのstatus取得後に作成または更新された。履歴時点のWebモデルhashは`36a0c54c9a91bcff0b7da98ad0ae0b896ea68c1335b904eee5081ff199303721`。G-01棚修正後の現行lean/public hashは追記セクションと`room-g01-audit-2026-09-08.md`に記録する。下記一覧は履歴時点のinventoryであり、追記パスが存在しないという意味ではない。

```text
 M AGENTS.md
 M apps/astro/astro.config.mjs
 M apps/astro/src/components/home/StatusRow.astro
 M apps/astro/src/pages/[locale]/index.astro
?? apps/astro/public/models/residential-day-panorama.png
?? apps/astro/public/models/residential-night-panorama.png
?? apps/astro/public/models/room.glb
?? apps/astro/src/components/home/RoomHome.astro
?? apps/astro/src/components/home/room-copy.ts
?? apps/astro/src/components/home/room-runtime.ts
?? apps/astro/src/pages/[locale]/overview.astro
?? assets/room/add_balcony.py
?? assets/room/add_skill_toys.py
?? assets/room/add_wall_uchiwa.py
?? assets/room/apply_book_spines.py
?? assets/room/apply_desk_displays.py
?? assets/room/apply_desk_poster.py
?? assets/room/apply_monitor_wallpaper.py
?? assets/room/arrange_display_case_contents.py
?? assets/room/bind_live_towels.py
?? assets/room/browser-acrylic-polish-comparison.png
?? assets/room/browser-balcony-first.png
?? assets/room/browser-book-spines.png
?? assets/room/browser-cardistry-marker-current.png
?? assets/room/browser-case-contents.png
?? assets/room/browser-case-glazing-isolation.png
?? assets/room/browser-case-polished-comparison.png
?? assets/room/browser-cases-before-current.png
?? assets/room/browser-chair-pad-current.png
?? assets/room/browser-cloth-shape.png
?? assets/room/browser-darts-focus.png
?? assets/room/browser-day.png
?? assets/room/browser-desk-real-displays.png
?? assets/room/browser-entry.png
?? assets/room/browser-events-content.png
?? assets/room/browser-framed-uv-fixed.png
?? assets/room/browser-furniture.png
?? assets/room/browser-handoff-final.png
?? assets/room/browser-hobbies-composed.png
?? assets/room/browser-hobbies-focus.png
?? assets/room/browser-hobby-inventory-current.png
?? assets/room/browser-hobby-markers-current.png
?? assets/room/browser-hobby-markers.png
?? assets/room/browser-ja-rubiks-current.png
?? assets/room/browser-kendama-keyboard-current.png
?? assets/room/browser-lighting-after.png
?? assets/room/browser-lighting-balanced.png
?? assets/room/browser-lighting-before.png
?? assets/room/browser-live-current.png
?? assets/room/browser-live-room.png
?? assets/room/browser-live-towel-attendance.png
?? assets/room/browser-mobile-entry.png
?? assets/room/browser-mobile-hobbies.png
?? assets/room/browser-namecard-content.png
?? assets/room/browser-notes-content.png
?? assets/room/browser-panel-keyboard-check.png
?? assets/room/browser-pen-marker-current.png
?? assets/room/browser-piano-content.png
?? assets/room/browser-piano-direct-page.png
?? assets/room/browser-projects-content.png
?? assets/room/browser-projects.png
?? assets/room/browser-return-room.png
?? assets/room/browser-shelf-placement-fixed.png
?? assets/room/browser-shelf-refined-focus.png
?? assets/room/browser-shelf-structure.png
?? assets/room/browser-skill-toys-entry.png
?? assets/room/browser-skill-toys-shelf.png
?? assets/room/browser-th-contact-tabs-fixed.png
?? assets/room/browser-th-namecard-current.png
?? assets/room/browser-th-return-current.png
?? assets/room/browser-uchiwa-attendance.png
?? assets/room/browser-uchiwa-current-focus.png
?? assets/room/browser-uchiwa-current.png
?? assets/room/browser-uchiwa-entry.png
?? assets/room/browser-uchiwa-group-focus.png
?? assets/room/browser-yoyo-content-current.png
?? assets/room/browser-yoyo-hover.png
?? assets/room/chair-geometry-check.png
?? assets/room/configure_case_volume.py
?? assets/room/create_contour_stand.py
?? assets/room/export_room_web.py
?? assets/room/refine_beanbag_cloth.py
?? assets/room/refine_chair_cushion.py
?? assets/room/refine_closet.py
?? assets/room/refine_curtains.py
?? assets/room/refine_dartboard_curves.py
?? assets/room/refine_keybed.py
?? assets/room/refine_shelf_structure.py
?? assets/room/repair_closet_overlap.py
?? assets/room/repair_closet_poster_clearance.py
?? assets/room/repair_wall_seams.py
?? assets/room/room-acrylic-clear-cases-check.png
?? assets/room/room-acrylic-contour-check.png
?? assets/room/room-acrylic-fill-check.png
?? assets/room/room-case-isolation-check.png
?? assets/room/room-case-raw-transmission-check.png
?? assets/room/room-case-refraction-only-check.png
?? assets/room/room-case-unfiltered-check.png
?? assets/room/room-closet-construction-check.png
?? assets/room/room-current-authored-lighting.png
?? assets/room/room-current-penlight-night-check.png
?? assets/room/room-curtain-construction-check.png
?? assets/room/room-curtain-header-check.png
?? assets/room/room-day-fill-balance-check.png
?? assets/room/room-daylight-shading.png
?? assets/room/room-desk-audit.png
?? assets/room/room-desk-curtain-check.png
?? assets/room/room-keybed-shape-check.png
?? assets/room/room-keyboard-playing-check.png
?? assets/room/room-layout-corrected.png
?? assets/room/room-minimal-poster-shading.png
?? assets/room/room-night-shading.png
?? assets/room/room-pc-clearance-check.png
?? assets/room/room-pc-detail-check.png
?? assets/room/room-penlight-wall-check.png
?? assets/room/room-photo-comparison.png
?? assets/room/room-poster-clearance-night-check.png
?? assets/room/room-preview.png0001.png
?? assets/room/room-print-detail.png
?? assets/room/room-rack-cycles-check.png
?? assets/room/room-residential-night-check.png
?? assets/room/room-residential-night-glass-check.png
?? assets/room/room-residential-window-check.png
?? assets/room/room-shelf-printed-assets-check.png
?? assets/room/room-six-acrylic-check.png
?? assets/room/room-sky-shading.png
?? assets/room/room-storage-audit.png
?? assets/room/room-web-candidate.glb
?? assets/room/room-web-current.glb
?? assets/room/room-web-glass-candidate.glb
?? assets/room/room-web-lean.glb
?? assets/room/room.blend
?? assets/room/room.blend1
?? assets/room/shelf-geometry-check.png
?? assets/room/strip_unused_uv.mjs
?? assets/room/textures/acrylic-idol-amber.png
?? assets/room/textures/acrylic-idol-burgundy.png
?? assets/room/textures/acrylic-idol-navy.png
?? assets/room/textures/acrylic-idol-plum.png
?? assets/room/textures/acrylic-idol-rose.png
?? assets/room/textures/acrylic-idol-teal.png
?? assets/room/textures/blue-banner.png
?? assets/room/textures/book-spine-atlas.png
?? assets/room/textures/closet-illustration.png
?? assets/room/textures/closet-portrait.png
?? assets/room/textures/desk-group-poster.png
?? assets/room/textures/fabric-basecolor.png
?? assets/room/textures/fabric-normal.png
?? assets/room/textures/illustrated-posters-minimal.png
?? assets/room/textures/illustrated-posters.png
?? assets/room/textures/laptop-projects-display.png
?? assets/room/textures/linen-basecolor.png
?? assets/room/textures/monitor-forest-wallpaper.png
?? assets/room/textures/oak-basecolor.png
?? assets/room/textures/paper-basecolor.png
?? assets/room/textures/plywood-basecolor.png
?? assets/room/textures/residential-day-panorama.png
?? assets/room/textures/residential-night-panorama.png
?? assets/room/textures/tablet-notes-display.png
?? assets/room/textures/wood-normal.png
?? conductor/CURRENT_TASK.md
?? conductor/evidence/room-references/bruno-current.png
?? conductor/evidence/room-references/bruno-entry.png
?? conductor/evidence/room-references/shahbaj-entry.png
?? conductor/evidence/room-references/shahbaj-loaded.png
?? conductor/history/astro-fidelity-2026-08-20.md
?? conductor/room-assets.md
?? conductor/room-hobby-map.md
?? conductor/room-reference-map.md
?? conductor/room-resume.md
?? conductor/room-spec.md
?? conductor/room-verification-handoff.md
```
