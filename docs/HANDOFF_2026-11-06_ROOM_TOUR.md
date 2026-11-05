# ホームページ・ルームツアー引継ぎ 2026-11-06

## 1. 作業契約と停止条件

最新依頼は引継ぎ、対象変更のコミットと push、その後の停止。実装コミット `2860ec75271476d7bc8dcb32cf6ae7c454daa363` は `origin/main` へ push 済み。この文書とライブ索引は別の引継ぎコミットに含める。追加の設計・実装・ブラウザー操作は開始しない。

製品要件は、実際の部屋を巡るスクロール駆動 Three.js ホームページ。通常設定では常時アンビエント動作を維持し、動きを減らす設定・明示操作では静止する。実データ、既存ルート、入室後の操作、英語・日本語・タイ語、モバイル、読める HTML フォールバックを保持する。最初の画面にカメコ写真を使わない。

判断順序は最新依頼、`conductor/CURRENT_TASK.md`、現在のソース、ADR 0008、過去資料。旧 ADR 0001 と `docs/design/pages/home.md` の写真ヒーローは現行要件を上書きしない。古い引継ぎの遅延ロード方式、マージ破棄方式、権限、プロセス番号も現在の根拠にしない。

push の許可は得た。マージ、明示デプロイ、CMS 更新、外部投稿、有料生成は実施していない。Strapi はプロジェクト・経歴・プロフィール・写真メタデータ、Outline はノート・趣味の所有元。実装へ個別の編集記事を移さない。

既存GitHub設定によりpush後に自動workflowが開始した。確認時点では [Continuous Integration](https://github.com/hamzaabamboo/ham-san.net/actions/runs/42055920989) と [Deploy](https://github.com/hamzaabamboo/ham-san.net/actions/runs/42055920967) は両方 `in_progress`。手動deployは起動しておらず、workflow開始を完了とは扱わない。

## 2. リポジトリと作業ツリー

| 項目 | 確認値 |
| --- | --- |
| 作業場所 | `/Users/vittayapalotai.tanyawat/code/ham-san.net` |
| ブランチ | `main`、追跡先 `origin/main` |
| remote | `git@gh-personal:hamzaabamboo/ham-san.net.git` |
| 作業開始前 HEAD | `3730912fd54bf0af7eb83d7fd722ec792d1db2ce` |
| push 済み実装 | `2860ec75271476d7bc8dcb32cf6ae7c454daa363` |
| 人間の Git identity | `Tanyawat Vittayapalotai <hamzaabamboo@gmail.com>` |
| PR | 作成していない。main へ直接 push |
| ネットワーク確認 | `git fetch` 成功後、開始時の左右差は `0 0`。実装 push 後の HEAD と origin/main は一致 |

実装コミットには31ファイルを含む。正確な一覧は `git show --stat 2860ec7`。現在の引継ぎ文書を含む後続コミットによって最終 HEAD は進むため、再開時は必ず fetch と `git rev-parse HEAD origin/main` で確認する。

次の既存ローカル資料は変更せず、今回の push に含めなかった。削除・自動 stage しない。

- 変更済み生成物: `tools/room-harness/build/audit-latest.json`、`physics-latest.json`。今回の継続で再生成していない。
- 未追跡の設計・調査資料: `.taste-skill/direction.json`、`conductor/brand-notes/`、`conductor/home-brand-inventory.md`。過去の同作業資料だが、プライベートな原調査を含むため公開範囲を拡大しなかった。
- 以前からの未追跡資料: `conductor/unslop-round2-deduped.json`、`conductor/unslop-round2-raw-findings.json`、`docs/HANDOFF_2026-10-22.md`、`docs/HANDOFF_2026-10-28_HOBBIES_RECOVERY.md`、`docs/HANDOFF_2026-10-28_UI_AUDIT.md`、`docs/HANDOFF_2026-11-05_HOME.md`、`docs/HANDOFF_2026-11-05_ROOM_TOUR.md`。

作業ツリー全体が clean であるとは報告しない。上記を残したまま、対象の実装と引継ぎだけを配送する。

## 3. 実行環境と制約

- Node は `mise exec node@24.22.1 --`。リポジトリ既定の Node 24.16.0 には agent-browser がなく、実際に起動失敗した。
- `DO_NOT_TRACK=1` を維持。Astro ビルドは `ASTRO_TELEMETRY_DISABLED=1 ASTRO_ADAPTER=node RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=1`。テストは `--max-concurrency 1`。
- Netlify のローカルアダプターは `unexpected argument '--allow-scripts' found` と Edge Functions 起動失敗を出した。設定を変更せず、既存の Node アダプター分岐を使用した。
- 本番相当サーバーは `apps/astro` から `HOST=0.0.0.0 PORT=4323 ... node dist/server/entry.mjs`。今回起動したサーバーは停止済み。4323 の listener がないことを確認した。
- タスクのブラウザー名は `ham-room-continuity`。`session info --json` は `active:false`、PID/runtime は null。無関係の `inkless-setlist` は触らない。
- ブラウザー実行には毎回 `AGENT_BROWSER_HEADED=true AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic,--mute-audio"`。新しいタブやユーザー Chrome を代用にしない。
- Blender 制作元は `assets/room/room-v2.blend`。編集は公開された Blender Lab ネイティブ MCP のみ。今回の継続では Blender を操作していない。
- 最終ビルド前の利用可能容量は `df -k .` で 14,784,692 KiB。丸めた使用率97%を容量不足と扱わない。

## 4. 実行記録

以下はこの継続で再現に必要な実コマンドと操作。過去セッションのログは読んでいない。読み取りはファイルサイズ確認後、現行索引と指定ソースに限定した。CDP URL は一時値なので再利用せず、毎回現在の値を取得する。

| 順序・目的 | コマンドまたは操作 | 結果・再実行条件 |
| --- | --- | --- |
| 再開 | `cat conductor/CURRENT_TASK.md`、`git status --short --branch` | 対象の dirty work と無許可の外部操作を区別 |
| 元の実行経路 | `DO_NOT_TRACK=1 ... bun run dev -- --host 0.0.0.0 --port 4323` | Netlify Edge 起動失敗。Node 分岐へ切替 |
| Node 開発確認 | `DO_NOT_TRACK=1 ASTRO_ADAPTER=node RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=1 mise exec node@24.22.1 -- bun run dev -- --host 0.0.0.0 --port 4323` | 起動成功。その後停止 |
| モバイル変更 | `RoomHome.astro` の700px以下に scene-height `clamp(14rem, 34svh, 20rem)` を追加 | 390×844で371→287px。既存構図計算を再利用 |
| ビューポート検証 | agent-browser の viewport、open、screenshot、`mouse wheel 490`、`mouse wheel -490`、入室・退室・motion・drawer・Escape | EN390、JA phone、TH320、tablet768を目視。viewport preset は coarse pointer の証拠にならなかった |
| 本番相当確認 | `DO_NOT_TRACK=1 HOST=0.0.0.0 PORT=4323 RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=1 mise exec node@24.22.1 -- node dist/server/entry.mjs` | 既存ビルドで実ブラウザー検証。終了時 Ctrl-C |
| 記録準備 | agent-browser eval で `window.name="room-continuity-proof"` と isolated profile の `room-motion=on`、`get cdp-url` | 実際に所有する同一タブを選択。URLは毎回取得 |
| cold entry | `DO_NOT_TRACK=1 mise exec node@24.22.1 -- node tools/room-harness/capture-session.mjs <current-cdp-url> room-continuity-proof .scratch/rec/mobile-touch-cold-entry-proof.mp4 12 --touch --enter` | 実 touchStart/touchEnd、390×844/coarse/entry/revealを終端でassert。成功 |
| 全章 | `DO_NOT_TRACK=1 mise exec node@24.22.1 -- node tools/room-harness/capture-session.mjs <current-cdp-url> room-continuity-proof .scratch/rec/mobile-touch-tour-proof.mp4 1 --touch --chapters` | native wheel、8枚、overflow=false。全画像を個別に目視 |
| シーケンス確認 | `DO_NOT_TRACK=1 ffmpeg -hide_banner -loglevel error -threads 1 -i .scratch/rec/mobile-touch-cold-entry-proof.mp4 -vf 'fps=1,scale=195:-1,tile=5x3' -frames:v 1 -threads 1 -y .scratch/rec/mobile-touch-cold-entry-proof-sequence.png` | 全時間帯のプレビュー・入室・カーテン動作を目視 |
| ハーネス検査 | `DO_NOT_TRACK=1 mise exec node@24.22.1 -- node --check tools/room-harness/capture-session.mjs` | exit 0 |
| 整形 | `DO_NOT_TRACK=1 mise exec node@24.22.1 -- bunx --no-install prettier --check tools/room-harness/capture-session.mjs tools/room-harness/README.md` | pass |
| 配送前fetch | `DO_NOT_TRACK=1 git fetch`、`git rev-list --left-right --count HEAD...origin/main` | 成功、0/0。rebase不要 |
| 最終テスト | `DO_NOT_TRACK=1 RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=1 mise exec node@24.22.1 -- bun test --max-concurrency 1 apps/astro/tests > .scratch/rec/tests-push-handoff.log 2>&1` | 363 pass、0 fail、35 files、exit 0 |
| 最終ビルド | `DO_NOT_TRACK=1 ASTRO_TELEMETRY_DISABLED=1 ASTRO_ADAPTER=node RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=1 mise exec node@24.22.1 -- bun run build > ../../.scratch/rec/build-push-handoff.log 2>&1` | CWD apps/astro、exit 0。大きなchunkとBrowserslistの警告あり |
| stage | 対象31ファイルを明示して `git add`。既存のhero-scene削除も保持 | 無関係な資料とaudit生成物はstageしない |
| 配送 | `DO_NOT_TRACK=1 git commit -m "feat: make homepage a continuous room tour"`、`DO_NOT_TRACK=1 git push origin main` | 2860ec7、push exit 0、HEAD/origin一致 |
| 停止確認 | `lsof -nP -iTCP:4323 -sTCP:LISTEN`、タスク名付き `agent-browser session info --json` | listenerなし、ブラウザーinactive |

Git hook は既存の `pnpx lint-staged` を実行し、一致タスクなしで終了した。新規テストは作成していない。最初のsecret scanは誤ってbinaryをtextとして読みdecode失敗したため採用せず、通常のstaged diffで再実行し、token/private-key/webhookパターン0件を確認した。

## 5. 実装方式と保存すべき判断

`index.astro` が `RoomHome tour` にSSRの各章を渡す。`RoomHome.astro` のスクロール conductor が章ごとのposeを `room-runtime.ts` に渡す。実データの取得は `HomeBody.astro` と既存CMSユーティリティを使い、期限超過はlast-good値、ない場合は読める失敗表示と再取得になる。

通常環境ではWebGLを自動で準備し、制限付き接続では静的状態を保つ。昼夜・desktop/mobileの4種類の動画とposterが初期表示を橋渡しする。モバイルは上のsceneと下の文章を分離し、読書中は章のカメラを保持。入室では同じカメラ、位相、マージ済み表示を維持し、projectionを展開する。play操作で必要なときだけ元meshへ戻す。旧資料の「入室時に全マージを破棄」は採用しない。

カーテンの色passとdepth/shadow passは同じswayを使う。重複rack光は削除しspillを抑制。照明は天井diffuserのworld境界から配置する。Motion offはshader/texture/fanの位相を停止し、shadowを一度更新する。静止画像・ビルドを動作証拠にしない。

## 6. 配送ファイルと証拠

| 対象 | 役割・変更 | 確認と再開時の注意 |
| --- | --- | --- |
| `apps/astro/src/components/home/RoomHome.astro` | tour shell、scroll conductor、motion、同一構図preview、phone/tablet構成 | 現在のphone高さを保持。previewとliveを同一条件で比較 |
| `room-runtime.ts`（同directory） | pose補間、life、影、最適化、連続入室、破棄処理 | free roamとplayをtour最適化で壊さない |
| `HomeBody.astro`、`pages/[locale]/index.astro` | 実データの8章、入口、SSR期限、復旧 | CMS所有を保持。写真は最初の章に移さない |
| `apps/astro/src/styles/home.css` | 章、読み取り領域、desktop/tablet/phone、reduced motion | 固定sceneと文章の重なりを実画面で確認 |
| `apps/astro/src/utils/cms-cache.ts` | `withinLastGood` | タイムアウト時に架空値を入れない |
| `libs/i18n/en/home.json`、`ja/home.json`、`th/home.json` | 章名、職種、Tokyo、availability、motion文言 | 3言語の実幅を維持 |
| `apps/astro/astro.config.mjs` | inlineStylesheets | Node分岐は既存。production側の受入は別 |
| `apps/astro/tests/round22-contracts.test.ts` | 既存契約をroom tourへ更新 | 363テストの一部。新しいテストファイルなし |
| `apps/astro/src/components/home/hero-scene.ts` | 削除済み旧graphic hero | 復活させない |
| `apps/astro/public/models/room.glb` | 約13MBの現行runtime model | Blender原本と同じものと推定せず、変更時にhash確認 |
| `assets/room/room-v2.blend`、`export_room_v2.py`、`refine_scene_materials.py` | 編集原本、昼夜背景を保持するexport、実材質調整 | native MCP限定。再実行は現在のlive sceneを確認してから |
| `apps/astro/public/models/room-tour-{day,night}{,-mobile}.{mp4,webp}` | 8つの必要な製品preview asset | QA添付動画ではなくruntime依存物としてcommit |
| `apps/astro/src/components/home/room-preview.json` | 上記4組のpath | import先と実ファイルを揃える |
| `tools/room-harness/capture-session.mjs` | 同一tabの実touch entryと全章記録 | 録画中はagent-browserコマンドを挟まない |
| `render-motion-previews.mjs`、harness `README.md` | ローカルpreview生成・capture手順 | workflow証拠とasset生成を分ける |
| `AGENTS.md`、`docs/adr/0001-...`、`0008-...` | 連続性・制作元・新homepage判断 | 旧ADRと仕様の不一致を黙って書換えない |
| `.scratch/rec/mobile-resume-{before,after}.png` | phone scene高さの前後 | ローカルのみ。配送画像ではない |
| `.scratch/rec/mobile-touch-cold-entry-proof.mp4`、`.mp4.json`、`-sequence.png` | 最新touch entryの映像・状態・全期間の図 | 13.53秒、708 frames、例外0 |
| `.scratch/rec/mobile-touch-tour-proof.mp4`、`.mp4.json`、`.mp4.chapters/01.png`〜`08.png` | 全8章のnative wheelと画面 | coarse=true、390px、全章overflow=false。個別に閲覧済み |
| `.scratch/rec/tests-push-handoff.log`、`build-push-handoff.log` | push直前の検査 | ローカルのみ。CI結果と混同しない |

## 7. 検証マトリクス

| 項目 | 証拠層・結果 | 未検証の境界 |
| --- | --- | --- |
| 現行テスト | ローカル既存suite 363/363 pass | 過去索引の388件を現行件数として使わない |
| ビルド | Node production build exit 0、Astro errors 0 | provider deployの成功ではない |
| phone構成 | browser viewport EN390、JA、TH320、tablet768を目視 | 物理端末ではない |
| touch entry | 同一headed tab、390×844、coarse=true、touch=5、motion=on、entered/revealed=true | ブラウザーemulationである |
| 8章 | 個別画像を目視、caption一致、overflow=false | 主観的な最終デザイン受入は未確定 |
| 連続性・動作 | 最新映像のpreview/live/entryとカーテン変形を時系列で確認 | production・実機FPSではない |
| 停止状態 | listenerなし、タスクbrowser inactive | 以前のLAN URLは起動していない |
| Git配送 | 2860ec7のpushとlocal/remote一致を確認 | CI・明示deploy・production Lighthouseは別 |
| モデル受入 | 以前の記録は671688 triangles、check-buildに41件のlegacy failure | 今回再監査していない。完全合格とは扱わない |

## 8. 失敗・旧証拠・再発防止

- CLIのdevice presetはcoarse pointerを有効にしなかった。viewportだけの画像をtouch検証として数えない。
- CDPでphoneを設定しても、後続agent-browserコマンドが保存済みdesktop metrics/touch状態へ戻す。capture内部でInputを送る方式へ修正した。
- screencastのJPEG寸法がreload中に変わり、native viewport余白を含む場合がある。高さを保って正規化しphone領域をcropする。歪んだ古い動画は削除した。
- スクロール後のdocument原点clipは空白画像を作った。viewport screenshotへ変更し、全8枚を再生成・再確認した。
- CLI recordは新contextを作り、motion設定やstorageが落ちる。所有tabへattachするhelperを使う。
- 準備中のEnterが消える、入室時のcamera/animation reset、見えるwarm-up、rack白飛び、影に届かないcurtain変形は修正済み。旧成功報告だけで再発なしと判断しない。
- サイズの大きいファイルは全読みしない。通常のdiffにbinary強制textを指定しない。
- 無効な途中captureは10.8MiB削除済み。現行proof、編集可能原本、元資料は残している。

## 9. 残る制約と未確認事項

物理スマートフォン、current production Lighthouse、productionの全workflow、最終的な見た目の受入、モデルの全legacy gateは未確認。これらは今回のローカルブラウザーpassに含めない。現在の停止依頼を受けて追加作業はしない。

生の調査ノートと過去handoffはローカルのみ。新しいcheckoutで必要になった場合は所有者管理の同プロジェクト資料から取得し、取得済みと仮定しない。CMS credentialの値を文書へコピーしない。

## 10. 次の最初の操作

現在は停止。新しい指示なしにサーバーやbrowserを再起動しない。再開が依頼されたらrepo rootで `git status --short --branch`、live索引を確認する。branch状態を判断する場合は先に `DO_NOT_TRACK=1 git fetch`。現在のpush・CI・local資料の保持を確認し、指示された項目のみ進める。

## 11. 順序付き残作業

1. 新しい依頼が実機確認なら、4323が空いていることを確認しNode serverを起動。現在のLANアドレスを確認し、物理端末でpreview/live/entry、スクロール、タップ移動を確認する。emulation動画を代用しない。
2. 新しい依頼がモデル修正なら、`conductor/room-model-design-spec.md` と索引指定原本を読み、native MCPのlive filepathを確認。legacy failureの実体を再現してから編集する。
3. デプロイは別途明示許可がある場合のみ。provider完了、現行productionの視覚・動作、production Lighthouseを別々に検証する。

## 12. コマンド集

rootでの既存suite・capture・整形コマンドは§4。ビルドとserverだけCWDを `apps/astro` にする。同じ4323でserverを二重起動しない。重い処理は並列実行しない。ブラウザーは同じ名前の1sessionだけ。

現在のCDP URL取得:

```sh
DO_NOT_TRACK=1 AGENT_BROWSER_HEADED=true AGENT_BROWSER_ARGS="--use-mock-keychain,--password-store=basic,--mute-audio" mise exec node@24.22.1 -- agent-browser --session ham-room-continuity get cdp-url
```

配送状態の確認:

```sh
DO_NOT_TRACK=1 git fetch
git rev-parse HEAD origin/main
git rev-list --left-right --count HEAD...origin/main
git status --short --branch
```

## 13. 引継ぎ検収

- 作成日: 2026-11-06 Asia/Tokyo。
- 原本: live索引、当該会話の作業、現在のGit状態、上記ソース・証拠。過去セッション履歴の読取りなし。
- skill: handing-off-pro-max 1〜167 EOF。文書はユーザー発言を転記せず技術要件として記載。
- 検査: 実装commitのlocal/remote一致、listenerなし、browser inactive、tests/build exit 0、staged secret-pattern scan 0件、whitespace pass。
- 引継ぎ文書は書込み後に全文を再読し、`conductor/CURRENT_TASK.md`、現行proofの存在と最新tests/buildログを照合済み。最終配送ではこの文書と索引のみを追加commitしてpushし、そのHEADとremoteの一致を再確認する。
- 未確認: §9に明記。ローカルの残ファイルをcleanと偽らない。新しい実装・モデル操作・外部投稿を始めない。
