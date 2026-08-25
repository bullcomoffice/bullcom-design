/**
 * sns-common.cjs — SNS投稿スクリプト共通処理
 * post-to-x / post-to-instagram / post-to-gbp から使う。
 * 各関数は元スクリプトからの忠実な移植（挙動を変えない）。
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

/** .env.local を手動読み込み（旧 post-to-gbp.cjs の移植。呼んだスクリプトだけ有効） */
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '..', '.env.local');
  try {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

/** 必須envが欠けていたらログを出して exit 0（3スクリプト共通パターンの移植） */
function ensureEnvsOrSkip(requiredEnvs, logTag) {
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      console.log(`${logTag} ${env} が未設定のためスキップ`);
      process.exit(0);
    }
  }
}

/**
 * microCMSから最新公開記事を1件取得。
 * fields はスクリプトごとに異なる（gbpのみ description を要求）ため引数化。
 * エラー文言は旧 post-to-gbp.cjs 系（status付き）に統一。
 * x/ig の旧実装との差はエラーメッセージ文字列のみで、exitコードへの影響はない。
 */
function fetchLatestArticle(fields) {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  const url = `https://${domain}.microcms.io/api/v1/blogs?limit=1&orders=-publishedAt&fields=${fields}`;
  return httpsGetJson(url, { 'X-MICROCMS-API-KEY': apiKey }).then((res) => {
    if (res.status !== 200 || !res.body.contents?.length) {
      throw new Error(`microCMS取得失敗: ${res.status}`);
    }
    return res.body.contents[0];
  });
}

/**
 * 公開からの経過分数が上限を超えていたらログを出して exit 0。
 * maxMinutes の算出（SNS_POST_MAX_MINUTES の解釈）はスクリプトごとに
 * 従来式が異なるため、呼び出し側で算出して渡す。
 */
function skipIfStale(article, maxMinutes, logTag) {
  const publishedAt = new Date(article.publishedAt);
  const minutes = (Date.now() - publishedAt) / 60000;
  console.log(`${logTag} 公開からの経過時間: ${Math.round(minutes)}分 (上限: ${maxMinutes}分)`);
  if (minutes > maxMinutes) {
    console.log(`${logTag} 上限超過のためスキップ`);
    process.exit(0);
  }
}

/** sns-post-texts.json からカスタム投稿テキストを取得（なければnull） */
function getPostText(id) {
  try {
    const jsonPath = path.join(__dirname, '..', 'sns-post-texts.json');
    if (!fs.existsSync(jsonPath)) return null;
    const texts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    return texts[id] || null;
  } catch { return null; }
}

// ===== HTTPヘルパー（旧 post-to-gbp.cjs 56-133行の移植・実装同一） =====

function httpsGetJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

function httpsPostJson(url, headers, bodyObj) {
  const body = JSON.stringify(bodyObj);
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsPostForm(url, body) {
  return new Promise((resolve, reject) => {
    const data = body.toString();
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(buf) });
          } catch {
            resolve({ status: res.statusCode, body: buf });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = {
  loadEnvLocal, ensureEnvsOrSkip, fetchLatestArticle, skipIfStale,
  getPostText, httpsGetJson, httpsPostJson, httpsPostForm,
};
