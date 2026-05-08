import type { NextConfig } from "next";

// Setup Cloudflare Pages dev platform
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = await import('@cloudflare/next-on-pages/next-dev');
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Puppeteer-Module nicht im Client-Bundle bündeln (nur für Render Backend)
  serverExternalPackages: ["puppeteer", "puppeteer-core", "node-cron", "nodemailer", "@libsql/client", "@prisma/adapter-libsql"],
};

export default nextConfig;
