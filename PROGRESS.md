# PROGRESS — BULLCOM design

## 進行中タスク

- [ ] トップページのデザインをユーザーレビュー → フィードバック反映
- [ ] 下層ページ作成（サービス詳細 / 制作実績 / FAQ / 会社概要 / ブログ / お問い合わせ）
- [ ] お問い合わせフォーム実装（formsubmit-form skill を流用予定）
- [ ] microCMS セットアップ（ブログ用・要APIキー）
- [ ] Cloudflare Pages デプロイ + bullcom.website 向け設定
- [ ] GA4 プロパティ作成 → 測定ID設置（layout.tsx にTODOコメントあり）
- [ ] LINE: BULLCOM design 専用アカウントを作るか確認（現在は既存BULLCOMの lin.ee/vX5z2Xf を仮設定）
- [ ] 実績カード3件（PC修理/トラック/ボート）の掲載内容・スクリーンショットをユーザー確認
- [ ] TBD解消: 税表記統一（現在「税別」と仮表記） / 撮影・動画の料金 / お客様の声収集

## セッション記録

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
