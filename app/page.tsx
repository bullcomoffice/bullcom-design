import Image from "next/image";
import Link from "next/link";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import StatBand from "@/components/ui/StatBand";
import CtaBand from "@/components/ui/CtaBand";
import {
  HP_PRICES,
  LINE_URL,
  PHONE,
  PHONE_TEL,
  SERVICES,
  STRENGTHS,
  SUBSC_PLANS,
  WORKS,
} from "@/lib/site-data";

/* ============ ページ本体 ============ */

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero-canvas hero-sky relative flex min-h-svh items-center overflow-hidden pt-16">
        <Image
          src="/hero-colorful-sky.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-sky-image object-cover"
        />
        <div className="hero-sky-overlay absolute inset-0" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0">
            <p className="anim-fade-up font-en flex max-w-full flex-wrap items-center gap-3 break-words text-[10px] font-bold tracking-[0.2em] text-[var(--text-soft)] sm:text-xs sm:tracking-[0.3em]">
              <span className="inline-block h-px w-10 bg-gradient-to-r from-[var(--pink)] to-[var(--cyan)]" />
              WEB DESIGN STUDIO — BULLCOM SERIES 06
            </p>
            <h1 className="anim-fade-up delay-1 font-head mt-6 text-4xl font-black leading-[1.25] tracking-wide sm:text-5xl lg:text-6xl">
              <span className="grad-text">思い通り</span>の
              <br />
              ホームページを。
            </h1>
            <p className="anim-fade-up delay-2 mt-6 max-w-xl leading-relaxed text-[var(--text-soft)]">
              デザインから開発、公開後の運用まで。BULLCOM designは、Next.jsで
              「速くて、強くて、育てられる」ホームページをつくる制作スタジオです。
              古くなったサイトの作り替えも、はじめての1ページも、思い通りに。
            </p>

            <div className="anim-fade-up delay-3 mt-9 flex flex-wrap items-center gap-4">
              <a href={PHONE_TEL} className="btn btn-grad px-7 py-4 text-base">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
                </svg>
                無料相談 {PHONE}
              </a>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line px-6 py-4 text-base"
              >
                LINEで相談
              </a>
              <Link href="/price" className="btn btn-ghost px-6 py-4 text-base">
                料金を見る
              </Link>
            </div>

            <ul className="anim-fade-up delay-4 mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-soft)]">
              {["LP制作 3万円〜", "HP制作 20万円〜", "保守・セキュリティ対応"].map((chip) => (
                <li key={chip} className="flex items-center gap-1.5">
                  <span className="grad-text font-bold">✓</span>
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="anim-fade-up delay-2 relative mx-auto hidden w-full max-w-md lg:block">
            <div className="hero-board anim-float relative aspect-[1.06] rounded-[2rem] p-5 shadow-[0_35px_80px_rgba(92,80,151,0.2)]">
              <div className="absolute -left-7 top-12 h-24 w-24 rounded-[2rem] bg-gradient-to-br from-[#ffb6d4] to-[#ff6eaa] opacity-80 shadow-xl" />
              <div className="absolute -right-5 bottom-14 h-28 w-28 rounded-full border-[14px] border-[#8f78ff] opacity-80" />
              <div className="relative grid h-full grid-cols-[1.15fr_0.85fr] gap-3">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#322c74] via-[#5954b8] to-[#75caff] p-5 text-white shadow-lg">
                  <p className="font-en text-[10px] font-bold tracking-[0.25em] text-white/65">MAKE IT YOURS</p>
                  <p className="font-head mt-4 text-2xl font-black leading-snug">アイデアを<br />カタチに。</p>
                  <div className="mt-5 h-16 rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                    <div className="h-1.5 w-16 rounded-full bg-white/85" />
                    <div className="mt-2 h-1.5 w-10 rounded-full bg-white/45" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#fff6ed] p-3 shadow-lg">
                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#ffab4a]" />
                    <p className="font-en relative text-[10px] font-extrabold tracking-widest text-[#d66085]">BRANDING</p>
                    <div className="absolute bottom-3 left-3 right-3 h-12 rounded-xl bg-gradient-to-r from-[#f0509e] to-[#a06bff]" />
                  </div>
                  <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#e5fbff] p-3 shadow-lg">
                    <Image src="/logo-mark.png" alt="BULLCOM design" width={72} height={70} priority className="absolute bottom-1 right-2 w-14 rotate-[-10deg] drop-shadow-lg" />
                    <p className="font-en text-[10px] font-extrabold tracking-widest text-[#2478bd]">WEB DESIGN</p>
                    <div className="mt-4 h-1.5 w-12 rounded-full bg-[#5dbfd6]" />
                    <div className="mt-2 h-1.5 w-8 rounded-full bg-[#9cdae7]" />
                  </div>
                </div>
              </div>
              <p className="font-en absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-extrabold tracking-[0.28em] text-[#6c6990]">BULLCOM DESIGN STUDIO</p>
            </div>
          </div>
        </div>
      </section>

      <StatBand />

      {/* ================= WORKS ================= */}
      <section id="works" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="WORKS"
            ja="制作実績"
            description="BULLCOMシリーズをはじめ、集客の仕組みまで含めたサイトづくりをしています。実績は順次追加予定です。"
          />
          <Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {WORKS.map((work) => (
              <article key={work.title} className="glass card-hover group overflow-hidden rounded-2xl">
                <div className="work-visual relative overflow-hidden">
                  <Image
                    src={work.image}
                    alt={`${work.title}のスクリーンショット`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
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
                  <h3 className="font-head mt-3 text-lg font-bold">{work.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {work.description}
                  </p>
                  {work.url && (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-en mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-soft)] transition hover:text-[var(--text)]"
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
          </Reveal>
          <div className="mt-10 text-center">
            <Link href="/works" className="btn btn-ghost px-7 py-3.5 text-sm">
              制作実績をもっと見る
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRICE ================= */}
      <section id="price" className="relative overflow-hidden py-24">
        <div className="aurora h-[400px] w-[400px] bg-[#a06bff] opacity-20 -right-40 top-20" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="PRICE"
            ja="料金プラン"
            description="必要なものだけを、わかりやすい価格で。制作費を抑えて、公開後の保守までしっかり伴走します。"
          />

          {/* HP制作費 */}
          <div className="section-visual section-visual-price glass relative mb-10 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/15 to-transparent" />
            <div className="absolute inset-y-0 left-0 z-10 flex w-1/2 items-end p-5 sm:p-7">
              <div className="flex gap-2" aria-hidden="true">
                <span className="h-3 w-12 rounded-full bg-[var(--pink)]" />
                <span className="h-3 w-7 rounded-full bg-[var(--cyan)]" />
                <span className="h-3 w-16 rounded-full bg-[var(--orange)]" />
              </div>
            </div>
            <Image
              src="/scene-price-consultation.png"
              alt="デザイナーと事業者がホームページ制作の計画を相談している様子"
              fill
              sizes="(max-width: 640px) 100vw, 1152px"
              className="object-cover object-[62%_center]"
            />
          </div>

          <Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HP_PRICES.map((plan) => (
              <div
                key={plan.name}
                className={`card-hover relative overflow-hidden rounded-2xl p-6 ${
                  plan.featured ? "grad-border" : "glass"
                }`}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: plan.gradient }}
                />
                {plan.featured && (
                  <span className="font-en absolute right-4 top-4 rounded-full bg-gradient-to-r from-[var(--pink)] to-[var(--purple)] px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
                    MAIN
                  </span>
                )}
                <h3 className="font-head text-base font-bold text-[var(--text-soft)]">
                  {plan.name}
                </h3>
                <p className="mt-3">
                  <span className="font-en text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm font-bold text-[var(--text-soft)]">
                    {plan.unit}
                  </span>
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">{plan.note}</p>
              </div>
            ))}
          </div>
          </Reveal>

          {/* 保守サポート要約（詳細は /price） */}
          <Reveal className="mt-12">
          <div className="glass flex flex-col items-center justify-between gap-6 rounded-2xl p-8 md:flex-row md:text-left">
            <div className="text-center md:text-left">
              <p className="font-head text-lg font-bold">
                公開後も安心の<span className="grad-text-warm">保守サポート</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                月額{SUBSC_PLANS[1].price}円のスタンダードなら、更新代行・セキュリティ監視つき。
                <br className="hidden sm:block" />
                他社で作ったサイトの保守もお引き受けします。
              </p>
            </div>
            <Link href="/price" className="btn btn-grad shrink-0 px-7 py-3.5 text-sm">
              料金の詳細を見る
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="SERVICES"
            ja="サービス内容"
            description="Webからグラフィック、ブランディングまで。「会社の顔」をまるごとデザインします。"
          />
          <div className="section-visual section-visual-services glass relative mb-10 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/5 via-transparent to-white/35" />
            <Image
              src="/scene-services-creation.png"
              alt="デザイナーがウェブサイトや名刺、印刷物を制作している様子"
              fill
              sizes="(max-width: 640px) 100vw, 1152px"
              className="object-cover object-[42%_center]"
            />
          </div>

          <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="svc-card"
                style={{ "--accent": service.color } as React.CSSProperties}
              >
                <div className="svc-card-body">
                  <div className="flex items-center gap-4">
                    <span className="svc-card-chip">{service.icon}</span>
                    <div className="min-w-0">
                      <p className="font-en svc-card-label">{service.title}</p>
                      <h3 className="font-head mt-0.5 text-lg font-bold sm:text-xl">
                        {service.pageTitle}
                      </h3>
                    </div>
                  </div>

                  <ul className="svc-card-list">
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

                  <div className="svc-card-foot">
                    <p className="font-en svc-card-price">
                      <span className="svc-card-price-label">{service.prices[0].label}</span>
                      {service.prices[0].price}
                    </p>
                    <span className="font-en svc-card-more">
                      詳しく見る
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </Reveal>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn btn-ghost px-7 py-3.5 text-sm">
              サービス一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STRENGTH ================= */}
      <section id="strength" className="relative overflow-hidden py-24">
        <div className="aurora h-[380px] w-[380px] bg-[#38d4f5] opacity-15 -left-40 top-1/3" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="WHY BULLCOM"
            ja="選ばれる理由"
            description="「集客できない」「更新できない」「セキュリティが不安」。ホームページの三大お悩みに、正面から応えます。"
          />
          <Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {STRENGTHS.map((item) => (
              <div key={item.no} className="reason-card p-7">
                <p className="font-en absolute right-6 top-5 text-5xl font-extrabold text-[#6a5eb5]/10">
                  {item.no}
                </p>
                <span
                  className="flex h-13 w-13 items-center justify-center rounded-xl"
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
          </Reveal>
        </div>
      </section>

      {/* ================= CONTACT（詳細は /contact） ================= */}
      {/* 無料診断バナーを削除したぶん、ここで「他社サイトの無料診断」も訴求する */}
      <CtaBand description="「何から始めればいいか分からない」段階で大丈夫です。ご相談・お見積りは無料。他社で作られたサイトの無料診断も承っています。" />
    </>
  );
}
