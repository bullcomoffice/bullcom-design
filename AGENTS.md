# BULLCOM design — エージェント向けプロジェクトガイド

デザイン・HP作成事業の集客サイト（BULLCOMシリーズ第6弾）。
企画のマスター文書は [要件定義書.md](要件定義書.md)、進行状況は [PROGRESS.md](PROGRESS.md)。作業前に両方読むこと。

## プロジェクトの前提

- キャッチコピー: 「思い通りのホームページを」
- KGI: 継続顧客100社 / 問い合わせ月50件
- CV優先順: ①電話（078-912-2656） ②お問い合わせフォーム ③LINE（https://lin.ee/vX5z2Xf ※既存BULLCOMと共用の仮設定）
- ターゲット: 全国・全業種の事業者。悩み =「HPが古くて更新できない」「集客できるサイトが欲しい」「セキュリティが心配」
- トップページのファーストビュー優先順: キャッチコピー → 実績 → 料金

## 技術構成（変更不可）

- Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript
- `output: "export"` 静的エクスポート — サーバー処理・ISR・next/image最適化・Route Handlerは使えない（images.unoptimized 設定済み）
  - 動的ルートは generateStaticParams 必須で、**空配列は不可**（記事0件時は `/blog/preparing` プレースホルダーを返す実装になっている）
- ホスティング: Cloudflare Workers 静的アセット（wrangler.toml、out/ ディレクトリ）
- CMS: microCMS（`blogs` / `categories`。lib/microcms.ts は環境変数未設定でも空フォールバックでビルド可能）
- 環境変数: `.env.local`（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）— **コミット禁止**

## ⚠️ 最重要の運用ルール

- **main に push すると GitHub Actions が本番へ自動デプロイする**（https://bullcom-design.bullcom-office.workers.dev）。push は必ずユーザーの確認を取ってから行うこと。ローカル確認まではコミットのみでよい
- `components/ui/ContactForm.tsx` は FormSubmit で**本稼働中**。以下を変更しないこと（見た目のクラス調整はOK）:
  - form の action（エイリアスURL）・hidden フィールド（_subject/_template/_captcha/_next/_honey）
  - ネイティブ送信ロジック（画像圧縮・複数ファイルの hidden input 展開・form.submit()）— 添付は AJAX では送れない仕様のため
- ブログ（app/blog/）と microCMS 連携の構造（エンドポイント名・フィールド名）を壊さない
- 料金・電話番号・サービス内容などの**事実情報は変更禁止**（要件定義書 §8 が正）。コピーライティングの改善は歓迎

## デザイン要件（要件定義書 §4）

- 世界観: **スタイリッシュ × 高級感 × カラフル（多色使い）**
- NG: シンプルすぎるデザイン、安っぽいデザイン
- フォント: ゴシック系（現状: Noto Sans JP / 見出し Zen Kaku Gothic New / 欧文・数字 Inter）
- ロゴ: `public/logo-mark.png`（ピンクの盾＋B）。ピンク基軸の多色展開
- デザインシステム: `app/globals.css` に CSS変数（--pink/--purple/--blue/--cyan/--orange 等）とユーティリティ（.grad-text / .glass / .btn-grad / .btn-line / .btn-ghost / .aurora / .grid-overlay / .grad-border / .card-hover / .prose-blog）。拡張はOK、命名規則は踏襲する
- アニメーションは `prefers-reduced-motion` を尊重（既存の @media ラップを維持）

## 開発・検証

- dev サーバー: `npm run dev -- -p 3210`
- 完了条件: `npm run build` と `npm run lint` が両方通ること
- **このPCでは Claude のブラウザペインのスクリーンショットが機能しない**。視覚確認はヘッドレスChromeで行う:
  ```
  "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --screenshot=out.png --window-size=1440,900 http://localhost:3210
  ```
  - フルページ・セクション別・モバイルは playwright-core（`channel: "chrome"`、ブラウザDL不要）で `scrollIntoViewIfNeeded()` + `locator.screenshot()` / `fullPage: true` を使う
  - hero は `min-h-svh` のため、縦長ウィンドウの一発全画面キャプチャは不可（heroがウィンドウ高に伸びる）
- デスクトップ 1440px とモバイル 390px の両方で崩れ・横スクロールが無いことを確認する

## 作業記録

- 作業経過・決定事項は [PROGRESS.md](PROGRESS.md) に追記する（セッション記録の形式は既存に倣う）
- コミットメッセージは日本語
