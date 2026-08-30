// 対策台帳 A-6。microCMS のリッチテキスト（HTML）から meta description 用の抜粋を作る。
//
// これが無かった頃は `description: blog.title` で、descriptionがタイトルと一字一句同じだった。
// 検索結果のスニペットがタイトルの繰り返しになり、クリックの動機を与えられない。

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(html: string): string {
  return html.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (body.startsWith("#")) {
      const code = body.startsWith("#x") || body.startsWith("#X")
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[body.toLowerCase()] ?? whole;
  });
}

/**
 * リッチテキストから指定文字数の抜粋を作る。
 * @param html microCMS の content（HTML文字列）
 * @param max  最大文字数。既定110字は、Googleのスニペット表示（日本語で約120字）に収まる長さ
 */
export function excerpt(html: string | undefined | null, max = 110): string {
  if (!html) return "";
  const text = decodeEntities(
    html
      // script/style の中身は本文ではない
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      // ブロック要素の境目は空白にしないと単語が繋がる
      .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= max) return text;
  // 文の途中でぶつ切りにせず、句点があればそこで切る
  const head = text.slice(0, max);
  const lastPeriod = Math.max(head.lastIndexOf("。"), head.lastIndexOf("．"));
  if (lastPeriod >= max * 0.6) return head.slice(0, lastPeriod + 1);
  return `${head}…`;
}
