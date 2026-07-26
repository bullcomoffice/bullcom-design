import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import SectionHead from "@/components/ui/SectionHead";
import { SERVICES } from "@/lib/site-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "サービス" };
  return {
    title: service.pageTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        en={service.title.replace("系", "").toUpperCase()}
        ja={service.pageTitle}
        description={service.lead}
        image={service.heroImage}
        imageAlt={service.heroAlt}
        crumbs={[
          { href: "/services", label: "サービス" },
          { href: `/services/${service.slug}`, label: service.title },
        ]}
      />

      {/* サービス個票 */}
      <section className="relative py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-6">
            {service.details.map((detail, i) => (
              <div key={detail.name} className="glass card-hover rounded-2xl p-7 sm:p-9">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className="font-en flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
                      style={{
                        color: service.color,
                        background: "var(--surface-strong)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-head text-xl font-bold sm:text-2xl">{detail.name}</h2>
                  </div>
                  {detail.price && (
                    <span
                      className="font-en rounded-full px-4 py-1.5 text-sm font-bold text-white"
                      style={{ background: service.color }}
                    >
                      {detail.price}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[var(--text-soft)]">
                  {detail.summary}
                </p>

                <ul className="mt-5 grid gap-2.5 border-t border-[var(--border)] pt-5 text-sm text-[var(--text-soft)] sm:grid-cols-2">
                  {detail.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: service.color }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            ※表示価格は税別です。内容・ボリュームにより変動します。
          </p>
        </div>
      </section>

      {/* こんな方におすすめ */}
      <section className="relative overflow-hidden py-16">
        <div
          className="aurora h-[320px] w-[320px] opacity-15 -left-32 top-10"
          style={{ background: service.color }}
        />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHead en="FOR YOU" ja="こんな方におすすめです" />
          <div className="grid gap-4 sm:grid-cols-2">
            {service.recommended.map((r) => (
              <div
                key={r}
                className="glass flex items-start gap-3 rounded-2xl p-5 text-sm leading-relaxed text-[var(--text-soft)]"
              >
                <span className="grad-text mt-0.5 shrink-0 font-bold">✓</span>
                {r}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/price" className="btn btn-ghost px-7 py-3.5 text-sm">
              料金の詳細を見る
            </Link>
            <Link href="/works" className="btn btn-ghost px-7 py-3.5 text-sm">
              制作実績を見る
            </Link>
          </div>
        </div>
      </section>

      {/* 他のサービス */}
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead en="OTHER SERVICES" ja="ほかのサービス" />
          <div className="grid gap-5 md:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="glass card-hover rounded-2xl p-6"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    color: other.color,
                    background: "var(--surface-strong)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {other.icon}
                </span>
                <h3 className="font-head mt-4 text-base font-bold">{other.pageTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                  {other.description}
                </p>
                <span className="font-en mt-4 inline-block text-xs font-bold text-[var(--text-muted)]">
                  VIEW MORE →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
