# BULLCOM design（BULLCOMシリーズ第6弾）

デザイン・HP作成事業の集客サイト。ドメインは `bullcom.website`（本体）。

## このフォルダ

- [要件定義書.md](要件定義書.md) — 企画のマスター文書（2026-07-18 初版）
- 作業経過は [PROGRESS.md](PROGRESS.md) を参照

## 基本情報

- キャッチコピー: 「思い通りのホームページを」
- ロゴ: `D:\Data\Dropbox\AI\Claude\code\design\14preview-white-inside2-pink.png`（ピンクの盾＋B）
- デザイン: スタイリッシュ×高級感×カラフル多色使い、ゴシック系。シンプルすぎ・安っぽいのはNG
- KGI: 継続顧客100社 / 問い合わせ月50件
- CV優先順: 電話（078-912-2656） → フォーム → LINE

## 技術構成（既存シリーズと同じ）

- Next.js 16 + React 19 + Tailwind v4 + TypeScript（`output: "export"` 静的エクスポート）
- ホスティング: Cloudflare Workers 静的アセット（`npx wrangler deploy`、wrangler.toml）
  - 公開URL: https://bullcom-design.bullcom-office.workers.dev（bullcom.website切替はwrangler.tomlのroutesコメント解除）
- GitHub: https://github.com/bullcomoffice/bullcom-design → push で自動デプロイ（.github/workflows/deploy.yml）
- CMS: microCMS（コードは実装済み・サービス未作成。env: MICROCMS_SERVICE_DOMAIN/MICROCMS_API_KEY。未設定でもビルド可）
- フォーム: FormSubmit 稼働中（components/ui/ContactForm.tsx、エイリアス化・有効化済み）
- SNS自動投稿: Instagram / Facebook / Google Business Profile（`scripts/post-to-instagram.cjs` `scripts/post-to-gbp.cjs`、`.github/workflows/sns-post.yml`）
  - 投稿先は **bullcom.net と同じアカウント**（IG `bullcom2656` / FBページ `It Support Bullcom` / GBP `BULLCOM(ブルコム)`）。認証Secretsも同値
  - **X（旧Twitter）は作らない**。API従量課金のため手動運用（`x-schedule` skill）。sns-post.yml のXステップはコメントのまま残す — 復活させないこと
  - 画像は `public/blog-thumbnails/{記事ID}.jpg`（コミット必須）。microCMSのeyecatchは0バイト事故の実績があるので使わない
  - 起動は microCMS Webhook → `repository_dispatch(microcms-publish)`。**Webhook はドメイン切替まで未設定**（PROGRESS.md 参照）
- 参考: 既存プロジェクト `D:\Data\Projects\Next\bullcom\`

## 開発メモ

- dev: `npm run dev -- -p 3210`（`.claude/launch.json` 設定済）
- デザインシステムは `app/globals.css` の CSS変数（--pink/--purple/--blue/--cyan/--orange）+ ユーティリティクラス（.grad-text / .glass / .btn-grad / .aurora / .grad-border）
- トップは1ページ構成でセクションアンカー（#works #price #services #strength #contact）。下層ページ追加時にヘッダーのリンクをルートに置き換えること
- **スクショ検証**: このPCはブラウザペインのスクショが機能しない。scratchpad の `capture.mjs`（playwright-core, システムChrome利用）か、ヘッドレスChrome `--headless=new --screenshot` を使う。hero は `min-h-svh` なので縦長ウィンドウでの全画面キャプチャ不可、fullPage は playwright で撮る
