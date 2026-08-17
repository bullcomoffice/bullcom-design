import type { ReactNode } from "react";

/* サイト共通の確定情報（要件定義書 §0/§8 が正。変更時は要件定義書とセットで） */

export const PHONE = "078-912-2656";
export const PHONE_TEL = "tel:078-912-2656";
// TODO: BULLCOM design 専用LINEができたら差し替え（現在は既存BULLCOMと共用）
export const LINE_URL = "https://lin.ee/vX5z2Xf";
export const SITE_URL = "https://bullcom.website";

/* 事業者情報。BULLCOM（bullcom.jp）と同一事業者のデザイン事業ブランド。
   出典: https://bullcom.jp/about/ （2026-07-26 参照） */
export const COMPANY = {
  brand: "BULLCOM design（ブルコムデザイン）",
  operator: "BULLCOM（ブルコム）",
  owner: "芦原 陽右",
  zip: "〒651-2113",
  address: "兵庫県神戸市西区伊川谷町有瀬846-10 ギャラリエ1F",
  fax: "078-939-6660",
  email: "bullcom.office@gmail.com",
  founded: "2002年7月",
  businessHours: "9:30〜15:30（事務所）",
  contactHours: "9:00〜19:00",
  holiday: "不定休",
  area: "日本全国",
  payment: "現金・銀行振込・クレジット・代金引換",
} as const;

/* ============ 制作実績 ============ */

export type Work = {
  category: string;
  title: string;
  description: string;
  label: string;
  image: string;
  /** 公開中のサイトURL（実績カードから遷移できるようにする） */
  url?: string;
};

export const WORKS: Work[] = [
  {
    category: "コーポレート",
    title: "パソコン修理・設定 BULLCOM",
    description: "神戸・明石のパソコン修理店。地域SEOで問い合わせを継続獲得する店舗サイト。",
    label: "PC REPAIR",
    image: "/work-pc-repair.png",
    url: "https://bullcom.jp/",
  },
  {
    category: "買取サービス",
    title: "トラック買取.jp",
    description: "無料査定フォームからLINE査定まで、問い合わせ導線を作り込んだ買取サイト。",
    label: "TRUCK",
    image: "/work-truck.png",
    url: "https://www.truck-asahi.com/",
  },
  {
    category: "買取サービス",
    title: "ボート買取サイト",
    description: "広告×SEOのCV計測を設計し、データで改善を回せるようにした買取サイト。",
    label: "BOAT",
    image: "/work-boat.png",
    url: "https://boatkaitori.com/",
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

export type ServiceDetail = {
  name: string;
  summary: string;
  points: string[];
  price?: string;
};

export type Service = {
  slug: string;
  title: string;
  /** 詳細ページの見出し（H1）に使う。カテゴリ名より具体的に */
  pageTitle: string;
  /** 詳細ページ用のリード文 */
  lead: string;
  metaDescription: string;
  color: string;
  /** 一覧・トップ用の短い説明 */
  description: string;
  /** 一覧・トップ用の箇条書き */
  items: string[];
  prices: { label: string; price: string }[];
  /** 詳細ページに並べるサービス個票 */
  details: ServiceDetail[];
  /** こんな方におすすめ */
  recommended: string[];
  heroImage: string;
  heroAlt: string;
  icon: ReactNode;
};

export const SERVICES: Service[] = [
  {
    slug: "web",
    title: "Web系",
    pageTitle: "ホームページ制作・運用",
    lead:
      "コーポレートサイトからLP、ECサイトまで。Next.jsで「速くて、強くて、育てられる」サイトをつくり、公開後の運用までお引き受けします。",
    metaDescription:
      "BULLCOM designのホームページ制作。コーポレートサイト20万円〜、LP3万円〜、リニューアル15万円〜、EC構築30万円〜。Next.jsによる高速・高セキュリティなサイトを、保守運用までまとめてお任せいただけます。",
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
    details: [
      {
        name: "HP・コーポレートサイト制作",
        summary:
          "会社の顔となるサイトを、構成の設計からご一緒します。スマートフォン表示は標準対応。ブログを自分で更新できる管理画面もお付けできます。",
        points: [
          "構成・ワイヤーフレームの設計からご提案",
          "スマホ・タブレット対応（レスポンシブ）標準",
          "ブログ更新用の管理画面（CMS）に対応",
          "Googleアナリティクス設置・SEOの基本設定込み",
        ],
        price: "20万円〜（〜10ページ）",
      },
      {
        name: "LP制作",
        summary:
          "広告やキャンペーンの受け皿になる1ページ完結型のサイト。問い合わせや申し込みへ迷わず進める導線に絞って構成します。",
        points: [
          "問い合わせ・申し込みへの導線に特化した構成",
          "広告出稿に合わせた短納期のご相談も可能",
          "フォーム設置・計測タグの設定に対応",
        ],
        price: "3万円〜",
      },
      {
        name: "HPリニューアル",
        summary:
          "古くなったサイトを、高速で安全なNext.js製に作り替えます。今の原稿や写真を活かしながら、足りない部分を補って再構成します。",
        points: [
          "既存の原稿・画像を活かした作り替えが可能",
          "表示速度・スマホ対応・SSLをまとめて改善",
          "現状の課題を無料サイト診断で整理してからご提案",
        ],
        price: "15万円〜",
      },
      {
        name: "ECサイト構築",
        summary:
          "ネットショップの開設をお手伝いします。商品登録や受注の流れなど、公開後に運用しやすい形を優先して設計します。",
        points: [
          "商品登録・在庫管理のしやすさを重視した設計",
          "決済・配送まわりのご相談にも対応",
        ],
        price: "30万円〜",
      },
      {
        name: "保守・運用",
        summary:
          "公開後のサーバー管理、セキュリティ監視、更新代行まで。他社で制作されたサイトの保守だけでもお引き受けします。",
        points: [
          "サーバー・ドメイン管理、定期バックアップ",
          "セキュリティ監視で改ざん・乗っ取りを予防",
          "テキストや画像の差し替え、ブログ入稿の代行",
          "他社制作サイトの引き継ぎもOK（まずは無料診断）",
        ],
        price: "月5,000円〜",
      },
    ],
    recommended: [
      "ホームページが古くなっていて、何年も更新できていない",
      "作った業者と連絡が取れず、直したいところが直せない",
      "問い合わせにつながるサイトに作り替えたい",
      "セキュリティや表示速度に不安がある",
    ],
    heroImage: "/service-web.png",
    heroAlt: "ノートPC・タブレット・スマートフォンにホームページのデザインを表示した制作イメージ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    slug: "graphic",
    title: "グラフィック系",
    pageTitle: "ロゴ・印刷物のデザイン",
    lead:
      "ロゴから名刺、チラシ、看板、パッケージまで。Webと同じトーンで紙まわりも整えて、会社の見え方に統一感をつくります。",
    metaDescription:
      "BULLCOM designのグラフィックデザイン。ロゴ・CI 3万円〜、名刺2万円〜、チラシ2万円〜、パンフレット3万円〜、看板3万円〜、パッケージ10万円〜。Webと同じトーンで紙媒体まで一貫してデザインします。",
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
    details: [
      {
        name: "ロゴ・CIデザイン",
        summary:
          "会社やお店の顔になるロゴをおつくりします。名刺・看板・Webなど使う場面を想定して、小さくしても読みやすい形に整えます。",
        points: [
          "複数案からご検討いただけます",
          "縮小時・モノクロでの見え方まで確認",
          "各種データ形式でお渡し（印刷・Web両対応）",
        ],
        price: "3万円〜",
      },
      {
        name: "名刺デザイン",
        summary:
          "渡した相手に伝わる名刺に。ロゴやサイトのトーンに合わせて、情報の優先順位を整理してレイアウトします。",
        points: ["ロゴ・Webとトーンを統一", "印刷用データでお渡し"],
        price: "2万円〜",
      },
      {
        name: "チラシ・パンフレット",
        summary:
          "配布して読まれる紙面をつくります。載せたい情報が多いときも、優先順位を整理して読みやすくまとめます。",
        points: [
          "掲載内容の整理からご相談可能",
          "写真撮影・原稿づくりもあわせて対応",
        ],
        price: "チラシ 2万円〜 / パンフレット 3万円〜",
      },
      {
        name: "看板デザイン",
        summary:
          "遠くからでも伝わる看板に。掲出する場所や見られる距離を踏まえて、視認性優先でデザインします。",
        points: ["設置場所・視認距離を踏まえた設計", "施工業者への入稿データに対応"],
        price: "3万円〜",
      },
      {
        name: "パッケージデザイン",
        summary:
          "商品の魅力が伝わるパッケージをデザインします。素材や形状のご相談も含めて一緒に考えます。",
        points: ["商品の見せ方・訴求内容から整理", "印刷仕様に合わせたデータ作成"],
        price: "10万円〜",
      },
    ],
    recommended: [
      "ロゴがなく、会社の見え方がバラバラになっている",
      "名刺やチラシを、サイトと同じ雰囲気で揃えたい",
      "自分で作った資料に、どうも素人っぽさが残る",
      "Webと紙をまとめて相談できる相手がほしい",
    ],
    heroImage: "/service-graphic.png",
    heroAlt: "名刺・チラシ・パンフレットとカラーチップを並べた印刷物デザインのイメージ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    slug: "branding",
    title: "ブランディング系",
    pageTitle: "ブランディング・コンセプト設計",
    lead:
      "「何を、誰に、どう伝えるか」から一緒に考えます。色・フォント・言葉のルールを決めて、どの媒体でもブレない見え方をつくります。",
    metaDescription:
      "BULLCOM designのブランディング。コンセプト設計からブランドガイドライン策定まで一式20万円〜。色・フォント・言葉づかいのルールを整え、Webから印刷物まで一貫したブランドイメージをつくります。",
    color: "var(--purple)",
    description:
      "「何を、誰に、どう伝えるか」から一緒に設計。色・フォント・言葉のルールを整えて、ブレないブランドをつくります。",
    items: [
      "コンセプト設計・ブランド戦略",
      "ブランドガイドライン策定（色・フォント・使い方のルール集）",
    ],
    prices: [{ label: "ブランディング一式", price: "20万円〜" }],
    details: [
      {
        name: "コンセプト設計・ブランド戦略",
        summary:
          "強みやお客様像を一緒に整理して、伝えるべきメッセージを言葉にします。デザインの前に、方向性を決めるところからご一緒します。",
        points: [
          "ヒアリングで強み・お客様像・競合を整理",
          "伝えたいことをキャッチコピー・メッセージに落とし込み",
          "サイトや紙媒体での見せ方まで見据えて設計",
        ],
      },
      {
        name: "ブランドガイドライン策定",
        summary:
          "使う色、フォント、ロゴの余白、写真の選び方などをルール集にまとめます。誰が作っても同じ雰囲気を保てるようになります。",
        points: [
          "カラーパレット・フォントの指定",
          "ロゴの使い方（余白・最小サイズ・NG例）",
          "写真やトーンの選び方の基準",
        ],
      },
    ],
    recommended: [
      "何を打ち出せばいいのか、自社の強みが整理できていない",
      "担当者や制作物ごとに、デザインの雰囲気がバラバラ",
      "新しく事業やお店を始めるので、最初から世界観を固めたい",
      "外注先に渡せるデザインのルールがほしい",
    ],
    heroImage: "/service-branding.png",
    heroAlt: "カラーパレットや素材見本を並べたブランドのムードボード",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M11 3L8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
  {
    slug: "contents",
    title: "コンテンツ・運用系",
    pageTitle: "撮影・動画・コピーライティング",
    lead:
      "サイトに載せる素材づくりもおまかせください。伝わる写真・動画・文章を用意して、コンテンツの質から集客を底上げします。",
    metaDescription:
      "BULLCOM designの撮影・動画制作・コピーライティング。写真素材や原稿がなくても大丈夫。コピーライティング3万円〜、撮影・動画制作はお見積り。ホームページ制作とあわせてご依頼いただけます。",
    color: "var(--orange)",
    description:
      "サイトに載せる素材づくりもおまかせ。伝わる写真・動画・文章で、コンテンツの質を底上げします。",
    items: ["写真撮影・動画制作", "コピーライティング"],
    prices: [
      { label: "コピーライティング", price: "3万円〜" },
      { label: "写真撮影・動画制作", price: "お見積り" },
    ],
    details: [
      {
        name: "写真撮影",
        summary:
          "サイトやチラシに使う写真を撮影します。スタッフや店内、商品など、実際の様子が伝わるカットをご用意します。",
        points: [
          "サイトの構成に合わせて必要なカットをご提案",
          "撮影した写真はサイト・印刷物どちらにも使用可能",
        ],
        price: "お見積り",
      },
      {
        name: "動画制作",
        summary:
          "サービス紹介や広告用の動画をおつくりします。SNS向けの縦型など、使う場所に合わせた形式で仕上げます。",
        points: ["用途に合わせた尺・形式でご提案", "字幕・テロップ入れに対応"],
        price: "お見積り",
      },
      {
        name: "コピーライティング",
        summary:
          "キャッチコピーやサービス説明文を書きます。「文章を用意するのが一番大変」という方は、ヒアリングをもとにこちらでまとめます。",
        points: [
          "ヒアリング内容から原稿を作成",
          "検索されるキーワードを踏まえた文章に",
          "サイト制作とセットのご依頼も歓迎",
        ],
        price: "3万円〜",
      },
    ],
    recommended: [
      "ホームページに載せる写真がなく、用意する余裕もない",
      "文章を考えるのが苦手で、制作がそこで止まってしまう",
      "SNSや広告に使う動画をつくりたい",
      "サイト制作と素材づくりをまとめて頼みたい",
    ],
    heroImage: "/service-contents.png",
    heroAlt: "カメラ・照明・マイクとノートを並べた撮影と原稿制作のイメージ",
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
