import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ui/ContactForm";
import { LINE_URL, PHONE, PHONE_TEL } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "BULLCOM designへのお問い合わせ。お電話（078-912-2656）・LINE・メールフォームで承ります。ご相談・お見積りは無料です。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        en="CONTACT"
        image="/sub-contact-desk.png"
        imageAlt="電話・LINE・メールフォームでの相談窓口をイメージしたデスク"
        ja="お問い合わせ"
        description="ご相談・お見積りは無料です。「まだ何も決まってない」段階でも大歓迎。お気軽にどうぞ。"
        crumbs={[{ href: "/contact", label: "お問い合わせ" }]}
      />

      <section className="relative overflow-hidden py-8">
        <div className="aurora h-[340px] w-[340px] bg-[#a06bff] opacity-20 right-[8%] top-0" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            <a
              href={PHONE_TEL}
              className="glass card-hover flex flex-col items-center gap-3 rounded-2xl p-8 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--pink)] to-[var(--purple)] text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
                </svg>
              </span>
              <p className="font-head font-bold">お電話</p>
              <p className="font-en text-2xl font-extrabold tracking-wide">{PHONE}</p>
              <p className="text-xs text-[var(--text-muted)]">タップで発信できます</p>
            </a>

            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass card-hover flex flex-col items-center gap-3 rounded-2xl p-8 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--line-green)] text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 5.6 2 10c0 2.8 1.8 5.3 4.6 6.7-.1.6-.6 2.4-.7 2.7-.1.4.2.4.4.3.2-.1 2.6-1.8 3.7-2.5.7.1 1.3.1 2 .1 5.5 0 10-3.6 10-8.3S17.5 2 12 2z" />
                </svg>
              </span>
              <p className="font-head font-bold">LINE</p>
              <p className="text-sm text-[var(--text-soft)]">友だち追加して</p>
              <p className="-mt-2 text-sm text-[var(--text-soft)]">そのままトークで相談</p>
              <p className="text-xs text-[var(--text-muted)]">24時間受付・写真も送れます</p>
            </a>

            <a
              href="#contact-form"
              className="glass card-hover flex flex-col items-center gap-3 rounded-2xl p-8 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </span>
              <p className="font-head font-bold">メールフォーム</p>
              <p className="text-sm text-[var(--text-soft)]">下のフォームから24時間受付</p>
              <p className="text-xs text-[var(--text-muted)]">参考画像の添付もできます</p>
            </a>
          </div>

          <div className="subpage-contact-visual relative mt-12 overflow-hidden rounded-[1.75rem] border border-white/70 shadow-[0_20px_55px_rgba(88,67,166,0.14)]">
            <Image
              src="/sub-services-studio.png"
              alt="制作の相談からはじまるクリエイティブな時間のイメージ"
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
            <div className="subpage-hero-shine absolute inset-0" />
          </div>

          <div className="mt-14">
            <ContactForm />
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm leading-relaxed text-[var(--text-soft)]">
            <p className="font-head mb-2 font-bold text-[var(--text)]">ご相談前に</p>
            <ul className="flex flex-col gap-1.5">
              <li>・ご相談、お見積りは無料です。しつこい営業はいたしません。</li>
              <li>・他社で制作されたサイトの保守・リニューアルのご相談も歓迎です。</li>
              <li>・お急ぎの場合はお電話が確実です。</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="pb-20" />
    </>
  );
}
