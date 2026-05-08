# 🚀 START HERE - Deployment Guide

## Quick Start

**Ziel:** Backend auf Render deployen unter `api.high-end-homes.de`

**Zeit:** 15 Minuten

**Kosten:** $7/Monat (Render Starter)

---

## Schritt-für-Schritt

### 1. Turso Database (2 Min)

```bash
turso db create high-end-homes-prod
turso db show high-end-homes-prod
turso db tokens create high-end-homes-prod
```

Notiere `DATABASE_URL` und `DATABASE_AUTH_TOKEN`

### 2. Render.com Setup (5 Min)

1. https://render.com → Sign up mit GitHub
2. New Web Service → Repository: `Johannes221/high-end-homes`
3. Root Directory: `my-app`
4. Build: `npm install && npm run build`
5. Start: `npm start`

### 3. Environment Variables (2 Min)

In Render "Advanced":

```bash
NODE_ENV=production
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=https://api.high-end-homes.de
DATABASE_URL=libsql://[your-db].turso.io
DATABASE_AUTH_TOKEN=eyJ...
```

### 4. Deploy (3 Min)

Klicke "Create Web Service" → Warte auf "Live"

### 5. Database Schema (1 Min)

```bash
export DATABASE_URL="libsql://[your-db].turso.io"
export DATABASE_AUTH_TOKEN="eyJ..."
cd my-app
npm run prisma:push
```

### 6. Admin User (2 Min)

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('dein-passwort', 10));"
turso db shell high-end-homes-prod
```

```sql
INSERT INTO User (id, email, password, name, createdAt)
VALUES ('admin-' || lower(hex(randomblob(16))), 'admin@high-end-homes.de', '$2a$10$...', 'Admin', datetime('now'));
```

### 7. DNS Setup (Optional - später)

Cloudflare DNS:
- CNAME `api` → `high-end-homes.onrender.com`

---

## Fertig! ✅

**Backend läuft auf:**
- Render URL: `https://high-end-homes.onrender.com`
- Custom Domain (später): `https://api.high-end-homes.de`

**Teste:**
- Health: `/api/health`
- Admin: `/intern/login`

---

## Vollständige Anleitung

Siehe `HYBRID-SETUP-GUIDE.md` für Details.

---

## Später: Frontend auf Cloudflare Pages

Wenn du willst, können wir später:
- Frontend auf `www.high-end-homes.de` (Cloudflare Pages)
- Backend bleibt auf `api.high-end-homes.de` (Render)

Aber erstmal: **Backend deployen und testen!**
