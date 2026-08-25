/**
 * post-to-instagram.cjs
 * microCMSの最新公開記事をInstagram + Facebookに画像付き自動投稿
 */

const https = require('https');
const { ensureEnvsOrSkip, fetchLatestArticle, skipIfStale, getPostText } = require('./lib/sns-common.cjs');

process.on('uncaughtException', (e) => {
  console.error('[IG/FB投稿] 予期せぬエラー:', e.message);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  console.error('[IG/FB投稿] 未処理のPromiseエラー:', e?.message || e);
  process.exit(1);
});

const requiredEnvs = [
  'MICROCMS_SERVICE_DOMAIN', 'MICROCMS_API_KEY',
  'IG_BUSINESS_ACCOUNT_ID', 'IG_PAGE_ACCESS_TOKEN',
  'FB_PAGE_ID', 'SITE_URL',
];
ensureEnvsOrSkip(requiredEnvs, '[IG/FB投稿]');

function igPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = https.request({
      hostname: 'graph.facebook.com',
      path: `/v25.0/${endpoint}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) },
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on('error', reject); req.write(bodyStr); req.end();
  });
}

function waitForContainer(containerId, token) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 36; // 5秒 × 36回 = 約3分
    const check = () => {
      attempts++;
      https.get(`https://graph.facebook.com/v25.0/${containerId}?fields=status_code,status&access_token=${token}`, (res) => {
        let data = '';
        res.on('data', (c) => data += c);
        res.on('end', () => {
          let d;
          try { d = JSON.parse(data); }
          catch (e) {
            console.log(`[IG投稿] JSON parse失敗 (attempt ${attempts}): ${data.slice(0, 300)}`);
            if (attempts >= MAX_ATTEMPTS) return reject(new Error('parse error'));
            return setTimeout(check, 5000);
          }
          if (d.status_code === 'FINISHED') return resolve();
          if (d.status_code === 'ERROR' || d.status_code === 'EXPIRED') return reject(new Error(d.status_code));
          // subcode 33 = container がまだ Graph API 側で認識されていない → retry
          const isTransientAuthError = d.error && d.error.code === 100 && d.error.error_subcode === 33;
          if (d.error && !isTransientAuthError) return reject(new Error(`API error: ${d.error.message || JSON.stringify(d.error)}`));
          if (attempts >= MAX_ATTEMPTS) {
            return reject(new Error(`timeout after ${attempts} attempts (last: ${d.status_code || (d.error && d.error.message) || 'undefined'})`));
          }
          if (attempts % 6 === 0 || attempts === 1) {
            console.log(`[IG投稿] 画像処理待ち (${attempts * 5}秒経過, status: ${d.status_code || (d.error && d.error.message) || 'pending'})`);
          }
          setTimeout(check, 5000);
        });
      }).on('error', reject);
    };
    setTimeout(check, 15000); // 初回wait 15秒（container作成直後のGraph API認識遅延対策）
  });
}

function generateHashtags(title) {
  const tags = (process.env.SNS_HASHTAGS_IG || process.env.SNS_HASHTAGS || '#BULLCOM #パソコン修理 #神戸 #明石 #PC修理').split(' ');
  return tags.slice(0, 8).join(' ');
}

async function main() {
  try {
    const article = await fetchLatestArticle('id,title,slug,publishedAt,eyecatch');
    console.log(`[IG/FB投稿] 最新記事: ${article.title} (ID: ${article.id})`);

    const max = Number(process.env.SNS_POST_MAX_MINUTES || 60);
    skipIfStale(article, max, '[IG/FB投稿]');

    const articleUrl = `${process.env.SITE_URL}/blog/${article.slug || article.id}`;
    // コミット済みサムネを優先（eyecatchの0バイト不調に強い）。無い時のみ eyecatch。
    const imageUrl = (process.env.SITE_URL ? `${process.env.SITE_URL}/blog-thumbnails/${article.id}.jpg` : null) || article.eyecatch?.url;

    const igId = process.env.IG_BUSINESS_ACCOUNT_ID;
    const fbId = process.env.FB_PAGE_ID;
    const token = process.env.IG_PAGE_ACCESS_TOKEN;

    // カスタム投稿テキスト（md由来）があれば使用、なければデフォルト
    const postText = getPostText(article.id);
    const defaultHashtags = generateHashtags(article.title);

    // ===== Instagram =====
    try {
      console.log(`[IG投稿] 画像URL: ${imageUrl}`);
      const igCaption = postText
        ? `${postText.body}\n\n記事はこちら→プロフィールのリンクから\n🔗 ${articleUrl}\n\n${postText.hashtags}`
        : `【新着記事】${article.title}\n\n記事はこちら→プロフィールのリンクから\n🔗 ${articleUrl}\n\n${defaultHashtags}`;
      if (postText) console.log('[IG投稿] カスタムテキスト使用');
      else console.log('[IG投稿] デフォルトテキスト使用');
      const container = await igPost(`${igId}/media`, {
        image_url: imageUrl, caption: igCaption, access_token: token,
      });
      if (!container.id) throw new Error(`IG container失敗: ${JSON.stringify(container)}`);
      console.log(`[IG投稿] コンテナID: ${container.id}`);

      // status_code 取得が常時 Authorization Error を返すため、
      // status check は省略して固定時間待機 → publish 試行する方式に変更
      console.log('[IG投稿] 60秒待機 (画像処理時間確保)...');
      await new Promise(r => setTimeout(r, 60000));

      console.log('[IG投稿] publish 試行...');
      let igResult = await igPost(`${igId}/media_publish`, { creation_id: container.id, access_token: token });
      // まだ処理中なら追加で30秒待ってリトライ
      if (!igResult.id && igResult.error) {
        console.log(`[IG投稿] publish失敗、30秒後にリトライ: ${JSON.stringify(igResult.error)}`);
        await new Promise(r => setTimeout(r, 30000));
        igResult = await igPost(`${igId}/media_publish`, { creation_id: container.id, access_token: token });
      }
      if (!igResult.id) throw new Error(`IG公開失敗: ${JSON.stringify(igResult)}`);
      console.log(`[IG投稿] 投稿成功! Post ID: ${igResult.id}`);
    } catch (e) {
      console.error('[IG投稿] エラー:', e.message);
      // IG失敗してもFBは続行
    }

    // ===== Facebook =====
    if (process.env.IG_ONLY === '1') {
      console.log('[FB投稿] IG_ONLY=1 のためFBスキップ');
    } else {
      try {
        const fbMessage = postText
          ? `${postText.body}\n\n${articleUrl}\n\n${postText.hashtags}`
          : `【新着記事】${article.title}\n\n${articleUrl}\n\n${defaultHashtags}`;
        console.log('[FB投稿] Facebookページに投稿中...');
        const fbResult = await igPost(`${fbId}/photos`, {
          url: imageUrl, message: fbMessage, access_token: token,
        });
        if (fbResult.id) {
          console.log(`[FB投稿] 投稿成功! Post ID: ${fbResult.id}`);
        } else {
          console.log(`[FB投稿] 投稿失敗: ${JSON.stringify(fbResult)}`);
        }
      } catch (e) {
        console.error('[FB投稿] エラー:', e.message);
      }
    }
  } catch (e) {
    console.error('[IG/FB投稿] エラー:', e.message);
    process.exit(1);
  }
}

main();
