# PROGRESS — BULLCOM design

## 進行中タスク

### ユーザー対応待ち
- [ ] **bullcom.website 本番ドメイン切替の判断**（現在workers.devで公開中。切替は wrangler.toml のコメント解除+deploy。現在bullcom.websiteで動いてる物は置き換わるので要確認）
- [ ] **microCMS Webhook設定**（記事公開→自動デプロイ。PATが要るので下記手順で。bullcom本家の設定コピーが早い）
  - microCMS: bullcom-design → API設定 → Webhook → カスタム通知
  - URL: `https://api.github.com/repos/bullcomoffice/bullcom-design/dispatches`
  - ヘッダー: `Authorization: Bearer <GitHub PAT>` / `Accept: application/vnd.github+json`
  - ボディ: `{"event_type": "microcms-publish"}`（デフォルトボディ送信をOFFにしてカスタムボディで）
- [ ] トップページのデザインレビュー / 実績カード3件（PC修理/トラック/ボート）の内容確認
- [ ] LINE: design専用アカウントを作るか（現在は既存BULLCOMの lin.ee/vX5z2Xf を仮設定）
- [ ] GA4 プロパティ作成 → 測定ID共有（layout.tsx にTODOコメントあり）

### 次セッション以降
- [ ] ドメイン切替後、フォームの `_next` リダイレクト（?sent=1完了表示）を本番ドメインで再確認（workers.devでは効かずFormSubmitのThanksページに飛ぶ既知事象）
- [ ] microCMS Webhook → GitHub repository_dispatch 連携（microcms-publish、要PAT。sns-auto-post-setup skill参照）
- [ ] SNS自動投稿セットアップ（sns-auto-post-setup skill）
- [ ] 下層ページ拡充（サービス詳細 / 制作実績詳細 / FAQ / 会社概要）
- [ ] OG画像作成（現在未設定）
- [ ] TBD解消: 税表記統一（現在「税別」と仮表記） / 撮影・動画の料金 / お客様の声収集

### microCMS情報（2026-07-18 セットアップ完了）
- サービス: BULLCOM design / `bullcom-design.microcms.io`（ブログテンプレートから作成）
- API: `blogs`（title/content/eyecatch/category）+ `categories`（name）— bullcom本家と同一構造
- APIキー: GET専用キーを GitHub Secrets（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）とローカル `.env.local` に設定済み
- サンプル記事1件が本番 /blog に表示されるのを確認済み。記事の削除・追加はmicroCMS管理画面から
- カテゴリ名はテンプレ初期値（チュートリアル等）。`lib/blog-ui.ts` の catColors はお知らせ/制作事例/デザイン/SEO/セキュリティ/ノウハウ想定なので、カテゴリを整理するときに合わせると色が付く（未定義名は紫のデフォルト色）

## セッション記録

### 2026-07-18 (3): デプロイ・microCMS基盤・FormSubmit完了

- **①Cloudflareデプロイ完了**: Workers静的アセット方式（bullcom本家と同じ）
  - 公開URL: https://bullcom-design.bullcom-office.workers.dev
  - GitHub: https://github.com/bullcomoffice/bullcom-design （public・main）
  - CI: push → build → `wrangler deploy` 自動化済み（Secrets: CLOUDFLARE_API_TOKEN/ACCOUNT_ID設定済み、run成功確認済み）
  - 本番ドメイン切替は wrangler.toml の `[[routes]]` コメント解除で（ユーザー確認待ち）
- **②microCMS基盤実装**: lib/microcms.ts（未設定時は空フォールバックでビルド可能）+ /blog 一覧・/blog/[slug] 詳細（bullcom互換: blogs/categoriesエンドポイント、slug=コンテンツID）
  - 注意: `output: export` は動的ルートに1パス以上必須 → 記事0件時は `/blog/preparing` プレースホルダーを生成
  - サービス作成はユーザー作業（手順は上記）
- **③FormSubmit完了・本稼働**: トップ#contactにフォーム実装（画像圧縮・複数添付展開・snippet.html準拠）
  - アクティベーション済み（2026-07-18）。actionはエイリアス `7cfa2a028361eaede7c9ced9630770f0` に差し替え済み
  - テスト送信2通の受信をGmailで確認（表形式・日本語項目OK）
  - 既知事象: workers.devでは `_next` リダイレクトが効かない → ドメイン切替後に再確認
- lint対応: `/`へのaタグ→Link化 / effect内同期setState→setTimeout化

### 2026-07-18 (2): サイト構築開始・トップページ完成

- Next.js 16 + React 19 + Tailwind v4 + TypeScript を bullcom 本家と同構成でセットアップ（静的エクスポート、Cloudflare Pages想定）
- トップページ実装完了: Hero / 制作実績 / 料金（制作費・保守サブスク・デザイン料金）/ サービス / 選ばれる理由 / 無料診断バナー / お問い合わせ
- デザイン: ダーク基調 × カラフルグラデ（ピンク・紫・青・シアン・オレンジ）× Zen Kaku Gothic 900。要件の「スタイリッシュ×高級感×カラフル」を反映
- ロゴ: `logomoji-3d-pink.png` から透過マークを切り出し → `public/logo-mark.png` + `app/icon.png`
- 検証済み: 本番ビルド✓ / ESLint✓ / デスクトップ・モバイル表示✓（ヘッドレスChromeでスクショ確認）
- 注意: このPCではブラウザペインのスクショがタイムアウトする → scratchpad の `capture.mjs`（playwright-core + システムChrome）で撮影する運用
- メール導線は暫定で mailto:bullcom.office@gmail.com（フォームは近日公開表記）

### 2026-07-18: 要件定義完了

- `/hp-requirements` で要件ヒアリング（セクション0〜8）→ [要件定義書.md](要件定義書.md) 初版作成
- 決定事項:
  - サイト名: BULLCOM design / 目的: デザイン・HP作成事業の新規集客 / 担当: 芦原 陽右
  - ドメイン: bullcom.website 本体 / 構成: Next.js + microCMS + Cloudflare（既存シリーズ流用）
  - ページ: トップ/サービス/料金/実績/会社概要/FAQ/問い合わせ/ブログ/お客様の声
  - サービスメニュー＆料金決定（LP3万〜、HP20万〜、ロゴ3万〜など。詳細は要件定義書 §8）
  - 保守サブスク3プラン（ライト5千/スタンダード1万/プレミアム2万）+ 年間費用1.5万＋税
  - 他社制作HPの保守受託もやる（無料サイト診断→プラン提案）
