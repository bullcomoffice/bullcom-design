import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  },
  twitter: {
    card: "summary",
    title: "BULLCOM design｜思い通りのホームページを",
    description:
      "Next.js製の高品質サイトをLP 3万円〜。デザインから開発、公開後の保守・セキュリティまでおまかせのHP制作スタジオ。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${zenKaku.variable} ${inter.variable}`}>
      {/* TODO: GA4 の測定ID発行後、bullcom 本家と同様に <Script> で gtag を設置する */}
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* TODO: BULLCOM design 専用LINEができたらURL差し替え（現在は既存BULLCOMのLINE） */}
        <a
          href="https://lin.ee/vX5z2Xf"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-line"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 5.6 2 10c0 2.8 1.8 5.3 4.6 6.7-.1.6-.6 2.4-.7 2.7-.1.4.2.4.4.3.2-.1 2.6-1.8 3.7-2.5.7.1 1.3.1 2 .1 5.5 0 10-3.6 10-8.3S17.5 2 12 2z" />
          </svg>
          LINEで相談
        </a>
      </body>
    </html>
  );
}
