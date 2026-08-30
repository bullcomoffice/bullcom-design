# SEO / GEO 運用（bullcom.website）

BULLCOM design のSEO/GEO対策を「実装 → スケジュールで答え合わせ → 改善」で回す。
週報・月報の**タイミングと中身の定義は
[`D:\Data\Projects\Next\bullcom\_seo\report-operation.md`](../../bullcom/_seo/report-operation.md) が正**。
このファイルはサイト固有の情報（対象KW・実装状況・実務メモ）を持つ。

## 実施スケジュール

| | 日時 | 所要 | タスクID |
|---|---|---|---|
| 週報 | 毎週日曜 **13:00**（最終日曜はスキップ） | 15分 | `bullcom-design-seo-weekly-review` |
| 月報 | 毎月**最終日曜** 13:00（週報を兼ねる） | 1時間 | `bullcom-design-seo-monthly-review` |

どちらも cron は `0 13 * * 0`（毎週日曜）で起動し、プロンプト冒頭のガード式で
自分の担当日かを判定する。cron は「第N曜日」を表現できないため。

```bash
if [ "$(date -d '+7 days' +%m)" != "$(date +%m)" ]; then echo last-sunday; else echo normal-sunday; fi
```

13:00 にしたのは他プロジェクトと重ねないため（bullcom.net 9:00 ／ huneya 10:23 ／
bullcom.jp 11:00。bullcom.jp の月報は1時間なので 12:00 まで走る）。

## サイトの前提

- 正規形は**末尾スラッシュ無し**（`next.config.ts` に `trailingSlash` 未指定。canonical も `/faq` 形式）。
  姉妹サイト bullcom.net は逆なので混同しないこと。
- GSCプロパティ: **`sc-domain:bullcom.website`**（ドメインプロパティ）。
  apex の TXT に `google-site-verification=ZeGVFZ7gWy0KRyO7vpwyoiKjBZ3P_vIdxiX9IJOvRio` があり、
  Cloudflare 移管後も残っている。URLプレフィックス形式を resource_id に渡すと「アクセス権がありません」になる。
- GA4: **未設置**（`app/layout.tsx:125` にTODOコメント。→ 対策台帳 A-7）。
  設置されるまで週報のGA4項目は「-」で記録する。
- 静的エクスポート（`output: "export"`）を Cloudflare Workers 静的アセットへデプロイ。
  **main への push でデプロイが走る**（`.github/workflows/deploy.yml`）。
- ドメインは 2026-08-26 に Cloudflare へ移管したばかり。GSCの履歴データはそれ以前と地続きだが、
  実質的な運用開始はこの時点と考えてよい。

## いま入っている対策（2026-08-30 時点）

- 全ページ self-canonical（末尾スラッシュ無し）
- トップに **ProfessionalService** 構造化データ（住所・電話・営業時間・提供サービス・親組織BULLCOM）
- `/faq` に **FAQPage**
- ブログ記事に **BreadcrumbList**（※ Article は未実装 → A-5）
- 下層ページ・サービス個別4ページに固有の meta description
- OG画像（`public/og-image.png` 1200x630）+ twitter card `summary_large_image`
- ブログ27本（公開9本 / 予約18本、毎週水9:45）と、公開をトリガーにした SNS自動投稿（IG/FB/GBP）

### まだ無いもの（初回チェックで判明。すべて対策台帳に起票済み）

sitemap.xml / llms.txt / robots.txt の自前配信 / URL正規化（https・非www・末尾スラッシュ）/
記事の Article 構造化データ / 記事の meta description（現在タイトルと同一）/ GA4

## 対象キーワード（暫定・初回週次で確定する）

`app/layout.tsx` の keywords と料金レンジから置いた暫定値。
実際にGSCで表示が出ているクエリを見て、初回の週次レビューで確定・入れ替える。

- 主軸: `ホームページ制作 神戸` / `ホームページ制作 おまかせ`
- 補助: `LP制作 格安` / `ホームページ リニューアル 神戸` / `ホームページ 保守 月額`

> 個別KWの順位精査は**月次**が担当する（週次では追わない）。
> 月次では毎回、選定時に無かった**新規クエリの台頭**も確認して主軸KWを見直す。

**注意**: bullcom.jp（パソコン修理）・bullcom.net（セキュリティ）と同一事業者の別サイト。
GEO評価の質問は、**design の担当領域（ホームページ制作・デザイン・LP・ブランディング）を
名指しした質問**を必ず入れること。姉妹サイトと競合する一般語だけ見ていると .website の実力が測れない。

## コマンド

```bash
npm run seo:check   # 外形チェックの結果を表示するだけ
npm run seo:log     # 表示 + _seo/health-log.md に追記
```

全項目PASSなら終了コード0、1つでも失敗なら1。

## 実務メモ

### GSCは URL パラメータで直接開ける

```
https://search.google.com/search-console/performance/search-analytics
  ?resource_id=sc-domain%3Abullcom.website
  &start_date=20260823&end_date=20260829            ← YYYYMMDD（ハイフンなし）
  &metrics=CLICKS%2CIMPRESSIONS%2CCTR%2CPOSITION
  &breakdown=page
```

- 日付は**ハイフンありでは効かない**
- クエリ数・ページ数は表の右下「1〜10/102」から読む（合計値の表示はない）

### DOMをスクレイプするときの罠

検索パフォーマンス画面には、**過去に表示した期間のテーブルがDOM上に残る**。
`document.querySelectorAll('table')` は複数返り、先頭が古い期間のデータのことがある。
必ず `getBoundingClientRect().width > 0`（＝表示中）のテーブルを選ぶこと。

### robots.txt は「ボット名が書いてあるか」で判定してはいけない

現在の `https://bullcom.website/robots.txt` は **Cloudflare の Managed robots.txt** が
配信されており、GPTBot / ClaudeBot / Google-Extended 等を **`Disallow: /` で列挙**している。
名前の有無だけを見ると「記載あり＝許可」と誤判定するため、
`scripts/seo-healthcheck.mjs` では User-agent グループを解析して
実際に `/` を取得してよいかまで判定している。

### 外形チェックの「ブログ description」判定

記事タイトル自体に「｜」が入ることがあるため、title を先頭の「｜」で分割してはいけない。
サイト名サフィックス `｜BULLCOM design` を末尾から除去して比較する。

### サンプル記事IDは消えることがある

外形チェックは `0q17ybkcytm` を構造化データ・descriptionのサンプルにしている。
microCMS で記事を削除するとチェックが落ちるので、その場合は
`scripts/seo-healthcheck.mjs` の `BLOG_SAMPLE` を差し替える。

## 記録ファイル

| ファイル | 役割 |
|---|---|
| [`weekly-log.md`](./weekly-log.md) | 週次記録（最新を上に追記） |
| [`monthly-review.md`](./monthly-review.md) | 月次チェックリスト兼記録先 |
| [`action-log.md`](./action-log.md) | 対策台帳（A-番号で採番・ステータス管理） |
| [`health-log.md`](./health-log.md) | 外形自動チェックの履歴 |
