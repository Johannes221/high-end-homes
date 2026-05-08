# Frontend/Backend Split Architecture

## Übersicht

- **Frontend (Cloudflare Pages)**: Statische Next.js App mit öffentlichen Seiten
- **Backend (Render)**: Next.js App mit API Routes, Auth, Admin Panel

## Struktur

### Frontend (Cloudflare Pages)
```
Öffentliche Seiten:
- / (Homepage)
- /entkernung, /entruempelung, /hausaufloesung (Service-Seiten)
- /entkernung-heidelberg, etc. (Lokale Seiten)
- /kontakt (Kontaktformular)
- /angebot (Quote-Formular)
- /faq, /ueber-uns, /region
- /maler, /sanitaer, etc. (Handwerker-Seiten)

Build: Static Export (HTML/CSS/JS)
Domain: www.high-end-homes.de
```

### Backend (Render)
```
API Routes & Admin:
- /api/contact (POST)
- /api/quote (POST)
- /api/quotes (GET - auth required)
- /api/quotes/[id] (GET/PUT - auth required)
- /api/quotes/[id]/pdf (GET - auth required)
- /api/auth/[...nextauth] (NextAuth)
- /api/auth/register (POST)
- /api/user (GET/PATCH/DELETE - auth required)
- /api/health (GET)

Admin Panel:
- /intern (Dashboard)
- /intern/quotes (Quote Management)
- /intern/login
- /intern/register

Domain: api.high-end-homes.de (oder Render URL)
```

## Problem: Static Export Einschränkungen

Next.js Static Export unterstützt **NICHT**:
- ❌ API Routes (`/api/*`)
- ❌ Server-Side Rendering (SSR)
- ❌ NextAuth (benötigt Server)
- ❌ Dynamic Routes mit `getServerSideProps`
- ❌ Middleware

## Lösung: Zwei separate Deployments

### Option A: Zwei Next.js Apps (EMPFOHLEN)

**Frontend App (my-app-frontend/)**
- Nur öffentliche Seiten
- Static Export
- Macht API Calls zu Backend
- Deployed auf Cloudflare Pages

**Backend App (my-app-backend/)**
- Nur API Routes + Admin Panel
- Vollständiges Next.js SSR
- Prisma, NextAuth, etc.
- Deployed auf Render

### Option B: Monorepo mit Workspaces

```
high-end-homes/
├── packages/
│   ├── frontend/    (Cloudflare Pages)
│   └── backend/     (Render)
└── package.json     (Workspace root)
```

## Aktueller Stand

Die aktuelle App ist eine **Monolith-App** mit:
- Öffentlichen Seiten
- API Routes
- Admin Panel
- NextAuth
- Prisma

**Diese kann NICHT als Static Export deployed werden.**

## Nächste Schritte

### Schnelle Lösung: Alles auf Render

1. Entferne `output: 'export'` aus `next.config.ts`
2. Deploy komplette App auf Render
3. Cloudflare nur für DNS nutzen
4. Fertig in 10 Minuten

### Langfristige Lösung: Split Architecture

1. Frontend-App erstellen (nur öffentliche Seiten)
2. Backend-App erstellen (API + Admin)
3. Frontend deployed auf Cloudflare Pages
4. Backend deployed auf Render
5. Frontend macht API Calls zu Backend

**Zeitaufwand: 2-3 Stunden Refactoring**

## Empfehlung

**Für jetzt: Alles auf Render deployen**

Warum?
- Funktioniert sofort
- Keine Code-Änderungen nötig
- Cloudflare kann trotzdem für DNS/CDN genutzt werden
- Später kann man immer noch splitten

**Später: Split Architecture**

Wenn Traffic/Performance wichtig wird:
- Frontend auf Cloudflare Pages (schneller, günstiger)
- Backend auf Render (nur für API/Admin)
- Bessere Skalierung

## Setup für "Alles auf Render"

1. **Render.com Setup:**
   - New Web Service
   - Build: `npm run build`
   - Start: `npm start`
   - Environment Variables setzen

2. **next.config.ts ändern:**
   ```ts
   // output: 'export' ENTFERNEN
   const nextConfig: NextConfig = {
     images: { unoptimized: true },
     serverExternalPackages: [...]
   };
   ```

3. **Cloudflare DNS:**
   - CNAME `www` → `your-app.onrender.com`
   - CNAME `@` → `your-app.onrender.com`
   - SSL/TLS: Full

4. **Render Custom Domain:**
   - Add custom domain: `www.high-end-homes.de`
   - Verify DNS

Fertig! App läuft auf Render, Cloudflare macht DNS/CDN.
