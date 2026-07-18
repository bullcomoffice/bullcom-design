import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // microCMS の画像ドメインを許可
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        pathname: "/**",
      },
    ],
    // Cloudflare Pages では自動最適化が使えないため無効化
    unoptimized: true,
  },

  // 静的エクスポート（Cloudflare Pages向け）
  output: "export",
};

export default nextConfig;
