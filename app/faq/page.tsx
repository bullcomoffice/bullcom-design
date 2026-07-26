import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "BULLCOM designへのよくあるご質問。料金・保守サポート・他社で制作したサイトの引き継ぎ・素材のご用意についてお答えします。",
  alternates: { canonical: "/faq" },
};

// 注: 納期・制作期間など未確定の事実は掲載していない（ユーザー確認後に追加する）
// text は構造化データ（FAQPage）用のプレーンテキスト
const FAQS: { q: string; text: string; a: React.ReactNode }[] = [
  {
    q: "他社で作ったホームページの保守だけお願いできますか？",
    text: "はい、お引き受けできます。「作った業者と連絡がつかない」「更新方法が分からない」という方こそ、ぜひご相談ください。まずは無料のサイト診断で現状を確認し、最適なプランをご提案します。",
    a: (
      <>
        はい、お引き受けできます。「作った業者と連絡がつかない」「更新方法が分からない」という方こそ、
        ぜひご相談ください。まずは
        <strong className="text-[var(--text)]">無料のサイト診断</strong>
        で現状を確認し、最適なプランをご提案します。
      </>
    ),
  },
  {
    q: "料金はどのくらいかかりますか？",
    text: "LP制作は3万円〜、ホームページ制作（〜10ページ）は20万円〜、リニューアルは15万円〜です。別途、ドメイン維持・レンタルサーバー費として年間15,000円＋税をいただいています。表示価格は税別です。",
    a: (
      <>
        LP制作は3万円〜、ホームページ制作（〜10ページ）は20万円〜、リニューアルは15万円〜です。
        別途、ドメイン維持・レンタルサーバー費として年間15,000円＋税をいただいています。
        詳しくは<Link href="/price" className="grad-text font-bold">料金プラン</Link>
        をご覧ください（表示価格は税別です）。
      </>
    ),
  },
  {
    q: "保守サポートには何が含まれますか？",
    text: "月額5,000円のライトプランでサーバー・ドメイン管理、セキュリティ監視、定期バックアップまで。月額10,000円のスタンダードでは軽微な修正・更新代行（月2回まで）、月額20,000円のプレミアムではブログ入稿代行やSEOレポートまで対応します。",
    a: (
      <>
        月額5,000円のライトプランでサーバー・ドメイン管理、セキュリティ監視、定期バックアップまで。
        月額10,000円のスタンダードでは軽微な修正・更新代行（月2回まで）、
        月額20,000円のプレミアムではブログ入稿代行やSEOレポートまで対応します。
      </>
    ),
  },
  {
    q: "写真や文章を用意できないのですが大丈夫ですか？",
    text: "大丈夫です。写真撮影・動画制作、コピーライティングもお引き受けしています。お持ちの素材を活かしつつ、足りない部分を補う形でご提案します。",
    a: (
      <>
        大丈夫です。写真撮影・動画制作、コピーライティングもお引き受けしています。
        お持ちの素材を活かしつつ、足りない部分を補う形でご提案します。
      </>
    ),
  },
  {
    q: "ホームページ以外のデザインもお願いできますか？",
    text: "はい。ロゴ・CI、名刺、チラシ、パンフレット、看板、パッケージまで対応しています。Webと同じトーンで揃えることで、ブランド全体に統一感が生まれます。",
    a: (
      <>
        はい。ロゴ・CI、名刺、チラシ、パンフレット、看板、パッケージまで対応しています。
        Webと同じトーンで揃えることで、ブランド全体に統一感が生まれます。
      </>
    ),
  },
  {
    q: "自分でブログを更新できますか？",
    text: "できます。管理画面（microCMS）から、専門知識なしで記事の追加・編集が可能です。操作方法もお伝えしますし、入稿代行が必要な場合はプレミアムプランで対応します。",
    a: (
      <>
        できます。管理画面（microCMS）から、専門知識なしで記事の追加・編集が可能です。
        操作方法もお伝えしますし、入稿代行が必要な場合はプレミアムプランで対応します。
      </>
    ),
  },
  {
    q: "対応エリアはどこまでですか？",
    text: "日本全国対応しています。お打ち合わせはお電話・LINE・オンラインで承ります。",
    a: <>日本全国対応しています。お打ち合わせはお電話・LINE・オンラインで承ります。</>,
  },
  {
    q: "セキュリティ対策はどうなっていますか？",
    text: "SSL対応はもちろん、保守プランではセキュリティ監視と定期バックアップを標準で行います。Next.jsによる静的サイト構成のため、一般的なCMSに比べて改ざん・乗っ取りのリスクを大きく抑えられます。",
    a: (
      <>
        SSL対応はもちろん、保守プランではセキュリティ監視と定期バックアップを標準で行います。
        Next.jsによる静的サイト構成のため、一般的なCMSに比べて改ざん・乗っ取りのリスクを大きく抑えられます。
      </>
    ),
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.text },
    })),
  };

  return (
    <>
      <PageHero
        en="FAQ"
        image="/scene-support-security.png"
        imageAlt="ホームページ運用を支えるサポートのイメージ"
        ja="よくある質問"
        description="ご相談前によくいただく質問をまとめました。ここにない疑問も、お気軽にお問い合わせください。"
        crumbs={[{ href: "/faq", label: "よくある質問" }]}
      />

      <section className="relative py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <details
                key={faq.q}
                className="glass card-hover group rounded-2xl p-6"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-start gap-4">
                  <span className="font-en grad-text shrink-0 text-xl font-extrabold">Q</span>
                  <span className="font-head flex-1 font-bold leading-snug">{faq.q}</span>
                  <span className="mt-1 shrink-0 text-[var(--text-muted)] transition group-open:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 flex gap-4 border-t border-[var(--border)] pt-4">
                  <span className="font-en shrink-0 text-xl font-extrabold text-[var(--text-muted)]">
                    A
                  </span>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--text-soft)]">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <CtaBand
        title="解決しないことがあれば、直接どうぞ"
        description="お電話・LINE・フォームでお気軽にご質問ください。営業目的のご連絡はいたしません。"
      />
    </>
  );
}
