## Build & Run

- Install: `bun install`
- Astro dev: `cd apps/astro && bun run dev -- --host 0.0.0.0`
- Astro build: `cd apps/astro && bun run build`
- Astro lint: `cd apps/astro && bun run lint`
- Astro format check: `cd apps/astro && bun run format`
- Workspace check: `bun run check`

## Docs

- Domain words: `CONTEXT.md`. Name things with its terms.
- Why a structural choice was made: `docs/adr/`. Flag any change that contradicts one.
- Module map, data flow, room pipeline, deploy: `docs/architecture.md`.
- Before changing a page or UI: `docs/design/README.md` and `docs/design/pages/<page>.md`.

## Validation

- Primary gate for the Stitch workstream: `cd apps/astro && bun run build`
- Route verification must use `agent-browser`
- Compare implemented pages against `stitch_exports/4878703984446574546`
- Validate one route at a time
- Do not batch shell commands for this workstream
- Build success is not sufficient; visual and functional verification are required in the same loop
- The default Ralph build loop must re-plan, implement, verify, and write notes in one iteration

## Operational Notes

- The active workstream is Astro fidelity against Stitch project `4878703984446574546`
- Treat the repository code as the product source of truth
- Treat the Stitch export HTML and screenshots as design reference for composition, hierarchy, spacing, and tone
- Preserve real repo behavior; do not replace working systems with fake visual replicas
- Use relevant available skills when they materially improve planning, implementation, or validation
- The normal loop should not depend on a separate planning run before doing useful work
- Preserve multilingual quality across English, Japanese, and Thai
- Remove invented brand language that is not present in the Stitch comps
- Do not hide layout or interaction failures behind "content gap" language
- Hover states and hover colors must be deliberate and usable, not noisy
- Fallback states must still feel designed
- Keep this file operational only
- Keep `tools/room-harness/README.md`, `tools/room-harness/comparison.md`, and `tools/room-harness/ask-for-comment.md` in English. This rule does not change the language of `conductor/room-spec.md` or product content.

## Agent skills

### Issue tracker

GitHub Issues on `hamzaabamboo/ham-san.net`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Color System

- The palette is `The Builder's Atelier`, defined in `stitch_exports/4878703984446574546/01_design-system.md`.
- The single source of truth in code is the `--atelier-*` custom property block in `apps/astro/src/index.css`, mirrored as Panda tokens in `apps/astro/src/theme/tokens/atelier.ts`.
- Components and stylesheets reference `var(--atelier-*)`. Raw hex literals in component or page source are a defect.
- `@pandacss/no-hardcoded-color` is the guardrail. It is currently `warn` because the remaining `rgba()` washes are not tokenised; raise it to `error` once they are.
- Surfaces stay grayscale. Amber is the only signal color. Introducing a second hue requires a design-system change first, not a component-local literal.

## 3Dホームの設計方針

- 再開時はconductor/CURRENT_TASK.mdを唯一のライブ索引とし、指定された次作業の原本だけを読む。完全な制作手順・失敗回避・検証境界はconductor/room-full-handoff-2026-09-07.md。旧停止資料の権限・モデルハッシュを現状と取り違えない。
- デザイン・画像方針・Blender・モデリングは主担当が実施する。Luna/maxへの委任は独立したコード実装・コード読解・要約に限定し、対象ファイルと停止条件を指定する。主担当は委任結果を原本で確認する。モデル・テクスチャ・造形スクリプトの編集は委任しない。
- 原要求から最新平面図までの統合要件はconductor/room-spec.md。配置はroom-reference-map.md、進行状態はCURRENT_TASK.mdへ分離する。窓外の住宅街、発光ペンライト、適切な完成アクリルアセットも必須要件であり、単なる空背景・無地棒・仮人物で代用しない。
- 部屋は本人の実際の配置と持ち物が分かる、最小限のディテールで制作する。部屋の資料が揃うまで配置を創作しない。
- デスクトップはWASD移動。オブジェクト選択時に構図を整えたクローズアップへ移り、閲覧中は移動を固定する。
- コンテンツは読みやすいHTMLオーバーレイで表示する。将来的なフルページ置換を考慮するが、既存ルート削除は別途決定する。
- モバイルは同じ部屋をタップ移動。入口には部屋のプレビュー、入室操作、通常ナビゲーションを用意する。
- モデル制作はBlenderを使用し、成果物をプロジェクト内に保持する。
- Blender MCPは公式Blender Lab版（https://www.blender.org/lab/mcp-server/）を使用する。導入済みアドオンに合わせ、Codexのcommandは/opt/homebrew/bin/uv、argsは["--directory", "/Users/vittayapalotai.tanyawat/blender_mcp/mcp", "run", "blender-mcp"]とする。接続先127.0.0.1:9876、DISABLE_TELEMETRY=trueを維持する。uvx blender-mcpが取得するahujasid版は別実装であり混在させない。設定変更後はCodex側のMCP再読込とネイティブ応答を確認し、Blenderの再起動や再インストールを代用にしない。
- MCP設定の存在やポートのlistenだけで疎通完了と判断しない。実際のMCP応答を確認する。
- 制作参考: https://www.freecodecamp.org/news/create-a-cute-room-portfolio-with-threejs-blender-javascript/ 。モデリング、UV展開、ベイク、モデル・テクスチャ圧縮、クリック・タッチ判定、モーダルを参照する。記事のOrbitControlsは採用済みのWASDとクローズアップを上書きしない。
- 参考記事のVite構成や公開手順を、そのままAstro製品への移行指示・デプロイ許可として扱わない。記事読了と動画本編の検証を区別する。
- 部屋の写真に基づく最小構成はconductor/room-reference-map.mdを参照する。机・棚・開口の位置関係と特徴的な形を残し、雑多な小物や全収集物の再現は行わない。広角写真から実寸を断定しない。
- 今回の空間は主室の長方形のみ。キッチンは将来用の参照情報として記録し、モデル化しない。机は直線的な長方形とする。少数のぬいぐるみとダーツボードを含む特徴的な持ち物を残し、簡略化によって個性を削らない。写真上の見え方と所有者の形状確認が異なる場合は所有者の確認を優先する。
- 部屋の照明はAsia/Tokyoの時刻に応じて昼光と暖かい夜の室内照明へ適応させる。モニターはプロジェクト、紙の束はノート、棚と対応する趣味オブジェクトは趣味へ接続する。3Dの素材と照明は写真由来の自然色を使用し、HTML操作部は既存トークンを使用する。
- 部屋の実装開始は承認済み。可逆的なカメラ復帰・追加ページ統合などの実装判断で再び質問段階へ戻らない。
- Blender操作はCodexに公開されたネイティブMCPツールから行う。ツール未公開時にPython製MCPクライアントやBlender CLIで迂回しない。接続の設定と、現在のセッションにツールが公開された状態を区別する。
- 部屋の開口は同一壁面上のバルコニー掃き出し開口と奥窓の2つ。ポスターと趣味棚は別の壁面に置く。所有者が確認済みであり、2開口を隣接壁へ分離しない。家具・カーテン・ダーツスタンド・展示物の干渉を実画面で確認する。
- 配置は所有者の最新平面図を写真の推測より優先する。上壁に2窓と中央のダーツ、左壁に左向きPC机とその入口側の鍵盤スタンド、右壁に棚とその入口側のペンライト・タオル掛け、左下に玄関、下壁右に収納扉。机・ビーズクッション・マット・ポスターの相対座標はconductor/room-reference-map.mdを参照。上面図で一致を検証する。
- 特徴物としてダーツとスタンド・投擲マット、ルービックキューブ、寸法を調整できるアクリルスタンド、寝そべりぬいぐるみ、サイズの異なる書籍・雑誌・単行本、低い床机を含める。形状と配置は写真を基準とする。
- UV素材は模型の形状と一貫させる。参照写真の切り抜きを平面へ貼り、撮影時の遠近・照明・背景をそのまま持ち込む仕上げは行わない。
- 壁の区画を移動・寸法変更した後は、柱・窓下壁・まぐさの接合と天井下端までの連続性を実境界と室内視点で確認する。メッシュの存在だけで壁の健全性を判断しない。
- 照明・窓外背景の視認検証では、Blenderの表示モードとuse_scene_lights/use_scene_worldを確認する。スタジオHDRIのMaterial Previewを制作した照明や住宅街背景の証拠にしない。Material Preview・Cyclesレンダー・Web描画の検証範囲を分ける。
- ポスターの簡略化は粗い多角形人物への置換ではない。参照に基づくミニマルなイラストを画像生成しUVへ使用する。部屋・窓・家具の未計測寸法を確定値と扱わず、平面配置とマットの投擲軸を一緒に照合する。
- モデル制作の仕様はconductor/room-model-design-spec.md、全体の製品要件はconductor/room-spec.md。2026-09-10の制作経緯と未解決の詳細退行はdocs/HANDOFF_2026-09-10.mdを参照し、原写真・現行.blend・同一構図の新規画像で再確認する。旧ハッシュ・実行状態・レビュー所見を現状の証拠として使わない。
- 確定済みの部屋幅5.05 mと平面配置を維持する。密度の機械的複製ではなく持ち物の識別可能な形状と質感を再現し、単純化による詳細欠落を修正する。衣類ハンガーは制作対象外。生成した小物印刷に顔・文字・ロゴを追加しない。
- 原写真は変更禁止。画像変換は別の出力先を指定し、sipsを使う場合は必ず--outを付ける。造形確認は明るく判読可能な照明と同じカメラで前後比較し、確認専用の照明変更を制作ファイルへ保存しない。
- 部屋制作では開発サーバーを起動・停止しない。ブラウザー検証は所有者の依頼がある場合に限る。Blenderでは編集と保存を直列化し、保存後は物理検査・シーン検査・書出し・UV除去・公開用ローカルGLB同期・check-buildの順に検証する。Blender CLIへの迂回は禁止を維持する。
- 親が拡縮されたオブジェクトはmatrix_worldと実境界で配置を確認し、境界測定前にview_layerを更新する。生成メッシュは面積ゼロを検査する。確認用カメラの存在やレビュー所見を仮定せず、現在のデータから取得する。
- 2026-09-10の最新展示方針: アクリルスタンドは各個体に異なる絵柄を割り当てる。透明ケース群は横に隣接する家具棚2列にまたがる。ぬいぐるみは小さく展示に馴染ませ、小型趣味道具は低い机に配置できる。旧PC机のルービックキューブ用アンカーを、この承認済み配置より優先しない。
- 制作チェックポイントと実行上の注意はdocs/HANDOFF_2026-09-10_SHRINE_MODEL.md。再開時は同資料の整合性確認を先に行う。refine_shrine_layout.pyは適用済みで再実行しない。アクリル再生成ではacrylic-unique-assignments.jsonのACRYLIC_ARTWORKを必ず渡す。復旧用.blendを制作元と取り違えず、未保存のライブ状態を破棄しない。
