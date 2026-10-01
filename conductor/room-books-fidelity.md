# 書籍・紙資料の制作状態

## 原資料

- 原写真は `tools/room-harness/evidence/reference-archives-20260908/archive-1/`。変更禁止。
- `PXL_20260907_015010154.jpg`：棚全体。確認用切り抜きは `tools/room-harness/item-compare/work/books-original-detail-20260930.jpg`。
- `PXL_20260908_033114085.jpg`：中央アクリル展示。左端に白い薄型雑誌の列、下端に厚さの異なるアルバム類を確認できる。
- `033115504` は額装写真、`033118190` は上部アクリル展示、`033126602` はぬいぐるみ棚、`033125497` はダーツ・ぬいぐるみ棚。仕様の写真索引と一部不一致。仕様を写真に合わせて書き換えていない。

## 適用済み変更

以下は一回のみ適用済み。再実行禁止。元メッシュ・素材は保持。

- `assets/room/refine_book_spine_palette.py`：書籍9メッシュの背表紙を既存仕様アトラスへ変更。
- `assets/room/refine_folder_spine_palette.py`：フォルダー8メッシュを淡い背表紙へ変更。
- `assets/room/refine_book_page_edges.py`：`Magazines U1 top`、`Books U1 shelf 2`、`Photobooks U1 shelf 1` の64冊に表紙縁・本文断面の区別を追加。実境界・配置は維持。
- `assets/room/refine_top_magazines.py`：上段30冊の既存数を維持し、厚さ・高さと背表紙の構成を調整。厚さ約6.2–18.6 mm、高さ約263–300 mm、間隔1.2 mmは写真からの制作推定値であり実測値ではない。棚内の横方向占有範囲と底面高さを維持。三角形追加なし。
- `assets/room/textures/top-magazine-spines.png`：原写真の白・灰褐色・黄土・淡い桃色を参考に生成した16列アトラス。読める文字・タイトル・顔・ロゴは追加していない。生成画像は原写真の代替証拠ではない。

## 検証

すべて `tools/room-harness/item-compare/work/`。

- `book-support-before-20260930.json`：選択した7列の棚支持を確認。
- `book-page-edges-audit-20260930.json`：64冊の変更前後境界一致、非多様体辺0、面積ゼロ0。
- `book-pages-close-before-20260930.png` / `book-pages-close-after-20260930.png`：同一カメラ画像を直接確認。
- `top-magazine-before-20260930.png` / `top-magazine-after-20260930.png`：同一カメラ画像を直接確認。上段のみ変更、下段を保持。
- `top-magazine-audit-20260930.json`：30冊すべて `Shelf U1 bookcase shelf 3` が支持。隙間約0.5 mm、非多様体辺0、面積ゼロ0。
- `top-magazine-external-audit-20260930.json`：書き出し対象の可視シーンとの表面交差なし。全室の接触証明ではない。
- 保存元 `assets/room/room-v2.blend` と公開用 `apps/astro/public/models/room.glb` を同期。公開ノードの `topMagazinesRefined` と3素材を確認。
- `source-gate-top-magazines-20260930.json`：保存元の一致は合格。632160 / 450000三角形、旧名称による項目照合、全室の物理証明は未解決。

## 次の比較

バインダーの実冊数・幅と、下段アルバム・フォルダーの縦置き・積層を全景原写真と現在の同一構図レンダーで比較する。現在の上段30冊を実冊数として扱わない。バインダー6背は写真に見える構成の解釈であり、所有冊数の確定ではない。全棚の写真一致は未承認。

## クリアバインダー

- 原写真 `PXL_20260908_033141015.jpg` と `033143232.jpg` はペンライト棚の近接写真。左下に灰色の半透明バインダー、上端から折り返す暗い布帯、小さな金属スナップ、上寄りの紙ラベルを確認した。
- `assets/room/refine_clear_binders.py` は一回のみ適用済み。再実行禁止。対象 `Clear files U4 middle` の元メッシュを保持し、低い指穴付きファイルボックスの背表紙を灰色の素材へ変更。元の22冊・配置・底面高さは保持したが、実冊数・幅との一致は未証明。
- `assets/room/textures/clear-binder-spines.png` は生成した16列アトラス。紙ラベルは無地。元写真の人物名・文字を創作していない。
- `Clear binder top straps` と `Clear binder metal snaps` を追加。布帯は折り返しを含む閉じたL形断面、スナップは12角柱。寸法・透過量は制作推定値。
- 同一カメラの `clear-binders-before-20260930.png` / `clear-binders-after-20260930.png` を直接確認。灰色素材・上部帯・スナップが表示され、下段は保持。
- `clear-binder-audit-20260930.json`：3部品とも面積ゼロ0、非多様体辺0、対象外との表面交差0。22冊すべて `Shelf U4 teal shelf 2` が約0.5 mm下で支持。意図した3部品相互の接触はこの外部検査から除外。
- `clear-binder-attachments-20260930.json`：スナップと布帯、折り返しと上端の局所座標による接合値を確認。最大誤差約0.000000096 m。全室の支持証明ではない。
- 保存元と公開GLBを同期し、3ノード・灰色素材・布帯・金属素材を確認。`source-gate-clear-binders-20260930.json` は保存元一致に合格。633568 / 450000三角形、全室の物理証明は未解決。書き出し中間ファイルは削除済み。

## バインダー列の構成修正

- `refine_binder_group.py` は一回のみ適用済み。再実行禁止。全景015010154と近接033141015を再確認し、22薄型反復を6つの幅広背へ変更。布帯は灰・紫・青・黒・金の5つ、末尾は帯なし。幅は制作推定値、列の占有範囲と支持高さを維持。
- `binder-group-after-20260930.png` を原写真切り抜きと直接比較。下段8つの同型リングファイルは原写真の混在アルバムに未一致。
- `binder-group-audit-20260930.json`：6背すべて棚支持約0.5 mm、3部品の面積ゼロ・非多様体辺・対象外表面交差0。
- `binder-group-attachments-20260930.json`：5布帯と背、5スナップと布帯の局所接合隙間0。
- 制作元を保存、保存後dirty=false。公開GLBをWebP88・UV除去・meshoptで同期。binder-group-public-20260930.jsonで6背メタデータ・5布帯素材を確認。中間ファイル削除済み。source-gate-binder-group-20260930.jsonは保存元一致に合格、632288 / 450000三角形と全室表面接触証明は未解決。

## U4下段の混在アルバム

- `refine_lower_albums.py` 一回のみ適用済み。再実行禁止。元メッシュ保持。原015010154全景を基準に同型指穴ファイルを撤去し、淡色・赤褐色・灰色・クリーム・オリーブの異なる背へ変更。8縦置きと6積層は制作解釈であり、実冊数の確定ではない。寸法推定。
- 生成補助資料：assets/room/textures/lower-albums-reference-20260930.png。原写真の代替証拠ではない。
- lower-albums-before/after-20260930.jpg を同一カメラで直接比較。色・高さ・厚さ・平積みの構成を改善したが、面質と隠れた細部は未承認。レンダー形式は既存JPEG設定、カメラと設定は復元。
- lower-albums-audit-20260930.json：面積ゼロ・非多様体辺・部品内外表面交差0。縦置き8冊と積層底面は棚上約0.5mm、上層は下層上約0.2mm。
- 保存元と公開GLB同期。lower-albums-public-20260930.jsonでメタデータと11素材確認。中間ファイル削除。source-gate-lower-albums-20260930.jsonは保存元一致合格、632808/450000三角形、全室接触証明未解決。
- 次：U4底面棚。原写真の底面切り抜きを再確認すると幅広の縦置き淡色スリーブであり、平積み中心という解釈は誤り。現在の19薄型書籍と比較する。
