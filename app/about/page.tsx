import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { COMPANY, PHONE, PHONE_TEL, STRENGTHS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "BULLCOM design（ブルコムデザイン）の会社概要。「思い通りのホームページを」をコンセプトに、全国の事業者さま向けにホームページ制作・デザイン・保守運用を行っています。",
  alternates: { canonical: "/about" },
};

// 事業者情報は bullcom.jp/about（同一事業者）を参照して記載
// よく見られる連絡先は上部のカードに、その他は下の一覧に分ける
const CONTACTS = [
  {
    label: "TEL",
    value: PHONE,
    note: "受付 9:00〜19:00",
    href: PHONE_TEL,
    color: "var(--pink)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
      </svg>
    ),
  },
  {
    label: "MAIL",
    value: COMPANY.email,
    note: "24時間受付",
    href: `mailto:${COMPANY.email}`,
    color: "var(--purple)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
  },
  {
    label: "OFFICE",
    value: COMPANY.address,
    note: COMPANY.zip,
    color: "var(--blue)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const PROFILE: { label: string; value: string }[] = [
  { label: "事業名", value: COMPANY.brand },
  { label: "運営", value: COMPANY.operator },
  { label: "代表者", value: COMPANY.owner },
  { label: "FAX", value: COMPANY.fax },
  { label: "創業", value: COMPANY.founded },
  { label: "事業内容", value: "ホームページ制作・デザイン制作・ブランディング・保守運用" },
  { label: "対応エリア", value: COMPANY.area },
  { label: "事務所営業時間", value: COMPANY.businessHours },
  { label: "連絡受付時間", value: COMPANY.contactHours },
  { label: "定休日", value: COMPANY.holiday },
  { label: "お支払い方法", value: COMPANY.payment },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        en="ABOUT"
        image="/sub-about-partnership.png"
        imageAlt="お客様とデザインの方向性を考えるチームのイメージ"
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

          {/* 連絡先ハイライト */}
          <div className="mb-8 grid gap-5 sm:grid-cols-3">
            {CONTACTS.map((c) => {
              const inner = (
                <>
                  <span className="profile-contact-chip">{c.icon}</span>
                  <span className="font-en profile-contact-label">{c.label}</span>
                  <span className="font-en profile-contact-value text-sm sm:text-base">
                    {c.value}
                  </span>
                  <span className="relative z-[1] text-xs text-[var(--text-muted)]">{c.note}</span>
                </>
              );
              const style = { "--accent": c.color } as React.CSSProperties;
              return c.href ? (
                <a key={c.label} href={c.href} className="profile-contact" style={style}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="profile-contact" style={style}>
                  {inner}
                </div>
              );
            })}
          </div>

          {/* 詳細 */}
          <dl className="profile-table">
            <div className="profile-table-head" />
            {PROFILE.map((row) => (
              <div key={row.label} className="profile-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-center text-xs leading-relaxed text-[var(--text-muted)]">
            BULLCOM designは、パソコン修理・設定の
            <a
              href="https://bullcom.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition hover:text-[var(--text)]"
            >
              BULLCOM
            </a>
            が運営するデザイン事業ブランドです。
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
