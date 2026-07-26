import type { ReactNode } from "react";

/* サイト共通の確定情報（要件定義書 §0/§8 が正。変更時は要件定義書とセットで） */

export const PHONE = "078-912-2656";
export const PHONE_TEL = "tel:078-912-2656";
// TODO: BULLCOM design 専用LINEができたら差し替え（現在は既存BULLCOMと共用）
export const LINE_URL = "https://lin.ee/vX5z2Xf";
export const SITE_URL = "https://bullcom.website";

/* ============ 制作実績 ============ */

export type Work = {
  category: string;
  title: string;
  description: string;
  label: string;
  image: string;
};

export const WORKS: Work[] = [
  {
    category: "コーポレート",
    title: "パソコン修理・設定 BULLCOM",
    description: "神戸・明石のパソコン修理店。地域SEOで問い合わせを継続獲得する店舗サイト。",
    label: "PC REPAIR",
    image: "/work-pc-repair.png",
  },
  {
    category: "買取・販売",
    title: "トラック買取・販売サイト",
    description: "在庫掲載からSNS自動投稿・広告動画まで、集客の仕組みごと構築した事例。",
    label: "TRUCK",
    image: "/work-truck.png",
  },
  {
    category: "買取サービス",
    title: "ボート買取サイト",
    description: "広告×SEOのCV計測を設計し、データで改善を回せるようにした買取サイト。",
    label: "BOAT",
    image: "/work-boat.png",
  },
];

/* ============ 料金 ============ */

export const HP_PRICES = [
  {
    name: "LP制作",
    price: "3",
    unit: "万円〜",
    note: "1ページ完結型。広告・キャンペーンの受け皿に",
    gradient: "linear-gradient(90deg, #f0509e, #ffab4a)",
    featured: false,
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
    featured: false,
  },
  {
    name: "EC構築",
    price: "30",
    unit: "万円〜",
    note: "ネットショップ開設。運用しやすさを重視した設計",
    gradient: "linear-gradient(90deg, #4f8dff, #38d4f5)",
    featured: false,
  },
];

export const GRAPHIC_PRICES = [
  { name: "ロゴ単体 / CI一式", price: "3万円〜" },
  { name: "名刺デザイン作成", price: "2万円〜" },
  { name: "チラシ作成", price: "2万円〜" },
  { name: "パンフレット作成", price: "3万円〜" },
  { name: "看板デザイン作成", price: "3万円〜" },
  { name: "パッケージデザイン", price: "10万円〜" },
  { name: "ブランディング（コンセプト設計＋ガイドライン）", price: "20万円〜" },
  { name: "コピーライティング", price: "3万円〜" },
];

export const SUBSC_PLANS = [
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

/* ============ サービス ============ */

export type Service = {
  title: string;
  color: string;
  description: string;
  items: string[];
  prices: { label: string; price: string }[];
  icon: ReactNode;
};

export const SERVICES: Service[] = [
  {
    title: "Web系",
    color: "var(--blue)",
    description:
      "設計から開発、公開後の運用まで一貫対応。Next.js製の高速で安全なサイトを、集客の仕組みごと構築します。",
    items: [
      "HP・コーポレートサイト制作（新規/リニューアル）",
      "LP制作（広告用の1ページ完結型）",
      "ECサイト構築",
      "保守・運用（更新代行、サーバー管理、障害対応）",
    ],
    prices: [
      { label: "LP制作", price: "3万円〜" },
      { label: "HP制作（〜10P）", price: "20万円〜" },
      { label: "HPリニューアル", price: "15万円〜" },
      { label: "EC構築", price: "30万円〜" },
      { label: "保守・運用", price: "月5,000円〜" },
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
    description:
      "Webと同じトーンで紙まわりもデザイン。名刺からパッケージまで、会社の顔を統一感のあるビジュアルに整えます。",
    items: [
      "ロゴ・CI（企業の顔まわり一式）",
      "名刺・チラシ・パンフレット・看板",
      "パッケージデザイン",
    ],
    prices: [
      { label: "ロゴ単体 / CI一式", price: "3万円〜" },
      { label: "名刺デザイン", price: "2万円〜" },
      { label: "チラシ", price: "2万円〜" },
      { label: "パンフレット", price: "3万円〜" },
      { label: "看板デザイン", price: "3万円〜" },
      { label: "パッケージ", price: "10万円〜" },
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
    description:
      "「何を、誰に、どう伝えるか」から一緒に設計。色・フォント・言葉のルールを整えて、ブレないブランドをつくります。",
    items: [
      "コンセプト設計・ブランド戦略",
      "ブランドガイドライン策定（色・フォント・使い方のルール集）",
    ],
    prices: [{ label: "ブランディング一式", price: "20万円〜" }],
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
    description:
      "サイトに載せる素材づくりもおまかせ。伝わる写真・動画・文章で、コンテンツの質を底上げします。",
    items: ["写真撮影・動画制作", "コピーライティング"],
    prices: [
      { label: "コピーライティング", price: "3万円〜" },
      { label: "写真撮影・動画制作", price: "お見積り" },
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
];

/* ============ 選ばれる理由 ============ */

export type Strength = {
  no: string;
  title: string;
  description: string;
  color: string;
  icon: ReactNode;
};

export const STRENGTHS: Strength[] = [
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
