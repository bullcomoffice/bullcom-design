// ブログカード表示用の共通定義（一覧 / 詳細で共用）
//
// キーは microCMS の categories と一致させること（2026-08-24 に4分類で作成）。
// 値はカテゴリバッジの背景色。白の太字12pxを載せるので、
// ブランド色（--pink/--purple/--blue/--cyan）をそのまま使うと 3.2〜3.5:1 で
// WCAG AA(4.5:1) に届かない。同じ色相のまま暗くして 4.8:1 に揃えてある。
export const catColors: Record<string, string> = {
  "費用と依頼": "#db1374", // --pink 系 / 白文字 4.82:1
  "デザイン": "#8846ff", // --purple 系 / 白文字 4.81:1
  "運用・保守": "#1366ff", // --blue 系 / 白文字 4.80:1
  "つくりの話": "#077c95", // --cyan 系 / 白文字 4.85:1
};

// 未定義カテゴリ（microCMSテンプレ初期値の チュートリアル/テクノロジー/更新情報 など）用
export const defaultCatColor = "#8846ff";

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
};
