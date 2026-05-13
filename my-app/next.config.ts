import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Bypass on-the-fly Sharp optimisation on the Render Starter dyno
    // (0.5 CPU / 512 MB). The source images in /public are already
    // hand-tuned WebP between 88 KB and 250 KB, so further server-side
    // re-encoding only costs latency and OOMs.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Hand-tuned static media in /public — long-lived browser + CDN cache.
        source: '/:all*.(webp|avif|jpg|jpeg|png|svg|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Vorher/Nachher and other nested static media.
        source: '/before-after/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Puppeteer-Module nicht im Client-Bundle bündeln (nur für Render Backend)
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium", "node-cron", "nodemailer", "@libsql/client", "@prisma/adapter-libsql"],
};

export default nextConfig;
