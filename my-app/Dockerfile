FROM node:22-bookworm-slim

# Chromium-Abhängigkeiten für @sparticuz/chromium / puppeteer
# + build-essential + python3 für native node modules (lightningcss/tailwind v4)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    openssl \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencies installieren (einmalig — native binaries bleiben erhalten)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Prisma schema + config kopieren, Client generieren
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# Rest des Source-Codes kopieren
COPY . .

# Next.js Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
