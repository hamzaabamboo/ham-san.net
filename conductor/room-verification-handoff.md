# 3Dホーム検証再開資料 — 2026-09-07

## 1. タスク契約

実室に対応した高品質なモデル、自然な材質、Tokyo昼夜、住宅街背景、WASDと構図付き選択、HTML本文、実UIヒントを完成・検証する。詳細はroom-spec.md、配置原本は所有者の2枚目平面図、形状はDownloads/Photos-1-001の3写真。キッチン・架空の家具・仮UIは追加しない。ローカル制作のみ許可。起動例外・push・公開は未許可。

## 2. リポジトリ

- CWD: `/Users/vittayapalotai.tanyawat/code/ham-san.net`
- branch: `main`、HEAD: `fa3f507114370a7d0d48a45b39e5939d562c51f9`。
- `git status --short --branch`で広範な既存dirty状態を確認。今回の停止処理で製品コードは変更していない。未知の所有権を推定して取り消さない。
- 関連untracked: `assets/room/`、`apps/astro/public/models/`、`apps/astro/src/components/home/{RoomHome.astro,room-runtime.ts,room-copy.ts}`、`conductor/`。
- 直近のモデル変更はケース厚みメタデータと収納横ポスター離隔。以前の変更の境界はCURRENT_TASK.mdに記載。

## 3. 環境と権限

Blenderは公開ネイティブMCPのみ。独自Pythonクライアント、Blender CLI、OS操作は禁止。4321は現在LISTENなし。`agent-browser session list`にはdefaultのみ存在し、所有権不明のため操作していない。自分の実行中サーバー・レンダー・監査エージェントはない。直近空き容量4.6GiB。大規模ビルドや画像一括生成の前に再確認する。

## 4. 停止判定の操作台帳

この停止処理に限定した正確なコマンド。以前の全生ログは読まず、再構成しない。

|順序|操作|結果|
|---|---|---|
|1|`tail -n 4 conductor/CURRENT_TASK.md`|直前の夜間ポスター修正と厚み修正を確認|
|2|view_imageで`/Users/vittayapalotai.tanyawat/Downloads/Photos-1-001/PXL_20260907_015010154.jpg`|ラップトップとタブレットの実アプリ表示を再確認|
|3|`lsof -nP -iTCP:4321 -sTCP:LISTEN`|終了1、LISTENなし|
|4|get_goal|未完了のactive状態を確認|
|5|handing-off-pro-max/SKILL.mdをサイズ確認後、1–167 EOF読了|停止時の引継ぎ規則を確認|
|6|`git status --short --branch`、`git rev-parse HEAD`|上記branch/HEADとdirty状態|
|7|`AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser session list`|defaultのみ、未操作|

## 5. 方法と判断

原写真のPC画面は実コンテンツ。架空のコードやUI画像を描いて完成扱いにしない。実サイト表示を画面に利用する場合も、ページを起動して内容を直接確認してから行う。ブラウザーを省略して材質数値だけで合格しない。一時サーバーの禁止例外を繰り返し求めたが、明示の回答はない。

## 6. 成果物

|パス|役割・現状態|
|---|---|
|`assets/room/room.blend`|保存済み原本|
|`assets/room/export_room_web.py`|評価メッシュ化、UV保全、FONT/LIGHTと対象extrasの出力|
|`assets/room/configure_case_volume.py`|実形状の短辺からケース厚みメタデータを設定。再実行時は元材質の面のみ処理|
|`assets/room/repair_closet_poster_clearance.py`|2枚の板と印刷を一体移動。枠との最小60mm離隔を確保、再実行可能|
|`assets/room/strip_unused_uv.mjs`|未参照UVだけ除去。保持バイトを別途検証する|
|`assets/room/room-web-current.glb`|最適化前原本|
|`assets/room/room-web-lean.glb`、`apps/astro/public/models/room.glb`|31,170,032 bytes。SHA256 `66f5b244b51ff571409491e2ea8fe85be27ad82bc49cc7a0d8fffd8890ebbe6b`|
|`assets/room/room-poster-clearance-night-check.png`|主担当が視認した修正後夜間画像。Web証拠ではない|
|`assets/room/room-case-refraction-only-check.png`|反射寄与分離の診断画像。最終材質ではない|
|`conductor/room-assets.md`|生成素材と原本・プロンプトの記録|

## 7. 検証境界

|対象|現証拠|未検証|
|---|---|---|
|壁接合|Blender正面画像、隙間0m|Webの現行表示|
|ポスター|同一夜間カメラの修正前後、60mm離隔|通常移動の全角度|
|16本ペンライト|Cycles夜間画像で発光・色漏れ|Tokyo切替とWeb光源|
|ケース材質|GLB volume/IOR/transmission、保持バイト検証|実際のWeb透過と負荷|
|UIヒント|過去の対象lint/format成功、遮蔽処理|クリック・WASD・モバイル・全対象|
|PC画面|写真を再視認|ラップトップ/タブレットは仮表示|

## 8. 失敗と再発防止

スタジオHDRIのMaterial Previewを制作照明の証拠にしない。ケースの白い成分は反射であり、粗さ低減・glossy filter無効化・デノイズ無効化では解決しなかった。反射だけを除く比較で分離し、物理材質は復元済み。Blender5.2のinline変換はThicknessだけのglTFグループを落とす。標準Occlusion入力も持つグループで原ノードの出力経路を保持し、実GLBで確認済み。古い画像・GLBハッシュ・エージェントの成功報告を現行証拠にしない。

## 9. ブロッカー

一時Astroサーバー起動の明示許可がない。最終Web検証と実サイト内容の画面制作を進められない。許可なしで別のサーバーやブラウザーHTML注入へ迂回しない。モデル・UV・印刷・ケース厚み・壁・夜間ポスターの安全なローカル作業は実施済みだが、完成ではない。ダーツ支持部の正確な写真/型番と収納前無記名矩形の確認も未回答。

## 10. 直後の一手

起動許可の返答を確認する。許可があれば`apps/astro`で`bun run dev -- --host 0.0.0.0`を実行し、実際のポートとハンドルを記録。既に4321が使われていたら勝手に停止せず対象確認。許可がなければ起動しない。

## 11. 残作業順

1. 実ブラウザーで現行壁・ケース・ポスター・昼夜を直接確認、コンソール/ネットワークを確認。
2. WASD、対象ヒント、遮蔽、クリック、構図/移動固定、HTML本文、復帰、モバイル、英日泰を実操作。
3. ラップトップ/タブレットの仮画面を実内容に対応させ、棚・家具を原写真と再照合。ダーツ支持部は未確認形状を創作しない。
4. 変更後モデル同期と同じ実操作で再検証。完成条件はroom-spec.md全体、局所画像だけでは不可。

## 12. 再開コマンド

コマンドは一つずつ実行。サーバー開始だけは新しい許可が必須。

```sh
lsof -nP -iTCP:4321 -sTCP:LISTEN
df -h .
AGENT_BROWSER_ARGS='--use-mock-keychain,--password-store=basic,--mute-audio' agent-browser session list
node assets/room/strip_unused_uv.mjs assets/room/room-web-current.glb assets/room/room-web-lean.glb
shasum -a 256 assets/room/room-web-lean.glb apps/astro/public/models/room.glb
```

ブラウザーは一つの専用セッションのみ。全コマンドに上記ARGSを付け、非HTTPリンクを開かない。終了時に自分のセッションとサーバーだけ終了する。全セッションを無断終了しない。

## 13. 引継ぎ確認

2026-09-07、停止判定時のGit/4321/セッション状態を直接確認。現セッションの直接要求とプロジェクト規則を使用。他セッション履歴は未読。恒久状態はCURRENT_TASK.mdと本資料。画像は上記パスを直接視認済み。実ブラウザー、全モデル忠実度、性能、最終完成は未検証。
