# ham-san.net 3Dホーム — 完全引継ぎと制作手順、2026-09-07

次の担当が原本・実装・証拠・失敗条件を確認して再開するための運用資料。完成報告ではない。技術判断の根拠と実行可能な計画を記録し、内部思考の逐語記録や会話原文は保存しない。唯一のライブ索引は `conductor/CURRENT_TASK.md`。

# PART I — TASK CONTRACT AND LIVE STATE

## 1. Exact task contract

- 最新要求: 完全な引継ぎを作成し、Luna/maxでも継続できる具体的な方向、判断根拠、手順、検証条件を残す。`handing-off-pro-max`、`handoff`、`ask-matt`、`setup-matt-pocock-skills`が明示指定された。
- 現在の停止点: けん玉の大小皿、ヨーヨー材質、カード表面、関連Linksの型注釈を限定修正済み。原本保存・GLB同期・Thai desktop browser証拠・Astro buildまで実施。全体モデル/UXは未完成。
- 全体の完成条件: 本人の主室の配置・家具型・特徴物を維持した高品質なBlender原本とWebモデル。Tokyo昼夜、住宅街とバルコニー、WASD/タップ移動、クリック時の構図と移動固定、実HTML本文、元位置への復帰、英日泰、識別しやすい操作ヒント。`room-spec.md` の全UX/GEO/AST/LIT項目と `room-hobby-map.md` の全趣味が対象。
- 最小化は物量の選別。安価な仮形状、別の家具、無地板を完成とする意味ではない。AAA品質達成・無欠陥を未検証で宣言しない。
- 禁止: キッチン追加、未確認の所有機種・イベント柄の創作、既存ルート削除、他プロジェクト変更、OS/音声設定操作、独自Blender接続、Blender CLI、無許可commit/push/PR/デプロイ/外部投稿。
- 今回の権限: ローカル引継ぎ文書、状態検査、所有プロセスの終了、Matt設定の調査。Matt設定書き込みはスキルの確認段階待ち。GitHub remoteを確認したことは外部書き込み権限ではない。
- 優先順位: 最新所有者平面図v2 → 所有者の確定事項 → 原写真3枚（形状・材質）→ 参考サイト（体験のみ）→ 実装。古い停止資料や混在した別作業メモは権限原本ではない。
- Goalはactiveのまま。引継ぎ完成は部屋完成ではなく、blocked判定でもない。

### 固定済みの配置・対応

- 上壁に2開口。左は黄系カーテンの掃き出し開口、右は青灰系カーテンの窓。間にダーツスタンドと直線投擲マット。
- 左壁に左向きPC机。椅子は右側、机用マットは別。PC机より入口側に水平演奏姿勢の鍵盤とスタンド。
- 右壁に白い大型区画棚。前に低い机とビーズクッション。棚より入口側に多数のペンライトとライブ物販タオル、うちわ。
- 左下が玄関、下壁左が入口、下壁右が収納。ポスターは左壁/右下壁/下壁中央。家具で図柄を遮らない。
- モニター→Projects、紙→Notes、棚/各趣味物→対応趣味、名刺→Namecard/About/Contact、ライブ物販→Events。
- 広角写真から実寸を断定しない。主室寸法とバルコニー奥行きは近似。バルコニー扉開閉・屋外歩行は未実装。

### 原資料の実パス

- `/Users/vittayapalotai.tanyawat/Downloads/Photos-1-001/PXL_20260907_015010154.jpg`: バルコニー/棚/応援グッズ。
- `/Users/vittayapalotai.tanyawat/Downloads/Photos-1-001/PXL_20260907_015016170.jpg`: 机/入口/収納。
- `/Users/vittayapalotai.tanyawat/Downloads/Photos-1-001/PXL_20260907_014827641.PANO.jpg`: 相対位置の補助。
- 元アーカイブ: `/Users/vittayapalotai.tanyawat/Downloads/Photos-1-001.zip`。既に展開済み。原写真をrepoへコピーしない。
- 所有者図の永続転記: `conductor/room-reference-map.md` のowner-floorplan-v2、15:20:59版。描画ツールの青線/選択ハンドルは家具ではない。
- 体験/工程の閉じた参考集合: `https://bruno-simon.com/`、`https://shahbaj-sheikh.vercel.app/`、`https://www.freecodecamp.org/news/create-a-cute-room-portfolio-with-threejs-blender-javascript/`。現在のhandoffではWeb再取得なし。記事内容の再検証や追加外部asset調達は制作再開時に必要性を判断する。

## 2. Ground truth: repository and working tree

| 項目 | 確認値 | 証拠 |
| --- | --- | --- |
| CWD / root | `/Users/vittayapalotai.tanyawat/code/ham-san.net` | `git rev-parse --show-toplevel HEAD` |
| branch / HEAD | `main` / `fa3f507114370a7d0d48a45b39e5939d562c51f9` | 同上、`git status --short --branch` |
| remote | `git@gh-personal:hamzaabamboo/ham-san.net.git` | `.git/config`、`git remote -v` |
| upstream/PR | ローカル表示はmain...origin/main。最新性・PR・CIは未確認 | fetchしていない。引継ぎに不要 |
| dirty | 広範な既存変更、削除、未追跡が混在 | `git status --short --branch` |
| 部屋対象一覧 | [room-handoff-inventory-2026-09-07.md](room-handoff-inventory-2026-09-07.md) | 限定パスの `git status --short --untracked-files=all` 実出力 |
| 所有権 | 部屋系列の成果物は特定可能。古い個別作者や別作業の変更境界は不明 | 取り消し・一括整形しない |

最近の直接変更は `RoomHome.astro`、`room-runtime.ts`、`room-copy.ts`、`add_skill_toys.py`、`add_wall_uchiwa.py`、`bind_live_towels.py`、モデル出力、関連証拠とconductor文書。全ファイルがGit追跡済みとは限らないため、空の `git diff --stat` を無変更の証拠にしない。

`StatusRow.astro`、レイアウト、Events、Atelier、翻訳、CI等にも並行・先行変更がある。今回の部屋ヒント修正の所有物として扱わない。`CURRENT_TASK.md` のEventernoteフォーム関連行は別作業混在であり、部屋担当はそのブラウザー、認証、投稿へ進まない。

### 引継ぎ時のハッシュ

- `assets/room/room-web-lean.glb` と `apps/astro/public/models/room.glb`: G-01棚修正後 `01fa6c7aaaa0e9c8a965b2b075e55a856d74d340093cd623b2af99ee22782d0e`、39,713,788 bytes。前回のけん玉/カード配信hash `36a0c54c9a91bcff0b7da98ad0ae0b896ea68c1335b904eee5081ff199303721`は履歴比較用。
- `assets/room/room-web-current.glb`: 最新最適化前39,813,464 bytes。117 groups/120 objectsをexportし、UV strip後に配信した。
- `apps/astro/src/components/home/room-runtime.ts`: `a7fb558e575416be23750905424530b16d5dd4a55011703991a2346b2344c9d0`。
- `apps/astro/src/components/home/RoomHome.astro`: `62da7dc0314477cc1e004dd717218179a747c98948d84004ddf765feb613f624`。
- `.blend` は編集原本。GLBハッシュ一致は原本全体の同一性、配置、見た目、性能の証明ではない。

## 3. Environment and operational rules

- OS: macOS/zsh、Asia/Tokyo。空き容量5.1GiB、99%使用。`df -h .`で確認。重いビルド・レンダー・スクリーンショット一括処理を同時実行しない。
- 旧Astro: `apps/astro` CWDで `ASTRO_ADAPTER=node bun run dev -- --host 127.0.0.1`。旧ハンドル96487、node PID84503、127.0.0.1:4321。引継ぎ時にCtrl-Cで意図して終了、exit130。その後lsofはLISTENなし/exit1。
- 旧専用ブラウザー: `ham-room-live`、1440×900、最後のURL `http://127.0.0.1:4321/th/`。引継ぎ時にclose済み。最後の画面は `assets/room/browser-handoff-final.png`。他セッションをcloseしない。
- 終了前に存在した他セッション: `default`、`eventernote-login`、`courta-readonly-20260907`。一覧以外は未操作。名前は再開時に変わり得る。
- Blender: 終了していない。ネイティブ `get_object_info` が `Skill toy kendama cup crosspiece` の実情報を返した。単なる設定存在やlisten確認ではない。
- Browser prefixは必須: `AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio'`。本人Chrome、OSダイアログ、mailto/tel/非HTTPリンクを操作しない。
- コマンドは個別実行。ローカル編集はapply_patch。新規テストは要求・プロトコル・既存検証で不足する場合のみ。既存テストを実行する場合も並列数を制限する。
- ネイティブBlender MCP内でbpyを実行することは許可された制作方法。独自Python MCPクライアントやCLI迂回は別物で禁止。
- 元写真はDownloadsに置いたまま。会話原文、秘密値、履歴の生ダンプをrepoへ保存しない。

# PART II — COMPLETE EXECUTION RECORD

## 4. Chronological command and action ledger

正確性の境界: 現在保持された会話、直接観測、現行スクリプト、既存文書から確認できる実行を記録する。以前の全生成コマンド本文と時刻は保持されておらず、全履歴を読んだとは主張しない。他セッションのログは読んでいない。未知の過去コマンドを推測して再構成せず、保存スクリプトを再開原本にする。

`R` は上記repo root、`A` は `R/apps/astro`。以下の `B` は単なる台帳省略名で、実行時は完全なprefixを使う: `AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live`。この定義以外の引数・順序は省略しない。

| 順序/時期 | CWD | 正確な操作または保存原本 | 理由・実結果 | 再実行 |
| --- | --- | --- | --- | --- |
| 前系列 | R | native Blender executeで `assets/room/add_wall_uchiwa.py`、続いて `bind_live_towels.py` | うちわ追加、Events構図をグッズ全体へ。保存済み | 追加スクリプトは存在確認後のみ |
| 前系列 | R | 実ローカルhobbies全12ルート、Music3子、Steno子を `agent-browser read <正規URL>` | 所有機材/休止ページを確認。URLはroom-hobby-map.md | 読み取り再実行可 |
| 22:02頃 | R | native execute: `exec(compile(open(bpy.path.abspath('//add_skill_toys.py')).read(),'add_skill_toys.py','exec'))` | 4趣味小物とtarget metadata。原本保存 | 不可: 既存root検出で停止。更新版を別途作る |
| 22:03頃 | R | native execute: `exec(compile(open(bpy.path.abspath('//export_room_web.py')).read(),'export_room_web.py','exec'))` | 原本からGLB出力 | 原本・保存先・空きを確認後可 |
| 22:04頃 | R | `node assets/room/strip_unused_uv.mjs assets/room/room-web-current.glb assets/room/room-web-lean.glb` | 未使用UV75チャンネル削減、2,289,488 bytes削減 | 入出力を間違えなければ可 |
| 同上 | R | `cp assets/room/room-web-lean.glb apps/astro/public/models/room.glb` | 配信コピー | 新leanの検証後のみ |
| 同上 | R | `shasum -a 256 assets/room/room-web-lean.glb apps/astro/public/models/room.glb` | 一致 | 可 |
| 統合途中 | R | Luna/maxがroom-runtime.ts / room-copy.tsを変更 | 4対象の動的ルート、各言語ラベル追加 | 古い草案を再適用しない |
| 統合途中 | R | ハードコードfallback除去を指示、途中の実ブラウザー確認 | `ReferenceError: hobbyRouteFallbacks is not defined`、黒い入口を再現 | 宣言と参照を同時に直す。修正済み |
| 22:13頃 | R | `B press Escape` → `B screenshot assets/room/browser-uchiwa-current.png` → view_image | 現行入口、うちわあり | 順序と現在stateを確認 |
| 同上 | R | `B mouse move 1257 273` → `B mouse down` → `B mouse up` | うちわ実形状クリック | 同viewport/入室poseのみ |
| 同上 | R | `B snapshot -i` → `B screenshot assets/room/browser-uchiwa-current-focus.png` → view_image | 読込後の実Eventsとグッズ全体 | loading画像を完成証拠にしない |
| 22:16頃 | R | apply_patch: hobbyラベルにmarker属性、CSSの点表示 | 重なる名前を減らす | 後続button版が現行 |
| 同上 | R | `B open http://127.0.0.1:4321/th/` → `B snapshot -i` → `B click @e5` | 入室。refは当時のもの | 再開時はfresh snapshot |
| 同上 | R | `B screenshot assets/room/browser-hobby-markers.png` → view_image | 名前重なり解消 | 現在はbutton版で再検証 |
| 22:17頃 | R | `B mouse move 979 417` → `B screenshot assets/room/browser-yoyo-hover.png` | ヨーヨーhover名 | 同poseのみ |
| 同上 | R | `B mouse down` → `B mouse up` → `B snapshot -i` | 実形状からYoyoへ | 可、source選択状態確認 |
| 同上 | R | `B get attr '[data-room-full-page]' href` → `B screenshot assets/room/browser-yoyo-content-current.png` → view_image | UUID523ba14a…、Yoyo本文/対象可視 | 可 |
| 22:19頃 | R | `B press Escape` → `B mouse move 1002 421` → `B mouse down` → `B mouse up` → `B get attr '[data-room-full-page]' href` | ペンの点で/hobbiesを選択する誤動作 | 失敗再現。現行buttonで修正 |
| 22:20頃 | R | apply_patch: span→button、type/aria-label、pointer/focus/click handlers、24px hit area/8px dot/tooltip | 装飾ラベルのクリックが後ろの棚へ抜ける根因を修正 | 既存コードへ重複適用しない |
| 同上 | A | `bunx eslint src/components/home/room-runtime.ts src/components/home/RoomHome.astro` | exit0、Browserslist更新案内のみ | 可。依存更新は不要 |
| 同上 | R | `B open http://127.0.0.1:4321/th/` → `B click '[data-room-enter]'` → `B click '[data-room-target-label="penspinning"]'` | ペンのbutton経由選択 | 可 |
| 22:21頃 | R | `B get attr '[data-room-full-page]' href` → `B screenshot assets/room/browser-pen-marker-current.png` → view_image | 正規Pen Spinning、物と本文共存 | 可 |
| 同上 | R | `B press Escape` → `B focus '[data-room-target-label="kendama"]'` → `B press Enter` | keyboard起動 | 可、focus中に移動を混ぜない |
| 同上 | R | `B get attr '[data-room-full-page]' href` → `B screenshot assets/room/browser-kendama-keyboard-current.png` → view_image | 正規Kendama。皿の向き不良を発見 | 機能合格と形状不合格を分離 |
| 22:22頃 | R | `B press Escape` → `B click '[data-room-target-label="cardistry"]'` → `B get attr '[data-room-full-page]' href` | 正規Cardistry UUID | 可 |
| 同上 | R | `B screenshot assets/room/browser-cardistry-marker-current.png` → view_image | 実本文/カード可視、表面は未完成 | 可 |
| 同上 | A | `bunx prettier --check src/components/home/room-runtime.ts src/components/home/RoomHome.astro` | exit0、全対象一致 | 可 |
| 22:24頃 | R | `B errors --json` | 古いfallback ReferenceError2件のみ。空と報告しない | 可、時刻/ソースURLで区別 |
| 22:25頃 | R | `B press Escape` → `B hover '[data-room-target-label="penspinning"]'` → `B screenshot assets/room/browser-hobby-markers-current.png` → view_image | 最終button/tooltipを再視認 | 可 |
| 引継ぎ | R | `git status --short --branch`、`git rev-parse --show-toplevel HEAD`、`git remote -v` | branch/HEAD/dirty/remote確認 | 読取可、fetchしていない |
| 引継ぎ | R | `lsof -nP -iTCP:4321 -sTCP:LISTEN`、`ps -p 84503 -o pid,ppid,etime,command` | 旧所有Astro PID確認 | PIDは再利用され得る |
| 引継ぎ | R | `df -h .` | 5.1GiB /99% | 重い処理前に再実行 |
| 引継ぎ | native MCP | `get_object_info`、object_name=`Skill toy kendama cup crosspiece` | 回転Y=1.57079625、960頂点、880面 | 読取可 |
| 22:50頃 | R | `B screenshot assets/room/browser-handoff-final.png` → view_image | 最後の実表示 | 保存済み |
| 引継ぎ | R | `B close` | 所有ブラウザー終了0 | 無条件再実行不要 |
| 引継ぎ | tool | `write_stdin({session_id:96487,chars:"\u0003",yield_time_ms:1000,max_output_tokens:600})` | 所有Astro終了130 | 古いハンドルへ再送しない |
| 引継ぎ | R | `lsof -nP -iTCP:4321 -sTCP:LISTEN` | 無出力/exit1、意図した停止 | 可 |
| 2026-09-07 23:40–23:58 | native MCP/R/A/B | `refine_kendama_cups.py`、`refine_card_faces.py`、yo-yo材質調整、export→UV strip→copy、fresh Thai browserでentry/3対象/return、ESLint/Prettier、Astro build | けん玉大小皿、ヨーヨー青金属、カードrank/suit、ContentId型を修正。browser errors空。buildは0 errors/0 warnings/0 hintsでComplete | 各slice再実行は既存guardと原本確認後のみ |

矢印は実行順序の表記であり、一括シェル実行の指示ではない。全操作を一つずつ確認する。生成スクリプトの以前の全文は現ファイルにある。今回停止時に返ったAstroログは344行中先頭/末尾のみ、19:02–22:22の範囲が可視。全ログ読了とは扱わない。

## 5. Methodology and decision record

1. **配置と造形を分離して検証する。** 所有者v2図は相対位置の原本、写真は家具型の原本。写真の遠近から窓を別壁にする推測は棄却。2開口の同一壁は再質問しない。
2. **物量と品質を混同しない。** 多数の粗い箱を追加して充実感を作る手法は棄却。少数でも白棚の区画、木椅子の曲率、布の沈み、各趣味物の機能形状が読めることが必要。
3. **本物のコンテンツを先に読む。** hobbies一覧だけではCameraの機種やPiano子ページが分からなかった。実本文で確認した所有機材をroom-hobby-mapへ記録。未実行の汎用カメラ草案は削除し、Nikon D7000等の根拠なし置換を防止した。
4. **動的ルートを保持する。** runtimeは一覧内見出しと正規リンクからIDを解決し、PianoはMusic子まで辿る。slugやUUIDの固定fallbackは棄却。解決失敗時は実hobbiesへ留まるが、個別対応完了とはしない。
5. **モデルとUIの接点を分ける。** Blenderの各形状にroomTarget、Floor baseにroomNavigation。exportがextrasを保持しruntimeが位置/構図を解決。HTMLは本文表示、3Dは対象と空間。
6. **ヒントの失敗を実クリックで特定した。** 名前の重なりを点表示で減らしただけではペン選択が棚へ抜けた。装飾spanをbuttonに変え、正しい対象IDでfocusTargetを実行するよう修正。遮蔽判定、実形状ray picking、既存下部ナビを保持した。
7. **透明物は構造から直す。** printとclear plateの親変換差を修正。roughnessを下げるだけ、ケースを消すだけ、偽の透明材へ変える方法を棄却。CURVEを除外した配置スクリプトが板を取り残していた。評価更新後に整列する。
8. **UVをexportで壊さない。** 材質だけでjoinすると異なるUV名が失われた。材質+UV名/active_render+targetをgroup keyとする。stripは未参照UVだけ削除する。
9. **証拠の層を守る。** CLI成功、Cycles、Material Preview、GLBデータ、実Web、物理端末は別々。最後に利用者が見るWebの同じ構図を主担当が視認して判断する。

## 6. Files and artifacts

全パスのGit状態は別紙inventory。以下の相対パスはrepo root基準。過去PNGは変更後の全体証明には使わない。

| パス | 役割・変更と理由 | 現在の検証/所有 | 再開指示 |
| --- | --- | --- | --- |
| `assets/room/room.blend` | 編集原本、RoomHome collection | 本作業系列、native応答あり | これを出発点。旧生成全体を再実行しない |
| `assets/room/room.blend1` | Blenderバックアップ | 旧状態、最新性不明 | 最新原本と取り違えない |
| `assets/room/room-web-current.glb` | evaluated export | 前回生成済み | Web配布前の中間物 |
| `assets/room/room-web-lean.glb`、`apps/astro/public/models/room.glb` | 未使用UV削減/配布物 | checksum一致、実Web使用 | export後に再同期 |
| `assets/room/room-web-candidate.glb`、`room-web-glass-candidate.glb` | 古い診断候補 | 現行配布物ではない | 上書き配布しない |
| `apps/astro/src/components/home/room-runtime.ts` | Three、移動、Tokyo、ray/occlusion、button hint、HTML関連ルート | 主担当+Luna、最近の対象lint/ブラウザー確認済み | 既存挙動を保持。namecard遮蔽候補は未確定 |
| `apps/astro/src/components/home/RoomHome.astro` | 入口/パネル/ヒントCSS | 主担当、button修正確認済み | 24px hit area、8px dot、focus outline、hover tooltipを保持 |
| `apps/astro/src/components/home/room-copy.ts` | 英日泰ラベル | Luna、4趣味追加 | localeごとに実確認を続ける |
| `assets/room/add_skill_toys.py` | 4小物、lathe/UV、個別target/構図 | 主担当。root存在時raise | 更新処理を別途作成。丸ごと再実行禁止 |
| `assets/room/refine_kendama_cups.py` | 旧横向きcrosspieceをarchiveし、大小の上向き木製皿・bridge・collar・rimを追加 | native MCP実行、room.blend保存、近接render/browser確認 | 再実行は既存large cup検出で停止。全体配置監査は残る |
| `assets/room/refine_card_faces.py` | spread fiveへ一般rank/suit印字を追加 | native MCP実行、room.blend保存、browser確認 | 商標/実所有deckを創作しない。UV画像化と全端末可読性は未完 |
| `assets/room/add_wall_uchiwa.py` | 印刷面、縁、背骨、柄、掛け具 | 主担当、実形状click確認 | 元物販の複製とは主張しない |
| `assets/room/bind_live_towels.py` | towels/uchiwa→events、グッズ全体構図 | 主担当、実Web確認 | うちわを含むbounds中心を維持 |
| `assets/room/add_balcony.py` | 左引戸外の床/腰壁/手すり/排水/室外機 | 主担当、外観初回確認 | 寸法近似。歩行/扉は未実装 |
| `assets/room/refine_shelf_structure.py` | 疎な棚→4列白モジュラー棚、書籍配置とcollider | 主担当、初回Web確認 | 原写真の密度まで完了していない |
| `assets/room/refine_beanbag_cloth.py`、`refine_chair_cushion.py` | 球/板の代わりに沈み/膨らみ/縫い目 | 主担当、初回Web確認 | 縫い目と全体造形は再点検 |
| `assets/room/refine_curtains.py`、`refine_keybed.py`、`refine_dartboard_curves.py` | 布、61鍵、円盤精度 | 本作業系列、部分確認 | 原写真一致と交差の最終判定は未完 |
| `assets/room/refine_closet.py`、`repair_closet_overlap.py`、`repair_closet_poster_clearance.py` | 引戸/重なり/ポスター離隔 | 本作業系列、60mm離隔の過去確認 | 最新通常視点を再検証 |
| `assets/room/repair_wall_seams.py` | 窓壁の隙間61.54mm/面ずれ25.64mm修正 | 本作業系列、過去境界検査 | 天井下まで連続しているかWeb確認 |
| `assets/room/create_contour_stand.py` | 最大連結領域外周→印刷mesh/3mm透明板 | 本作業系列、6体作成 | 内部白領域の穴抜き未対応 |
| `assets/room/arrange_display_case_contents.py` | print/clear plate/baseを一緒に配置 | 主担当、CURVE除外を修正 | view_layer.update後にmatrix整列。板を忘れない |
| `assets/room/configure_case_volume.py` | KHR volume厚さ/IOR/transmission | 本作業系列、export確認 | Thicknessだけのgroupに戻さない |
| `assets/room/apply_book_spines.py` | 12列atlasを縦横比保持UVで印刷 | 主担当、Web確認 | 実所有書籍タイトルの再現ではない |
| `assets/room/apply_desk_displays.py` | 実Projects/NotesキャプチャをPC/tabletへ | 主担当、Web確認 | 静止画。画面内リンクでなくHTMLで操作 |
| `assets/room/apply_monitor_wallpaper.py`、`apply_desk_poster.py` | 仮表示を完成イラストへ | 本作業系列、部分確認 | 写真切抜きをモデル面へ貼らない |
| `assets/room/export_room_web.py` | MESH/CURVE/FONT/LIGHT評価、UV別join、extras維持 | 今回全文再読 | temporary collectionをfinallyで削除、原本保存とは別 |
| `assets/room/strip_unused_uv.mjs` | 未参照UVと未使用buffer削除 | 今回全文再読 | 入出力は別パス、assert失敗で停止 |
| `assets/room/textures/` | 表面/印刷/住宅街/画面素材 | 全ファイル名はinventory、来歴はroom-assets | LDR背景をHDR環境光と混同しない |
| `conductor/room-spec.md` | 統合要件/完成条件 | 仕様原本、今回全文読了 | 実装へ迎合して要件を下げない |
| `conductor/room-reference-map.md` | v2平面図の相対座標/写真型 | 今回全文読了 | 古いルート説明はhobby-map/runtimeで更新された状態を優先 |
| `conductor/room-hobby-map.md` | 全12趣味の実機材/UUID/不足 | 今回直前に更新済み | 次の追加対象の原本 |
| `conductor/room-assets.md` | 生成assetの来歴・プロンプト | 今回全文読了 | 一部GLB未同期等の古い検証行は本handoffで更新済み |
| `CONTEXT.md` | 部屋、机、趣味物、closeup、panel用語 | 今回全文読了 | 進捗記録にしない |
| `conductor/room-resume.md`、`room-verification-handoff.md` | 14:58/18:56旧停止状態 | 今回全文読了 | 同一壁/起動許可待ち/旧hashは失効 |

### 直近の実ブラウザー証拠

全て `assets/room/` 配下。主担当がview_imageで視認済み。参照画像と現在実装の全角度一致を意味しない。

| ファイル | 実際に示すもの | 示さないもの |
| --- | --- | --- |
| `browser-handoff-final.png` | 最後の/th/入口、ペンhover、うちわ/棚/バルコニーの現行表示 | 最終造形合格、昼間、移動 |
| `browser-hobby-markers-current.png` | button hint/hover名、他の小物は点 | mobile実タップ |
| `browser-yoyo-content-current.png` | 実形状click後Yoyo本文、左側に物 | 金属品質は暗く不合格 |
| `browser-pen-marker-current.png` | marker→Pen Spinning、pen全長可視 | 全ray pick |
| `browser-kendama-keyboard-current.png` | Enter→Kendama、けん玉可視 | 皿形状は不合格 |
| `browser-cardistry-marker-current.png` | marker→Cardistry/Magic、deck可視 | 印刷面の完成 |
| `browser-kendama-cups-loaded.png` | 新大小皿を含むKendama closeup、実本文 | 全角度/全locale |
| `browser-yoyo-material-fixed.png` | 調整後の青い金属yo-yoと実本文 | 昼夜比較、物理材質の最終合格 |
| `browser-cardistry-faces-fixed.png` | spread上のrank/suit印字と実本文 | 全端末での判読性、画像UVの最終合格 |
| `browser-room-return-after-hobby-fixes.png` | Escape後に部屋へ復帰、cardistry hint可視 | 厳密な元pose一致、全対象復帰 |
| `browser-uchiwa-current-focus.png` | fan実click→Events、fan/penlights/towels共存 | 実物グッズ図柄の再現 |
| `browser-live-towel-attendance.png` | towel実click→参加履歴 | 無地柄の完成 |
| `browser-piano-direct-page.png` | Music配下の実Piano子ページ | 楽器造形最終品質 |
| `browser-th-contact-tabs-fixed.png` | Namecard/Contact/Aboutタブの維持 | 全locale全ルート |
| `browser-ja-rubiks-current.png` | 日本語Rubiks実本文 | 最新4趣味の日本語検証 |
| `browser-desk-real-displays.png` | PC/tablet実画面texture+Projects実panel | 静的画面内リンク操作 |
| `browser-framed-uv-fixed.png` | UV別join後の額装印刷 | 全材質合格 |
| `browser-case-glazing-isolation.png` | ケースを外した診断比較 | 最終モデルではない |
| `browser-acrylic-polish-comparison.png`、`browser-case-polished-comparison.png` | roughness実験 | 改善成功ではない |
| `browser-mobile-entry.png`、`browser-mobile-hobbies.png` | 狭幅で入口/本文 | coarse=false、物理touch未検証 |
| `browser-panel-keyboard-check.png` | 文字列入力中panel構図維持 | 持続WASD keydown/衝突の証明ではない |

# PART III — EVIDENCE, FAILURES, AND HONESTY

## 7. Verification matrix

| 要件 | 必須証拠 | 現証拠/結果 | 残り |
| --- | --- | --- | --- |
| 主室/2窓/家具配置 | 最新上面図+所有者v2照合 | 過去修正と現入口部分表示 | 全GEO再照合 |
| 全家具/UV/質感 | 原写真+近接Web | 個別改善、mock品質が残る | 全AST/LIT合格が必要 |
| うちわ/ライブ物販導線 | actual object click+実本文 | fan/towel→Events確認 | 実物印刷/全角度遮蔽 |
| 新4趣味導線 | target→実UUID+closeup+return | /th/でyoyo/cardistry/kendamaを実パネル確認、Escape復帰。既存penも前回確認 | 英日、mobile、全ray |
| 全趣味対応 | 全12項目とMusic/Typing子内容 | hobby-mapで不足明示 | Camera/Typing/Trombone/Posture/Geoguessr/Drawing |
| WASD/衝突/復帰/固定 | 持続key入力+実位置変化+障害物 | Escape等は部分確認 | 真のheld-key、全障害物、連続操作 |
| ヒント | 視認/hover/keyboard/click/occlusion | 重なり/ペン誤選択修正、実Web確認 | 全遮蔽物/locale/mobile |
| Tokyo昼夜 | 時刻別の同一対象実Web | 夜現行表示 | 昼、境界時刻、反射/窓方向 |
| 原本→配信 | GLB hash+metadata+実Web | lean/public一致、実Web表示 | 最新原本の全属性独立監査 |
| code gate | 対象ESLint/Prettier/Astro build | 3ファイルgate成功、build再実行0 errors/0 warnings/0 hints、Complete | CI/展開未確認 |
| errors | fresh起動/操作のconsole | 今回fresh `ham-room-live`操作後errors JSON空 | 他locale/他端末 |
| mobile/性能 | 実coarse操作と実端末測定 | 狭幅画像のみ | physicaltouch/FPS/メモリ/ロード時間 |

## 8. Failures, traps, and rejected approaches

| 問題 | 証拠/根因 | 再発防止 |
| --- | --- | --- |
| 窓を別壁へ配置 | 広角写真を誤解。所有者v2は同一壁 | 図の上下左右を固定して上面検証 |
| 照明だけでmock造形を隠す | 主室画像で家具型が異なる | 造形ゲートと照明ゲートを分離 |
| 原写真を平面へ貼る | 遠近/照明/背景がモデルと二重化 | 印刷原稿/適切なUVを作る |
| 透明板だけ残る | placementがMESHだけ、板はCURVE | print/plate/baseを一組で移動、評価更新 |
| 額装UV消失 | 材質だけでmesh join | UV名/active_renderもgroup key |
| ケース粗さ調整に固執 | .012→0、stand .075→.012とも明確改善なし | 現値へ復元済み。透過/配置/反射を分離診断 |
| fallback削除中の黒画面 | `ReferenceError: hobbyRouteFallbacks is not defined` | 宣言/参照を一貫して修正。current sourceは除去済み |
| ペンmarkerで棚へ遷移 | spanがpointer-events none、rayは後ろの棚に当たる | buttonに変更済み。架空本文やroute固定で回避しない |
| 対象名が重なる | 小物に全ラベル常時表示 | individual hobbiesは点、hover/focusで名。主導線名は維持 |
| けん玉皿が横向き | crosspieceをX軸latheで作り端に凹形状 | `refine_kendama_cups.py`で大小の上向き皿へ修正済み。全体配置と複数角度は未完 |
| 金属yo-yoが黒い | 夜closeupで確認 | 材質色/coatを物理範囲で調整済み。昼夜と室内反射の完全比較は未完 |
| cards表が無地 | closeupで確認 | spread fiveへ一般rank/suit印字済み。画像UV化/全端末可読性は未完 |
| `--allow-scripts`関連Netlify起動失敗 | 旧標準起動経路 | 既存ASTRO_ADAPTER=node起動を使用。依存/設定の広域変更不要 |
| CPU/ディスク圧迫 | 99% volume | 自分のプロセスから確認。無制限parallel/build/sweep禁止 |
| 旧handoffの権限停止 | server未許可/窓未回答という旧記述 | どちらもその後解消。今回停止は手動handoff処理 |
| namecard遮蔽 | roomHotspotをopaque判定前に返すsource候補 | 現Webで再現してから修正。代理人の指摘だけで断定しない |
| iframe focus残留 | 代理人の候補、主担当はBODY/dialog=false | 未再現。確定bugとして記録しない |
| 間違った証拠ファイル | browser-skill-toys-shelf.pngが一度full hobbiesページだった | ファイル名で信じずview_image。現在の代表証拠は明記した-current画像 |

## 9. Known limitations and blockers

- 全体は未完成だが作業不能ではない。3回連続の同一必須ブロッカーは成立していないためGoalをblockedへ変更しない。
- ライブ物販の正確な柄: 判読可能な近接写真/原稿が未提供。イベント名や図柄の捏造は禁止。導線・幾何・展示配置は進められる。原稿到着後は印刷UVだけを対応させる。
- ダーツ支持部: 下部が原写真の収集物で隠れ、型番/構造未確定。見える形状は照合可能。未知部分の精密再現だけが情報不足。
- バルコニー: 外観追加は済み。屋外歩行/開閉の採用は未確定。現状の入口案内で歩けるように見せない。
- 物理mobile、昼夜通し、性能は未検証。狭幅だけで代替不可。
- Matt設定: trackerの選択質問を送信済み。回答後にtriage labelとdomain layout、書込み前draft確認が必要。設定済みとは言わない。

# PART IV — RESUME WITHOUT REDISCOVERY

## 10. Immediate next action

まず本handoffとCURRENT_TASKを確認する。G-01はv2平面図/native bounds/原写真3枚で配置を照合済み、棚密度を限定修正し、現行GLB・fresh headed browser・Astro buildまで再検証済み。次はU-01の遮蔽/持続移動をread-onlyで再現し、同時に椅子・beanbag・アクリル/ペンライト・昼夜材質の次の未完GEO/AST sliceを選ぶ。K-01/K-02/K-03は限定修正済みなので、旧crosspieceの960頂点状態へ戻さない。

- 一致: `g01-layout-objects.png`、`g01-shelf-polished-final.png`、`browser-g01-shelf-focus-after.png`、`browser-g01-room-return-after-shelf.png`を根拠として保持し、次の未完GEO/AST sliceだけを選ぶ。
- 不一致: Blender native `get_object_info` と `Floor base.roomNavigation` の全targets/boundsを調べ、最新原本を基準に限定修正する。
- MCP未公開: 設定存在とtool公開を区別し、ユーザーに公開状態を報告。独自クライアントやBlender CLIへ逃げない。文書/コードの安全な読取は続行可能。

## 11. Remaining ordered work

各作業は原本読取→限定修正→原本保存→export/UV strip/copy→同一Web構図→証拠視認の順。Blender編集者は1人。Luna/maxへ渡す場合も対象ファイル、禁止範囲、返却物を明示する。

最初の復帰時はG-01の完了証拠を確認し、U-01の実画面再現へ進む。遮蔽/移動の不具合がなければ、次の未完GEO/AST sliceへ移る。全体を最初から作り直す指示ではない。

委任は1sliceずつ: K-01はBlender編集1担当、K-02はruntime/照明の読取調査、H-01は実本文/ルートの読取調査を並列化できる。モデル生成とexportは直列。返却必須項目は変更パス/正確なobject名/前後boundsとtransform/保存先/コマンドexit/スクリーンショット/既知の未完。担当の成功報告だけで次のblockerを解除しない。

### K-01 — けん玉の機能形状

- 前提: 現行crosspieceと原本を確認。`add_skill_toys.py` のlathe/parent basisを読む。
- 対象: `Skill toy kendama` のcrosspieceだけ。root/turned ken/tama/tether、他家具、roomTarget、現カメラを維持。
- 保存前後で `Floor base.roomNavigation` 全体を比較する。boundsと既存targetsを丸ごと保持し、追加済み4趣味のposition/cameraを落とさない。小物中心には糸や台座も含まれるため、bounds中心が適切な注視点とは限らない。既定移動境界への置換は禁止。
- 原因: 現crosspieceはX軸回転体で端が横を向く。正しい大小皿は水平な受け面を持ち上を向く。
- 方法: 中央横木と左右の上向き凹面皿を一体の木製部品として構築。サイズ差、縁の丸み、皿内側の曲面、木目UV、連結部を表現。旧部品はRoomHomeの書出し対象外へアーカイブし、無条件削除しない。`assets/room/refine_kendama_cups.py`をnative MCPで実行済み。新objectはbridge/collar/large cup+rim/small cup+rim、旧crosspieceはarchive/hide_render。world boundsと既存navigationを保存後に再計算した。
- local座標の注意: root matrixのlocal X→world−Y、local Y→world X、local Z→world Z。単純worldrotationは他軸を壊す。親inverse/basisを保持する。
- 実績: Blender近接render `assets/room/kendama-cups-inspect.png`とbrowser `assets/room/browser-kendama-cups-loaded.png`で上向きの大小皿、ken、tama、tetherを視認。Webmarker→Kendama→Escape復帰とerrors空を確認。今後の全体配置/材質監査は残る。

### K-02 — 夜間反射とyo-yo

- K-01と独立調査可、runtime編集とBlender exportを競合させない。
- 対象: room-runtime.tsの `refreshSkyEnvironment` とyo-yo材質/法線。現材質Base(.025,.10,.19)、roughness.24、metallic.85。
- 調査: PMREMへ渡すsceneに何が入るか、night intensity、lathe winding/法線を読む。現在Skyのみの環境反射は候補であり確定原因ではない。
- 方法: 一要因ずつ可逆比較。金属反射に室内情報が不足するなら実際の室内に整合した環境光/反射を構成する。物理metalを偽発光や過大環境強度へ置換しない。他透明材と昼光への副作用を確認。
- 実績: `Yo-yo anodised aluminium`をBase(.075,.28,.68)、roughness.20、metallic.72、coat .38/.16へ調整。browser `assets/room/browser-yoyo-material-fixed.png`で黒いシルエットから青い金属面とハイライトへ改善を視認。昼夜比較と室内反射の完全監査は残る。

### K-03 — cards印刷

- 対象: cardistryのspread card表面とdeck。52枚の厚み/UV/targetを保全。
- 方法: 正規rank/suitを備えた一般的なトランプ面を追加。実所有deckの商標は確認できないので創作しない。`assets/room/refine_card_faces.py`でspread fiveへrank/suitの印字geometryを追加し、52枚の厚み/UV/targetを変更しない。
- 実績: browser `assets/room/browser-cardistry-faces-fixed.png`でspread上の赤黒rank/suit印刷を視認。marker→正規CardistryとEscape復帰を確認。印刷を画像UVへ置換する必要性と可読性の全端末監査は残る。

### H-01 — 残る実趣味

- 原本 `room-hobby-map.md`。CameraはNikon D7000と所有レンズ、Typing/StenoはPC入力と実学習内容、MusicにはTrombone/Transcriptions、Postureには24-inch foam roller、Geoguessrには地理探索、Drawingには画材が必要。
- カメラのwishlistレンズを所有品として追加しない。ステノ機器のモデルは未記載。Drawing等の空本文は捏造せず空状態を表示する。
- 1趣味ずつモデル/roomTarget/runtime union/definitions/focus/copy/動的resolver/関連tabを縦に接続する。造形だけ追加して完了にしない。既存家具位置を変えない。
- 各合格: 元本文照合、実objectまたはmarker→正規ページ、closeupで対象可視、Escape復帰、英日泰ラベル。全項目後にhobby-mapの不足列を置換。

#### H共通 — Lunaへ渡す入力と編集境界

- 入力: この節、`conductor/room-hobby-map.md`、`assets/room/add_skill_toys.py`、`apps/astro/src/components/home/room-runtime.ts`、`room-copy.ts`、`RoomHome.astro`、対象の実hobbies本文。最初にサイズを確認して該当原本を全文読む。
- 編集許可: 1対象の新規Blender修正スクリプト、必要な印刷asset、runtime/copyの当該target、保存/exportしたroom.blend/GLB、当該証拠/記録。共通renderer/既存家具/既存コンテンツ本文/他プロジェクトは変更しない。
- 接続手順: `HobbyTargetId` → `hobbyTargetIds` → `hobbyHeadingTitles` → `targetDefinitions` → `defaultFocusPositions` → `hobbyPaths`初期値 → roomCopyのen/ja/th → Blenderの各実描画部品のroomTarget → `Floor base.roomNavigation.targets[id]`。現在はこれらが明示列挙であり、1箇所追加しただけでは完了しない。
- resolver: rootはhobbies一覧にある実見出し/正規リンクから解決。childは実parent本文の正規childリンクから解決。UUIDをfallback定数として埋め込まない。読込完了を待ってpathForを使う。解決不能なら内容を創作せず、原因と該当ページを報告する。
- 失敗判定: 現実装はfetch失敗・非OK・見出し不一致で初期値 `hobbies` に留まる。関連tabはpathで重複排除されるため、未解決の複数趣味が1tabへ消える。各個別UUID/child URLと期待するtab全件を確認し、一般hobbiesの表示だけでは合格にしない。
- 関連tab: 追加後は表示幅を検査。現行8個からさらに増えるため、必要ならRoomHomeのtabsだけに横スクロールとbutton縮小防止を入れる。選択中tabが見えること、キーボード操作とmobileを確認し、文字を極端に小さくして押し込まない。
- Blender transform: local→worldはrootごとに確認。既存skill toyのX→−Y/Y→X/Z→Zを別家具へ無条件流用しない。部品boundsと親matrixを保存前後で比較する。
- shelf配置: 既存の空き区画をnative読取と画面で確認してから使う。カメラ等の最終配置は未承認の実所有位置として断定しない。大きい追加家具を作らず、通路とposterを塞がない。
- 返却: touched paths、source URLと根拠、object名/target/世界bounds/camera、GLB hash、実クリックのhref、closeup画像、Escape復帰画像、lint結果、未完。実ブラウザー未実施ならブラウザー未検証と明記する。
- 編集競合: runtime/copyとBlenderの担当は同時に同じファイル/sceneを変更しない。本文の読み取り調査だけ並列可。前の対象の結果を主担当が統合した後、次へ進む。

#### H-02 — Camera / 所有機材の外観と導線

- 正規本文: `http://127.0.0.1:4321/th/hobbies/6c2d00b7-dc75-4f45-b286-bf1cbf9e5284`。ローカル起動後、実本文のGear/Wishlistを別々に確認。
- 所有根拠: Nikon D7000、Nikon DX18–105mm F3.5–5.6G ED VR AF-S、Tamron70–300mm F4–5.6 Di VC USD。Sigma150–600/Tamron100–400はInterested Inであり所持品ではない。
- 計画target: `camera`（まだ未実装）。予定スクリプト `assets/room/add_camera_hobby.py`（まだ存在しない）。物理寸法やボタン配列が現資料で読めなければ製品一次資料の追加参照が必要と明記し、箱＋円筒でNikon再現済みとしない。
- 最小限の認識要素: DSLRのグリップ/プリズム部/マウント/レンズ段差/フォーカスリング/背面画面。細かな機種刻印は確認できる資料だけ。レンズを全所有数並べる必要はない。
- 検証: model近接→marker→上記実Camera→本文内Gear、Escapeで元位置。Projects/Notesを壊していないことを追加で確認。
- 完了: 機種の特徴が比較可能で、所有とwishlistを混同せず、実導線が通る。画像資料が不足する部分は未完成として残す。

#### H-03 — Typing / Steno

- 正規root: `http://127.0.0.1:4321/th/hobbies/f28e6219-f8ea-4801-bbca-7fd3f0686da5`。Steno child: 同rootの `/doc/90bc7a15-70b0-4835-a3d6-234b9f6a077b`。
- 根拠: Typing実プロフィール、StenoはPlover/Lapwing/練習サイト/母音メモ。特定ステノ専用機の所有記載はない。
- native確認済み: `Laptop recessed keyboard deck` はMESH、現在roomTarget=`projects`。`Layout musical keyboard`配下の演奏スタンド部品はpiano。両者を混同しない。
- 計画: PC入力部の実キー/keyboard deckだけに `typing` の独立選択を設け、モニター/PC画面のProjectsを保持。Laptop全体をtypingへ一括付替えしない。新規専用ステノ機を捏造しない。
- StenoはTyping panelの関連リンクから実childを解決し、空の偽ページを作らない。単独targetを増やすかは現物の識別可能性を確認したうえで判断する。
- 検証: PC入力→Typing→Steno実child→戻る、モニター→Projects、紙→Notes、演奏鍵盤→Piano。4導線を混同せず同一ブラウザーで確認。

#### H-04 — Music / Trombone / Transcriptions

- 正規root: `http://127.0.0.1:4321/th/hobbies/db3c4b0f-40a1-4132-9732-442ce3b27236`。
- 実child: Trombone `/doc/7126d9a4-2c3e-4383-844a-908e14c8359b`、Transcriptions `/doc/afb74437-b955-4684-a4c7-abfa06a6b8d3`。Piano `/doc/54fe7549-66d7-406d-8d97-21d9de0f02ba`は既に直接解決している。
- 根拠: Tromboneの機種名なし。採譜本文は短い。架空の演奏実績/曲/音源を補わない。
- 計画: 実資料に合うトロンボーンのベル、主管、スライドの構造が判別可能な代表物を追加。正確な所有場所は不明なので大型収納や通路上配置を創作しない。原本で置き場所が確定できない場合、Musicの関連導線を先に接続し、模型配置は未完として返す。
- 採譜はMusic/Piano panelの実Transcriptionsリンクで提供。Notesの紙束targetを奪わず、架空楽譜を作らない。
- 検証: Piano既存URL維持、Trombone/Transcriptionsのroot/child構造一致、Escape/関連tab維持。

#### H-05 — Posture Thing / フォームローラー

- 正規本文: `http://127.0.0.1:4321/th/hobbies/4ddb6416-b7d0-4477-b636-27144cf923e4`。
- 根拠: 24インチ高密度フォームローラー。24in=0.6096mは単位換算であり、部屋の測量値ではない。直径/色/ブランドは本文や参照で確認できなければ未確定。
- 計画target: `posture`。床置きの代表物を既存通路/マット/家具に干渉しない場所へ。細かな発泡材の粗さ/端面と丸みを付け、粗い円柱を完成扱いしない。未確認の突起付きローラーにしない。
- 検証: closeupで表面と接地、クリック→正規Posture。医学的な有効性をこの実装が保証する表現は追加しない。既存本文は改変しない。

#### H-06 — Geoguessr

- 正規本文: `http://127.0.0.1:4321/th/hobbies/bd49f03c-f554-46af-bcda-33983b677d7e`。根拠はPlonk Itと地理資料への実リンク。
- 未確定: 実所持の地球儀/地図は記載されていない。専用の地球儀を所有物として創作しない。
- 計画target: `geoguessr`。既存デジタル機器または趣味panelから実地理探索の導線を作り、PCの既存Projects/Notes割当を保持する。新たな物理表現を採用する場合は所有再現とサイト導線の演出を明確に分ける。
- 検証: 正規本文と元リンクhrefを確認。外部アカウントへのログイン/ゲーム操作/投稿はしない。地理探索と判別できない装飾を完成扱いしない。

#### H-07 — Drawing

- 正規本文: `http://127.0.0.1:4321/th/hobbies/3fd729f1-9dee-4e98-8dd9-c45f2161a780`。現在は素材未公開の休止ページ。
- 計画target: `drawing`。一般的なスケッチブック/鉛筆等の小さな代表物。具体的な所有ブランド、完成作品、技能実績は創作しない。描かれていないページを実作品として見せない。
- ペン回し用ペン、Notes紙束、Drawing用具を別対象として識別できるようにする。既存机/棚を移動せず空き面に接地させる。
- 検証: 形状/紙厚/角/鉛筆の先端と材質、marker→正規空状態、Notes/Pen Spinningの既存URL維持。休止状態を理由に趣味そのものを省略しない。

### G-01 — 形状/配置/素材の全体監査

- 最新v2平面図の全相対座標を上面図と比較し、その後写真3枚と家具を近接照合。
- 対象: 2窓/中央dart、机向き/鍵盤/棚/マット/入口/収納/ポスター、curtain clearance、寝そべり形状、棚密度、椅子/beanbag布、アクリル内穴/印刷/ケース、住宅街解像度。
- 判定: 原写真の型と異なる場合は修正。見た目だけで交差と断定せずbounds/meshも確認。モデル未計測寸法を実測値に格上げしない。
- 合格: room-spec全GEO/AST項目に最新証拠。所有者レビューに提示して確認。

#### G-01 readout — 2026-09-08

- 完全な比較結果は `conductor/room-g01-audit-2026-09-08.md`。原写真3枚を直接視認し、v2平面図を配置原本として扱った。
- Native boundsで上壁2開口/中央ダーツ、左壁PC机/右側椅子・机マット、入口側鍵盤、右壁棚、低机/beanbag、右下ペンライト・タオル、左下入口、下壁右収納の各相対領域を再確認した。配置移動は行っていない。
- `assets/room/g01-layout-objects.png`は床・壁・窓を一時的に非表示にした上面監査画像。`assets/room/g01-topdown.png`は元の遮蔽状態を示す補助画像で、配置証拠には使わない。
- 写真との形状照合で実際に見つかった不一致は棚密度だった。`g01-shelf-wide.png`の大きな空き区画は写真の密な白色モジュラー棚と矛盾した。
- 限定修正として `densify_shelf_contents.py`、`repair_shelf_density.py`、`fill_shelf_bays.py`、`fill_shelf_top_bay.py`、`refill_shelf_top_display.py`、`repair_shelf_book_edges.py`をnative Blender MCPで順に実行した。最終近接証拠は `assets/room/g01-shelf-polished-final.png`。
- `repair_shelf_density.py`では初回コピーが親の非直交basisを継承していたため、親を外し、元群のboundsから目標位置を再計算した。書籍ヘルパーの unrotated top/band が棚を横切ったため削除した。これらは見た目だけでなくboundsで再確認した。
- G-01の配置判定はbounded pass、棚密度は改善済み。部屋全体の完成、全小物再現、export/browser/昼夜/mobile/衝突/遮蔽/残趣味の合格を意味しない。
- G-01修正をnative `export_room_web.py`→`strip_unused_uv.mjs`→public `room.glb`へ同期した。現行lean/public SHA256は`01fa6c7aaaa0e9c8a965b2b075e55a856d74d340093cd623b2af99ee22782d0e`、exportは128 groups/131 objects。fresh headed `ham-room-live`で入口→入室→可視棚marker→実hobbies overlay→Escape復帰を実行し、`browser-g01-entry-after-shelf.png`、`browser-g01-shelf-focus-after.png`、`browser-g01-room-return-after-shelf.png`を視認、errors JSON空。これは棚修正のbounded gateであり、全体完成ではない。

### U-01 — 遮蔽/移動/閲覧

- source候補: namecard hotspotのearly return。実ブラウザーで壁/家具越し選択を再現したときのみ修正。marker visibilityの150ms cacheと視線変化も確認。
- 持続WASDは本当のkeydown/upで、床上移動と壁/机/棚/収納への衝突停止を確認する。文字列typingは代替不可。既存CLIの対応コマンドを現helpで確認し、ブラウザーへテスト用カメラ値を注入しない。
- 選択中は移動しない、closeupがpanelに隠れない、本文scroll、内部HTTPリンク、外部full-pageリンク、Escape/戻る/再入室、キー残留を確認。
- 英日泰、実coarse/mobile、portrait/landscape、ロード失敗時の通常ナビ、console/network、実負荷も対象。

### V-01 — 最終検証と独立監査

- 前提: G/H/Uの未完なし。対象静的gateと必須のAstro buildを空き確認後に実行する。容量不足ならbuild未検証として止め、他プロジェクトのデータを削除しない。
- Luna/maxへ写真/配置、物理材/UV、Web操作の独立読取監査を限定割当。主担当は各指摘を再現してから採用する。
- specの全要件を最新artifactへ対応させる。部分画像、build成功、モデル応答を全体合格にしない。
- 外部公開やpushは新しい明示許可がある場合だけ。ユーザーに現在の成果物を提示し、Goal completeは全条件の実証後のみ。

## 12. Command cookbook

以下は1コマンドずつ実行。起動はモデル制作再開の文脈で行い、引継ぎ作成だけなら起動しない。ポート利用者がいれば勝手にkillしない。

```sh
git status --short --branch
git rev-parse --show-toplevel HEAD
df -h .
lsof -nP -iTCP:4321 -sTCP:LISTEN
```

CWD `/Users/vittayapalotai.tanyawat/code/ham-san.net/apps/astro`:

```sh
ASTRO_ADAPTER=node bun run dev -- --host 127.0.0.1
```

返ったforeground handle/PIDを記録し、所有者として終了まで管理する。意図して停止した旧96487の再利用は禁止。予期せぬ終了時は原因を調べ、無条件再起動しない。

```sh
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser session list
```

`ham-room-live` が既に存在する場合は、まず同sessionの `get url` で所属を確認する。他プロジェクトなら操作・navigation・closeをせず停止する。この部屋の旧sessionなら閉じてからfresh sessionを作る。既存ログを新しい実行のエラーとして混同しない。

```sh
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live --headed open http://127.0.0.1:4321/th/
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live set viewport 1440 900
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live snapshot -i
```

入室ボタンがenabledになったことをsnapshotで確認してから次へ進む。GLB読み込み完了まではdisabledであり、エラー時もdisabledのまま。進まなければ現在のstatus、errors、モデルのnetwork応答を調べる。時間経過だけを成功とせず、sleepループやforce clickで回避しない。入室後も新しいsnapshotと画面でけん玉markerの可視状態を確認する。

```sh
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live click '[data-room-enter]'
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live snapshot -i
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live click '[data-room-target-label="kendama"]'
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live get attr '[data-room-full-page]' href
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live screenshot assets/room/browser-kendama-cups-after.png
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live errors --json
```

最後のafter画像名は将来の予定で、まだ存在する証拠ではない。screenshot後にview_imageし、loading中なら実本文が読める状態を別途確認して取り直す。

Escape後も画面を保存・視認し、選択前の位置/向きと比較する。既存の復帰画像と操作記録は部分証拠であり、厳密な元pose一致は未証明。終了時はこのタスクが作成したsessionだけを閉じ、一覧で残存を確認する。

```sh
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser --session ham-room-live close
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser session list
```

Blenderで現在の保存パスを確認してから、ネイティブexecute内でのみ実行:

```python
exec(compile(open(bpy.path.abspath('//export_room_web.py')).read(),'export_room_web.py','exec'))
```

export前に対象修正を原本へ保存する。書出し前後の選択やtemporary collectionはスクリプトが復元する。`RoomWebExport`が既存なら原因を調査し、無条件削除しない。

repo rootで個別実行:

```sh
node assets/room/strip_unused_uv.mjs assets/room/room-web-current.glb assets/room/room-web-lean.glb
cp assets/room/room-web-lean.glb apps/astro/public/models/room.glb
shasum -a 256 assets/room/room-web-lean.glb apps/astro/public/models/room.glb
```

CWD apps/astro、対象コード変更後:

```sh
bunx eslint src/components/home/room-runtime.ts src/components/home/RoomHome.astro src/components/home/room-copy.ts
bunx prettier --check src/components/home/room-runtime.ts src/components/home/RoomHome.astro src/components/home/room-copy.ts
```

最終buildはapps/astroで `bun run build`。初回は`relatedLinks`のContentId推論エラーを検出し、型注釈を修正後に再実行して0 errors/0 warnings/0 hints、`Server built`、`Complete`を確認。G-01棚配信後にも再実行し、同じ0 errors/0 warnings/0 hints、exit 0、`Complete`を確認。上の3ファイル静的gateも成功。Browserslist stale noticeとchunk-size warningは残るが依存更新は行わない。全体workspace checkは重く別範囲も含むため、ヒント修正だけで安易に実行しない。依存installは既存環境で不要。

### Suggested skills / Mattルーティング

- `handing-off-pro-max`: 今回の完全handoffと状態検証。
- `handoff`: 移管用portable文書、suggested skills。OS temp保存指示はproject-owned優先規則により適用しない。
- `ask-matt`: 複数セッションの残作業は既存specを維持し、blocker順のself-contained tasksへ分ける。確定済み配置を再grillしない。
- `setup-matt-pocock-skills`: 未設定。GitHub remote、AGENTSあり、CLAUDEなし、CONTEXTあり、CONTEXT-MAP/docs/agents/docs/adr/.scratchなし。workspacesはapps/*/libs/*。triage skillは存在のみ確認。trackerの回答待ち。回答後にtriage defaults、single/multi-contextを順に確認し、draft提示後だけ設定を書く。
- `look-at-the-screen` → `surgical-patch`: 限定不具合の実視認、根因修正、同一画面確認。
- `agent-browser`: current CLI coreを全文読んで使用。route verificationの必須手段。
- `get-your-shit-together`: 原本と出力の食い違い/訂正があれば即座に再照合。
- `imagegen`: 印刷原稿/背景の新規生成時のみ、来歴と原稿をroom-assetsへ。Blender形状の代用品にしない。
- 次担当はLuna/max指定を守る。各担当は入力/許可パス/禁止操作/証拠/stop条件を受け取り、主担当だけが統合・完成判定を行う。

## 13. Handoff receipt

- 作成・更新日: 2026-09-08、Asia/Tokyo。今回の最後の実画面時刻23:53:43。
- live確認: main/HEAD/dirty/remote、所有Astro PID、終了130/4321 LISTENなし、browser URL/close、native Blender object応答、5.1GiB、GLB/code hash。
- 読了: AGENTS、CURRENT_TASK、room-spec、room-reference-map、room-assets、room-hobby-map、CONTEXT、旧room-resume/verification-handoff、export/strip/add_skill_toys/refine_kendama_cups/refine_card_faces/room-copy、変更責務を持つruntime/RoomHome部分とRoomHome全文。
- skill coverage: handing-off-pro-max 1–167/EOF、ask-matt 1–90/EOF、setup-matt-pocock-skills 1–116/EOF、handoff全文、PHASE-BOUNDARIES全文。前段surgical-patch 1–16/EOF、look-at-the-screen 1–60/EOF、agent-browser stub/core全文。
- 履歴: 現会話の直接要求と保持された実操作のみ。他セッションの履歴読取なし。停止時Astro出力は先頭/末尾のみ。欠けた過去実行時刻/全文を捏造していない。
- 永続文書: 本資料、room-handoff-inventory、CURRENT_TASK、room-hobby-map。raw chat/秘密値はコピーしない。
- 書込み後照合: 初稿1–384/EOFを連続読了。追加したH共通/H-02–H-07とcookbookを再読。独立監査のreadiness/tab消失/navigation保持/cleanup/build必須/復帰証拠の指摘を原コードに照合し、本文を修正。今回のK-01/K-02/K-03実装、GLB/runtime/RoomHome hash、Astro build、4321 LISTENなし、ham-room-live close、対象Git状態を再確認。
- 最新照合SHA256: G-01後GLB lean/public `01fa6c7aaaa0e9c8a965b2b075e55a856d74d340093cd623b2af99ee22782d0e`、runtime `a7fb558e575416be23750905424530b16d5dd4a55011703991a2346b2344c9d0`、RoomHome `62da7dc0314477cc1e004dd717218179a747c98948d84004ddf765feb613f624`、room-copy `e003a248df9d844328391a901d6c48e5779b53d1c06221e24cb4c0b3a3f64cdf`、kendama script `2b04a1a3224f520e95358b2790b616a19ac1093612a28d0e360e4d1d6ac5fce3`、card script `3e71904cc32b1a1d7301110c942dabd8e5e834128626ccbbf12c0faf44e93593`。旧hashは履歴比較用で、現行GLBと混同しない。
- 未検証: 部屋全体品質、残趣味、全操作/昼夜/mobile/性能、CI/deploy。今回のbrowserはThai desktopの実操作。Matt設定は確認待ち。けん玉/ヨーヨー/カードの限定修正は実施済みだが全体合格ではない。
