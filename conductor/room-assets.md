# 部屋の生成資産

本書は生成資産の来歴・適用範囲・未検証境界だけを記録する。要求・状態・受入れ証拠の正規原本は[room-spec.md](room-spec.md)の正規要求台帳である。

## 書籍の背表紙アトラス

- assets/room/textures/book-spine-atlas.png。組み込みimagegenで制作したオリジナルの印刷アトラス。所有する本の実タイトルや出版社を再現したものではない。
- apply_book_spines.pyで実際の12列境界を指定し、背表紙正面だけにUVを設定。縦横比を保つ中央クロップを使用し、既存の単色帯はアーカイブ保全。browser-book-spines.pngで実ブラウザーの印刷を主担当視認。
- 生成プロンプト:

```text
Use case: stylized-concept. Asset type: flat albedo texture atlas for the spines of modeled books, magazines and tankobon in a personal Japanese hobby-room scene. Create ONE square high-resolution texture sheet divided into exactly 12 equal-width vertical spine strips, edge to edge, all full height, no gaps or margins. Each strip is a professionally printed original book spine design, mostly ivory or white coated paper with restrained navy, burgundy, ochre and teal accents; varied fine editorial linework, small original manga face vignettes, botanical illustration fragments, music notation fragments and precise small volume numerals 01 through 12. Use visual printed detail rather than giant blocks of color. Uniform flat lighting and orthographic straight-on scan, no shadows, bevels, perspective, bookshelf, room, binding geometry, photographs of books, logos or existing publishers/franchises. No invented readable titles, no pseudo-Japanese gibberish. This is print artwork for 12 narrow physical spine UV islands, not a mockup of books. Fine crisp ink and subtle paper grain. Output the atlas itself only.
```

## ノートPCとタブレットの実ページ表示

- laptop-projects-display.pngはローカルの実/en/projects/を1344×800で、tablet-notes-display.pngは実/en/notes/を984×800で専用headedブラウザーから取得した。ファイルはassets/room/textures/配下。架空のUIや生成したコード画面ではない。
- apply_desk_displays.pyで各画面の正面UVと発光材質へ適用し、Blender画像をパックした。静止した表示用テクスチャであり、画面内リンク自体の操作を提供するものではない。閲覧操作は既存HTMLオーバーレイを使用する。
- browser-desk-real-displays.pngで、実ブラウザー上のノートPCにProjects、タブレットにNotesが正方向で表示され、Projectsの実本文と共存することを主担当が視認した。

## 机上のグループポスター

- [desk-group-poster.png](../assets/room/textures/desk-group-poster.png)、1122×1402。組み込みimagegenで生成した独自の成人9人のイラスト。原写真の実グッズや既存キャラクターの複製ではない。
- apply_desk_poster.pyで円/矩形の旧人物と帯を非表示保全し、紙面の前面UVへ適用。縦横比を維持して下端1.7804、上端2.7305に配置。Blenderの目線高さ1.6と1.95でモニターに遮られず全図柄を視認。
- 最終生成プロンプト:

```text
Use case: stylized-concept. Asset type: flat printed anime group poster texture for a personal room's desk wall. Create an original polished Japanese anime ensemble illustration of nine distinct adult female performers in coordinated white stage outfits with restrained gold and blue accents, arranged as one cohesive group against a luminous pale-blue sky. Refined faces, distinct natural hairstyles, expressive poses, clean professional linework and dimensional cel shading, subtle flowing ribbons and fabric. Portrait 4:5 canvas, complete composition with ample margin around heads and limbs. Group fills the artwork without becoming cluttered. Artwork only, no room, no frame, no monitor, no physical poster mockup. No text, names, logos, watermark or existing franchise characters. Do not make a grid, collage, repeated copied characters, faceless circles or crude geometric shapes.
```

## 外部モニターの壁紙

- 原本: [monitor-forest-wallpaper.png](../assets/room/textures/monitor-forest-wallpaper.png)、1672×941。組み込みimagegenで制作したオリジナル風景。原写真のモニターに見える緑系イラストの方向性を参照し、所有者の元画像そのものとは扱わない。
- apply_monitor_wallpaper.pyで外部モニターの前面だけへUVと発光テクスチャを設定。Projects対象を保持。旧5本の仮コードバーはRoom superseded monitor placeholderで保全。Blender近接で向きと表示を確認。
- 最終生成プロンプト:

```text
Use case: stylized-concept. Asset type: flat landscape wallpaper texture for a desktop monitor inside a modeled personal room. Create an original polished anime-background painting of lush green woodland and a clear stream with softly sunlit foliage, natural layered depth and subtle stone banks. Calm daylight, vivid but believable greens and cool water highlights. Wide landscape 16:9 composition, edge-to-edge artwork. This is the screen image itself, NOT a picture of a monitor, room or device. No characters, no logos, no text, no UI, no borders, no watermark. Fine painterly detail and clean focal structure, not geometric placeholder shapes.
```

## 輪郭カット用人物イラスト

- 原本: assets/room/textures/acrylic-idol-navy.png。組み込みimagegenによるオリジナル人物画。既存の所有グッズの複製ではない。
- 制作指示: 成人の単独アイドル、栗色の髪、紺・アイボリー・金の衣装、靴まで含む全身、精細な印刷用イラスト。後続編集で背景の発光を除去し、無地の白背景へ変更。
- 1024×1536、アルファは全画素不透明。透過PNGとは扱わない。create_contour_stand.pyが最大連結領域の外周を抽出し、印刷面のUV・三角形と、外周を拡張した厚さ3mmの透明板を生成する。輪郭形状は画像から導出するが、内部の白領域の穴抜きは未対応。
- 追加原本: assets/room/textures/acrylic-idol-{burgundy,teal,amber,plum,rose}.png。すべて組み込みimagegenで生成した成人のオリジナル人物。burgundyは黒ボブ・赤紫の舞台衣装、tealは銀長髪・青緑ドレス、amberは赤褐色の編髪・マイクとクリームの衣装、plumは黒ポニーテール・眼鏡・パンツスーツ、roseは金短髪・薔薇色ドレス。指示は精細な全身印刷画、靴まで含む構図、無地白背景、発光・影・文字・台座なし。burgundyの初回背景の発光は画像編集で除去。
- create_contour_stand.pyのSTAND_SPECで画像名・高さ・位置を指定し、6体すべて輪郭メッシュへ置換。既存の仮形状は非表示コレクションで保全。5つの仮楕円額装も同じ原本の上半身UV領域へ変更。
- room-shelf-printed-assets-check.pngを主担当が視認。6体と5つの額装印刷が実棚に表示。ケース材質を分離してroughness .012、Cycles transmission/max bounceを12へ変更。ケース反射・一部印刷の重なり・細い毛髪外形は最終品質未達。Blender原本保存済み、GLB未同期。

## 住宅街の昼間パノラマ

- ファイル: [residential-day-panorama.png](../assets/room/textures/residential-day-panorama.png)
- 制作日: 2026-09-07。組み込み画像生成ツールで生成した架空の住宅街。実際の住所や近隣の記録写真ではない。
- 用途: 窓から見えるスカイボックスの昼間用候補。空、低層住宅、瓦屋根、バルコニー、室外機、電線、道路を含む。
- 保存した画像を主担当が直接視認済み。LDR画像でありHDR採光資産ではない。
- Blender Worldへ適用し、room-residential-window-check.pngで左窓越しの住宅街を主担当が視認。採光はphysical skyと分離。1774×887の全周画像では窓越しの細部が柔らかく、高精細品質は未達。
- Web配信用コピー: apps/astro/public/models/residential-day-panorama.png。room-runtime.tsで昼間背景へ接続済み。夜間用も下記画像へ接続。読込前・失敗時は手続き型Skyを維持。実ブラウザーは未検証。
- 未検証: 球面表示の継ぎ目・極、反射、夜景との遷移、実ブラウザー。昼画像を暗くするだけの処理を完成した夜景と扱わない。

### 生成指示

2:1の360度正距円筒パノラマ。日本の静かな住宅街をアパートの一階分程度の高さから見る。控えめな2〜3階建て住宅、淡い漆喰とコンクリート、瓦と金属屋根、小さなバルコニー、室外機、電柱・電線、鉢植え、遠景の集合住宅。自然な昼光と薄い雲、落ち着いた実在感のある色。上半分は主に空、下半分は一貫した住宅街。水平な地平線、左右端の連続性、球面投影に対応する天頂と天底を要求。室内・窓枠・人物・可読看板・ロゴ・透かし・架空の高層都市を含めない。最寄りの外壁は数メートル離し、画面全体を塞がない。

## 住宅街の夜間パノラマ

- 原本: [residential-night-panorama.png](../assets/room/textures/residential-night-panorama.png)。Webコピー: apps/astro/public/models/residential-night-panorama.png。
- 組み込みimagegenによる昼画像の照明変更。1774×887のLDR。主担当が画像を直接比較し、主要な屋根・街路・電柱の位置を視認。球面の継ぎ目と窓越しの夜間表示は未検証。
- 生成指示: 昼画像を編集対象とし、建物・屋根・道路・電線・視点・水平線・2:1構図を保持。照明のみ夜へ変更。自然な暗い紺色の曇天、一部の既存窓の暖光、控えめな街灯と乾いた路面への光。月・星・新しい建物・人物・車・ネオン・文字を追加しない。左右端の連続性を維持し、単なる青色フィルターにしない。
- runtimeはTokyoの既存昼夜判定で画像を選択。両テクスチャを個別に解放し、終了後に読込が完了した場合も破棄する。Blender Worldはまだ昼画像のまま。
