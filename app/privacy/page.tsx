import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { COMPANY, PHONE, PHONE_TEL } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "BULLCOM designのプライバシーポリシー（個人情報保護方針）。お客様からお預かりした個人情報の取得・利用目的・管理・第三者提供・開示請求、およびアクセス解析ツールの利用について定めています。",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. 個人情報の定義",
    body: (
      <p>
        本ポリシーにおける「個人情報」とは、個人情報の保護に関する法律に定める個人情報を指し、
        生存する個人に関する情報のうち、氏名、住所、電話番号、メールアドレスなどにより
        特定の個人を識別できるものをいいます。
      </p>
    ),
  },
  {
    title: "2. 個人情報の取得",
    body: (
      <>
        <p>
          当方は、お問い合わせフォーム、お電話、LINE、メールなどを通じて、
          適法かつ公正な手段により個人情報を取得します。取得する項目は次のとおりです。
        </p>
        <ul>
          <li>お名前、会社名・屋号</li>
          <li>メールアドレス、電話番号</li>
          <li>ご相談内容、および添付いただいた資料・画像</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. 利用目的",
    body: (
      <>
        <p>取得した個人情報は、次の目的の範囲内で利用します。</p>
        <ul>
          <li>お問い合わせ・ご相談への回答、お見積りのご提示</li>
          <li>ご依頼いただいた制作・保守業務の遂行およびご連絡</li>
          <li>契約の履行、料金のご請求</li>
          <li>サービス品質の向上のための分析</li>
        </ul>
        <p>
          上記の目的以外に利用する必要が生じた場合は、あらかじめご本人の同意を得たうえで利用します。
        </p>
      </>
    ),
  },
  {
    title: "4. 第三者への提供",
    body: (
      <>
        <p>
          当方は、次のいずれかに該当する場合を除き、ご本人の同意なく個人情報を第三者に提供しません。
        </p>
        <ul>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要があり、ご本人の同意を得ることが困難な場合</li>
          <li>
            利用目的の達成に必要な範囲内で、業務の一部を外部に委託する場合（この場合、委託先に対して
            必要かつ適切な監督を行います）
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "5. 個人情報の管理",
    body: (
      <p>
        当方は、個人情報の紛失、破壊、改ざん、漏えいなどを防止するため、
        通信の暗号化（SSL/TLS）をはじめとする必要かつ適切な安全管理措置を講じます。
        また、個人情報を利用する必要がなくなったときは、遅滞なく消去するよう努めます。
      </p>
    ),
  },
  {
    title: "6. お問い合わせフォームの送信について",
    body: (
      <p>
        本サイトのお問い合わせフォームでは、送信内容の受け取りに外部のフォーム送信サービスを
        利用しています。送信いただいた内容は、当方が受信するために必要な範囲で
        当該サービスを経由して処理されます。
      </p>
    ),
  },
  {
    title: "7. アクセス解析ツールについて",
    body: (
      <p>
        本サイトでは、サイトの利用状況を把握するためにアクセス解析ツールを利用する場合があります。
        これらのツールはCookieを使用してデータを収集しますが、収集される情報は匿名であり、
        個人を特定するものではありません。Cookieの利用はブラウザの設定により無効にすることができます。
      </p>
    ),
  },
  {
    title: "8. 開示・訂正・削除のご請求",
    body: (
      <p>
        ご本人から、個人情報の開示、訂正、追加、削除、利用停止のご請求があった場合は、
        ご本人であることを確認したうえで、法令に従い速やかに対応します。
        ご請求は下記のお問い合わせ窓口までご連絡ください。
      </p>
    ),
  },
  {
    title: "9. 本ポリシーの変更",
    body: (
      <p>
        法令の改正やサービス内容の変更に伴い、本ポリシーを変更する場合があります。
        変更後の内容は、本ページに掲載した時点から効力を生じるものとします。
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        en="PRIVACY POLICY"
        ja="プライバシーポリシー"
        description="BULLCOM design（以下「当方」）は、お客様からお預かりする個人情報の重要性を認識し、以下の方針に基づいて適切に取り扱います。"
        crumbs={[{ href: "/privacy", label: "プライバシーポリシー" }]}
      />

      <section className="relative py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col gap-5">
            {SECTIONS.map((section) => (
              <div key={section.title} className="glass rounded-2xl p-7">
                <h2 className="font-head text-lg font-bold">{section.title}</h2>
                <div className="prose-privacy mt-4">{section.body}</div>
              </div>
            ))}
          </div>

          {/* お問い合わせ窓口 */}
          <div className="grad-border mt-8 p-7">
            <h2 className="font-head text-lg font-bold">10. お問い合わせ窓口</h2>
            <dl className="mt-4 flex flex-col gap-2 text-sm text-[var(--text-soft)]">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="w-28 shrink-0 font-bold text-[var(--text-muted)]">事業者名</dt>
                <dd>
                  {COMPANY.brand}（{COMPANY.operator}）
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="w-28 shrink-0 font-bold text-[var(--text-muted)]">代表者</dt>
                <dd>{COMPANY.owner}</dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="w-28 shrink-0 font-bold text-[var(--text-muted)]">所在地</dt>
                <dd>
                  {COMPANY.zip} {COMPANY.address}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="w-28 shrink-0 font-bold text-[var(--text-muted)]">電話番号</dt>
                <dd>
                  <a href={PHONE_TEL} className="font-en font-bold text-[var(--text)]">
                    {PHONE}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="w-28 shrink-0 font-bold text-[var(--text-muted)]">メール</dt>
                <dd>{COMPANY.email}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-8 text-right text-xs text-[var(--text-muted)]">
            制定日：2026年7月26日
          </p>
        </div>
      </section>

      <div className="pb-12" />
    </>
  );
}
