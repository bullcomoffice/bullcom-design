import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_TEL } from "@/lib/site-data";

const FOOTER_LINKS = [
  { href: "/services", label: "サービス" },
  { href: "/price", label: "料金" },
  { href: "/works", label: "制作実績" },
  { href: "/blog", label: "ブログ" },
  { href: "/faq", label: "よくある質問" },
  { href: "/about", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo-mark.png" alt="BULLCOM design ロゴ" width={40} height={39} />
              <span className="font-en text-xl font-bold tracking-tight">
                BULLCOM <span className="grad-text">design</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              思い通りのホームページを。デザイン×Next.jsのHP制作スタジオ
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={PHONE_TEL}
              className="font-en flex items-center gap-2 text-2xl font-bold tracking-wide"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--cyan)">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
              </svg>
              {PHONE}
            </a>
            <p className="text-xs text-[var(--text-muted)]">お電話・LINEでお気軽にご相談ください</p>
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-[var(--border)] pt-8 text-sm text-[var(--text-soft)]">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col justify-between gap-2 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>© 2026 BULLCOM design. All rights reserved.</p>
          <p className="font-en tracking-widest">BULLCOM SERIES No.06</p>
        </div>
      </div>
    </footer>
  );
}
