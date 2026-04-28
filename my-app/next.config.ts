import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Puppeteer-Module nicht im Client-Bundle bündeln
  serverExternalPackages: ["puppeteer", "puppeteer-core", "node-cron", "nodemailer", "@libsql/client", "@prisma/adapter-libsql"],
};

export default nextConfig;
