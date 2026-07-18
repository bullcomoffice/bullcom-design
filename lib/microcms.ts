import { createClient } from "microcms-js-sdk";
import type { Blog, Category } from "@/types/blog";

// microCMS 未セットアップでもビルドが通るよう、環境変数がない場合は空データを返す
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

export const cmsReady = Boolean(serviceDomain && apiKey);

const client = cmsReady
  ? createClient({ serviceDomain: serviceDomain as string, apiKey: apiKey as string })
  : null;

type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const emptyList = <T,>(limit = 10): ListResponse<T> => ({
  contents: [],
  totalCount: 0,
  offset: 0,
  limit,
});

// ブログ記事一覧を取得
export const getBlogs = async (limit = 10, offset = 0): Promise<ListResponse<Blog>> => {
  if (!client) return emptyList<Blog>(limit);
  return client.getList<Blog>({
    endpoint: "blogs",
    queries: { limit, offset, orders: "-publishedAt" },
  });
};

// ブログ記事をID指定で取得（microCMSのコンテンツID）
export const getBlogById = async (id: string): Promise<Blog | null> => {
  if (!client) return null;
  return client.get<Blog>({ endpoint: "blogs", contentId: id });
};

// カテゴリ一覧を取得
export const getCategories = async (): Promise<ListResponse<Category>> => {
  if (!client) return emptyList<Category>(100);
  return client.getList<Category>({ endpoint: "categories", queries: { limit: 100 } });
};

// トップページ用：最新記事を指定件数取得
export const getLatestBlogs = async (limit = 5): Promise<ListResponse<Blog>> => {
  if (!client) return emptyList<Blog>(limit);
  return client.getList<Blog>({
    endpoint: "blogs",
    queries: { limit, orders: "-publishedAt", fields: "id,title,eyecatch,publishedAt,category" },
  });
};
