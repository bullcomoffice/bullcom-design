import Link from "next/link";
import { LINE_URL, PHONE, PHONE_TEL } from "@/lib/site-data";

// CV導線（優先順: 電話 → フォーム → LINE）
// モバイル: 画面下に固定バー（電話・フォーム・LINE）
// デスクトップ: 右下にLINEボタンのみ（ヘッダーに電話と無料相談があるため）
export default function FloatingCta() {
  return (
    <>
      {/* モバイル固定バー */}
      <div className="floating-bar lg:hidden">
        <a href={PHONE_TEL} className="floating-bar-item floating-bar-tel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
          </svg>
          <span>
            電話する
            <span className="floating-bar-sub">{PHONE}</span>
          </span>
        </a>

        <Link href="/contact" className="floating-bar-item floating-bar-form">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </svg>
          <span>
            フォーム
            <span className="floating-bar-sub">24時間受付</span>
          </span>
        </Link>

        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-bar-item floating-bar-line"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.5 2 2 5.6 2 10c0 2.8 1.8 5.3 4.6 6.7-.1.6-.6 2.4-.7 2.7-.1.4.2.4.4.3.2-.1 2.6-1.8 3.7-2.5.7.1 1.3.1 2 .1 5.5 0 10-3.6 10-8.3S17.5 2 12 2z" />
          </svg>
          <span>
            LINE
            <span className="floating-bar-sub">写真も送れます</span>
          </span>
        </a>
      </div>

      {/* デスクトップ: 右下LINE */}
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-line hidden lg:inline-flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.5 2 2 5.6 2 10c0 2.8 1.8 5.3 4.6 6.7-.1.6-.6 2.4-.7 2.7-.1.4.2.4.4.3.2-.1 2.6-1.8 3.7-2.5.7.1 1.3.1 2 .1 5.5 0 10-3.6 10-8.3S17.5 2 12 2z" />
        </svg>
        LINEで相談
      </a>
    </>
  );
}
