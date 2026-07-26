import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { PHONE, PHONE_TEL, STRENGTHS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "BULLCOM design（ブルコムデザイン）の会社概要。「思い通りのホームページを」をコンセプトに、全国の事業者さま向けにホームページ制作・デザイン・保守運用を行っています。",
  alternates: { canonical: "/about" },
};

// TODO: 以下はユーザー確認が必要な項目。確定情報が入るまで「—」表記のままにすること（事実の創作は禁止）
const PROFILE: { label: string; value: string }[] = [
  { label: "屋号・事業名", value: "BULLCOM design（ブルコムデザイン）" },
  { label: "事業内容", value: "ホームページ制作・デザイン制作・ブランディング・保守運用" },
  { label: "電話番号", value: PHONE },
  { label: "メール", value: "bullcom.office@gmail.com" },
  { label: "対応エリア", value: "日本全国" },
  { label: "所在地", value: "—" },
  { label: "代表者", value: "—" },
  { label: "設立", value: "—" },
  { label: "営業時間", value: "—" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        en="ABOUT"
        ja="会社概要"
        description="BULLCOM designについて。ホームページを「作って終わり」にしないパートナーでありたいと考えています。"
        crumbs={[{ href: "/about", label: "会社概要" }]}
      />

      {/* コンセプト */}
      <section className="relative py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass grid items-center gap-10 rounded-2xl p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="font-en grad-text text-sm font-bold tracking-[0.3em]">CONCEPT</p>
              <h2 className="font-head mt-4 text-2xl font-black leading-relaxed tracking-wide sm:text-3xl">
                <span className="grad-text">思い通り</span>の
                <br />
                ホームページを。
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-[var(--text-soft)]">
                <p>
                  「ホームページを作ったけれど、そのまま何年も更新できていない」
                  「連絡した業者と、いつの間にか連絡が取れなくなった」——
                  そんな声を、私たちは何度も聞いてきました。
                </p>
                <p>
                  BULLCOM designは、デザインから開発、公開後の運用までを一貫してお引き受けする制作スタジオです。
                  Next.jsによる高速で安全なサイトづくりと、公開後の保守・更新サポートで、
                  ホームページを「育てられる資産」に変えていきます。
                </p>
                <p>
                  盾のロゴには、お客様のサイトを守り続けるという意思を込めています。
                  はじめての1ページから、長く付き合えるパートナーとして伴走させてください。
                </p>
              </div>
            </div>
            <div className="mx-auto w-40 sm:w-56">
              <Image
                src="/logo-mark.png"
                alt="BULLCOM design シンボルマーク"
                width={487}
                height={471}
                className="drop-shadow-[0_20px_60px_rgba(240,80,158,0.35)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 私たちの強み */}
      <section className="relative overflow-hidden py-24">
        <div className="aurora h-[340px] w-[340px] bg-[#38d4f5] opacity-15 -left-32 top-24" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead en="OUR STRENGTH" ja="私たちが大切にしていること" />
          <div className="grid gap-6 md:grid-cols-3">
            {STRENGTHS.map((item) => (
              <div key={item.no} className="glass card-hover relative rounded-2xl p-7">
                <p className="font-en absolute right-6 top-5 text-5xl font-extrabold text-[#6a5eb5]/10">
                  {item.no}
                </p>
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    color: item.color,
                    background: "var(--surface-strong)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {item.icon}
                </span>
                <h3 className="font-head mt-5 text-lg font-bold leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 事業概要 */}
      <section className="relative py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHead en="PROFILE" ja="事業概要" />
          <dl className="glass overflow-hidden rounded-2xl">
            {PROFILE.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 border-b border-[var(--border)] px-6 py-5 last:border-b-0 sm:flex-row sm:gap-6"
              >
                <dt className="w-40 shrink-0 text-xs font-bold text-[var(--text-muted)] sm:text-sm">
                  {row.label}
                </dt>
                <dd className="flex-1 text-sm text-[var(--text-soft)]">
                  {row.label === "電話番号" ? (
                    <a href={PHONE_TEL} className="font-en font-bold text-[var(--text)]">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
            「—」の項目は準備中です。詳細はお問い合わせください。
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
