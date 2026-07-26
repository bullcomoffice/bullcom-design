import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { WORKS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "制作実績",
  description:
    "BULLCOM designの制作実績。コーポレートサイト、買取・販売サイトなど、集客の仕組みまで含めたサイトづくりの事例をご紹介します。",
  alternates: { canonical: "/works" },
};

// TODO: お客様の声を掲載する（要件定義書 §3-3・現在は未収集）
const VOICES: { company: string; text: string }[] = [];

export default function WorksPage() {
  return (
    <>
      <PageHero
        en="WORKS"
        image="/work-truck.png"
        imageAlt="事業の魅力をWebサイトで伝える制作実績のイメージ"
        ja="制作実績"
        description="BULLCOMシリーズをはじめ、集客の仕組みまで含めたサイトづくりをしています。実績は順次追加していきます。"
        crumbs={[{ href: "/works", label: "制作実績" }]}
      />

      <section className="relative py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((work) => (
              <article
                key={work.title}
                className="glass card-hover group overflow-hidden rounded-2xl"
              >
                <div className="work-visual relative overflow-hidden">
                  <Image
                    src={work.image}
                    alt={`${work.title}のイメージ`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#272442]/35 via-transparent to-white/5" />
                  <span className="font-en absolute bottom-3 right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] text-slate-700 shadow-sm">
                    {work.label}
                  </span>
                </div>
                <div className="p-6">
                  <span className="font-en inline-block rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs font-semibold text-[var(--text-soft)]">
                    {work.category}
                  </span>
                  <h2 className="font-head mt-3 text-lg font-bold">{work.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {work.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section className="relative overflow-hidden py-24">
        <div className="aurora h-[320px] w-[320px] bg-[#4f8dff] opacity-15 -right-28 top-16" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="VOICE"
            ja="お客様の声"
            description="ご依頼いただいたお客様からいただいた感想をご紹介します。"
          />
          {VOICES.length === 0 ? (
            <div className="glass mx-auto max-w-lg rounded-2xl p-10 text-center">
              <p className="font-head text-lg font-bold">準備中です</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
                お客様の声は現在準備中です。公開までしばらくお待ちください。
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <CtaBand
        title="こんなサイトを作りたい、をお聞かせください"
        description="参考サイトのURLやイメージだけでも大丈夫です。実現できるか・いくらかかるかを無料でお答えします。"
      />
    </>
  );
}
