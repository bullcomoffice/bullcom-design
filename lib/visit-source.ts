/**
 * お問い合わせが「どのページから来た人か」を、フォームの送信内容に載せるための記録。
 *
 * bullcom.org（2026-10-24）の仕組みを横展開。最初に開いたページ（検索などから着地したページ）・
 * 流入元のサイト・フォームの直前に見ていたページを sessionStorage に残し、
 * お問い合わせフォームの隠し項目としてメール本文（worker.js の表）に入れる。
 * タブを閉じれば消える。サーバーや Cookie には何も残さない。
 *
 * ⚠️ このサイトの正規形は末尾スラッシュ**無し**（bullcom.org は有り）なので、パスはスラッシュを落としてそろえる。
 */

const STORAGE_KEY = "bullcom_visit_source";

export type VisitSource = {
  /** セッションで最初に開いたページ */
  landing: string;
  /** 最初のページに来る前のサイト（検索エンジンなど）。直接来た場合は空 */
  referrer: string;
  /** お問い合わせページ以外で最後に見たページ */
  last: string;
};

/** フォームの直前ページとして数えないページ（完了表示も /contact?sent=1 なので同じパス） */
const SKIP_PATHS = ["/contact"];

function normalize(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function read(): VisitSource | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VisitSource) : null;
  } catch {
    return null;
  }
}

function referrerHost(): string {
  try {
    if (!document.referrer) return "";
    const host = new URL(document.referrer).hostname;
    return host === window.location.hostname ? "" : host;
  } catch {
    return "";
  }
}

/** ページを開くたびに呼ぶ */
export function recordPageView(pathname: string) {
  const path = normalize(pathname);
  const current = read() ?? { landing: path, referrer: referrerHost(), last: "" };
  if (!SKIP_PATHS.includes(path)) current.last = path;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // プライベートブラウズ等で使えない場合は記録しない
  }
}

/** フォームに載せる値。記録が無ければ null */
export function readVisitSource(): VisitSource | null {
  return read();
}
