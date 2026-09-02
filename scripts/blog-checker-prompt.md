# ブログ公開・SNS投稿の日次チェック（10:30 Slack通知）を新しいサイトに広げるプロンプト

毎朝 **10:30 JST** に「今日ブログが公開されたか」「SNS自動投稿が成功したか」をまとめて
Slackへ通知する仕組み。**サイトごとに作るのではなく、`bullcomoffice/blog-checker`
という共通リポジトリ1本が全サイトをまとめて見に行く**構成になっている。

したがって新しいサイトを増やすときは、**そのサイトのリポジトリには何も足さない**。
blog-checker 側に「監視対象を1つ追加する」だけでよい。

## 現状（2026-09-03 時点）

| 監視中のサイト | URL | リポジトリ |
|---|---|---|
| Security | bullcom.net | bullcomoffice/bullcom-security |
| Recycle | bullcom.org | bullcomoffice/bullcom-recycle |
| 修理 | bullcom.jp | bullcomoffice/bullcom |
| Design | bullcom.website | bullcomoffice/bullcom-design |

- 実行: `bullcomoffice/blog-checker` の `.github/workflows/daily-check.yml`
- 起動: **cron-job.org → Cloudflare Worker（`blog-checker-trigger`）→ workflow_dispatch**
  （`on: schedule` は使っていない。GitHubのcronは遅延が大きいため外部トリガー）
- 通知: **Slackへ毎日**（BULLCOMワークスペース `#general` / アプリ「BULLCOM Bot」の Incoming Webhook）。
  **LINEは異常時のみ**（無料枠200通/月を使い切って通知が止まった過去があるため）

---

## 貼り付け用プロンプト

```
ブログ公開とSNS自動投稿の日次チェック（毎朝10:30 JSTにSlack通知）に、このサイトを追加してください。

## 仕組み（先に把握してから作業すること）
監視は各サイトのリポジトリではなく、共通リポジトリ bullcomoffice/blog-checker が
まとめて行っています。追加作業はすべて blog-checker 側で完結します。
このプロジェクトのリポジトリには何も足さないでください。

- 本体: bullcomoffice/blog-checker の check_blogs.py（sites 配列に監視対象が並んでいる）
- 実行: .github/workflows/daily-check.yml（workflow_dispatch のみ。
  起動は cron-job.org → Cloudflare Worker「blog-checker-trigger」→ workflow_dispatch）
- 判定ロジック:
  1) microCMS のコンテンツAPIで「今日 JST に publishedAt になった記事」を取得
  2) 記事があれば、そのサイトのリポジトリの sns-post.yml の当日実行結果を GitHub API で確認
  3) 記事が無い日は SNS チェックをスキップ（⏭️）
- 通知先: Slack は毎日送信（生存確認を兼ねる）／ LINE は異常時のみ（無料枠温存）

## やること

1. check_blogs.py の sites 配列に、このサイトのエントリを1つ追加する。
   既存エントリと同じ形にすること:
     {
       "name":     "<Slackに出る短い表示名>",
       "url":      "https://<ドメイン>/blog",
       "cms_svc":  os.environ.get("MICROCMS_<KEY>_SERVICE_ID", ""),
       "cms_api":  os.environ.get("MICROCMS_<KEY>_API_ID", "blogs"),   ← microCMSのエンドポイント名
       "cms_key":  os.environ.get("MICROCMS_<KEY>_API_KEY", ""),
       "gh_repo":  os.environ.get("GH_REPO_<KEY>", "bullcomoffice/<repo>"),
       "workflow": "sns-post.yml",
       "sns":      "IG / FB / GBP",
     }
   <KEY> はサイトを表す英大文字の識別子（既存: SECURITY / RECYCLE / REPAIR / DESIGN）。

2. blog-checker リポジトリに Secrets と Variables を追加する。
   - Secrets: MICROCMS_<KEY>_SERVICE_ID / MICROCMS_<KEY>_API_KEY
     ※ APIキーは **GETのみの権限**でよい。「下書きコンテンツの全取得」は絶対に付けないこと
   - Variables: GH_REPO_<KEY>（例 bullcomoffice/xxxx）
   - 値はこのプロジェクトの .env.local から読む（チャットに値を表示しないこと）

3. daily-check.yml の env: ブロックに、追加した環境変数の受け渡しを足す。
   ここに書き忘れると、値は入っているのに常に「設定未完（スキップ）」になる。

4. 動作確認する。
   gh workflow run daily-check.yml --repo bullcomoffice/blog-checker
   実行後に gh run view --log で、追加したサイトの行が出ているか確認する:
   - 当日公開があれば「✅ ブログ: N本公開」＋「✅ SNS投稿: 成功」
   - 公開がない日は「⏭️ ブログ: 本日公開予定なし」＋「⏭️ SNS投稿: スキップ」
   「⏭️ 設定未完（スキップ）」と出たら Secrets 名か env: の記述が食い違っている。

## 注意
- GH_PAT（blog-checker が各リポジトリのワークフロー結果を読むためのトークン）は既存のものを流用する。
  新サイトのリポジトリが private の場合、そのトークンに読み取り権限があるか確認すること。
- 監視対象は IG / FB / GBP のみ。**Xは手動運用なので監視しない**（sns-post.yml のXステップは
  コメントアウトされたまま）。
- SNSチェックは「sns-post.yml が success で終わったか」しか見ない。
  「上限超過でスキップされた」場合も success になるので、投稿されたかどうかまでは分からない。
  厳密に見たいときは各SNSのアカウントを直接確認すること。
- 通知が来ない日が続いたら、まず cron-job.org と Cloudflare Worker「blog-checker-trigger」が
  生きているかを疑う（GitHub側の cron ではないため、GitHub Actions の画面だけ見ても分からない）。

## 最後に
追加後に手動実行して、Slackに新しいサイトの行が出ることを確認してから報告してください。
```

---

## 備考

- 通知ポリシーの由来: 2026-07 に LINE 無料枠（月200通）を使い切り、月末に通知が完全に止まった。
  以来 **Slack=毎日 / LINE=異常時のみ** の2段構えにしてある
- `send_webhook()` は URL で Slack / Discord を自動判別する（Slack=`text`・3500字分割、
  Discord=`content`・1900字分割）。Discord へ移したい場合は `DISCORD_WEBHOOK_URL` を入れるだけでよい
- Slack Webhook URL は文字の読み取り事故が起きやすい（末尾 `...OFh0TflyNST` の `l` を `1` と
  誤読して invalid_token になった前例あり）。画面から目視で写さず、コピーで取得すること
