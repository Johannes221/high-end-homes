import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Puppeteer-Module nicht im Client-Bundle bündeln (nur für Render Backend)
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium", "node-cron", "nodemailer", "@libsql/client", "@prisma/adapter-libsql"],
};

export default nextConfig;
