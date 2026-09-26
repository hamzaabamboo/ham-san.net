# 部屋内の趣味対応

原本は既存の `/[locale]/hobbies` とその実ページ。2026-09-07に主担当が実ブラウザーの一覧を確認し、その後すべてのルート本文とMusicの3子ページ、TypingのSteno子ページをローカル実ページから読了。一覧だけの確認を本文読了と扱わない。休止状態はオブジェクトを省略する理由にはしない。本文や所有機種、技能実績は創作しない。

| 趣味 | 既存ページID | 部屋で必要な表現 | 現状 |
| --- | --- | --- | --- |
| Camera | 6c2d00b7-dc75-4f45-b286-bf1cbf9e5284 | カメラ。Wishlist/Researchと実所有を区別する | 個別対象なし |
| Typing / Steno | f28e6219-f8ea-4801-bbca-7fd3f0686da5 | PC入力機器とステノの内容への接続。ピアノ鍵盤と混同しない | キーボードデッキ・キー・凡例をtyping対象へ接続。実ブラウザーでTyping/Steno本文を確認 |
| Music | db3c4b0f-40a1-4132-9732-442ce3b27236 | ピアノ、トロンボーン、採譜の内容を取りこぼさない | ピアノのみ対応 |
| Darts | ce3055fa-eff2-487f-bd6f-3860dde96bae | ダーツボード・スタンド・マット | 個別対象あり、形状検証は未完了 |
| Rubiks | abdbab31-794f-43c6-bef0-852e1748494e | キューブ。3x3、BLD、OH等は実ページへ | 個別対象あり |
| Posture Thing | 4ddb6416-b7d0-4477-b636-27144cf923e4 | フォームローラー等の実内容と対応 | 個別対象なし |
| Pen Spinning | 6ea8f3bd-83ca-40dd-b477-a62291a7f75b | ペン回し用ペン | 追加済み。マーカーから実ページ/構図を確認 |
| Kendama | e99d3767-6bc4-4af1-b0be-995633815e85 | けん玉 | 追加済み。Enterで実ページ/構図を確認。皿形状未完成 |
| Geoguessr | bd49f03c-f554-46af-bcda-33983b677d7e | 地理探索と識別できる表現。所有物として地球儀を捏造しない | 個別対象なし |
| Cardistry / Magic | b5264e7e-e147-4fd3-88a7-1673db59ec9b | トランプ | 追加済み。マーカーから実ページ/構図を確認。表面図柄未完成 |
| Drawing | 3fd729f1-9dee-4e98-8dd9-c45f2161a780 | 画材・スケッチ用具。既存Notes対象とは区別 | 個別対象なし。既存ページは休止 |
| Yoyo | 523ba14a-421b-4846-8827-cb06e104da6f | ヨーヨー | 実ジオメトリクリック→実ページ/構図を確認。金属が暗すぎる |

## 実装制約

- CameraのGear: Nikon D7000、Nikon DX 18–105mm F3.5–5.6G ED VR AF-S、Tamron 70–300mm F4–5.6 Di VC USD。Interested InのSigma 150–600mmとTamron 100–400mmは実所有と混同しない。汎用の小型カメラ草案は未実行のまま破棄した。
- DartsのGear: メインはLuke Littler Loadout、KFlex Medium Shape、Lippoint Long。ボードはTarget TORとDartslive Home。サブ機種の曖昧な表記を勝手に確定しない。
- RubiksのGear: MoYu WeiLong V11 8-Magnet Ball Core、GAN V100 Leap、Meilong 4x4。既存ページは3x3/BLD/OH/5x5/4x4/2x2への子ページを持つ。
- Musicの正規子ページ: Trombone `doc/7126d9a4-2c3e-4383-844a-908e14c8359b`、Piano `doc/54fe7549-66d7-406d-8d97-21d9de0f02ba`、Transcriptions `doc/afb74437-b955-4684-a4c7-abfa06a6b8d3`。Tromboneに機種情報はない。Pianoは基礎・ラグタイム/クラシック・ジャズ資料、Transcriptionsは採譜についての短い本文。
- Typingは各タイピングサービスの実プロフィール。Steno `doc/90bc7a15-70b0-4835-a3d6-234b9f6a077b` はPlover/Lapwing、練習サイト、母音の学習メモ。特定ステノ機器の所有は記載されていない。
- Posture本文に24インチ高密度フォームローラーがある。内容は参照・リンクの根拠であり、医療的有効性の保証として扱わない。
- Pen Spinning、Yoyo、Cardistry/Magic、Kendama、Drawingは詳細ページ自体も未公開素材の空状態。具体的なペン改造名・ヨーヨー機種・デック名は確認できない。GeoguessrはPlonk Itと地理資料へのリンク。

- 全項目を部屋の認識可能な対象と結び、クリック・ヒント・構図・HTML本文まで実ブラウザーで確認する。一覧への一律転送で個別対応を代用しない。
- 最新の所有者平面図の家具位置と主室の最小構成を維持する。未確認の大型家具を追加しない。
- 既存の参照写真・ページで機種を確認できなければ、特定ブランドや所有事実を断定しない。
- ライブ物販タオルはEventsの参加履歴へ接続済み。趣味棚や一般的な生活用品と混同しない。正確な柄は追加原画像待ち。
- `room-runtime.ts` はpiano/darts/rubik/typingと上記4小物を既存ページ見出しから解決する。個別ヒントは遮蔽判定つきの実ボタン。未公開本文を創作しない。残る趣味は個別モデル/操作とも未完了。
