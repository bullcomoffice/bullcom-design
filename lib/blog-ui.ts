// ブログカード表示用の共通定義（一覧 / 詳細で共用）
export const catColors: Record<string, string> = {
  "お知らせ": "#f0509e",
  "制作事例": "#a06bff",
  "デザイン": "#4f8dff",
  "SEO": "#38d4f5",
  "セキュリティ": "#ffab4a",
  "ノウハウ": "#b8e34d",
};

export const defaultCatColor = "#a06bff";

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
};
