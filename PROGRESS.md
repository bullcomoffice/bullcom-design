# PROGRESS — BULLCOM design

## 進行中タスク

### ユーザー対応待ち
- [ ] **Cloudflareダッシュボードで Managed robots.txt を無効化**（対策台帳 A-3の残作業）。
      ゾーン → AI Crawl Control の robots.txt 管理。APIトークンにゾーン権限が無く代行できない。
      無効化すると外形チェックが 18/18 PASS になる
- [ ] 🚨 **最優先: お問い合わせフォームが本番で壊れている**。Resend が `send.bullcom.website` を
      「未検証」と判定して 403 を返す（8/26 のDNS移管でResendの検証レコードが引き継がれなかった）。
      Resendダッシュボードの DNS レコードを Cloudflare に入れ直す作業が必要（下記 2026-08-29 (4) 参照）
- [x] 08/26 09:45 の予約公開が自動投稿まで通るか確認 → **2026-08-29 確認完了・全自動で成功**
      （下記「2026-08-29」参照。次の予約公開は 09/02 水 9:45）
- [ ] トップページのデザインレビュー / 実績カード3件（PC修理/トラック/ボート）の内容確認
- [ ] GA4 プロパティ作成 → 測定ID共有（layout.tsx にTODOコメントあり）

### 次セッション以降
- [ ] フォームの End-to-End 送信テスト（Resend移行後まだ未実施。実行すると contact@ と Gmail に実際にメールが届く）
- [ ] 下層ページ拡充（サービス詳細 / 制作実績詳細 / FAQ / 会社概要）
- [ ] TBD解消: 税表記統一（現在「税別」と仮表記） / 撮影・動画の料金 / お客様の声収集

### microCMS情報（2026-07-18 セットアップ完了）
- サービス: BULLCOM design / `bullcom-design.microcms.io`（ブログテンプレートから作成）
- API: `blogs`（title/content/eyecatch/category）+ `categories`（name）— bullcom本家と同一構造
- APIキー: GET専用キーを GitHub Secrets（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）とローカル `.env.local` に設定済み
- サンプル記事1件が本番 /blog に表示されるのを確認済み。記事の削除・追加はmicroCMS管理画面から
- カテゴリ名はテンプレ初期値（チュートリアル等）。`lib/blog-ui.ts` の catColors はお知らせ/制作事例/デザイン/SEO/セキュリティ/ノウハウ想定なので、カテゴリを整理するときに合わせると色が付く（未定義名は紫のデフォルト色）

## セッション記録

### 2026-08-30 (2): SEOの基礎工事（A-1〜A-6）を実装・デプロイ。7/17 → 17/18 PASS

ユーザー判断で **A-3 は「AIクローラを拒否ではなく許可」** に決定。あわせて他も実装した。

| ID | 対応 | 状態 |
|---|---|---|
| A-1 | `worker.js` で https / 非www / 末尾スラッシュ無し へ **301正規化** | ✅完了 |
| A-2 | `app/sitemap.ts`（静的10 + サービス4 + 記事 = **22URL**・末尾スラッシュ0件） | ⏳継続観察 |
| A-3 | `app/robots.ts`。AIクローラ13種を明示 `Allow` + `Sitemap:` 行 | 🔵検証中（**残作業あり**） |
| A-4 | `public/llms.txt`（1,961字） | ⏳継続観察 |
| A-5 | 記事に `Article` 構造化データ | ⏳継続観察 |
| A-6 | `lib/excerpt.ts` で記事 description を本文抜粋に（40字→**86字**・タイトルと別文） | ⏳継続観察 |
| A-7 | GA4 | 🔴未着手（ユーザー作業待ち） |

#### ⚠️ 詰まった点（次に同じことをするとき必ず読む）

**1. `run_worker_first` が無いと A-1 は「直したのに直らない」**

`worker.js` に正規化を書いてデプロイしても、外形チェックは 307 のままだった。
**Workers静的アセットは既定で、アセットに一致するリクエストを Worker に通さない**。
`/about/` も `/` も `out/` の中身に一致するので、正規化コードが一度も呼ばれていなかった。

→ `wrangler.toml` の `[assets]` に **`run_worker_first = true`** を追加して解決。
   bullcom.jp も同じ構成（あちらの A-1 の記録にも同じ話がある）。

なお反映直後は旧レスポンスが残るので、**デプロイ成功＝即反映ではない**。
`?cb=$RANDOM` を付けて数十秒後に測り直すこと（一度これで「まだ効いていない」と誤判断した）。

**2. Cloudflare Managed robots.txt は上書きではなく「前に連結」される**

自前の `robots.txt` を置いても、配信されるのは
`# BEGIN Cloudflare Managed content` … `# END` のブロック **＋ 自前の内容**。
結果 GPTBot / ClaudeBot / Google-Extended には
`Disallow: /`（Cloudflare）と `Allow: /`（自前）が並ぶ。

RFC 9309 では同じ User-agent のグループは統合され、同じ長さの指定なら Allow が勝つので
主要クローラは許可と解釈するはずだが、**競合そのものはダッシュボードで消すべき**（→ 進行中タスク）。

外形チェック側も「最初に一致したグループだけ見る」実装だと誤判定するので、
**同じUser-agentのグループを全部まとめて評価**するよう直した（チェック項目は17→18に増えた）。

**3. `output: "export"` では `app/robots.ts` / `app/sitemap.ts` に `dynamic = "force-static"` が必須**

無いと `export const dynamic = "force-static"/export const revalidate not configured on route`
でビルドごと落ちる。

#### 検証

- 外形チェック **17/18 PASS**（残1は上記のCloudflare側の作業）
- 主要13URL（トップ・サービス4・料金・実績・ブログ・記事・FAQ・会社概要・問い合わせ・
  プライバシー・OG画像・サムネ）すべて 200
- **フォームのPOST経路も 302 のまま**。正規化は `/api/contact-submit` の POST より**後**に
  評価するようにしてある（301はPOSTをGETに変えてしまうため）

### 2026-08-30: SEO/GEO 週報・月報の運用を新設

`D:\Data\Projects\Next\bullcom\_seo\report-operation.md`（全プロジェクト共通の運用ルール）に沿って、
bullcom.website にも週報・月報を新設した。

#### スケジュール

| | cron | 実施 | 所要 | タスクID |
|---|---|---|---|---|
| 週報 | `0 13 * * 0` | 毎週日曜13:00（**最終日曜はスキップ**） | 15分 | `bullcom-design-seo-weekly-review` |
| 月報 | `0 13 * * 0` | 毎月**最終日曜**13:00（週報を兼ねる） | 1時間 | `bullcom-design-seo-monthly-review` |

- cron は「第N曜日」を表現できないため、**両方とも毎週日曜起動**にして、プロンプト冒頭の
  ガード式 `[ "$(date -d '+7 days' +%m)" != "$(date +%m)" ]` で自分の担当日かを判定する方式
- 13:00 にしたのは他プロジェクトと重ねないため（bullcom.net 9:00 / huneya 10:23 / bullcom.jp 11:00。
  bullcom.jp の月報は1時間なので12:00まで走る）
- 判定を8週分検算済み。8/30=月報 → 9/6・9/13・9/20=週報 → 9/27=月報 → …

#### 作ったもの

| ファイル | 役割 |
|---|---|
| `_seo/README.md` | サイト固有の前提・対象KW・実務メモ |
| `_seo/weekly-log.md` | 週次記録（テンプレ付き・最新を上に追記） |
| `_seo/monthly-review.md` | 月次チェックリスト兼記録先 |
| `_seo/action-log.md` | 対策台帳（A-番号・🔵検証中/⏳継続観察/✅完了/❌棄却） |
| `_seo/health-log.md` | 外形チェック履歴（スクリプトが `--append` で追記） |
| `scripts/seo-healthcheck.mjs` | 外形チェック本体（依存なし・Node18+ の fetch のみ） |

`npm run seo:check`（表示のみ）/ `npm run seo:log`（履歴に追記）。全PASSで終了コード0。

#### 初回チェックの結果: **7/17 PASS** — 失敗10項目を A-1〜A-7 に起票

SEOの基礎工事を一度も通していない状態だった。**退行ではなく「まだ作っていない」もの**が大半。

| ID | 内容 |
|---|---|
| A-1 | URL正規化が無い（http→https / www→非www が **200**、末尾スラッシュが **307**）。最大8通りのURLで200を返す |
| A-2 | `sitemap.xml` が **404** |
| A-3 | robots.txt が **Cloudflare Managed** で、GPTBot / ClaudeBot / Google-Extended 等を `Disallow: /`。Sitemap行も無い |
| A-4 | `llms.txt` が **404** |
| A-5 | 記事に `Article` 構造化データが無い（`BreadcrumbList` のみ） |
| A-6 | 記事の meta description が**タイトルと一字一句同じ**（`app/blog/[slug]/page.tsx:26` の `description: blog.title`） |
| A-7 | GA4 未設置。週報のGA4項目と月報のCVが埋まらない |

**A-3 が最重要**。GEO（AI検索での露出）を目的にしているのに、AIクローラを名指しで拒否している。
この状態でGEO引用テストをしても出ないのが当然で、運用の前提が崩れる。
ただし「AIに学習させたくない」意図でCloudflare側を有効にした可能性があるので、**着手前に方針確認が要る**。
なお `OAI-SearchBot` と `PerplexityBot` は個別指定が無く `User-agent: *` の `Allow: /` にフォールバックしていて許可されている。

#### 実装上のハマりどころ

- **robots.txt は「ボット名が書いてあるか」で判定してはいけない**。参考実装（bullcom.jp）は
  `body.includes("GPTBot")` で許可判定していたが、Cloudflare Managed robots.txt は
  **Disallow でボット名を列挙する**ため、その方式だと「記載あり＝許可」と誤判定する。
  このサイトのスクリプトでは User-agent グループを解析して、実際に `/` を取得してよいかまで判定している
- **正規形は末尾スラッシュ無し**（`trailingSlash` 未指定・canonical も `/faq` 形式）。
  bullcom.net は逆なので、あちらの実装をコピーすると判定が反転する
- description の判定で title からサイト名を除くとき、**先頭の「｜」で分割しない**。
  記事タイトル自体に「｜」が入ると前半だけを拾い、同一なのにPASSする。
  サフィックス `｜BULLCOM design` を末尾から除去して比較している
- GSCは `sc-domain:bullcom.website`。apex TXT の `google-site-verification=ZeGVFZ7…` が
  Cloudflare 移管後も残っているので、ドメインプロパティは生きているはず

### 2026-08-29 (4): 🚨 お問い合わせフォームが本番で動いていないことが判明（Resend 403）

宛先変更のEnd-to-Endテストで発覚。**フォームは送信できず、お客様には「送信できませんでした」の
エラーページが出る状態**だった。宛先変更が原因ではなく、それ以前から壊れていた。

#### 原因: Resend が送信ドメインを未検証と判定している

```
[contact] Resend error 403
{"statusCode":403,"message":"The send.bullcom.website domain is not verified.
 Please, add and verify your domain on https://resend.com/domains","name":"validation_error"}
```

`send.bullcom.website` の DNS を引くと **TXT も MX も1件も無い**（NODATA）。
**2026-08-26 の Cloudflare 移管で、Resend の検証レコードが引き継がれなかった**のが原因。
移管時に確認したのはルートドメインのメール系（MX / SPF / DKIM セレクタ `x` / DMARC / google-site-verification）だけで、
`send.` サブドメイン配下のResend用レコードは Cloudflare の自動スキャン11件に含まれていなかった。

→ **フォームは 2026-08-26 のDNS移管以降ずっと送信失敗**していた可能性が高い
（Resend移行が 8/24、DNS移管が 8/26。移行直後は動いていたはず）。

#### 復旧に必要な作業（ユーザー作業。APIトークンにゾーン権限が無いため代行できない）

1. https://resend.com/domains → `send.bullcom.website` を開き、表示されるDNSレコードを確認
   （通常 MX 1件 + SPF の TXT 1件 + DKIM の TXT 1件、必要なら DMARC）
2. Cloudflare の `bullcom.website` ゾーンに同じ内容で追加する。**プロキシは必ずOFF（DNS only）**
3. Resend の画面で Verify → `Verified` になるのを確認
4. `https://bullcom.website/contact` から実際に送信してテスト

**ルートドメインのメール設定（MX → `mail.bullcom.website`、ワイルドカード `*` のプロキシOFF）には触れないこと。**
CoreServer のメール受信が壊れる。

#### ついでに直したもの

- **`worker.js`: Resend失敗時の理由をログに残すようにした**（`console.error("[contact] Resend error", ...)`）。
  これまで失敗理由が本番で一切見えず、エラーページの文言しか手掛かりが無かった。
  読み方: `npx wrangler tail --format json`（`logs[].message` に出る）。今回の原因特定もこれで行った
- **`wrangler.toml`: `workers_dev = true` の位置がおかしかった**。`[assets]` テーブルの後ろに書かれていたため
  TOML の仕様で `assets.workers_dev` と解釈され、deploy のたびに
  「Unexpected fields found in assets field: "workers_dev"」の警告が出ていた（設定は効いていない。
  ルート未設定時の既定が true なので結果的に workers.dev は生きていた）。`[assets]` の前へ移動して解消

#### 検証に使った手順（再現用）

ハニーポットではなく実フォームと同じ multipart POST を投げる。フィールド名は日本語なので UTF-8 で組むこと。
`ご相談の詳細` に URL を含めると `URL_PATTERN` に弾かれるので入れない。

```
POST https://bullcom.website/api/contact-submit
  _subject / _redirect=/contact?sent=1 / _honey=（空）
  お名前 / 会社名 / email / 電話番号 / ご相談内容 / ご相談の詳細
→ 正常なら 302 Location: https://bullcom.website/contact?sent=1
→ 400 + 送信エラーページ なら Resend 側で失敗している。wrangler tail でログを見る
```

### 2026-08-29 (3): お問い合わせ通知の宛先を2件に変更

`worker.js` の受信設定を変更した（ユーザー指示）。

| 変更前 | 変更後 |
|---|---|
| TO: `contact@bullcom.website` / CC: `bullcom.office@gmail.com` | TO: `contact@bullcom.website` + `bullcom.contact@gmail.com` / CC なし |

- `CONTACT_CC` は「移行期の保険」として置かれていたものなので空にし、2件とも正規の宛先（TO）へ揃えた
- **`CONTACT_TO[0]` はお客様宛の確認メールの `reply_to` にも使われる**ので、先頭は独自ドメインのままにしてある
  （お客様に見えるのは `contact@bullcom.website` だけで、Gmail 側のアドレスは露出しない）
- Gmail のアドレスが `bullcom.office@` → `bullcom.contact@` に替わっている点に注意（別アドレス）

**反映にはデプロイが必要**。`worker.js` は静的アセットと同じ Worker なので、main への push →
GitHub Actions の `npx wrangler deploy` で本番へ乗る。push するまで本番の宛先は旧設定のまま。

検証: `node --check worker.js` ✓ / lint ✓ / build ✓。実メール到達の確認は End-to-End テスト時に行う。

### 2026-08-29 (2): カテゴリバッジの色を実カテゴリに対応 / フォーム完了表示を本番で確認

#### `lib/blog-ui.ts` の catColors を実際の4カテゴリへ

microCMSテンプレ初期値の想定（お知らせ/制作事例/SEO/セキュリティ/ノウハウ）のままだったため、
**9本中6本がデフォルト紫**で色分けが機能していなかった。2026-08-24 に作った4分類に置き換えた。

| カテゴリ | 色 | 白文字コントラスト |
|---|---|---|
| 費用と依頼 | `#db1374`（--pink 系） | 4.82:1 |
| デザイン | `#8846ff`（--purple 系） | 4.81:1 |
| 運用・保守 | `#1366ff`（--blue 系） | 4.80:1 |
| つくりの話 | `#077c95`（--cyan 系） | 4.85:1 |

**ブランド色をそのまま使わなかった理由**: バッジは白の太字12pxを載せるので、
`--pink #f0509e` は 3.31:1、`--purple` 3.48:1、`--blue` 3.19:1 と WCAG AA(4.5:1) に届かない。
`--cyan` に至っては 1.76:1。色相（HLS の H・S）を保ったまま明度だけ下げて 4.8:1 に揃えた。
未使用のテンプレ3カテゴリ（チュートリアル/テクノロジー/更新情報）はデフォルト色に任せる。

検証: lint ✓ / build ✓ / `out/blog.html` で4カテゴリすべてが専用色になり、デフォルト色への
フォールバックが0件であることを確認（2+3+2+2＝9本）。

#### ついでに整理した積み残し

「OG画像作成（現在未設定）」が残っていたが、**2026-08-18 に作成済み**だった
（`public/og-image.png` 1200x630 / 本番で HTTP 200・698KB、`app/layout.tsx` の openGraph と
twitter card 両方に設定済み）。実態に合わせて削除した。

#### フォームの完了表示（?sent=1）を本番ドメインで確認 → **問題なし**

積み残しは「FormSubmit の `_next` が workers.dev で効かない」という話だったが、
**2026-08-24 に Cloudflare Worker + Resend へ移行済みで、前提そのものが変わっていた**（下記）。

- `POST https://bullcom.website/api/contact-submit` → `302` / `Location: https://bullcom.website/contact?sent=1`
  （ハニーポット `_honey` に値を入れて実行。この経路はメールを送らずリダイレクトだけ返すので**テスト送信にならない**）
- ヘッドレスChromeで `https://bullcom.website/contact?sent=1` を描画 → 「🎉 送信ありがとうございました！」の完了ブロックを確認
- 同一オリジンへの302なので、FormSubmit時代の「外部Thanksページに飛ぶ」事象は構造的に起こらない

#### ⚠️ ドキュメントの記載漏れを補完

**2026-08-24 の「FormSubmit → Cloudflare Worker + Resend 移行」（コミット `c8fb0bb`）が
PROGRESS / CLAUDE.md / AGENTS.md のどこにも書かれていなかった**ため、3ファイルとも実装に合わせて修正した。

- 送信経路: `ContactForm.tsx`（action=`/api/contact-submit`）→ `worker.js` の `handleContactSubmit` → Resend API
- hidden フィールドは `_subject` / `_redirect` / `_honey`（`_next` `_template` `_captcha` は無い）
- 宛先 `contact@bullcom.website` / CC `bullcom.office@gmail.com` / 送信元 `noreply@send.bullcom.website`
- 自動返信あり（送信者宛、reply_to は contact@）
- 認証は **Worker の Secret `RESEND_API_KEY`**（GitHub Secrets ではない）:
  `printf '%s' '<APIキー>' | npx wrangler secret put RESEND_API_KEY`
- スパム対策が3段（ハニーポット / フィールド名の文字化け検出 / `KNOWN_FIELDS` の語彙照合 / 本文のURL混入拒否）。
  **フォームの項目名を変えると `KNOWN_FIELDS` と食い違って正規の送信まで弾かれる**ので、worker.js と同時に直すこと

**未実施**: 実際にメールが届くところまでの End-to-End テストは、移行後まだ一度も行われていない
（記録が無い）。実行するとお客様宛と同じ経路で contact@ と Gmail にテストメールが届く。

### 2026-08-29: 予約公開 → SNS自動投稿の全自動フローが初回で成功（確認のみ）

08/26 09:45（JST）の予約公開について、GitHub Actions とAPIの実測で検証した。**手を入れた箇所は無い。**

- microCMS の予約公開が Webhook を発火 → `repository_dispatch(microcms-publish)` で
  `Build & Deploy` と `SNS Auto Post` の両方が 00:45:11Z に起動、どちらも success
- 記事: 「「おしゃれなサイト」より「伝わるサイト」。最初に決めるのはデザインではありません」（`0q17ybkcytm`）
- 経過時間 0分 / 2分 で `SNS_POST_MAX_MINUTES=60` の範囲内 → 3媒体とも投稿された

| 媒体 | 結果 |
|---|---|
| Instagram | ✅ Post ID `18095919038565010`（カスタムテキスト使用・サムネあり） |
| Facebook | ✅ Post ID `122119649817309436` |
| GBP | ✅ 投稿成功（本文166文字・アイキャッチあり） |

- 本番 `/blog` は 200、公開記事は **9本**（既存8本＋今回の1本）。予約は残り18本（毎週水 9:45、12/30まで）
- `SNS_POST_MAX_MINUTES` は 60 に戻っていることを確認済み（キルスイッチ解除済み）

**これで「記事を書く → microCMSに予約投入 → 自動公開 → 自動デプロイ → 3媒体へ自動投稿」が全自動で回る状態になった。**

### 2026-08-26 (2): 公式LINE（BULLCOM Design）を開設・設定

アカウント: **`@529xcjts`** / 友だち追加URL: **https://lin.ee/5Sgn6PJ**
※ 既存BULLCOM（`@crt1899h` / lin.ee/vX5z2Xf）とは別アカウント。プランは「コミュニケーション」（無料）、認証ステータスは未認証。

#### ビジネスプロフィール（公開済み）

| 項目 | 値 |
|---|---|
| ステータスメッセージ | 思い通りのホームページを |
| 紹介文 | ホームページ制作・デザイン｜神戸から全国対応 |
| 住所 | 〒651-2113 兵庫県神戸市西区伊川谷町有瀬846-10 ギャラリエ1F（地図ピンあり） |
| 電話番号 | 078-912-2656（タップ発信を有効化） |
| Webサイト | https://bullcom.website |
| 支払い方法 | 現金可 ＋ その他「銀行振込、クレジットカード、代金引換」 |
| 営業時間 | 全曜日 **9:00〜19:00**（＝受付時間）／ 備考欄に「不定休（受付時間 9:00〜19:00）」 |
| フッターボタン | 色=ロゴのローズ色 / テキスト=「問い合わせる」「記事をチェック」 |
| 背景画像 | `public/hero-colorful-sky.png` から虹色部分を切り出して使用 |

カードのブランド（VISA/JCB等）は資料に無いので個別チェックせず「その他」にまとめた。

#### トーク まわり

- **あいさつメッセージ**: 友だち追加時の案内文を design 用に書き換え（264字）。相談例4つ＋電話番号＋サイトURL
- **チャット: オフ → オン**。運用目的が「チャットで問い合わせ対応」なのにオフのままだった
- **応答時間**: **オフ**（LINEは24時間365日受付とする方針）。応答方法は常に「手動チャット」
  - いったん 9:00〜19:00 に設定したが、方針確認のうえオフへ変更。曜日ごとの時間帯は残っているが無効
- **応答メッセージ**: 既定文が「このアカウントでは個別のお問い合わせを受け付けておりません」で
  アカウントの目的と正反対だったため差し替え。24時間365日に合わせ、時間に触れない文面にした
  （タイトル「受信時の自動返信」）。**電話番号だけは実際に 9:00〜19:00 なのでその旨を残している**
- **リッチメニュー**: 作らない。お客様とのチャットにのみ使う運用のため

#### サイト側

`lib/site-data.tsx` の `LINE_URL` を新URLへ差し替え。1箇所の定数なので全ページに反映される
（TOP / contact / price / FloatingCta / CtaBand）。本番で旧URLが0件、新URLのみになったことを確認済み。

#### ついでに直したもの

`eslint.config.mjs` に `scripts/**` を除外指定。SNS投稿スクリプトはNode用のCommonJS(.cjs)で
`require()` が正しいのに、Next.js側のTSルールが当たって11エラー出ていた（SNS構築時から）。

#### SNSパーツ・ボタン色（同日 追加設定）

- **SNSパーツ: 掲載**。bullcom.net との共用アカウントでよい、との判断
  - Facebook `https://www.facebook.com/1165513313302170`（It Support Bullcom）
  - Instagram `https://www.instagram.com/bullcom2656/`
  - 初期値のX枠はFacebookへ変更、YouTube枠は削除。**空欄のまま残すと保存時にバリデーションで弾かれる**
- **フッターボタンの色: ロゴのローズ色へ**。ロゴ画像から主要色を抽出（`#A84878` / `#903060`）し、
  LINEのパレット37色と距離計算して最も近い **`#ae466b`**（差14）を選択。
  サイトのブランドピンク `#f0509e` に寄せるなら `#dd5888` が最寄り

**LINE管理画面のクセ**: パーツの表示トグルは未保存の変更があると押しても効かず、
「保存されていない編集内容は破棄されます」ダイアログが割り込む。**先に［保存］→ その後トグル → ［公開］**の順で操作する。

**営業時間の決め方**: 事務所 9:30〜15:30 と 受付 9:00〜19:00 の2つがあるが、
プロフィールを見るのはお客様なので**受付時間（9:00〜19:00）を採用**。不定休なので曜日は絞らず全曜日に同じ時間を入れ、
定休日の自由記述欄に「不定休」と明記した。

**営業時間UIのクセ**: 時刻はネイティブの `<select>` ではなく `div.loa-input-time` 内の
**時・分に分かれた2つのテキスト入力**。ドロップダウンのリンクをJSでclickしても状態が更新されないので、
この2つの input に直接値を入れて `input`/`change`/`blur` を発火させるのが確実
（画面には「すべての曜日に適用」リンクもある）。

#### 未設定・判断待ち

- **お知らせパーツ**: OFF
- Facebookページに**ユーザーネーム（vanity URL）が未設定**なのでSNSパーツのURLが数字のまま。
  設定すれば `facebook.com/xxxx` の短いURLに差し替えられる

### 2026-08-26: SNS自動投稿を有効化。あわせて「下書きが本番公開されていた」事故を修正

#### ⚠️ APIキーの「下書きコンテンツの全取得」が原因で、未公開27本がサイトに出ていた

microCMSのAPIキー（default）に **「下書きコンテンツの全取得」** 権限が付いており、
コンテンツAPIが DRAFT まで返していた。ビルドもSNSスクリプトも同じキーを使うため:

- `/blog` に未公開の27本が並び、**予約公開が完全に無意味になっていた**
- SNSスクリプトの `fetchLatestArticle` が **未公開記事を「最新記事」として掴んでいた**
  （Webhookを先に入れていたら、未公開記事をIG/FB/GBPへ投稿していた）

→ 管理画面 → APIキー → default → コンテンツAPI の「下書きコンテンツの全取得」をOFF。
   管理API側の予約設定そのものは正常だった（毎週水9:45、08/26〜12/30の19本）。
   **キーの権限は「GET のみ」で運用すること。プレビューが要るなら draftKey を使う。**

#### 記事の公開状態を整理

- 予約なしだった下書き8本を、当初の意図どおり **7/01〜8/19 の毎週水曜9:45** で公開
- microCMSテンプレのサンプル記事（`nqgv3qjy1t`）は**削除せず下書きへ**戻してサイトから外した
- 結果: 公開中8本 / 予約19本 / 下書き1本（サンプル）

**publishedAt のハマりどころ**: 下書きのままだと
`'publishedAt' field error. This field is valid for content that is meant to be published.` で400。
**先に公開 → その後 publishedAt を過去日付へ PATCH** の順でないと通らない。
また公開状態の変更は `PATCH {service}.microcms-management.io/api/v1/contents/blogs/{id}/status` に
`{"status":["PUBLISH"]}`。**PUT だと 405 Method Not Allowed**（予約は PUT なので紛らわしい）。

#### Webhook（microCMS → GitHub）

`GitHub Actions` プリセットで登録。名前 `sns-auto-post` / ユーザー名 `bullcomoffice` /
リポジトリ `bullcom-design` / イベント `microcms-publish`。通知タイミングは既定のまま
（「コンテンツの公開（予約設定による操作）」が含まれる＝週次の自動公開で発火する）。
GitHubトークンの入力はユーザーが実施。

**一括公開のときは SNS 連投に注意**。今回は8本を連続公開したので、事前に
`gh secret set SNS_POST_MAX_MINUTES --body 0` で投稿を止め、作業後に 60 へ戻した。
（0にすると `minutes > 0` が常に真になりスキップされる＝実質キルスイッチ）

#### 検証済み

- Webhookが8回とも発火し、`Build & Deploy` と `SNS Auto Post` が毎回 success で起動
- SNS側は8本とも「公開からの経過時間 9898分・上限超過のためスキップ」で**投稿されず**（連投事故なし）
- 本番 `/blog` に公開済み8本のみが並ぶことを確認
#### 実投稿テスト（2026-08-26）: IG / FB / GBP すべて成功

7/1付の記事（`85wnqdfepbh`）を下書き→再公開して本番投稿を確認した。

| 媒体 | 結果 | 確認内容 |
|---|---|---|
| Instagram | ✅ https://www.instagram.com/p/Dcer-4aEgbb/ | 画像あり・原稿のSNS文・リンク正しい |
| Facebook | ✅ Post ID `122119639707309436` | 画像あり・同上 |
| GBP | ✅ state `LIVE` | 画像あり・CTA URL が本番ドメイン |

投稿文は `scripts/sns-post-texts.json` のカスタムテキストが使われ、
リンクはすべて `https://bullcom.website/blog/{id}` で正しい。テスト後 publishedAt は 7/01 に戻した。

**★ Webhookが発火する操作の切り分け（重要）**

- **コンテンツAPI**（`{service}.microcms.io/api/v1/blogs/{id}` への PATCH 等）→ **発火する**
- **管理APIの status エンドポイント**（`.../contents/blogs/{id}/status`）→ **発火しない**

つまりスクリプトから公開状態だけ変えても自動投稿は走らない。
手で確認したいときは publishedAt を PATCH するか `gh workflow run sns-post.yml` を使う。
なお本番の週次公開は「予約設定による公開」なので、この制約とは無関係に発火する。

**日付の巻き戻しでもWebhookは飛ぶ**ので、publishedAt を直すときも
`SNS_POST_MAX_MINUTES=0` で止めてから作業すること。

### 2026-08-26: bullcom.website を Cloudflare へ移管（本番ドメイン切替）

メールは CoreServer のまま。移管の要点と、途中で起こした障害の記録。

#### 移設したDNS（Cloudflare zone `2928ca8de4363bdb37af189176fe9c44` / Free）

Cloudflareの自動スキャンで11件インポートされたが、**そのままではメールが壊れる**ため3点直した。

| 修正 | 内容 |
|---|---|
| MXの向き先 | `bullcom.website` → `mail.bullcom.website`（優先度10）。ルートをWorkerに載せるとMXがCloudflareのIPを指してしまうため |
| `mail` を新設 | A `163.44.176.15` / AAAA `2400:8500:1301:162::15:1`、どちらもプロキシOFF |
| ワイルドカード `*` | A/AAAA ともプロキシOFFへ（インポート時はON）。pop/smtp/imap/webmail/ftp を CoreServer 直通で維持 |

そのまま移設: SPF / `google-site-verification` / DMARC / **DKIM（セレクタ `x`、411文字）**。
DKIMは255バイト超で2チャンクに分割されるので、引用符を除いて結合し旧値と1文字ずつ照合して一致を確認した。

apex と www の A/AAAA は削除し、Worker のカスタムドメインに置き換えた。

#### ⚠️ 起こした障害と原因（同じ轍を踏まないこと）

**1. ゾーンが `initializing` のまま20時間、ドメイン全体が引けなくなった**

ゾーン作成後、オンボーディング（プラン選択 → DNS確認 → NS案内）を完了せず、
DNSレコード画面へ直接URLで飛んでしまった。プラン未選択だとゾーンが `initializing` で止まり、
**割り当てられたNSが `Query refused` を返す**。NSはすでにCloudflareへ切替済みだったため、
Webもメールも名前解決できない状態になった。

→ 対処: ダッシュボードで無料プランを選択 → 「アクティベーションに進む」→「ネームサーバーを更新しました」
まで完了させたら `pending` に移り、即座にNSが応答を返すようになった。
**ゾーンを作ったら必ずオンボーディングを最後まで通すこと。**

**2. `wrangler deploy` の `[[routes]]` で deploy ごと失敗し、workers.dev まで落ちた**

`custom_domain = true` のルートを書いて deploy したところ、
`/zones/{id}/workers/routes` が `Authentication error [code: 10000]` で失敗。
現在の `CLOUDFLARE_API_TOKEN` はこのゾーンのルート操作権限を持っていない（新規ゾーンのため）。
さらに `workers_dev` が未指定だったので、この deploy で **workers.dev が無効化され退避先も消えた**。

→ 対処: `wrangler.toml` から `[[routes]]` を外し `workers_dev = true` を明記して復旧。
カスタムドメインは**ダッシュボードの Workers → ドメイン タブ**で登録した（apex と www の2件）。
登録時に `Hostname ... already has externally managed DNS records` と出るので、
先にそのホスト名のA/AAAAを削除しておく必要がある。

#### 検証済み

- `https://bullcom.website/` `https://www.bullcom.website/` `/blog` `/blog-thumbnails/{id}.jpg` すべて HTTP 200
- workers.dev も 200 のまま（退避先として維持）
- MX → `mail.bullcom.website` → 163.44.176.15、pop/smtp も 163.44.176.15 のまま
- **メール受信テスト: 2026-08-26 に外部から送信して着信を確認済み**。
  MX → `mail.bullcom.website` → 163.44.176.15（CoreServer）の経路で問題なく届く

### 2026-08-25: SNS自動投稿（IG / FB / GBP）を構築

- `sns-auto-post-setup` skill で構築。**X（旧Twitter）は作らない**（API従量課金のため手動運用に切替済み）。
  `scripts/post-to-x.cjs` はコピーせず、`sns-post.yml` のXステップはコメントで残すだけ。復活させないこと
- 配置したもの
  - `scripts/post-to-instagram.cjs`（IG+FB）/ `scripts/post-to-gbp.cjs` / `scripts/lib/sns-common.cjs`
    — いずれも bullcom-security の本番稼働版をそのままコピー。挙動は変えていない
  - `.github/workflows/sns-post.yml` — deploy.yml とは別ワークフロー。`repository_dispatch(microcms-publish)` と手動実行で起動
  - `public/blog-thumbnails/{記事ID}.jpg` 27枚（Instagramは画像必須。microCMSのeyecatchは0バイト事故の実績があるので使わない）
  - `scripts/sns-post-texts.json` — `blog-drafts/*.md` の「## SNS投稿」から本文＋ハッシュタグを抜き出し記事IDをキーにしたもの（27本）。
    これが無いと投稿文が「【新着記事】{タイトル}」の既定文になる。記事を足したら再生成すること
- 記事IDとサムネの紐付けは、管理APIの `reservationTime.publishTime` と投入時の posts.json を突き合わせて特定（27本すべて確定）
- GitHub Secrets を設定（bullcom.net と同じアカウントへ投稿するため認証8件は同値）
  - 同値: `IG_BUSINESS_ACCOUNT_ID` `IG_PAGE_ACCESS_TOKEN` `FB_PAGE_ID` `GBP_CLIENT_ID` `GBP_CLIENT_SECRET` `GBP_REFRESH_TOKEN` `GBP_ACCOUNT_ID` `GBP_LOCATION_ID`
  - サイト固有: `MICROCMS_API_ID=blogs` / `SITE_URL=https://bullcom.website` / `SNS_HASHTAGS_IG` / `SNS_POST_MAX_MINUTES=60`
  - `FB_PAGE_ID` だけ控えが無く、Graph APIから取得 → `1165513313302170`（It Support Bullcom）
- 検証済み（いずれも読み取りのみ。実投稿はしていない）
  - IG `bullcom2656` / FB `It Support Bullcom` / GBP `BULLCOM(ブルコム)` にトークンが通ることを確認。bullcom.net と同一アカウント
  - サムネ27枚が workers.dev で HTTP 200 かつ 10KB以上（0バイト事故チェック）
  - microCMSの `fields` に `slug` を投げても200が返り、未定義なので記事URLは `id` にフォールバックする（`/blog/[id]` と一致）
  - `gh workflow run sns-post.yml` を実行 → 記事取得まで通り「公開から2019分・上限超過のためスキップ」で正常終了。
    投稿はしていない。npm ci / Secrets / microCMS取得 / スキップ判定までの疎通が取れている
- なお GBP は投稿文が「…詳しくはこちら👇」＋スクリプトの「詳細はこちら → URL」で少し重複する。
  原稿どおりの文面を優先して手は入れていない。気になるなら `post-to-gbp.cjs` の `buildSummary()` を調整する

#### ⚠️ 未完了：本番投稿テストは bullcom.website 切替が先

`SITE_URL=https://bullcom.website` にしてあるが、**このドメインはまだ Cloudflare に載っていない**。
現状 NS は Value Domain、実体は LiteSpeed サーバーで `https://bullcom.website/` は **403** を返す。
このまま投稿すると Instagram の画像取得が失敗し、GBP/FB には死んだリンクが載る。

- Cloudflare のゾーン一覧に `bullcom.website` は**無い**（bullcom.jp / .net / .org / .cyou 等はある）
- 切替手順: Cloudflareにゾーン追加 → Value Domain で NS を Cloudflare のものへ変更 → `wrangler.toml` の `[[routes]]` をコメント解除 → deploy
- **microCMS Webhook はまだ設定していない**。設定すると次の予約公開（毎週水9:45）で自動投稿が走ってしまうため、
  ドメイン切替が済むまで意図的に保留している

### 2026-08-24: ブログ27本をmicroCMSへ投入（予約公開つき）

- **カテゴリを4分類で作成**: 費用と依頼(esos-pueb) / デザイン(41w1mai42x) / 運用・保守(19k0gc2dp0) / つくりの話(3f4h6zg8ua2)
  ※テンプレ初期値の3件（チュートリアル/テクノロジー/更新情報）は未使用のまま残置
- **記事27本を投入**: 過去分8本（7/01〜8/19）は下書き、未来分19本（8/26〜12/30）は予約公開を設定
- **アイキャッチ27枚**をメディアにアップロードして各記事に紐付け
- 公開スケジュールは毎週水曜9:45（JST）。APIには UTC（00:45Z）で渡す

**APIの要点（実測で確定。ドキュメントはJS描画で読めないため直接検証した）**
- 過去日付の投稿は可能。`publishedAt` は指定できるが `createdAt` は不可（`'createdAt' is unexpected key`）
- 予約公開は2段階:
  1. `POST /api/v1/blogs?status=draft` で下書き作成
  2. `PUT https://{service}.microcms-management.io/api/v1/contents/blogs/{id}/reservation` に `{"publishTime":"...Z"}`
- 公開状態の変更は `PATCH .../contents/blogs/{id}/status` に **配列** で `{"status":["DRAFT"]}` / `["PUBLISH"]`
  （オブジェクトで送ると "Request body is not JSON object."）
- 既に公開済みだと予約不可（"Cannot be reserved for the public because it has already been published"）→ 先にDRAFTへ戻す
- メディアアップロードは `POST {service}.microcms-management.io/api/v1/media`（マネジメントAPI権限が必要）。
  **連続実行はレート制限に当たる**ので1件ごとに2〜3秒空ける（12枚目以降が一斉に失敗した）
- APIキーの権限: コンテンツAPIに POST/PUT/PATCH と下書き取得、マネジメントAPIに「公開状態の変更」「スケジュール設定の変更」「メディアの取得/アップロード」を付与。DELETEは事故防止で未付与

**再実行の手順**: `blog-drafts/build-posts.py` で posts.json を生成 → `blog-drafts/post-all.sh` で投入



### 2026-08-18 (2): デザイン改善7点（CV導線・可読性・SNS・SEO・演出）

実測をもとに改善。すべて本番反映済み。

1. **モバイル固定CTAバー**（`components/layout/FloatingCta.tsx`）: 従来はLINEボタンのみで、CV優先1位の電話がスクロール中に押せず、さらにボタンが本文に重なっていた。下部に「電話｜フォーム｜LINE」の3分割バーを設置し、`body { padding-bottom: 4.25rem }`（1023px以下）で重なりを解消
   - 注意: `.floating-bar` の display はCSSのメディアクエリで制御する。Tailwind の `lg:hidden` は詳細度が並ぶため globals.css の定義が後勝ちして効かなかった
2. **可読性**: `--text-muted` を `#8a86a0`（3.45:1）→ `#6f6b87` に変更。本番実測 5.01:1 でWCAG AA達成。12pxの注釈に使われていたため影響が大きい
3. **OG画像**: `public/og-image.png`（1200x630）を作成。gpt-image-2で背景を生成し、Pillowでロゴ・キャッチコピー・価格チップを合成。twitter card も `summary_large_image` に
4. **制作実績を実サイトのスクショに**: bullcom.jp / truck-kaitori.jp / boatkaitori.com を playwright で撮影し 16:10 で切り出し。「サイトを見る」外部リンクも追加
5. **構造化データ**: トップに `ProfessionalService`（所在地・電話・営業時間・提供サービス・親組織BULLCOM）を追加。ローカル検索向け
6. **数字帯**（`components/ui/StatBand.tsx`）: 創業2002年・6サイト・LP3万円〜・保守5,000円〜。事実のみ掲載
7. **スクロール演出**（`components/ui/Reveal.tsx`）: IntersectionObserverでセクションをフェードイン。`prefers-reduced-motion` で無効化
   - お客様の声は実データが集まるまで非表示（`VOICES` に追加すれば自動表示）

### 2026-07-26 (2): サービス個別ページ・プライバシーポリシー・会社概要

- **サービスを4ページに分割**: `/services/[slug]` の動的ルートで `web` `graphic` `branding` `contents` を静的生成
  - 各ページ: サービス個票（内容・特徴・価格）／こんな方におすすめ／他サービスへの回遊／CTA
  - 詳細コンテンツは `lib/site-data.tsx` の SERVICES に集約（slug・pageTitle・lead・metaDescription・details・recommended・heroImage）
  - `/services` は4ページへのハブに再構成、トップのサービスカードも各詳細ページへリンク
- **`/privacy` 新規作成**: 定義・取得・利用目的・第三者提供・管理・フォーム送信・アクセス解析・開示請求・変更・窓口の10項目。フッターにリンク追加。制定日 2026年7月26日
- **会社概要を実データ化**: bullcom.jp/about（同一事業者）を参照して所在地・代表者・FAX・創業・営業時間・定休日・支払方法を記載。`COMPANY` 定数に集約し /privacy と共用。「BULLCOMが運営するデザイン事業ブランド」と明記してbullcom.jpへリンク
- 検証: build ✓（全12ルート）/ lint ✓ / 13ページ×デスクトップ・モバイル＝26パターンで横スクロールなし ✓
- ~~未対応: サービス別ページのヒーロー画像は既存イラストの流用~~ → 2026-08-18 に専用イラストを生成して解消（下記）

### 2026-08-18: サービス4ページの専用イラストを生成

- gpt-image-2 で4枚生成し `public/service-{web,graphic,branding,contents}.png` として配置、各ページのヒーローに割り当て
  - Web=PC/タブレット/スマホのデザイン表示、グラフィック=名刺・チラシ・色見本、ブランディング=ムードボードと素材見本、コンテンツ=カメラ・照明・マイク
  - 人物なしで統一（実績カードが人物なしのため）。1440x960にリサイズ（既存画像と同水準の容量）
- **生成手順**: APIキーは `D:\Data\Projects\Next\bullcom\.env.local` の `OPENAI_API_KEY`。`https://api.openai.com/v1/images/generations` に model=gpt-image-2 / size=1536x1024 / quality=medium でPOST。レスポンスは `data[0].b64_json`（Base64）なのでデコードして保存。生成に数十秒かかるのでタイムアウトは長めに
  - 詳しい手順は `D:\Data\Projects\Next\bullcom\.claude\commands\blog-create.md` STEP3 を参照
  - トーン指定: 「明るい白基調のスタジオ、自然光、パステル＋ビビッド（ピンク/紫/青/シアン/オレンジ）、人物なし、文字なし、フォトリアル」で既存イラストと揃う
- 検証: build ✓ / lint ✓ / 本番4ページで画像ロード確認 ✓（デプロイ済み）

### 2026-07-26: 1ページ集約 → 複数ページ構成に分割

- 下層6ページを新規作成: `/services` `/price` `/works` `/faq` `/about` `/contact`
- トップページはダイジェスト化（各セクションの要約＋詳細ページへの導線）。FV優先順「キャッチコピー→実績→料金」、イラスト、明るいカラフルデザインは維持
- 共通化: `lib/site-data.tsx`（料金・サービス・実績・強み・電話/LINE定数）、`components/ui/` に PageHero / CtaBand / SectionHead
- ヘッダー/フッターを `/#アンカー` からルートリンクに置き換え、現在ページのアクティブ表示（下線・背景）を追加
- 各ページに metadata（title/description/canonical）、FAQに FAQPage 構造化データ
- `/about` の所在地・代表者・設立・営業時間は未確定のため「—」表記（**ユーザー確認待ち**）
- `/works` のお客様の声も未収集のため「準備中」表示
- 検証: build ✓ / lint ✓ / 全8ページ×デスクトップ1440・モバイル390で横スクロールなし ✓ / 旧アンカーリンク残存なし ✓ / `/contact?sent=1` で送信完了表示が出ることを確認 ✓
- ⚠️ 作業中の事故と復旧: 会話要約から引き継いだ古い（ダークテーマ版の）トップページ内容で `app/page.tsx` を上書きしてしまい、直前コミット f2879b1 の「明るくカラフル＋イラスト」版を一時的に破壊した。未コミットだったため `git checkout HEAD --` で復元し、現行デザインを基準に作業をやり直した。**要約経由で引き継いだ内容は、着手前に必ず現物のファイルを読んで確認すること**

### 2026-07-26: セクションごとの具体的なイラストを追加

- `public/scene-price-consultation.png` を料金プランに追加。制作前の相談・見積もりの安心感を伝えるビジュアルとして使用。
- `public/scene-services-creation.png` をサービス内容に追加。Web・グラフィック・ブランディングを横断する制作風景を表現。
- `public/scene-support-security.png` を無料診断バナーに追加。公開後の保守・セキュリティ対応を具体化。
- `app/page.tsx` で実績カードも含めてイラスト枠を整備し、ヒーローのモバイル幅を調整。料金・電話番号・フォーム送信ロジックは変更していない。
- `app/globals.css` にイラスト枠の専用スタイルを追加。Tailwindの高さユーティリティに依存せず、画像エリアの高さを安定化。
- 確認用画像: `screenshots-sections-desktop.png` / `screenshots-sections-mobile.png` / `screenshots-price-desktop.png`（Git管理対象外）。

### 2026-07-23: トップページをブライト・カラフルにリニューアル

- 実績カードを生成イラストで具体化: PC修理・設定の相談風景、トラック買取・販売の展示とデジタル運用、ボート買取サービスとマリーナの3点を `public/work-*.png` として追加
- `app/page.tsx` のファーストビューを、ロゴ単体から「制作物が並ぶデザインボード」風のビジュアルへ刷新。既存のキャッチコピー・説明・料金・電話番号・CV導線は維持
- 制作実績カードに、PC修理／トラック／ボートの各テーマを表現するブラウザ風イラストを追加。画像素材が未整備の段階でも、実績の方向性が直感的に伝わる構成に変更
- `app/globals.css` のデザインシステムを、白〜アイボリーを基調にした明るいガラスカード・多色グラデーションへ拡張。固定ヘッダー、フッター、フォームの配色も新背景での可読性を確保
- `ContactForm.tsx` は表示用クラスのみ調整し、FormSubmitの送信ロジック・hiddenフィールド・画像圧縮処理には未変更
- 検証: `npm run lint` / `npm run build` 成功。headless Chromeで 1440px・390px を確認し、`scrollWidth` は各ビューポート幅と一致（横スクロールなし）
- スクリーンショット: `screenshots-renewal-desktop.png` / `screenshots-renewal-mobile.png`

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

### 2026-07-26: 下層ページのビジュアルリニューアル

- `/services` `/price` `/works` `/faq` `/about` `/contact` の共通ヒーローを、明るい多色グラデーションとページ固有のイラスト付き構成へ刷新。
- 共通 `PageHero` に画像表示オプションを追加。サービス・会社案内用に新規イラスト `public/sub-services-studio.png`、`public/sub-about-partnership.png` を追加し、料金・実績・FAQ・お問い合わせには既存のテーマ別イラストを活用。
- 共通 `CtaBand` にサイト保守・セキュリティ支援のイラストを追加。お問い合わせページはフォーム前にも制作相談のイメージバナーを配置し、`ContactForm.tsx` の送信ロジックは変更していない。
- `npm run lint` と `npm run build` は成功。ヘッドレスChromeで全6ページを 1440px / 390px 幅で確認し、全組み合わせで `scrollWidth === clientWidth` を確認。
- 検証スクリーンショット: `screenshots-sub-*-desktop.png` / `screenshots-sub-*-mobile.png`（共通CTA: `screenshots-sub-services-cta-*.png`）。

### 2026-07-27: TOPヒーローをカラフルな空へ変更

- 淡いオーロラ背景を、雲とピンク・紫・青・シアンがはっきり見えるカラフルな空のビジュアルへ置き換え。
- `public/hero-colorful-sky.png` を追加。コピー・料金・電話番号・CV導線・右側のデザインボードは維持し、テキスト周辺だけ白のグラデーションで可読性を確保。
- 検証: `npm run lint` / `npm run build` 成功。ヘッドレスChrome 1440px・390pxで `scrollWidth === clientWidth` を確認。スクリーンショットは `screenshots-hero-sky-desktop.png` / `screenshots-hero-sky-mobile.png`。
- 追加調整: TOPヒーローの `grid-overlay` を外し、空の背景を升目なしでそのまま見せるように変更。

### 2026-07-27: 制作実績ビジュアルから人物を削除

- `public/work-pc-repair.png`、`public/work-truck.png`、`public/work-boat.png` を人物なしの画像へ差し替え。PC修理の作業環境、トラック、ボートを主役にし、既存のカラフルなトーンとデバイス・分析グラフィックを維持。
- 検証: TOPの制作実績セクションをヘッドレスChrome 1440px・390pxで確認し、人物が残っていないこと、`scrollWidth === clientWidth` を確認。`npm run lint` / `npm run build` 成功。
