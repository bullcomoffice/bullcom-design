import Link from "next/link";
import Image from "next/image";
import { LINE_URL, PHONE, PHONE_TEL } from "@/lib/site-data";

// 全ページ共通のCV導線。電話 → フォーム → LINE の優先順で配置する
export default function CtaBand({
  title = "まずは無料でご相談ください",
  description = "「何から始めればいいか分からない」段階で大丈夫です。ご相談・お見積りは無料。しつこい営業もしません。",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grad-border overflow-hidden">
          <div className="relative flex flex-col items-center gap-6 overflow-hidden px-6 py-12 text-center md:px-12 md:pr-56">
            <div className="aurora h-[220px] w-[220px] bg-[#f0509e] opacity-25 -left-20 -top-20" />
            <div className="aurora h-[220px] w-[220px] bg-[#4f8dff] opacity-25 -bottom-20 -right-20" />
            <div className="cta-illustration cta-illustration-float relative hidden overflow-hidden rounded-[1.5rem] border border-white/70 shadow-[0_18px_45px_rgba(79,141,255,0.2)] md:block">
              <Image
                src="/scene-support-security.png"
                alt="ウェブサイトを安全に運用するサポートのイメージ"
                fill
                sizes="192px"
                className="object-cover"
              />
              <div className="subpage-hero-shine absolute inset-0" />
            </div>

            <h2 className="font-head relative text-2xl font-black tracking-wide sm:text-3xl">
              {title}
            </h2>
            <p className="relative max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
              {description}
            </p>

            <div className="relative flex flex-wrap justify-center gap-4">
              <a href={PHONE_TEL} className="btn btn-grad px-7 py-4 text-base">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
                </svg>
                {PHONE}
              </a>
              <Link href="/contact" className="btn btn-ghost px-7 py-4 text-base">
                フォームで相談する
              </Link>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line px-7 py-4 text-base"
              >
                LINEで相談
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
