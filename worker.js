/**
 * BULLCOM design — Cloudflare Worker
 *
 * 静的アセット（out/）の配信に加えて、お問い合わせフォームの送信を受け取り
 * Resend API でメールを送る。worker-contact-form skill のテンプレートを基に構築。
 *
 * 必要な Secret: RESEND_API_KEY
 *   printf '%s' '<APIキー>' | npx wrangler secret put RESEND_API_KEY
 */

/* ---------- 汎用ヘルパー ---------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function html(body, status, headers) {
  return new Response(body, {
    status: status || 200,
    headers: Object.assign({ "Content-Type": "text/html; charset=utf-8" }, headers || {}),
  });
}

/* ---------- サイト固有設定 ---------- */
const SITE_NAME = "BULLCOM design";
// 通知の宛先。2件とも同じ本文が届く（2026-08-29 に bullcom.office@ から bullcom.contact@ へ変更）
// [0] はお客様宛の確認メールの reply_to にも使われるので、先頭は独自ドメインのままにすること
const CONTACT_TO = ["contact@bullcom.website", "bullcom.contact@gmail.com"];
const CONTACT_CC = [];
// Resend で検証した送信専用サブドメイン（root の既存MXには触れない）
const CONTACT_FROM = "BULLCOM design <noreply@send.bullcom.website>";

// スパムチェックの対象（components/ui/ContactForm.tsx の name 属性に合わせる）
const PHONE_FIELD = "電話番号";
const MESSAGE_FIELD = "ご相談の詳細";
const EMAIL_FIELD = "email";
const NAME_FIELD = "お名前";

const URL_PATTERN =
  /https?:\/\/|www\.\S|\b[a-z0-9][a-z0-9-]{1,61}\.(com|net|org|jp|io|co|info|biz|xyz|shop|site|online|club|top|vip|link|click|live|store|me|tv|cc|ru|cn)\b/i;

// 正規のフォームが必ず含むフィールド名。機械的なPOSTを弾く
const KNOWN_FIELDS = new Set([
  "お名前",
  "会社名",
  "email",
  "電話番号",
  "ご相談内容",
  "ご相談の詳細",
  "添付",
]);

/* ---------- お客様宛の自動確認メール ---------- */
function customerConfirmationHtml(name) {
  const nameLine = name ? `${esc(name)} 様` : "お客様";
  return (
    '<div style="font-family:sans-serif;font-size:15px;line-height:1.9;color:#24223a">' +
    `<p>${nameLine}</p>` +
    "<p>この度は BULLCOM design にお問い合わせいただき、誠にありがとうございます。<br>" +
    "以下の内容でお預かりしました。担当者より順次ご連絡いたします。</p>" +
    '<p style="margin-top:20px">お急ぎの場合は、お電話（078-912-2656／受付 9:00〜19:00）でも承ります。</p>' +
    '<p style="margin-top:28px;padding-top:14px;border-top:1px solid #e5e2f0;font-size:13px;line-height:1.8;color:#5f5c78">' +
    "BULLCOM design（ブルコムデザイン）<br>" +
    "〒651-2113 兵庫県神戸市西区伊川谷町有瀬846-10 ギャラリエ1F<br>" +
    "TEL 078-912-2656 / MAIL contact@bullcom.website<br>" +
    "https://bullcom.website</p>" +
    '<p style="margin-top:20px;font-size:12px;color:#6f6b87">' +
    "※本メールは自動送信されています。お心当たりがない場合は破棄してください。</p>" +
    "</div>"
  );
}

/* ---------- 汎用ロジック ---------- */
function safeRedirectPath(p) {
  return typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? p : "/";
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function contactErrorPage(message) {
  return html(
    '<!doctype html><html lang="ja"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      "<title>送信エラー｜BULLCOM design</title></head>" +
      '<body style="font-family:sans-serif;max-width:560px;margin:60px auto;padding:0 20px;line-height:1.9;color:#24223a">' +
      '<h1 style="font-size:20px">送信できませんでした</h1>' +
      `<p>${esc(message)}</p>` +
      '<p style="margin-top:24px">お急ぎの場合は、お電話（<a href="tel:078-912-2656">078-912-2656</a>）でも承ります。</p>' +
      '<p><a href="/contact">お問い合わせページへ戻る</a></p></body></html>',
    400
  );
}

async function handleContactSubmit(request, env) {
  const form = await request.formData();
  const redirect = safeRedirectPath((form.get("_redirect") || "").toString());
  const redirectUrl = new URL(redirect, request.url).toString();

  // ハニーポット：値が入っていれば送信せず成功したように見せる
  if ((form.get("_honey") || "").toString()) {
    return Response.redirect(redirectUrl, 302);
  }

  // フィールド名が文字化けしている送信（機械的送信の指紋）を拒否
  for (const key of form.keys()) {
    if (key.includes("?") || key.includes("�")) {
      return contactErrorPage(
        "送信内容を正しく読み取れませんでした。ブラウザを最新版にするか、時間をおいて再度お試しください。"
      );
    }
  }

  // 実フォームの語彙を含まない送信を拒否
  if (KNOWN_FIELDS.size) {
    const hasKnownField = [...form.keys()].some((k) => !k.startsWith("_") && KNOWN_FIELDS.has(k));
    if (!hasKnownField) {
      return contactErrorPage(
        "送信内容を正しく読み取れませんでした。ブラウザを最新版にするか、時間をおいて再度お試しください。"
      );
    }
  }

  const rows = [];
  const arrays = {};
  const attachments = [];
  let hasValue = false;

  for (const [key, value] of form.entries()) {
    if (key.startsWith("_")) continue;
    if (value && typeof value === "object" && typeof value.arrayBuffer === "function") {
      if (!value.size || value.size > 8 * 1024 * 1024) continue;
      attachments.push({
        filename: value.name || "file",
        content: arrayBufferToBase64(await value.arrayBuffer()),
      });
      continue;
    }
    const v = value.toString().trim();
    if (!v) continue;
    hasValue = true;
    if (key.endsWith("[]")) {
      const base = key.slice(0, -2);
      (arrays[base] = arrays[base] || []).push(v);
    } else {
      rows.push([key, v]);
    }
  }
  for (const [k, vals] of Object.entries(arrays)) rows.push([k, vals.join("、")]);

  if (!hasValue) return contactErrorPage("入力内容が空です。もう一度お試しください。");

  // 電話番号は入力があれば「0」始まりのみ許可（海外ボット対策）
  if (PHONE_FIELD) {
    const phoneDigits = (form.get(PHONE_FIELD) || "").toString().replace(/[^0-9]/g, "");
    if (phoneDigits && !phoneDigits.startsWith("0")) {
      return contactErrorPage("電話番号は「0」から始まる形式でご入力ください。");
    }
  }

  // 本文へのURL混入を拒否（SEOスパム対策）
  if (MESSAGE_FIELD) {
    const message = (form.get(MESSAGE_FIELD) || "").toString();
    if (URL_PATTERN.test(message)) {
      return contactErrorPage(
        "お問い合わせ内容にURLを含めることはできません。お手数ですがURLを外して送信してください。"
      );
    }
  }

  const subject =
    (form.get("_subject") || "").toString() || `【${SITE_NAME}】お問い合わせ`;
  const replyTo = EMAIL_FIELD ? (form.get(EMAIL_FIELD) || "").toString().trim() : "";
  const customerName = (form.get(NAME_FIELD) || "").toString().trim();

  const tableHtml =
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="border:1px solid #ddd;background:#f7f5ff;white-space:nowrap;vertical-align:top;font-weight:bold">${esc(
            k
          )}</td>` +
          `<td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`
      )
      .join("") +
    "</table>";

  const payload = { from: CONTACT_FROM, to: CONTACT_TO, subject, html: tableHtml };
  if (CONTACT_CC.length) payload.cc = CONTACT_CC;
  if (replyTo) payload.reply_to = replyTo;
  if (attachments.length) payload.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // 失敗理由が本番で一切見えず原因究明できなかったため記録する（`npx wrangler tail` で読む）
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return contactErrorPage(
      "送信に失敗しました。お手数ですが、お電話またはLINEでご連絡ください。"
    );
  }

  // お客様宛の確認メール（失敗しても通知は送信済みなので握りつぶす）
  if (replyTo) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM,
          to: [replyTo],
          reply_to: CONTACT_TO[0],
          subject: `【${SITE_NAME}】お問い合わせありがとうございます`,
          html: customerConfirmationHtml(customerName),
        }),
      });
    } catch {
      /* 確認メールの失敗は本体の送信に影響させない */
    }
  }

  return Response.redirect(redirectUrl, 302);
}

const handler = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact-submit" && request.method === "POST") {
      return await handleContactSubmit(request, env);
    }
    // それ以外は静的アセットを返す
    return env.ASSETS.fetch(request);
  },
};

export default handler;
