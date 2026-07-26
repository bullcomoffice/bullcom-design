export default function SectionHead({
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
