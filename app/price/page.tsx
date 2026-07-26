import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { GRAPHIC_PRICES, HP_PRICES, LINE_URL, PHONE_TEL, SUBSC_PLANS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "料金プラン",
  description:
    "BULLCOM designの料金一覧。LP制作3万円〜、HP制作20万円〜、HPリニューアル15万円〜、EC構築30万円〜。保守サポートは月5,000円〜。他社で制作したサイトの保守・無料診断も承ります。",
  alternates: { canonical: "/price" },
};

export default function PricePage() {
  return (
    <>
      <PageHero
        en="PRICE"
        ja="料金プラン"
        description="必要なものだけを、わかりやすい価格で。制作費を抑えて、公開後の保守までしっかり伴走します。ご相談・お見積りは無料です。"
        crumbs={[{ href: "/price", label: "料金" }]}
      />

      {/* HP制作費 */}
      <section className="relative py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="WEB"
            ja="ホームページ制作費"
            description="ページ数や機能によって変動します。まずは概算をお伝えしますので、お気軽にご相談ください。"
          />
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
        </div>
      </section>

      {/* 保守サブスク */}
      <section className="relative overflow-hidden py-24">
        <div className="aurora h-[380px] w-[380px] bg-[#ffab4a] opacity-15 -left-32 top-24" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="font-en grad-text text-sm font-bold tracking-[0.35em]">MAINTENANCE</p>
            <h2 className="font-head mt-3 text-3xl font-black tracking-wide sm:text-4xl">
              公開後も安心の<span className="grad-text-warm">保守サポート</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
              ホームページは作ってからが本番。
              <strong className="text-[var(--text)]">他社で作ったサイトの保守もお引き受けします。</strong>
              まずは無料サイト診断からどうぞ。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {SUBSC_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`card-hover rounded-2xl p-7 ${
                  plan.featured ? "grad-border md:-translate-y-2" : "glass"
                }`}
              >
                {plan.featured && (
                  <p className="font-en mb-3 inline-block rounded-full bg-gradient-to-r from-[var(--pink)] to-[var(--purple)] px-3 py-1 text-[10px] font-bold tracking-wider text-white">
                    RECOMMENDED
                  </p>
                )}
                <h3 className="font-head text-lg font-bold">{plan.name}</h3>
                <p className="mt-2">
                  <span className="text-sm text-[var(--text-muted)]">月額</span>
                  <span className="font-en ml-2 text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm font-bold text-[var(--text-soft)]">円</span>
                </p>
                <ul className="mt-5 flex flex-col gap-2.5 border-t border-[var(--border)] pt-5 text-sm text-[var(--text-soft)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="grad-text mt-0.5 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-center text-sm text-[var(--text-soft)]">
            基本費用：ドメイン維持・レンタルサーバー費{" "}
            <span className="font-en font-bold text-[var(--text)]">年間15,000円＋税</span>
          </p>
        </div>
      </section>

      {/* 無料サイト診断 */}
      <section className="relative py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grad-border overflow-hidden">
            <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center md:px-12">
              <div className="aurora h-[220px] w-[220px] bg-[#38d4f5] opacity-25 -left-20 -top-20" />
              <h2 className="font-head relative text-2xl font-black tracking-wide sm:text-3xl">
                そのホームページ、<span className="grad-text">無料診断</span>しませんか？
              </h2>
              <p className="relative max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
                「他社で作ったけど更新されていない」「表示が遅い」「セキュリティが不安」——
                他社制作のサイトもOK。現状を無料で診断して、改善プランをご提案します。
              </p>
              <div className="relative flex flex-wrap justify-center gap-4">
                <a href={PHONE_TEL} className="btn btn-grad px-7 py-3.5 text-sm">
                  電話で診断を依頼する
                </a>
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-line px-7 py-3.5 text-sm"
                >
                  LINEで診断を依頼する
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* デザイン制作の料金 */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="DESIGN"
            ja="デザイン制作の料金"
            description="ロゴ・名刺・チラシなどの紙まわりも、Webと同じトーンでまとめてご依頼いただけます。"
          />
          <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
            {GRAPHIC_PRICES.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--border)] py-3.5 text-sm"
              >
                <span className="text-[var(--text-soft)]">{item.name}</span>
                <span className="font-en shrink-0 font-bold text-[var(--text)]">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            ※表示価格は税別です。内容・ボリュームにより変動します。まずはお気軽にご相談ください。
          </p>
          <div className="mt-8 text-center">
            <Link href="/services" className="btn btn-ghost px-6 py-3 text-sm">
              サービス内容の詳細を見る
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="お見積りは無料です"
        description="「この予算でどこまでできる？」というご相談も歓迎です。まずは今のお悩みをお聞かせください。"
      />
    </>
  );
}
