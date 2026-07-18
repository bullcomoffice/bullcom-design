import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogById, getBlogs } from "@/lib/microcms";
import { catColors, defaultCatColor, formatDate } from "@/lib/blog-ui";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { contents } = await getBlogs(100);
  // output: export は動的ルートに1件以上のパスが必須。
  // microCMS 未設定・記事0件の間はプレースホルダー（準備中ページ）を生成する
  if (contents.length === 0) return [{ slug: "preparing" }];
  return contents.map((blog) => ({ slug: blog.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogById(slug);
  if (!blog) return { title: "ブログ" };
  const ogImage = blog.eyecatch?.url;
  return {
    title: blog.title,
    description: blog.title,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      url: `https://bullcom.website/blog/${slug}`,
      siteName: "BULLCOM design",
      locale: "ja_JP",
      type: "article",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: blog.title }] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogById(slug);

  // microCMS 未設定時のプレースホルダーページ
  if (!blog) {
    return (
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="font-en grad-text text-sm font-bold tracking-[0.35em]">BLOG</p>
          <h1 className="font-head mt-3 text-2xl font-black tracking-wide">記事を準備中です</h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-soft)]">
            もうしばらくお待ちください。
          </p>
          <Link href="/blog" className="btn btn-ghost mt-8 px-6 py-3 text-sm">
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const color = catColors[blog.category?.name ?? ""] ?? defaultCatColor;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://bullcom.website" },
      { "@type": "ListItem", position: 2, name: "ブログ", item: "https://bullcom.website/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `https://bullcom.website/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="relative overflow-hidden pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="aurora h-[300px] w-[300px] bg-[#a06bff] opacity-20 -right-24 top-10" />

      <article className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <nav className="mb-8 text-xs text-[var(--text-muted)]">
          <Link href="/" className="transition hover:text-white">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="transition hover:text-white">
            ブログ
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-xs">
          {blog.category && (
            <span
              className="rounded-full px-2.5 py-1 font-bold text-white"
              style={{ background: color }}
            >
              {blog.category.name}
            </span>
          )}
          <time className="font-en text-[var(--text-muted)]">
            {formatDate(blog.publishedAt ?? blog.createdAt)}
          </time>
        </div>

        <h1 className="font-head mt-4 text-2xl font-black leading-snug tracking-wide sm:text-3xl">
          {blog.title}
        </h1>

        {blog.eyecatch && (
          <div className="relative mt-8 overflow-hidden rounded-2xl">
            <Image
              src={blog.eyecatch.url}
              alt=""
              width={blog.eyecatch.width ?? 1200}
              height={blog.eyecatch.height ?? 630}
              className="w-full"
              priority
            />
          </div>
        )}

        <div
          className="prose-blog mt-10"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="grad-border mt-16 p-8 text-center">
          <p className="font-head text-lg font-bold">
            ホームページのご相談、お気軽にどうぞ
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            制作・リニューアル・保守、なんでも無料でご相談いただけます。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="tel:078-912-2656" className="btn btn-grad px-6 py-3 text-sm">
              078-912-2656
            </a>
            <Link href="/#contact" className="btn btn-ghost px-6 py-3 text-sm">
              お問い合わせへ
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="text-sm text-[var(--text-soft)] transition hover:text-white"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}
