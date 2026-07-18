import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk";

// カテゴリの型定義
export type Category = MicroCMSListContent & {
  name: string;
};

// ブログ記事の型定義（microCMSブログテンプレートに合わせた構造・bullcom本家と同じ）
export type Blog = MicroCMSListContent & {
  title: string;
  content: string;          // リッチテキスト（HTML）
  eyecatch?: MicroCMSImage; // アイキャッチ画像
  category?: Category;      // カテゴリ（リレーション）
};
