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
- 公式LINE: `@529xcjts`（BULLCOM Design）/ 友だち追加URL `https://lin.ee/5Sgn6PJ`。
  サイト側は `lib/site-data.tsx` の `LINE_URL` 1箇所で全ページに効く。
  **既存BULLCOMの `@crt1899h` とは別アカウント**なので混同しないこと
  - 運用は**チャットのみ・24時間365日**（応答時間オフ／手動チャット）。リッチメニューは作らない
  - プロフィールのSNS欄は bullcom.net と共用の IG `bullcom2656` / FB `It Support Bullcom` を掲載

## 技術構成（既存シリーズと同じ）

- Next.js 16 + React 19 + Tailwind v4 + TypeScript（`output: "export"` 静的エクスポート）
- ホスティング: Cloudflare Workers 静的アセット（`npx wrangler deploy`、wrangler.toml）
  - 公開URL: https://bullcom.website （www も同じサイト。workers.dev も退避先として生かしてある）
  - **カスタムドメインは wrangler.toml に書かない**。APIトークンにゾーン権限が無く deploy ごと失敗するため、
    Cloudflareダッシュボードの Workers → ドメイン タブで管理している（PROGRESS.md 2026-08-26 参照）
  - DNSは Cloudflare、**メールは CoreServer のまま**。MX → `mail.bullcom.website`、ワイルドカード `*` はプロキシOFF。
    apex を触るときこの2つを壊さないこと
- GitHub: https://github.com/bullcomoffice/bullcom-design → push で自動デプロイ（.github/workflows/deploy.yml）
- CMS: microCMS（コードは実装済み・サービス未作成。env: MICROCMS_SERVICE_DOMAIN/MICROCMS_API_KEY。未設定でもビルド可）
- フォーム: **Cloudflare Worker + Resend** 稼働中（`components/ui/ContactForm.tsx` → `/api/contact-submit` → `worker.js`）。
  2026-08-24 に FormSubmit から移行。送信後は同一オリジンへ302で戻り `?sent=1` で完了表示。
  宛先は `contact@bullcom.website` と `bullcom.contact@gmail.com` の2件（`worker.js` の `CONTACT_TO`）、送信元 `noreply@send.bullcom.website`。
  Secret は Worker 側の `RESEND_API_KEY`（GitHub Secrets ではない）
- SNS自動投稿: Instagram / Facebook / Google Business Profile（`scripts/post-to-instagram.cjs` `scripts/post-to-gbp.cjs`、`.github/workflows/sns-post.yml`）
  - 投稿先は **bullcom.net と同じアカウント**（IG `bullcom2656` / FBページ `It Support Bullcom` / GBP `BULLCOM(ブルコム)`）。認証Secretsも同値
  - **X（旧Twitter）は自動化しない**。API従量課金のため、共用アカウント **@BULLCOM_co** に
    x.com のネイティブ予約投稿を手動登録する運用（bullcom.net の日次予約と同じアカウント。
    あちらは朝9時台なので design は**水曜10:00**枠を使う）。初回登録は 2026-09-02。
    投稿には `public/blog-thumbnails/{記事ID}.jpg` のサムネを添付する（本文＋URL＋タグ3個＋画像）。
    ※Chromeには @Truck_asahi もログインしているので、**投稿前に必ずアカウントを確認**すること。
    sns-post.yml のXステップはコメントのまま残す — 復活させないこと
  - 画像は `public/blog-thumbnails/{記事ID}.jpg`（コミット必須）。microCMSのeyecatchは0バイト事故の実績があるので使わない
  - 起動は microCMS Webhook → `repository_dispatch(microcms-publish)`（`sns-auto-post`、設定済み・有効）
  - **日次監視あり**: 毎朝10:30 JST に `bullcomoffice/blog-checker`（共通リポジトリ）が
    「今日ブログが公開されたか」「sns-post.yml が成功したか」を見て **Slack #general** へ通知する。
    このリポジトリ側に監視用の設定は無い。異常時のみLINEにも飛ぶ。
    他サイトへ広げる手順は [scripts/blog-checker-prompt.md](scripts/blog-checker-prompt.md)
  - **microCMSのAPIキーに「下書きコンテンツの全取得」を付けないこと**。付けるとサイトに未公開記事が出るうえ、
    SNSスクリプトが未公開記事を投稿する（PROGRESS.md 2026-08-26 参照）
  - 記事を一括公開するときや publishedAt を直すときは、先に `gh secret set SNS_POST_MAX_MINUTES --body 0` で
    投稿を止める。終わったら 60 に戻す（0 にすると常にスキップされる＝キルスイッチ）
  - **Webhookはコンテンツ API の操作でしか発火しない**。管理APIの `/status` で公開状態を変えても飛ばない
    （週次の予約公開は別トリガーなので問題なし）
- ブログ記事の作成ルールは [blog-drafts/README.md](blog-drafts/README.md)（本文600〜970字・h2のみ・
  冒頭110字がdescriptionになる・SNS投稿文とサムネ必須・投入前にキルスイッチ等）
- 参考: 既存プロジェクト `D:\Data\Projects\Next\bullcom\`

## SEO / GEO 運用（週報・月報）

- 運用ルールの正は `D:\Data\Projects\Next\bullcom\_seo\report-operation.md`（全プロジェクト共通）
- サイト固有の前提・対象KW・実務メモは [_seo/README.md](_seo/README.md)
- **週報: 毎週日曜13:00（最終日曜はスキップ）／ 月報: 毎月最終日曜13:00（週報を兼ねる）**。
  **自動起動はしない**。Googleカレンダー（bullcom.office@gmail.com）の繰り返し予定を見て
  「BULLCOM designの週次レポートやって」「〜月次レビューやって」と指示して始める。
  13:00 は他サイト（net 9:00 / jp 11:00 / boatkaitori 12:00）と重ねないため
- 外形チェック: `npm run seo:check`（表示のみ）/ `npm run seo:log`（`_seo/health-log.md` に追記）
- **正規形は末尾スラッシュ無し**。姉妹サイト bullcom.net は末尾スラッシュ有りなので実装を流用するとき注意
- 2026-08-30 の初回チェックは 7/17 PASS → 同日 18/18 PASS。対策台帳は `_seo/action-log.md`（A-1〜A-10。2026-09-06 時点の未完は A-9 sitemap再送信 / A-10 GBPカテゴリ、いずれも要承認）

## 開発メモ

- dev: `npm run dev -- -p 3210`（`.claude/launch.json` 設定済）
- デザインシステムは `app/globals.css` の CSS変数（--pink/--purple/--blue/--cyan/--orange）+ ユーティリティクラス（.grad-text / .glass / .btn-grad / .aurora / .grad-border）
- トップは1ページ構成でセクションアンカー（#works #price #services #strength #contact）。下層ページ追加時にヘッダーのリンクをルートに置き換えること
- **スクショ検証**: このPCはブラウザペインのスクショが機能しない。scratchpad の `capture.mjs`（playwright-core, システムChrome利用）か、ヘッドレスChrome `--headless=new --screenshot` を使う。hero は `min-h-svh` なので縦長ウィンドウでの全画面キャプチャ不可、fullPage は playwright で撮る
