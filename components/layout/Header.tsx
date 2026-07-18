"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "#works", label: "制作実績" },
  { href: "#price", label: "料金" },
  { href: "#services", label: "サービス" },
  { href: "#strength", label: "選ばれる理由" },
  { href: "#contact", label: "お問い合わせ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[rgba(8,8,15,0.75)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/logo-mark.png"
            alt="BULLCOM design ロゴ"
            width={36}
            height={35}
            priority
          />
          <span className="font-en text-lg font-bold tracking-tight">
            BULLCOM <span className="grad-text">design</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--text-soft)] transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:078-912-2656"
            className="font-en flex items-center gap-1.5 text-sm font-bold tracking-wide text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--cyan)">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
            </svg>
            078-912-2656
          </a>
          <a href="#contact" className="btn btn-grad px-5 py-2.5 text-sm">
            無料相談する
          </a>
        </div>

        <button
          type="button"
          aria-label="メニュー"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--border)] bg-[rgba(8,8,15,0.95)] px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--surface)] hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex gap-3">
              <a href="tel:078-912-2656" className="btn btn-ghost flex-1 px-4 py-3 text-sm">
                電話する
              </a>
              <a
                href="#contact"
                className="btn btn-grad flex-1 px-4 py-3 text-sm"
                onClick={() => setOpen(false)}
              >
                無料相談する
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
