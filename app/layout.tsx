import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import { COMPANY, PHONE, SITE_URL } from "@/lib/site-data";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--loaded-noto",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--loaded-zen",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--loaded-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bullcom.website"),
  title: {
    default: "BULLCOM design｜思い通りのホームページを - HP制作・デザイン",
    template: "%s｜BULLCOM design",
  },
  description:
    "全国対応のホームページ制作・デザインスタジオ BULLCOM design。Next.js製の高品質サイトをLP 3万円〜、HP制作 20万円〜。公開後の更新サポート・セキュリティ対応まで、思い通りのホームページをおまかせで。",
  keywords: [
    "ホームページ制作",
    "HP作成 おまかせ",
    "HP制作",
    "Web制作",
    "ホームページ 作成",
    "LP制作",
    "ホームページ リニューアル",
    "ホームページ 保守",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BULLCOM design｜思い通りのホームページを",
    description:
      "Next.js製の高品質サイトをLP 3万円〜。デザインから開発、公開後の保守・セキュリティまでおまかせのHP制作スタジオ。",
    url: "https://bullcom.website",
    siteName: "BULLCOM design",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BULLCOM design｜思い通りのホームページを",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BULLCOM design｜思い通りのホームページを",
    description:
      "Next.js製の高品質サイトをLP 3万円〜。デザインから開発、公開後の保守・セキュリティまでおまかせのHP制作スタジオ。",
    images: ["/og-image.png"],
  },
};

// ローカルビジネスの構造化データ（神戸の実拠点・電話・営業時間があるためローカル検索に効く）
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "BULLCOM design",
  alternateName: "ブルコムデザイン",
  description:
    "ホームページ制作・デザイン制作・ブランディング・保守運用を行うデザインスタジオ。全国対応。",
  url: SITE_URL,
  telephone: PHONE,
  faxNumber: COMPANY.fax,
  email: COMPANY.email,
  founder: { "@type": "Person", name: COMPANY.owner },
  foundingDate: "2002-07",
  address: {
    "@type": "PostalAddress",
    postalCode: COMPANY.zip.replace("〒", ""),
    addressCountry: "JP",
    addressRegion: "兵庫県",
    addressLocality: "神戸市西区",
    streetAddress: "伊川谷町有瀬846-10 ギャラリエ1F",
  },
  areaServed: { "@type": "Country", name: "日本" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:30",
      closes: "15:30",
    },
  ],
  paymentAccepted: COMPANY.payment,
  parentOrganization: { "@type": "Organization", name: "BULLCOM", url: "https://bullcom.jp/" },
  makesOffer: [
    { "@type": "Offer", name: "ホームページ制作", price: "200000", priceCurrency: "JPY" },
    { "@type": "Offer", name: "LP制作", price: "30000", priceCurrency: "JPY" },
    { "@type": "Offer", name: "ホームページ保守・運用", price: "5000", priceCurrency: "JPY" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${zenKaku.variable} ${inter.variable}`}>
      <head>
        {/* GA4（プロパティ: BULLCOM design bullcom.website / 2026-08-30 設置）。
            フォームCVは送信後に /contact?sent=1 へ302で戻る作りなので page_view で拾える */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ET4GPWNTYJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ET4GPWNTYJ');
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* TODO: BULLCOM design 専用LINEができたらURL差し替え（現在は既存BULLCOMのLINE） */}
        <FloatingCta />
      </body>
    </html>
  );
}
