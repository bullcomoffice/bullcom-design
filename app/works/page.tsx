import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { WORKS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "制作実績",
  description:
    "BULLCOM designの制作実績。コーポレートサイト、買取・販売サイト、セキュリティサービスなど、業種も目的も異なるサイトを集客の仕組みまで含めて制作しています。掲載しているのは一部の事例です。",
  alternates: { canonical: "/works" },
};

// TODO: お客様の声を掲載する（要件定義書 §3-3・現在は未収集）
const VOICES: { company: string; text: string }[] = [];

export default function WorksPage() {
  return (
    <>
      <PageHero
        en="WORKS"
        image="/sub-works-portfolio.png"
        imageAlt="ノートPC・タブレット・スマートフォンに制作したサイトのデザインを並べたイメージ"
        ja="制作実績"
        description="コーポレートサイトから買取・販売サイト、セキュリティサービスまで。業種も目的も異なるサイトを、デザインだけでなく問い合わせにつながる導線や集客の仕組みまで含めて制作しています。ここでご紹介しているのは実績の一部です。近い業種の事例もお見せできますので、お気軽にご相談ください。"
        crumbs={[{ href: "/works", label: "制作実績" }]}
      />

      <section className="relative py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((work, i) => (
              <article
                key={work.title}
                className="work-card"
                style={{ "--accent": work.color } as React.CSSProperties}
              >
                <div className="work-visual work-visual-frame">
                  <span className="font-en work-no">{String(i + 1).padStart(2, "0")}</span>
                  <Image
                    src={work.image}
                    alt={`${work.title}のスクリーンショット`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="font-en work-label">{work.label}</span>
                </div>

                <div className="work-card-body">
                  <span className="font-en work-tag">{work.category}</span>
                  <h2 className="font-head mt-3 text-lg font-bold leading-snug">{work.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {work.description}
                  </p>
                  {work.url && (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-en work-more"
                    >
                      サイトを見る
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl border-t border-[var(--border)] pt-8 text-center">
            <p className="text-sm leading-relaxed text-[var(--text-soft)]">
              掲載しているのは<strong className="text-[var(--text)]">制作実績の一部</strong>です。
              このほかにも、ランディングページや小規模なサイト、公開を控えている案件などを手がけています。
              <br className="hidden sm:block" />
              「自分の業種に近い事例が見たい」「こんなサイトは作れる？」といったご相談も歓迎です。
            </p>
            <Link href="/contact" className="btn btn-grad mt-6 px-7 py-3.5 text-sm">
              事例について相談する
            </Link>
          </div>
        </div>
      </section>

      {/* お客様の声: 実データが集まるまでは非表示（VOICES に追加すると表示される） */}
      {VOICES.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="aurora h-[320px] w-[320px] bg-[#4f8dff] opacity-15 -right-28 top-16" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead
              en="VOICE"
              ja="お客様の声"
              description="ご依頼いただいたお客様からいただいた感想をご紹介します。"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {VOICES.map((v) => (
                <blockquote key={v.company} className="glass card-hover rounded-2xl p-7">
                  <p className="text-sm leading-relaxed text-[var(--text-soft)]">「{v.text}」</p>
                  <footer className="mt-4 text-xs font-bold text-[var(--text-muted)]">
                    {v.company}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="こんなサイトを作りたい、をお聞かせください"
        description="参考サイトのURLやイメージだけでも大丈夫です。実現できるか・いくらかかるかを無料でお答えします。"
      />
    </>
  );
}
