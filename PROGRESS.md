# PROGRESS — BULLCOM design

## 進行中タスク

### ユーザー対応待ち
- [ ] **08/26 09:45 の初回自動投稿を目視確認**（IG `bullcom2656` / FB `It Support Bullcom` / GBP `BULLCOM(ブルコム)`）
  - 画像が出ているか、本文とリンクが正しいかを必ず見る。Actionsが success でも投稿が空のことがある
  - 失敗していたら公開から60分以内に `gh workflow run sns-post.yml` で再実行できる
- [ ] トップページのデザインレビュー / 実績カード3件（PC修理/トラック/ボート）の内容確認
- [ ] LINE: design専用アカウントを作るか（現在は既存BULLCOMの lin.ee/vX5z2Xf を仮設定）
- [ ] GA4 プロパティ作成 → 測定ID共有（layout.tsx にTODOコメントあり）

### 次セッション以降
- [ ] ドメイン切替後、フォームの `_next` リダイレクト（?sent=1完了表示）を本番ドメインで再確認（workers.devでは効かずFormSubmitのThanksページに飛ぶ既知事象）
- [ ] `lib/blog-ui.ts` の catColors を実際の4カテゴリ名に合わせる
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
- **未実施: 実際のSNS投稿の目視確認** → 08/26 09:45 の自動公開が初回の本番投稿になる

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
