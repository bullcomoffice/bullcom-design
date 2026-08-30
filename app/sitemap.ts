import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/microcms";
import { SERVICES, SITE_URL } from "@/lib/site-data";

// output: "export" では明示が要る（無いと "not configured on route" でビルドが落ちる）
export const dynamic = "force-static";

// 対策台帳 A-2。ビルド時に静的な sitemap.xml を出力する（output: "export"）。
// ⚠️ このサイトの正規形は **末尾スラッシュ無し**。ルートも `https://bullcom.website` で終わる。
//    末尾スラッシュを付けると worker.js の正規化（A-1）と食い違い、sitemap 内の全URLが301になる。
//    姉妹サイト bullcom.net は末尾スラッシュ有りが正規形なので、あちらから流用しないこと。

type Entry = MetadataRoute.Sitemap[number];

const page = (path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry => ({
  url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  lastModified: new Date(),
  changeFrequency,
  priority,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    page("/", 1.0, "weekly"),
    page("/services", 0.9, "monthly"),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.8, "monthly")),
    page("/price", 0.9, "monthly"),
    page("/works", 0.8, "monthly"),
    page("/blog", 0.8, "weekly"),
    page("/faq", 0.7, "monthly"),
    page("/about", 0.6, "yearly"),
    page("/contact", 0.7, "yearly"),
    page("/privacy", 0.3, "yearly"),
  ];

  // microCMS 未設定・取得失敗でもビルドを止めない（静的ページだけの sitemap になる）
  let posts: MetadataRoute.Sitemap = [];
  try {
    const { contents } = await getBlogs(100);
    posts = contents.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.id}`,
      lastModified: new Date(blog.revisedAt ?? blog.updatedAt ?? blog.publishedAt ?? Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    posts = [];
  }

  return [...staticPages, ...posts];
}
