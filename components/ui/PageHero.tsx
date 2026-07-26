import Link from "next/link";

type Crumb = { href: string; label: string };

export default function PageHero({
  en,
  ja,
  description,
  crumbs = [],
}: {
  en: string;
  ja: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="hero-canvas relative overflow-hidden pt-16">
      <div className="aurora h-[320px] w-[320px] bg-[#f0509e] opacity-25 -left-28 -top-16" />
      <div className="aurora h-[300px] w-[300px] bg-[#a06bff] opacity-25 -right-24 top-0" />
      <div className="aurora h-[240px] w-[240px] bg-[#38d4f5] opacity-20 left-[45%] top-20" />
      <div className="grid-overlay absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {crumbs.length > 0 && (
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <Link href="/" className="transition hover:text-[var(--text)]">
              ホーム
            </Link>
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-2">
                <span>/</span>
                <Link href={c.href} className="transition hover:text-[var(--text)]">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        )}

        <p className="font-en grad-text text-sm font-bold tracking-[0.35em]">{en}</p>
        <h1 className="font-head mt-3 text-3xl font-black tracking-wide sm:text-5xl">{ja}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)] sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
