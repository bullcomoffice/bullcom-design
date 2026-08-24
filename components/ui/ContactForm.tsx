"use client";

import { useEffect, useRef, useState } from "react";

// 送信は自前の Cloudflare Worker（/api/contact-submit）→ Resend API。
// worker.js の handleContactSubmit と対。添付があるためネイティブ送信（AJAX不可）。
// 送信後は _redirect のパスへ302で戻り、?sent=1 で完了表示に切り替わる。
const ACTION = "/api/contact-submit";

const CATEGORIES = [
  "HP新規制作",
  "HPリニューアル",
  "LP制作",
  "EC構築",
  "ロゴ・グラフィック制作",
  "ブランディング",
  "保守・サイト診断（他社制作もOK）",
  "その他",
];

// worker.js の URL_PATTERN と同じ。サーバー側が本体の防御で、これは即時フィードバック用
const URL_RE =
  /https?:\/\/|www\.\S|\b[a-z0-9][a-z0-9-]{1,61}\.(com|net|org|jp|io|co|info|biz|xyz|shop|site|online|club|top|vip|link|click|live|store|me|tv|cc|ru|cn)\b/i;

// 画像圧縮: 600KB未満や非画像はそのまま。最大1600px・JPEG品質0.8
function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    if (!/^image\//.test(file.type) || file.size < 600 * 1024) {
      resolve(file);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(
            blob && blob.size < file.size
              ? new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
                  type: "image/jpeg",
                })
              : file
          );
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export default function ContactForm() {
  const boxRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // 送信後リダイレクト(?sent=1)で完了表示
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("sent") !== "1") return;
    const t = setTimeout(() => {
      setSent(true);
      history.replaceState(null, "", window.location.pathname + "#contact-form");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => {
      boxRef.current?.scrollIntoView({ block: "center" });
    }, 150);
    return () => clearTimeout(t);
  }, [sent]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form || sending) return;
    setError("");

    // URL混入チェック（圧縮より前に実施して無駄な処理を避ける）
    const message = form.querySelector<HTMLTextAreaElement>('textarea[name="ご相談の詳細"]');
    if (message && URL_RE.test(message.value)) {
      setError("ご相談の詳細にURLは含めないでください。お手数ですがURLを外して送信してください。");
      message.focus();
      return;
    }

    setSending(true);
    try {
      // 送信後の戻り先（現在のドメインに自動追従）
      const next = form.querySelector<HTMLInputElement>('input[name="_redirect"]');
      if (next) next.value = `${location.pathname}?sent=1`;

      // 再送信対策: 前回展開した余剰 input を掃除
      form.querySelectorAll('input[data-extra-photo="1"]').forEach((n) => n.remove());

      const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]'));
      await Promise.all(
        inputs.map(async (inp) => {
          const files = inp.files ? Array.from(inp.files) : [];
          if (!files.length) return;
          const compressed = await Promise.all(files.map(compressImage));
          // 1枚目は元のinputへ、2枚目以降は別name（添付2, 添付3…）のhidden inputへ
          const baseName = inp.name || "添付";
          const first = new DataTransfer();
          first.items.add(compressed[0]);
          inp.files = first.files;
          for (let i = 1; i < compressed.length; i++) {
            const extra = document.createElement("input");
            extra.type = "file";
            extra.name = `${baseName}${i + 1}`;
            extra.dataset.extraPhoto = "1";
            extra.style.display = "none";
            const dt = new DataTransfer();
            dt.items.add(compressed[i]);
            extra.files = dt.files;
            form.appendChild(extra);
          }
        })
      );

      form.submit(); // ネイティブ送信（添付はこの方式でないと届かない）
    } catch {
      setError("送信に失敗しました。お手数ですがお電話（078-912-2656）またはLINEでご連絡ください。");
      setSending(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--pink)]";
  const labelCls = "mb-1.5 block text-xs font-bold text-[var(--text-soft)]";

  if (sent) {
    return (
      <div ref={boxRef} id="contact-form" className="grad-border p-10 text-center">
        <p className="text-4xl">🎉</p>
        <h3 className="font-head mt-4 text-xl font-bold">送信ありがとうございました！</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
          内容を確認のうえ、順次ご連絡いたします。
          <br />
          確認メールをお送りしていますので、あわせてご確認ください。
          <br />
          お急ぎの場合はお電話（078-912-2656）が確実です。
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      id="contact-form"
      action={ACTION}
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-7 sm:p-9"
    >
      <input type="hidden" name="_subject" value="【BULLCOM design】お問い合わせ" />
      <input type="hidden" name="_redirect" value="/contact?sent=1" />
      <input
        type="text"
        name="_honey"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cf-name">
            お名前 <span className="text-[var(--pink)]">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            name="お名前"
            required
            placeholder="山田 太郎"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-company">
            会社名・屋号
          </label>
          <input
            id="cf-company"
            type="text"
            name="会社名"
            placeholder="株式会社サンプル"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-email">
            メールアドレス <span className="text-[var(--pink)]">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            required
            placeholder="example@email.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-phone">
            電話番号
          </label>
          <input
            id="cf-phone"
            type="tel"
            name="電話番号"
            pattern="0[0-9\-]*"
            title="電話番号は「0」から始まる形式でご入力ください"
            placeholder="078-000-0000"
            className={inputCls}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelCls} htmlFor="cf-category">
          ご相談内容
        </label>
        <select id="cf-category" name="ご相談内容" className={`${inputCls} cursor-pointer`}>
          <option value="">選択してください</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className={labelCls} htmlFor="cf-message">
          ご相談の詳細 <span className="text-[var(--pink)]">*</span>
        </label>
        <textarea
          id="cf-message"
          name="ご相談の詳細"
          required
          rows={6}
          placeholder="例）10年前に作ったホームページをリニューアルしたい。予算は○○万円くらいで考えています。"
          className={`${inputCls} resize-y`}
        />
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">
          ※迷惑メール対策のため、URLを含む送信はお受けできません
        </p>
      </div>

      <div className="mt-5">
        <label className={labelCls} htmlFor="cf-files">
          参考資料・スクリーンショット（任意・複数OK）
        </label>
        <input
          id="cf-files"
          type="file"
          name="添付"
          accept="image/*"
          multiple
          className="block w-full cursor-pointer text-sm text-[var(--text-soft)] file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--surface-strong)] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[var(--text)]"
        />
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">
          画像は送信前に自動で圧縮されます（現在のサイトのスクショなど歓迎です）
        </p>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="btn btn-grad mt-7 w-full px-6 py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "送信中..." : "この内容で送信する"}
      </button>

      {error && (
        <p className="mt-4 rounded-xl border border-[#f3b5c8] bg-[#fff1f6] px-4 py-3 text-center text-sm text-[#b3214e]">
          {error}
        </p>
      )}
    </form>
  );
}
