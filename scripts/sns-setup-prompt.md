# SNS自動投稿を別プロジェクトへ持ち込むためのプロンプト

microCMSブログのSNS自動投稿（IG / FB / GBP）を新しいプロジェクトに新設するための、
**そのまま貼り付けられるプロンプト**。bullcom-design 構築時（2026-08-25〜26）の実績と
ハマりどころを反映してある。

投稿先は全サイト共通で **BULLCOMのアカウント**（IG `bullcom2656` / FBページ `It Support Bullcom` /
GBP `BULLCOM(ブルコム)`）。認証Secretsは全リポジトリで同値。

---

## 貼り付け用プロンプト

```
このプロジェクトに microCMS ブログの SNS 自動投稿（Instagram / Facebook / Google Business Profile）を
新設してください。実装済みの参考が D:\Data\Projects\Next\bullcom-design（本番稼働中・2026-08-26 に
3媒体とも実投稿成功）にあります。大元は D:\Data\Projects\Next\bullcom-security です。

## 投稿先（全サイト共通・BULLCOMのアカウントに投稿する）
- Instagram: bullcom2656（ビジネスアカウント）
- Facebookページ: It Support Bullcom（ページID 1165513313302170）
- GBP: BULLCOM(ブルコム)
- X（旧Twitter）は作らない。API従量課金のため手動運用（x-schedule skill）。
  sns-post.yml の X ステップはコメントアウトのまま残し、復活させない

## 配置するもの（bullcom-design からコピー。挙動は変えない）
- scripts/post-to-instagram.cjs（IGとFBを1本で投稿）
- scripts/post-to-gbp.cjs
- scripts/lib/sns-common.cjs
- .github/workflows/sns-post.yml
  → デプロイ用ワークフローとは別ファイル。起動は repository_dispatch(microcms-publish) と workflow_dispatch
- scripts/sns-post-texts.json
  → 記事IDをキーにしたカスタム投稿文の辞書。原稿の「## SNS投稿」セクションから生成する。
    無い記事は既定文「【新着記事】{タイトル}」になるので、記事を足したら必ず再生成
- public/blog-thumbnails/{記事ID}.jpg（コミット必須）
  → Instagramは画像必須。microCMSのeyecatchは0バイト事故の実績があるため使わない

## GitHub Secrets
認証8件は bullcom-design / bullcom-security のリポジトリと同値。
**値の控えは `D:/Data/Projects/Next/bullcom/.env.local` にある**（ユーザーへの手入力依頼は不要）。
そこから読んで gh secret set で投入する。**値をチャット画面に表示しないこと**:
  IG_BUSINESS_ACCOUNT_ID / IG_PAGE_ACCESS_TOKEN /
  GBP_CLIENT_ID / GBP_CLIENT_SECRET / GBP_REFRESH_TOKEN / GBP_ACCOUNT_ID / GBP_LOCATION_ID
  → 上記7件は .env.local に同名で入っている
  FB_PAGE_ID → .env.local には無い。値は 1165513313302170（It Support Bullcom・公開情報）

投入例（Git Bash）:
  ENV="D:/Data/Projects/Next/bullcom/.env.local"
  for k in IG_BUSINESS_ACCOUNT_ID IG_PAGE_ACCESS_TOKEN GBP_CLIENT_ID GBP_CLIENT_SECRET            GBP_REFRESH_TOKEN GBP_ACCOUNT_ID GBP_LOCATION_ID; do
    grep "^$k=" "$ENV" | cut -d= -f2- | tr -d '
' | gh secret set "$k"
  done
  gh secret set FB_PAGE_ID --body 1165513313302170
サイト固有4〜6件:
  MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY / MICROCMS_API_ID（例: blogs）
  SITE_URL=https://<本番ドメイン> / SNS_HASHTAGS_IG / SNS_POST_MAX_MINUTES=60

## 起動経路
microCMS の Webhook（「GitHub Actions」プリセット、イベント名 microcms-publish、
リポジトリはこのプロジェクト、GitHubトークン入力はユーザー作業）。
- Webhook は「コンテンツAPIの操作」と「予約設定による公開」でしか発火しない。
  管理APIの /status で公開状態を変えても飛ばない
- publishedAt の変更（過去日への巻き戻し含む）でも飛ぶ。
  日付修正や一括公開の前は必ず gh secret set SNS_POST_MAX_MINUTES --body 0 で止め、
  終わったら 60 に戻す（0 = 常にスキップされるキルスイッチ）
- SNS_POST_MAX_MINUTES は「公開からの経過分数がこの値を超えていたらスキップ」の意味。
  再デプロイ等でワークフローが二重起動しても古い記事を再投稿しない安全弁

## 検証手順（この順で。実投稿はユーザー承認後）
1. トークン疎通（読み取りのみ）: IG / FB / GBP のアカウント情報がAPIで取得できるか。
   bullcom2656 / It Support Bullcom / BULLCOM(ブルコム) に一致することを確認
2. サムネが本番URLで HTTP 200 かつ 10KB以上（0バイトチェック）
3. gh workflow run sns-post.yml → 記事取得まで通り
   「公開からの経過時間・上限超過のためスキップ」で正常終了すること（ここまで投稿ゼロ）
4. 実投稿テスト: 記事1本を下書き→再公開して3媒体に投稿されるか確認。
   画像・カスタム投稿文・リンク（本番ドメイン/blog/{id}）の3点を見る。
   テスト後は publishedAt を元に戻す（このときもキルスイッチを先に）

## 注意（過去の事故から）
- SITE_URL の本番ドメインが生きていることが前提。死んだリンクをSNSに載せない
  （ドメイン切替前に有効化しない。bullcom-design はこの順序を守るためWebhook登録を最後にした）
- microCMS APIキーに「下書きコンテンツの全取得」権限を付けない。
  サイトに未公開記事が出るうえ、SNSスクリプトが未公開記事を「最新記事」として投稿してしまう
- IGはコンテナ作成→60秒待機→publish の実装（画像処理待ち）。この待機を削らない
- GBPは投稿が審査で削除されることがある。実投稿後に生存確認をする
- 記事URLは microCMS に slug フィールドが無ければ記事IDにフォールバックする。
  サイト側のルート（/blog/[id] か /blog/[slug] か）と一致しているか確認する
- IG_PAGE_ACCESS_TOKEN には60日の有効期限がある（旧HPプロジェクトの記録）。
  トークン疎通チェック（検証1）が突然401/190エラーになったら期限切れを疑い、
  再発行した値を全リポジトリのSecretsへ入れ直す

## 最後に
検証1〜3まで完了したら、実投稿テスト（検証4）を行うかユーザーに確認してから実施し、
結果（3媒体の投稿ID/URL）を報告してください。
```

---

## 備考（このファイル自体のメモ）

- 認証8件の由来: bullcom.net（bullcom-security）構築時に取得したもの。
  **正本の控えは `D:/Data/Projects/Next/bullcom/.env.local`**（GBP系はコメントで取得経緯も残っている）。
  GitHub Secrets は読み出せないため、新規リポジトリへはこのファイルから投入する。
  FB_PAGE_ID だけはファイルに無いが公開情報（1165513313302170）。
  GBP_REFRESH_TOKEN の期限切れ復旧手順は bullcom-security/PROGRESS.md の 2026-05-30 セクション参照
- 複数リポジトリで同じ8件を使うため、増えてきたら **GitHub Organization レベルの Secrets**
  に昇格させると投入作業が不要になる（bullcomoffice は org なので可能）
- bullcom-design での構築記録: PROGRESS.md の 2026-08-25 / 2026-08-26 セクション
- **IG_PAGE_ACCESS_TOKEN は60日期限**（出典: `D:\Data\Dropbox\AI\Claude\code\HP\PROGRESS.md` の
  今後の課題欄）。期限切れ時は再発行して**全リポジトリ**（bullcom-security / bullcom-design /
  新設分）の Secrets を更新する必要がある。リポジトリが増えるほど org Secrets 化の価値が上がる
