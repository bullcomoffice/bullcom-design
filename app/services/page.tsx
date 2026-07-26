import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { SERVICES, STRENGTHS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "サービス紹介",
  description:
    "BULLCOM designのサービス一覧。HP・LP・EC制作、保守運用、ロゴ・名刺・チラシなどのグラフィック、ブランディング、写真・動画・コピーライティングまで、会社の顔まわりをまるごとデザインします。",
  alternates: { canonical: "/services" },
};

const FLOW = [
  {
    step: "01",
    title: "ご相談・ヒアリング",
    description:
      "お電話・LINE・フォームでご連絡ください。目的やお困りごと、ご予算感をお聞きします。まだ何も決まっていない段階で大丈夫です。",
  },
  {
    step: "02",
    title: "ご提案・お見積り",
    description:
      "内容を整理して、構成とお見積りをご提案します。ご納得いただけない場合、ここでお断りいただいても費用はかかりません。",
  },
  {
    step: "03",
    title: "デザイン・制作",
    description:
      "デザイン案をご確認いただきながら制作を進めます。テキストや写真素材のご用意が難しい場合もご相談ください。",
  },
  {
    step: "04",
    title: "公開・運用サポート",
    description:
      "公開して終わりではありません。保守プランで更新代行・セキュリティ監視まで継続的にサポートします。",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        en="SERVICES"
        image="/sub-services-studio.png"
        imageAlt="Web制作からブランディングまでを支えるデザインスタジオのイメージ"
        ja="サービス内容"
        description="Webからグラフィック、ブランディングまで。「会社の顔」をまるごとデザインします。制作して終わりではなく、公開後に育てていくところまでが私たちの仕事です。"
        crumbs={[{ href: "/services", label: "サービス" }]}
      />

      {/* 4カテゴリ → 各詳細ページへ */}
      <section className="relative py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="glass card-hover group relative flex flex-col overflow-hidden rounded-2xl p-7 sm:p-8"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: service.color }}
                />
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      color: service.color,
                      background: "var(--surface-strong)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {service.icon}
                  </span>
                  <div>
                    <p
                      className="font-en text-[10px] font-bold tracking-[0.2em]"
                      style={{ color: service.color }}
                    >
                      {service.title}
                    </p>
                    <h2 className="font-head text-lg font-bold sm:text-xl">{service.pageTitle}</h2>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[var(--text-soft)]">
                  {service.description}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5 text-sm text-[var(--text-soft)]">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: service.color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
                  <span className="font-en text-sm font-bold text-[var(--text)]">
                    {service.prices[0].price.replace("〜", "")}〜
                  </span>
                  <span className="font-en text-xs font-bold text-[var(--text-muted)] transition group-hover:text-[var(--text)]">
                    詳しく見る →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            ※表示価格は税別です。内容・ボリュームにより変動します。
          </p>
        </div>
      </section>

      {/* 制作の流れ */}
      <section className="relative overflow-hidden py-24">
        <div className="aurora h-[340px] w-[340px] bg-[#a06bff] opacity-15 -right-32 top-20" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="FLOW"
            ja="ご依頼の流れ"
            description="お問い合わせから公開・運用まで、4ステップで進めます。"
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((f) => (
              <div key={f.step} className="glass card-hover relative rounded-2xl p-6">
                <p className="font-en grad-text text-3xl font-extrabold">{f.step}</p>
                <h3 className="font-head mt-3 text-base font-bold leading-snug">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-soft)]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 選ばれる理由（要約） */}
      <section className="relative py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead en="WHY BULLCOM" ja="選ばれる理由" />
          <div className="grid gap-6 md:grid-cols-3">
            {STRENGTHS.map((item) => (
              <div key={item.no} className="glass card-hover relative rounded-2xl p-7">
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

      <CtaBand />
    </>
  );
}
