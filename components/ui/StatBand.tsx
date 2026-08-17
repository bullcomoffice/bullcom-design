import Reveal from "@/components/ui/Reveal";

// 事実ベースの数字のみ掲載する（誇張・推測は載せない）
const STATS = [
  { value: "2002", unit: "年創業", note: "BULLCOMとして24年" },
  { value: "6", unit: "サイト", note: "自社運営のBULLCOMシリーズ" },
  { value: "3", unit: "万円〜", note: "LP制作の価格" },
  { value: "5,000", unit: "円〜", note: "公開後の保守サポート（月額）" },
];

export default function StatBand() {
  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="stat-band grid gap-6 rounded-2xl px-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-10">
            {STATS.map((stat) => (
              <div key={stat.note} className="text-center">
                <p className="font-en">
                  <span className="grad-text text-4xl font-extrabold tracking-tight">
                    {stat.value}
                  </span>
                  <span className="ml-1 text-sm font-bold text-[var(--text-soft)]">
                    {stat.unit}
                  </span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-soft)]">{stat.note}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
