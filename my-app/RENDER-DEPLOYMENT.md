# Render.com Deployment Guide

## Schnellstart (10 Minuten)

### 1. Render Account Setup

1. Gehe zu https://render.com
2. Sign up mit GitHub Account
3. Autorisiere Render für GitHub Zugriff

### 2. Web Service erstellen

1. Dashboard → "New +" → "Web Service"
2. GitHub Repository auswählen: `Johannes221/high-end-homes`
3. Name: `high-end-homes`
4. Root Directory: `my-app`
5. Runtime: `Node`
6. Build Command: `npm install && npm run build`
7. Start Command: `npm start`
8. Instance Type: `Starter` ($7/Monat) oder `Free` (für Testing)

### 3. Environment Variables

Klicke auf "Advanced" und füge hinzu:

**REQUIRED:**
```
NODE_ENV=production
AUTH_SECRET=<generiere mit: openssl rand -base64 32>
AUTH_URL=https://high-end-homes.onrender.com
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-turso-token
```

**OPTIONAL (Email):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=High-End Homes <noreply@high-end-homes.de>
NOTIFICATION_EMAIL=info@high-end-homes.de
CONTACT_EMAIL=info@high-end-homes.de
```

**OPTIONAL (URLs):**
```
PUBLIC_APP_URL=https://www.high-end-homes.de
```

### 4. Deploy

Klicke "Create Web Service" → Render startet automatisch den Build

### 5. Turso Database Setup

Während Render buildet:

```bash
# Database erstellen
turso db create high-end-homes-prod

# Connection String und Token holen
turso db show high-end-homes-prod
turso db tokens create high-end-homes-prod

# Schema pushen
export DATABASE_URL="libsql://your-database.turso.io"
export DATABASE_AUTH_TOKEN="your-token"
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

### 7. Custom Domain (Cloudflare)

#### In Render:

1. Settings → Custom Domains
2. Add Custom Domain: `www.high-end-homes.de`
3. Notiere die CNAME Target (z.B. `high-end-homes.onrender.com`)

#### In Cloudflare DNS:

1. DNS → Records
2. Add Record:
   - Type: `CNAME`
   - Name: `www`
   - Target: `high-end-homes.onrender.com`
   - Proxy status: `Proxied` (orange cloud)
3. Add Record:
   - Type: `CNAME`
   - Name: `@`
   - Target: `high-end-homes.onrender.com`
   - Proxy status: `Proxied`

#### In Cloudflare SSL/TLS:

1. SSL/TLS → Overview
2. Encryption mode: `Full (strict)`

#### Environment Variable Update:

Zurück zu Render → Environment Variables:
```
AUTH_URL=https://www.high-end-homes.de
PUBLIC_APP_URL=https://www.high-end-homes.de
```

Speichern → Render deployed automatisch neu

---

## Fertig! 🎉

Deine App läuft jetzt auf:
- **Production:** https://www.high-end-homes.de
- **Render URL:** https://high-end-homes.onrender.com
- **Admin Panel:** https://www.high-end-homes.de/intern

---

## Monitoring & Logs

### Logs ansehen:
1. Render Dashboard → Service auswählen
2. "Logs" Tab
3. Live-Stream der Server-Logs

### Metrics:
1. "Metrics" Tab
2. CPU, Memory, Response Times

### Deployments:
1. "Events" Tab
2. Alle Deployments und deren Status

---

## Troubleshooting

### Build Failed

**Problem:** `npm install` oder `npm run build` schlägt fehl

**Lösung:**
1. Logs prüfen
2. Sicherstellen dass `package.json` und `package-lock.json` committed sind
3. Root Directory auf `my-app` gesetzt ist

### Database Connection Failed

**Problem:** `DATABASE_URL ist in Production erforderlich`

**Lösung:**
1. Environment Variables prüfen
2. `DATABASE_URL` und `DATABASE_AUTH_TOKEN` korrekt gesetzt?
3. Turso Database erreichbar?

### Auth Errors (401)

**Problem:** Login funktioniert nicht

**Lösung:**
1. `AUTH_SECRET` gesetzt?
2. `AUTH_URL` stimmt mit Domain überein?
3. Admin User in Database vorhanden?

### Custom Domain nicht erreichbar

**Problem:** `www.high-end-homes.de` lädt nicht

**Lösung:**
1. DNS Propagation abwarten (bis zu 24h)
2. CNAME in Cloudflare korrekt?
3. SSL/TLS auf "Full (strict)" gesetzt?
4. Custom Domain in Render hinzugefügt?

---

## Automatische Deployments

Render deployed automatisch bei jedem Push zu `main`:

1. Push zu GitHub
2. Render erkennt Änderungen
3. Build startet automatisch
4. Bei Erfolg: Live in ~2-3 Minuten

---

## Kosten

### Render Pricing:

- **Free Tier:**
  - $0/Monat
  - 750 Stunden/Monat
  - Schläft nach 15 Min Inaktivität
  - Gut für Testing

- **Starter:**
  - $7/Monat
  - Immer aktiv
  - Empfohlen für Production

- **Standard:**
  - $25/Monat
  - Mehr Ressourcen
  - Für höheren Traffic

### Turso Database:

- **Starter:**
  - $0/Monat
  - 500 MB Storage
  - 1 Milliarde Row Reads
  - Ausreichend für Start

---

## Backup & Rollback

### Rollback zu vorherigem Deployment:

1. Render Dashboard → "Events"
2. Vorheriges erfolgreiches Deployment auswählen
3. "Redeploy" klicken

### Database Backup:

```bash
# Backup erstellen
turso db shell high-end-homes-prod ".backup backup.db"

# Restore
turso db shell high-end-homes-prod ".restore backup.db"
```

---

## Support

- **Render Docs:** https://render.com/docs
- **Turso Docs:** https://docs.turso.tech
- **Next.js Docs:** https://nextjs.org/docs
