"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/lib/visit-source";

/** 閲覧したページを記録する（お問い合わせメールに流入元を載せるため。lib/visit-source.ts 参照） */
export default function VisitSourceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageView(pathname);
  }, [pathname]);

  return null;
}
