#!/bin/bash
set -e

echo "Installing Chrome dependencies for Puppeteer..."

# Install Chrome dependencies (Debian/Ubuntu)
apt-get update
apt-get install -y \
  chromium \
  chromium-driver \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libatspi2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libwayland-client0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  xdg-utils \
  || echo "Warning: Some Chrome dependencies could not be installed"

echo "Running npm install..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Building Next.js app..."
npm run build

echo "Build complete!"
