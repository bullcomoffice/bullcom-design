/**
 * post-to-gbp.cjs
 * microCMSの最新公開記事を Google Business Profile (localPosts) に自動投稿
 * X / Instagram と同じく GitHub Actions sns-post.yml から呼ばれる想定
 *
 * 実行: node scripts/post-to-gbp.cjs
 *
 * API: My Business v4 localPosts
 *   POST https://mybusiness.googleapis.com/v4/{accountId}/locations/{locationId}/localPosts
 */

const { URLSearchParams } = require('url');
const { loadEnvLocal, ensureEnvsOrSkip, fetchLatestArticle, skipIfStale,
        getPostText, httpsPostJson, httpsPostForm } = require('./lib/sns-common.cjs');

// .env.local を手動読み込み（dotenv不要・gbpのみの従来挙動）
loadEnvLocal();

// 予期せぬエラーでもデプロイ継続
process.on('uncaughtException', (e) => {
  console.error('[GBP投稿] 予期せぬエラー:', e.message);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  console.error('[GBP投稿] 未処理のPromiseエラー:', e?.message || e);
  process.exit(1);
});

// 環境変数チェック
const requiredEnvs = [
  'MICROCMS_SERVICE_DOMAIN',
  'MICROCMS_API_KEY',
  'GBP_CLIENT_ID',
  'GBP_CLIENT_SECRET',
  'GBP_REFRESH_TOKEN',
  'GBP_ACCOUNT_ID',     // e.g. accounts/102979805946920121413
  'GBP_LOCATION_ID',    // e.g. locations/17165689984747186215
];
ensureEnvsOrSkip(requiredEnvs, '[GBP投稿]');

// ===== ヘルパー関数 =====

// 投稿済みID（重複投稿防止）
function getLastPostedId() {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '.last-posted-gbp-id');
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
  } catch {}
  return null;
}

function saveLastPostedId(id) {
  try {
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.join(__dirname, '.last-posted-gbp-id'), id, 'utf8');
  } catch {}
}

// アクセストークン取得（リフレッシュトークンから）
async function getAccessToken() {
  const res = await httpsPostForm(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID,
      client_secret: process.env.GBP_CLIENT_SECRET,
      refresh_token: process.env.GBP_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    })
  );
  if (res.status !== 200 || !res.body.access_token) {
    throw new Error(`アクセストークン取得失敗 (${res.status}): ${JSON.stringify(res.body)}`);
  }
  return res.body.access_token;
}

// 投稿本文（GBP の summary は最大 1500 文字）
function buildSummary(article) {
  const siteUrl = process.env.SITE_URL || 'https://bullcom.net';
  const url = `${siteUrl}/blog/${article.id}`;
  const postText = getPostText(article.id);
  if (postText) {
    console.log('[GBP投稿] カスタムテキスト使用');
    return `${postText.body}\n\n詳細はこちら → ${url}`;
  }
  // デフォルト
  const desc = article.description ? `\n\n${article.description.slice(0, 200)}` : '';
  return `【新着記事】${article.title}${desc}\n\n詳細はこちら → ${url}`;
}

async function main() {
  console.log('[GBP投稿] 最新記事を取得中...');
  const article = await fetchLatestArticle('id,title,publishedAt,eyecatch,description');
  console.log(`[GBP投稿] 最新記事: ${article.title} (ID: ${article.id})`);

  // 重複投稿チェック
  const lastId = getLastPostedId();
  if (lastId === article.id) {
    console.log(`[GBP投稿] 既に投稿済み (ID: ${article.id}) のためスキップします`);
    process.exit(0);
  }

  // 公開時間チェック（公開から上限分以内のみ投稿。'0'の解釈が異なるため従来式を維持）
  const maxMinutes = process.env.SNS_POST_MAX_MINUTES
    ? Number(process.env.SNS_POST_MAX_MINUTES)
    : 60;
  skipIfStale(article, maxMinutes, '[GBP投稿]');

  // アクセストークン取得
  console.log('[GBP投稿] アクセストークン取得中...');
  const accessToken = await getAccessToken();
  console.log('[GBP投稿] ✅ access_token 取得');

  // 投稿リクエスト組み立て
  const summary = buildSummary(article);
  console.log(`[GBP投稿] 投稿本文 (${summary.length}文字):\n${summary}`);

  const siteUrl = process.env.SITE_URL || 'https://bullcom.net';
  const articleUrl = `${siteUrl}/blog/${article.id}`;
  // コミット済みサムネを使用（eyecatchの0バイト不調に強い）。全記事分コミット済みが運用前提。
  const imageUrl = `${siteUrl}/blog-thumbnails/${article.id}.jpg`;

  const postBody = {
    languageCode: 'ja',
    summary,
    callToAction: {
      actionType: 'LEARN_MORE',
      url: articleUrl,
    },
    topicType: 'STANDARD',
  };

  postBody.media = [{
    mediaFormat: 'PHOTO',
    sourceUrl: imageUrl,
  }];
  console.log(`[GBP投稿] アイキャッチ画像: ${imageUrl}`);

  // localPosts API 呼び出し
  // GBP_ACCOUNT_ID / LOCATION_ID は "accounts/123/" 形式想定（先頭スラッシュ無し）
  const accountPath = process.env.GBP_ACCOUNT_ID.replace(/^\/+|\/+$/g, '');
  const locationPath = process.env.GBP_LOCATION_ID.replace(/^\/+|\/+$/g, '');
  const apiUrl = `https://mybusiness.googleapis.com/v4/${accountPath}/${locationPath}/localPosts`;

  console.log(`[GBP投稿] POST ${apiUrl}`);
  const res = await httpsPostJson(
    apiUrl,
    { Authorization: `Bearer ${accessToken}` },
    postBody
  );

  if (res.status !== 200) {
    console.error(`[GBP投稿] ❌ 投稿失敗 (HTTP ${res.status})`);
    console.error(JSON.stringify(res.body, null, 2));
    process.exit(1);
  }

  console.log(`[GBP投稿] ✅ 投稿成功!`);
  console.log(`Post name: ${res.body.name}`);
  console.log(`createTime: ${res.body.createTime}`);
  console.log(`searchUrl: ${res.body.searchUrl || '(N/A)'}`);

  saveLastPostedId(article.id);
}

main().catch((e) => {
  console.error('[GBP投稿] エラー:', e.message);
  process.exit(1);
});
