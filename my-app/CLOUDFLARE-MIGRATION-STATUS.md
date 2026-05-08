# Cloudflare Pages Migration Status

## ⚠️ KRITISCHES PROBLEM

Die meisten API Routes nutzen **Node.js-only** Features, die auf Cloudflare Edge **NICHT** funktionieren:

| Feature | Verwendet in | Edge-kompatibel? |
|---------|--------------|------------------|
| Prisma | Alle `/api/quotes/*`, `/api/user`, `/api/auth/register`, `/api/health` | ❌ Nein |
| Nodemailer | `/api/contact`, `/api/quote` | ❌ Nein |
| bcryptjs | `/api/auth/register`, `/api/user` | ❌ Nein |
| fs/path | `/api/quote` | ❌ Nein |
| NextAuth | `/api/auth/[...nextauth]` | ⚠️ Teilweise (nur JWT) |

## Lösung: Hybrid-Architektur

### Frontend (Cloudflare Pages)
- Alle öffentlichen Seiten (statisch)
- Keine API Routes
- Macht fetch() Calls zu Render Backend

### Backend (Render)
- Alle API Routes
- Prisma, Database
- NextAuth
- Email (Nodemailer)
- Admin Panel (`/intern/*`)

## Nächste Schritte

Da **ALLE API Routes** Node.js Features nutzen, müssen wir:

### Option A: Alle APIs auf Render lassen (EMPFOHLEN)

1. **Frontend auf Cloudflare Pages:**
   - Nur öffentliche Seiten
   - Static Export
   - Macht API Calls zu `https://api.high-end-homes.de`

2. **Backend auf Render:**
   - Komplette aktuelle App
   - Alle API Routes
   - Admin Panel
   - Database

**Vorteil:** Minimale Code-Änderungen

### Option B: APIs neu schreiben für Edge

Jede API Route müsste umgeschrieben werden:

```ts
// Vorher (Node.js)
const user = await prisma.user.findUnique({ where: { email } });

// Nachher (Edge)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${email}`);
const user = await response.json();
```

**Nachteil:** 2-3 Tage Arbeit für alle Routes

## Empfehlung

**Nutze Option A:**

1. **Cloudflare Pages** für Frontend (statische Seiten)
2. **Render** für komplettes Backend (API + Admin)
3. Frontend macht fetch() zu Render

**Setup:**
- Siehe `SPLIT-ARCHITECTURE.md` für Details
- Frontend: `output: 'export'` in next.config.ts
- Backend: Komplette aktuelle App auf Render

## Aktueller Stand

✅ `@cloudflare/next-on-pages` installiert
✅ `wrangler.toml` erstellt
✅ `runtime = 'edge'` zu allen API Routes hinzugefügt
❌ **Aber:** Alle API Routes nutzen Node.js Features

**Nächster Schritt:** Entscheide zwischen Option A oder B
