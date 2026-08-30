import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-data";

// output: "export" では明示が要る（無いと "not configured on route" でビルドが落ちる）
export const dynamic = "force-static";

// 対策台帳 A-3。
//
// 背景: 自前の robots.txt が無かったため、Cloudflare の **Managed robots.txt** が配信されており、
// GPTBot / ClaudeBot / Google-Extended / CCBot 等を `Disallow: /` でブロックしていた。
// GEO（AI検索での露出）を目的にしているサイトで、これは意図と正反対。
//
// AIクローラは**明示的に Allow で列挙する**。robots.txt の仕様では、同じ User-agent に対する
// 同じ長さのパス指定で Allow と Disallow が競合した場合、より制限の緩い Allow が優先される。
// Cloudflare 側の managed content が後ろに連結されても、この明示的な Allow が効くようにしておく。
// （恒久的には Cloudflare ダッシュボードで Managed robots.txt を無効化すること）
const AI_BOTS = [
  "GPTBot", // OpenAI（学習・参照）
  "OAI-SearchBot", // ChatGPT の検索
  "ChatGPT-User", // ChatGPT のユーザー起点アクセス
  "ClaudeBot", // Anthropic
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Google の AI Overviews / Gemini グラウンディング
  "Applebot-Extended",
  "CCBot", // Common Crawl（各種LLMの学習元）
  "meta-externalagent",
  "Bytespider",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
