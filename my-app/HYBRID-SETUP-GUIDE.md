# Hybrid Architecture Setup Guide

## Übersicht

- **Backend (Render):** Komplette App mit API Routes, Admin Panel, Database
- **Frontend (Cloudflare Pages):** Nur öffentliche Seiten (später)
- **Cloudflare:** DNS, CDN, SSL

---

## Phase 1: Backend auf Render (JETZT - 15 Minuten)

### 1. Turso Database erstellen

```bash
# Database erstellen
turso db create high-end-homes-prod

# Connection String holen
turso db show high-end-homes-prod

# Token generieren
turso db tokens create high-end-homes-prod
```

Notiere:
- `DATABASE_URL`: `libsql://[your-db].turso.io`
- `DATABASE_AUTH_TOKEN`: `eyJ...`

### 2. Render.com Setup

1. Gehe zu https://render.com
2. Sign up mit GitHub
3. **New Web Service**
4. Repository: `Johannes221/high-end-homes`
5. **Root Directory:** `my-app`
6. **Build Command:** `npm install && npm run build`
7. **Start Command:** `npm start`
8. **Instance Type:** Starter ($7/Monat)

### 3. Environment Variables in Render

Klicke "Advanced" und füge hinzu:

```bash
# REQUIRED
NODE_ENV=production
AUTH_SECRET=<generiere mit: openssl rand -base64 32>
AUTH_URL=https://api.high-end-homes.de
DATABASE_URL=libsql://[your-db].turso.io
DATABASE_AUTH_TOKEN=eyJ...

# OPTIONAL (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=High-End Homes <noreply@high-end-homes.de>
NOTIFICATION_EMAIL=info@high-end-homes.de
CONTACT_EMAIL=info@high-end-homes.de
```

### 4. Deploy Backend

Klicke **"Create Web Service"**

Render startet automatisch den Build. Warte bis Status: **"Live"**

Deine Backend-URL: `https://high-end-homes.onrender.com`

### 5. Database Schema pushen

```bash
# Lokal mit Production DB verbinden
export DATABASE_URL="libsql://[your-db].turso.io"
export DATABASE_AUTH_TOKEN="eyJ..."

cd my-app
npm run prisma:push
```

### 6. Admin User erstellen

```bash
# Bcrypt Hash generieren
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('dein-passwort', 10));"

# In Turso DB einfügen
turso db shell high-end-homes-prod
```

SQL:
```sql
INSERT INTO User (id, email, password, name, createdAt)
VALUES (
  'admin-' || lower(hex(randomblob(16))),
  'admin@high-end-homes.de',
  '$2a$10$...dein-bcrypt-hash...',
  'Admin',
  datetime('now')
);
```

### 7. Backend testen

Öffne: `https://high-end-homes.onrender.com/api/health`

Sollte zeigen:
```json
{
  "ok": true,
  "service": "high-end-homes-backend",
  "database": "ok"
}
```

### 8. Admin Panel testen

1. Öffne: `https://high-end-homes.onrender.com/intern/login`
2. Login mit Admin-Credentials
3. Sollte Dashboard zeigen

✅ **Backend ist live!**

---

## Phase 2: DNS Setup (5 Minuten)

### 1. Custom Domain in Render

1. Render Dashboard → Service → Settings
2. **Custom Domains** → Add Custom Domain
3. Domain: `api.high-end-homes.de`
4. Notiere CNAME Target: `high-end-homes.onrender.com`

### 2. Cloudflare DNS

1. Cloudflare Dashboard → DNS → Records
2. **Add Record:**
   - Type: `CNAME`
   - Name: `api`
   - Target: `high-end-homes.onrender.com`
   - Proxy: `Proxied` (orange cloud)

### 3. Cloudflare SSL/TLS

1. SSL/TLS → Overview
2. Encryption mode: **Full (strict)**

### 4. Environment Variable Update in Render

Gehe zurück zu Render → Environment Variables:

```bash
AUTH_URL=https://api.high-end-homes.de
```

Speichern → Render deployed automatisch neu (2-3 Min)

### 5. Backend mit Custom Domain testen

Öffne: `https://api.high-end-homes.de/api/health`

✅ **Backend läuft auf Custom Domain!**

---

## Phase 3: Frontend auf Cloudflare Pages (SPÄTER - Optional)

**Aktuell:** Komplette App läuft auf Render unter `api.high-end-homes.de`

**Später (wenn gewünscht):**
1. Frontend-Only Build erstellen
2. Auf Cloudflare Pages deployen unter `www.high-end-homes.de`
3. Frontend macht API Calls zu `api.high-end-homes.de`

**Vorteile:**
- Frontend auf Cloudflare CDN (schneller)
- Backend nur für API/Admin (günstiger)

**Nachteil:**
- Mehr Komplexität
- Zwei Deployments

**Empfehlung:** Erstmal so lassen, später optimieren wenn nötig.

---

## Aktueller Stand

✅ Backend auf Render: `api.high-end-homes.de`
✅ Alle API Routes funktionieren
✅ Admin Panel funktioniert
✅ Database verbunden
✅ Cloudflare macht DNS/SSL

**Nächster Schritt:**

Wenn du willst, können wir später:
- `www.high-end-homes.de` auf Cloudflare Pages (nur Frontend)
- `api.high-end-homes.de` bleibt auf Render (Backend)

Aber erstmal: **Teste dein Backend auf `api.high-end-homes.de`!**

---

## Troubleshooting

### Build Failed

**Logs prüfen:** Render Dashboard → Logs

**Häufige Probleme:**
- `package-lock.json` nicht committed
- Root Directory falsch (muss `my-app` sein)
- Environment Variables fehlen

### Database Connection Failed

**Prüfen:**
- `DATABASE_URL` korrekt?
- `DATABASE_AUTH_TOKEN` gesetzt?
- Schema gepusht? (`npm run prisma:push`)

### Custom Domain nicht erreichbar

**Warten:** DNS Propagation kann bis zu 24h dauern

**Prüfen:**
- CNAME in Cloudflare korrekt?
- SSL/TLS auf "Full (strict)"?
- Custom Domain in Render hinzugefügt?

---

## Kosten

**Render:**
- Starter: $7/Monat (empfohlen)
- Free: $0/Monat (schläft nach 15 Min)

**Turso:**
- Starter: $0/Monat (500 MB, 1B reads)

**Cloudflare:**
- DNS/SSL: $0/Monat

**Total:** $7/Monat für Production-ready Setup
