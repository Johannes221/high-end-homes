# Cloudflare Pages Deployment Guide

## Voraussetzungen

1. **Turso Database** erstellen:
   ```bash
   turso db create high-end-homes-prod
   turso db show high-end-homes-prod
   turso db tokens create high-end-homes-prod
   ```

2. **NextAuth Secret** generieren:
   ```bash
   openssl rand -base64 32
   ```

## Cloudflare Pages Setup

### 1. Build Configuration

- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `my-app`
- **Node version**: 22.x

### 2. Environment Variables (Settings → Environment Variables)

#### Production Environment

**REQUIRED:**
```
AUTH_SECRET=<generated-secret-from-openssl>
AUTH_URL=https://www.high-end-homes.de
DATABASE_URL=libsql://<your-database>.turso.io
DATABASE_AUTH_TOKEN=<your-turso-token>
NODE_ENV=production
```

**OPTIONAL (Email):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
SMTP_FROM=High-End Homes <noreply@high-end-homes.de>
NOTIFICATION_EMAIL=info@high-end-homes.de
CONTACT_EMAIL=info@high-end-homes.de
```

**OPTIONAL (URLs):**
```
PUBLIC_APP_URL=https://www.high-end-homes.de
```

### 3. Custom Domain Setup

1. Cloudflare Pages → Custom domains → Add custom domain
2. Domain: `www.high-end-homes.de`
3. DNS wird automatisch konfiguriert

### 4. Database Migration

Nach dem ersten Deployment:

```bash
# Lokal mit Production-DB verbinden
export DATABASE_URL="libsql://<your-database>.turso.io"
export DATABASE_AUTH_TOKEN="<your-turso-token>"

# Schema pushen
npm run prisma:push

# Optional: Admin-User erstellen
turso db shell high-end-homes-prod
```

SQL für Admin-User:
```sql
INSERT INTO User (id, email, password, name, createdAt)
VALUES (
  'admin-' || lower(hex(randomblob(16))),
  'admin@high-end-homes.de',
  '<bcrypt-hash>',
  'Admin',
  datetime('now')
);
```

Bcrypt-Hash generieren:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## Troubleshooting

### Build Failures

1. **"DATABASE_URL ist in Production erforderlich"**
   - Gelöst durch `NEXT_PHASE` Check in `lib/prisma.ts` und `prisma.config.ts`
   - Build verwendet dummy URL, Runtime benötigt echte URL

2. **"Module '@prisma/client' has no exported member 'PrismaClient'"**
   - Gelöst durch `postinstall` Script in `package.json`
   - Prisma Client wird automatisch nach `npm ci` generiert

3. **"picomatch version mismatch"**
   - Gelöst durch npm `overrides` in `package.json`
   - Erzwingt `picomatch@^4.0.4` überall

### Runtime Issues

1. **401 Unauthorized bei Login**
   - `AUTH_SECRET` in Environment Variables setzen
   - `AUTH_URL` muss mit tatsächlicher Domain übereinstimmen

2. **Database Connection Failed**
   - `DATABASE_URL` und `DATABASE_AUTH_TOKEN` prüfen
   - Turso Database muss erreichbar sein

3. **Emails werden nicht gesendet**
   - SMTP-Variablen sind optional
   - Ohne SMTP werden Emails nur geloggt (kein Fehler)

## Deployment Checklist

- [ ] Turso Database erstellt
- [ ] Database Schema gepusht (`prisma db push`)
- [ ] Admin-User in DB angelegt
- [ ] AUTH_SECRET generiert und gesetzt
- [ ] DATABASE_URL gesetzt
- [ ] DATABASE_AUTH_TOKEN gesetzt
- [ ] AUTH_URL auf Production-Domain gesetzt
- [ ] Custom Domain konfiguriert
- [ ] SSL/TLS aktiv (automatisch durch Cloudflare)
- [ ] Test-Login durchgeführt
- [ ] Test-Quote-Request durchgeführt

## Monitoring

- **Build Logs**: Cloudflare Pages Dashboard → Deployments → [Deployment] → Build log
- **Function Logs**: Cloudflare Dashboard → Workers & Pages → [Project] → Logs
- **Database**: Turso Dashboard oder `turso db inspect`

## Rollback

Falls ein Deployment fehlschlägt:
1. Cloudflare Pages Dashboard → Deployments
2. Vorheriges erfolgreiches Deployment auswählen
3. "Rollback to this deployment" klicken
