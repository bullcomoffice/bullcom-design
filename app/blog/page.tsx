import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/lib/microcms";
import { catColors, defaultCatColor, formatDate } from "@/lib/blog-ui";

export const metadata: Metadata = {
  title: "ブログ・コラム",
  description:
    "ホームページ制作・デザイン・SEO・セキュリティに関するノウハウを、BULLCOM designが発信します。",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const { contents: blogs } = await getBlogs(100);

  return (
    <div className="relative overflow-hidden pt-16">
      <div className="aurora h-[320px] w-[320px] bg-[#a06bff] opacity-25 -right-24 top-10" />
      <div className="aurora h-[280px] w-[280px] bg-[#f0509e] opacity-20 -left-24 top-64" />

      <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="font-en grad-text text-sm font-bold tracking-[0.35em]">BLOG</p>
          <h1 className="font-head mt-3 text-3xl font-black tracking-wide sm:text-4xl">
            ブログ・コラム
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
            ホームページ制作・デザイン・SEO・セキュリティのノウハウを発信しています。
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="glass mx-auto max-w-lg rounded-2xl p-12 text-center">
            <p className="font-head text-lg font-bold">記事を準備中です</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
              もうしばらくお待ちください。ご相談は
              <Link href="/#contact" className="grad-text font-bold">
                お問い合わせ
              </Link>
              からどうぞ。
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => {
              const color = catColors[blog.category?.name ?? ""] ?? defaultCatColor;
              return (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="glass card-hover group overflow-hidden rounded-2xl"
                >
                  <div className="relative h-44 overflow-hidden">
                    {blog.eyecatch ? (
                      <Image
                        src={blog.eyecatch.url}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${color}, var(--bg-soft))`,
                        }}
                      >
                        <Image
                          src="/logo-mark.png"
                          alt=""
                          width={72}
                          height={70}
                          className="opacity-80"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
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
                    <h2 className="mt-3 line-clamp-2 font-bold leading-snug">{blog.title}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
