import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/types/blog";
import { catColors, defaultCatColor, formatDate } from "@/lib/blog-ui";

// ブログカード（/blog 一覧とトップの新着で共用）。
// 見出しレベルはページ側の文書構造に合わせて渡す（一覧は h2、トップはセクション h2 の下なので h3）。
export default function BlogCard({
  blog,
  headingLevel = "h2",
}: {
  blog: Pick<Blog, "id" | "title" | "eyecatch" | "category" | "publishedAt" | "createdAt">;
  headingLevel?: "h2" | "h3";
}) {
  const color = catColors[blog.category?.name ?? ""] ?? defaultCatColor;
  const Heading = headingLevel;

  return (
    <Link href={`/blog/${blog.id}`} className="glass card-hover group overflow-hidden rounded-2xl">
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
            style={{ background: `linear-gradient(135deg, ${color}, var(--bg-soft))` }}
          >
            <Image src="/logo-mark.png" alt="" width={72} height={70} className="opacity-80" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs">
          {blog.category && (
            <span className="rounded-full px-2.5 py-1 font-bold text-white" style={{ background: color }}>
              {blog.category.name}
            </span>
          )}
          <time className="font-en text-[var(--text-muted)]">
            {formatDate(blog.publishedAt ?? blog.createdAt)}
          </time>
        </div>
        <Heading className="mt-3 line-clamp-2 font-bold leading-snug">{blog.title}</Heading>
      </div>
    </Link>
  );
}
