import Image from "next/image";
import ContactForm from "@/components/ui/ContactForm";

/* ============ データ定義 ============ */

const WORKS = [
  {
    category: "コーポレート",
    title: "パソコン修理・設定 BULLCOM",
    description: "神戸・明石のパソコン修理店。地域SEOで問い合わせを継続獲得する店舗サイト。",
    gradient: "linear-gradient(135deg, #4f8dff, #38d4f5)",
    label: "PC REPAIR",
  },
  {
    category: "買取・販売",
    title: "トラック買取・販売サイト",
    description: "在庫掲載からSNS自動投稿・広告動画まで、集客の仕組みごと構築した事例。",
    gradient: "linear-gradient(135deg, #ffab4a, #f0509e)",
    label: "TRUCK",
  },
  {
    category: "買取サービス",
    title: "ボート買取サイト",
    description: "広告×SEOのCV計測を設計し、データで改善を回せるようにした買取サイト。",
    gradient: "linear-gradient(135deg, #38d4f5, #a06bff)",
    label: "BOAT",
  },
];

const HP_PRICES = [
  {
    name: "LP制作",
    price: "3",
    unit: "万円〜",
    note: "1ページ完結型。広告・キャンペーンの受け皿に",
    gradient: "linear-gradient(90deg, #f0509e, #ffab4a)",
  },
  {
    name: "HP制作（〜10P）",
    price: "20",
    unit: "万円〜",
    note: "コーポレートサイトの新規制作。設計から公開まで",
    gradient: "linear-gradient(90deg, #f0509e, #a06bff)",
    featured: true,
  },
  {
    name: "HPリニューアル",
    price: "15",
    unit: "万円〜",
    note: "古いサイトを高速・安全なNext.js製に作り替え",
    gradient: "linear-gradient(90deg, #a06bff, #4f8dff)",
  },
  {
    name: "EC構築",
    price: "30",
    unit: "万円〜",
    note: "ネットショップ開設。運用しやすさを重視した設計",
    gradient: "linear-gradient(90deg, #4f8dff, #38d4f5)",
  },
];

const GRAPHIC_PRICES = [
  { name: "ロゴ単体 / CI一式", price: "3万円〜" },
  { name: "名刺デザイン作成", price: "2万円〜" },
  { name: "チラシ作成", price: "2万円〜" },
  { name: "パンフレット作成", price: "3万円〜" },
  { name: "看板デザイン作成", price: "3万円〜" },
  { name: "パッケージデザイン", price: "10万円〜" },
  { name: "ブランディング（コンセプト設計＋ガイドライン）", price: "20万円〜" },
  { name: "コピーライティング", price: "3万円〜" },
];

const SUBSC_PLANS = [
  {
    name: "ライト",
    price: "5,000",
    features: ["サーバー・ドメイン管理", "セキュリティ監視", "定期バックアップ"],
    featured: false,
  },
  {
    name: "スタンダード",
    price: "10,000",
    features: [
      "ライトの内容すべて",
      "軽微な修正・更新代行（月2回まで）",
      "テキスト・画像の差し替え対応",
    ],
    featured: true,
  },
  {
    name: "プレミアム",
    price: "20,000",
    features: ["スタンダードの内容すべて", "ブログ入稿代行", "SEOレポート", "優先対応"],
    featured: false,
  },
];

const SERVICES = [
  {
    title: "Web系",
    color: "var(--blue)",
    items: [
      "HP・コーポレートサイト制作（新規/リニューアル）",
      "LP制作（広告用の1ページ完結型）",
      "ECサイト構築",
      "保守・運用（更新代行、サーバー管理、障害対応）",
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "グラフィック系",
    color: "var(--pink)",
    items: [
      "ロゴ・CI（企業の顔まわり一式）",
      "名刺・チラシ・パンフレット・看板",
      "パッケージデザイン",
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: "ブランディング系",
    color: "var(--purple)",
    items: [
      "コンセプト設計・ブランド戦略",
      "ブランドガイドライン策定（色・フォント・使い方のルール集）",
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M11 3L8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
  {
    title: "コンテンツ・運用系",
    color: "var(--orange)",
    items: ["写真撮影・動画制作", "コピーライティング"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
];

const STRENGTHS = [
  {
    no: "01",
    title: "Next.jsで、速くて強いサイトを",
    description:
      "表示速度はSEOと離脱率に直結します。BULLCOM designは大手も採用するNext.jsで、高速表示・SEOに強いサイトを標準品質としてお届けします。",
    color: "var(--cyan)",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    no: "02",
    title: "作って終わりにしない",
    description:
      "「作った業者と連絡がつかない」「更新できず古いまま」をなくしたい。公開後の更新代行・保守サブスクで、ホームページを育て続けます。",
    color: "var(--pink)",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
  },
  {
    no: "03",
    title: "セキュリティに強い",
    description:
      "盾のロゴは安心の証。SSL対応・セキュリティ監視・バックアップを標準対応し、改ざんや乗っ取りからあなたのサイトを守ります。",
    color: "var(--purple)",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

/* ============ セクション見出し ============ */

function SectionHead({
  en,
  ja,
  description,
}: {
  en: string;
  ja: string;
  description?: string;
}) {
  return (
    <div className="mb-12 text-center">
      <p className="font-en grad-text text-sm font-bold tracking-[0.35em]">{en}</p>
      <h2 className="font-head mt-3 text-3xl font-black tracking-wide sm:text-4xl">{ja}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
          {description}
        </p>
      )}
    </div>
  );
}

/* ============ ページ本体 ============ */

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-svh items-center overflow-hidden pt-16">
        {/* aurora background */}
        <div className="aurora h-[420px] w-[420px] bg-[#f0509e] opacity-35 -left-32 top-10" />
        <div className="aurora h-[380px] w-[380px] bg-[#a06bff] opacity-35 right-[-100px] top-[-60px]" />
        <div className="aurora h-[360px] w-[360px] bg-[#4f8dff] opacity-30 bottom-[-120px] left-[30%]" />
        <div className="aurora h-[280px] w-[280px] bg-[#38d4f5] opacity-25 right-[15%] bottom-[-40px]" />
        <div className="aurora h-[240px] w-[240px] bg-[#ffab4a] opacity-20 left-[45%] top-[5%]" />
        <div className="grid-overlay absolute inset-0" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="anim-fade-up font-en flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-[var(--text-soft)]">
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
              <a href="tel:078-912-2656" className="btn btn-grad px-7 py-4 text-base">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
                </svg>
                無料相談 078-912-2656
              </a>
              <a
                href="https://lin.ee/vX5z2Xf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line px-6 py-4 text-base"
              >
                LINEで相談
              </a>
              <a href="#price" className="btn btn-ghost px-6 py-4 text-base">
                料金を見る
              </a>
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

          <div className="anim-fade-up delay-2 relative mx-auto hidden max-w-xs lg:block lg:max-w-sm">
            <div className="aurora h-[280px] w-[280px] bg-[#f0509e] opacity-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Image
              src="/logo-mark.png"
              alt="BULLCOM design シンボルマーク"
              width={487}
              height={471}
              priority
              className="anim-float relative drop-shadow-[0_20px_60px_rgba(240,80,158,0.45)]"
            />
          </div>
        </div>
      </section>

      {/* ================= WORKS ================= */}
      <section id="works" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            en="WORKS"
            ja="制作実績"
            description="BULLCOMシリーズをはじめ、集客の仕組みまで含めたサイトづくりをしています。実績は順次追加予定です。"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {WORKS.map((work) => (
              <article key={work.title} className="glass card-hover overflow-hidden rounded-2xl">
                <div
                  className="relative flex h-44 items-center justify-center overflow-hidden"
                  style={{ background: work.gradient }}
                >
                  <div className="absolute left-4 top-4 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/40" />
                    ))}
                  </div>
                  <p className="font-en text-3xl font-extrabold tracking-[0.2em] text-white/85">
                    {work.label}
                  </p>
                </div>
                <div className="p-6">
                  <span className="font-en inline-block rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs font-semibold text-[var(--text-soft)]">
                    {work.category}
                  </span>
                  <h3 className="font-head mt-3 text-lg font-bold">{work.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {work.description}
                  </p>
                </div>
              </article>
            ))}
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

          {/* 保守サブスク */}
          <div className="mt-20">
            <div className="mb-10 text-center">
              <h3 className="font-head text-2xl font-black tracking-wide sm:text-3xl">
                公開後も安心の<span className="grad-text-warm">保守サポート</span>
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
                ホームページは作ってからが本番。他社で作ったサイトの保守もOKです。
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
                  <h4 className="font-head text-lg font-bold">{plan.name}</h4>
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
              <span className="font-en font-bold text-white">年間15,000円＋税</span>
            </p>
          </div>

          {/* グラフィック・その他 */}
          <div className="mt-20">
            <div className="mb-8 text-center">
              <h3 className="font-head text-2xl font-black tracking-wide">
                デザイン制作の料金
              </h3>
            </div>
            <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
              {GRAPHIC_PRICES.map((item) => (
                <div
                  key={item.name}
                  className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--border)] py-3.5 text-sm"
                >
                  <span className="text-[var(--text-soft)]">{item.name}</span>
                  <span className="font-en shrink-0 font-bold text-white">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
              ※表示価格は税別です。内容・ボリュームにより変動します。まずはお気軽にご相談ください。
            </p>
          </div>
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
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <div key={service.title} className="glass card-hover rounded-2xl p-7">
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
                  <h3 className="font-head text-xl font-bold">{service.title}</h3>
                </div>
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
              </div>
            ))}
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
          <div className="grid gap-6 md:grid-cols-3">
            {STRENGTHS.map((item) => (
              <div key={item.no} className="glass card-hover relative rounded-2xl p-7">
                <p className="font-en absolute right-6 top-5 text-5xl font-extrabold text-white/8">
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

          {/* 無料診断バナー */}
          <div className="grad-border mt-16 overflow-hidden">
            <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center md:px-12">
              <div className="aurora h-[220px] w-[220px] bg-[#f0509e] opacity-25 -left-20 -top-20" />
              <div className="aurora h-[220px] w-[220px] bg-[#4f8dff] opacity-25 -bottom-20 -right-20" />
              <h3 className="font-head relative text-2xl font-black tracking-wide sm:text-3xl">
                そのホームページ、<span className="grad-text">無料診断</span>しませんか？
              </h3>
              <p className="relative max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
                「他社で作ったけど更新されていない」「表示が遅い」「セキュリティが不安」——
                他社制作のサイトもOK。現状を無料で診断して、改善プランをご提案します。
              </p>
              <div className="relative flex flex-wrap justify-center gap-4">
                <a href="tel:078-912-2656" className="btn btn-grad px-7 py-3.5 text-sm">
                  電話で診断を依頼する
                </a>
                <a
                  href="https://lin.ee/vX5z2Xf"
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

      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative overflow-hidden py-24">
        <div className="aurora h-[360px] w-[360px] bg-[#a06bff] opacity-20 right-[10%] top-0" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHead
            en="CONTACT"
            ja="お問い合わせ"
            description="ご相談・お見積りは無料です。「まだ何も決まってない」段階でも大歓迎。お気軽にどうぞ。"
          />
          <div className="grid gap-5 md:grid-cols-3">
            <a
              href="tel:078-912-2656"
              className="glass card-hover flex flex-col items-center gap-3 rounded-2xl p-8 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--pink)] to-[var(--purple)] text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
                </svg>
              </span>
              <p className="font-head font-bold">お電話</p>
              <p className="font-en text-2xl font-extrabold tracking-wide">078-912-2656</p>
              <p className="text-xs text-[var(--text-muted)]">タップで発信できます</p>
            </a>

            <a
              href="https://lin.ee/vX5z2Xf"
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
              <p className="text-sm text-[var(--text-soft)] -mt-2">そのままトークで相談</p>
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

          <div className="mt-14">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
