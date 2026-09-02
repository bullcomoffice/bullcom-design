import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getBlogs } from "@/lib/microcms";
import BlogCard from "@/components/ui/BlogCard";

export const metadata: Metadata = {
  title: "ブログ・コラム",
  description:
    "ホームページ制作とデザインのノウハウを、BULLCOM designが発信します。依頼する前に知っておきたい費用や進め方、Next.jsで制作している理由まで、制作の現場から具体的に。",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const { contents: blogs } = await getBlogs(100);

  return (
    <>
      <PageHero
        en="BLOG"
        image="/sub-blog-writing.png"
        imageAlt="記事のレイアウトを表示したノートPCとノート・ペンのイメージ"
        ja="ブログ・コラム"
        description="ホームページの作り方、デザインの考え方、依頼する前に知っておきたいこと。制作の現場で実際に判断していることを、できるだけ具体的に書いていきます。BULLCOM designがNext.jsで制作している理由——表示の速さと、改ざんされにくい安全なつくり——に関わる話も、制作者の視点から取り上げます。"
        crumbs={[{ href: "/blog", label: "ブログ" }]}
      />

      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {blogs.length === 0 ? (
          <div className="glass mx-auto max-w-lg rounded-2xl p-12 text-center">
            <p className="font-head text-lg font-bold">記事を準備中です</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
              もうしばらくお待ちください。ご相談は
              <Link href="/contact" className="grad-text font-bold">
                お問い合わせ
              </Link>
              からどうぞ。
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        <p className="mx-auto mt-12 max-w-2xl border-t border-[var(--border)] pt-8 text-center text-xs leading-relaxed text-[var(--text-muted)]">
          セキュリティ対策そのものの詳しい情報は、姉妹サイトの
          <a
            href="https://bullcom.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 font-bold underline underline-offset-2 transition hover:text-[var(--text)]"
          >
            BULLCOM Security
          </a>
          で発信しています。こちらでは、あくまでホームページ制作に関わる範囲で取り上げます。
        </p>
      </section>
    </>
  );
}
