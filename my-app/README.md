# High-End Homes Website

Professionelle Website für Entrümpelung, Entkernung und Kernsanierung.

## Produktionsarchitektur

Für dieses Projekt ist die sinnvollste kleine Produktionsarchitektur:

- Öffentliche Domain und DNS über Cloudflare
- Öffentliches Frontend unter `www.high-end-homes.de`
- Backend, interne Bereiche und APIs auf Render unter `api.high-end-homes.de`
- Kleine libSQL-Datenbank über Turso

Warum so:

- Die App enthält serverseitige Next.js-Features, Auth und API-Routen.
- Für wenig Datenvolumen brauchst du keine große Postgres-/Mongo-Infrastruktur.
- Turso/libSQL ist für diesen Scope günstig, schnell und deutlich einfacher als ein schweres DB-Setup.

## Datenbank-Empfehlung

Empfohlen:

- `Turso / libSQL`

Warum passend:

- kleine Datenmenge
- sehr wenig Operations-Aufwand
- Prisma ist bereits mit `@prisma/adapter-libsql` integriert
- funktioniert gut mit Render

Aktuelle Datenbank im Projekt:

- lokal: SQLite/libSQL über `DATABASE_URL="file:./dev.db"`
- Produktion: libSQL remote, z. B. `libsql://<db>.turso.io`

Nicht nötig für euren Scope:

- kein MongoDB-Cluster
- kein separates Redis-Setup
- keine große Postgres-Installation, solange Datenmenge und Schreiblast moderat bleiben

## Lokale Entwicklung

```bash
npm install
npm run prisma:generate:local
npm run prisma:push:local
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Environment-Variablen

### Frontend / Cloudflare

| Variable | Beispiel | Zweck |
|----------|----------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.high-end-homes.de` | Öffentliche API-Basis für das Formular |

### Backend / Render

| Variable | Beispiel | Zweck |
|----------|----------|-------|
| `AUTH_URL` | `https://api.high-end-homes.de` | Kanonische Backend-URL für Auth.js |
| `AUTH_SECRET` | langer zufälliger String | Pflicht für Sessions/Auth |
| `PUBLIC_APP_URL` | `https://www.high-end-homes.de` | Öffentliche Website-URL |
| `FRONTEND_URL` | `https://www.high-end-homes.de` | Erlaubte Frontend-Origin |
| `ALLOWED_ORIGIN` | `https://www.high-end-homes.de` | CORS-Origin für Formular-Requests |
| `DATABASE_URL` | `libsql://<db>.turso.io` | Produktionsdatenbank |
| `DATABASE_AUTH_TOKEN` | `...` | Turso Auth-Token |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP Host |
| `SMTP_PORT` | `587` | SMTP Port |
| `SMTP_USER` | `...` | SMTP User |
| `SMTP_PASS` | `...` | SMTP Passwort/App-Passwort |
| `SMTP_FROM` | `High-End Homes <noreply@high-end-homes.de>` | Absender |
| `NOTIFICATION_EMAIL` | `info@high-end-homes.de` | Zieladresse für Angebotsbenachrichtigungen |
| `CRON_SECRET` | zufälliger String | Schutz für `/api/cron` |
| `SERPAPI_KEY` | `...` | Preisvergleich/Scraping |
| `QUOTE_ARCHIVE_DIR` | leer lassen | Nur setzen, wenn explizit Datei-Archivierung gewünscht ist |

## Render Deployment

Die Datei `render.yaml` ist vorbereitet.

### Service anlegen

1. Repo mit Render verbinden
2. `Blueprint` oder `Web Service` aus `render.yaml` erstellen
3. Root Directory ist `my-app`
4. Healthcheck läuft über `/api/health`

### Build und Start

- Build: `npm ci && npm run build:production`
- Start: `npm run start`

### Nach erstem Deploy

Schema auf die Produktions-DB anwenden:

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run prisma:push
```

## Cloudflare Setup

## Variante, die ich für euch empfehle

Cloudflare übernimmt:

- DNS
- SSL
- WAF/CDN
- Domain-Routing

Und du legst an:

- `www.high-end-homes.de` -> öffentliche Website
- `api.high-end-homes.de` -> Render Backend

### DNS Einträge

- `www` -> Ziel je nach Frontend-Hosting
- `api` -> Render Custom Domain

### Wenn du die Marketing-Seite getrennt auf Cloudflare hosten willst

Dann muss der öffentliche Frontend-Teil separat gebaut oder extrahiert werden.

Wichtig:

- Die aktuelle Codebasis ist keine rein statische Frontend-App.
- Interne Bereiche, Auth und API bleiben serverseitig und gehören auf Render.
- Das öffentliche Angebotsformular kann bereits getrennt auf das Render-Backend zeigen über `NEXT_PUBLIC_BACKEND_URL`.

## Empfohlenes Domain-Setup

- `https://www.high-end-homes.de` -> öffentliches Frontend
- `https://api.high-end-homes.de` -> Next.js Backend auf Render

Beispiel:

- Frontend sendet Formular an `https://api.high-end-homes.de/api/quote`
- Backend erlaubt CORS nur von `https://www.high-end-homes.de`

## Produktionscheckliste

1. Turso DB anlegen
2. `DATABASE_URL` und `DATABASE_AUTH_TOKEN` in Render setzen
3. `AUTH_SECRET` generieren und in Render setzen
4. `AUTH_URL=https://api.high-end-homes.de` setzen
5. `PUBLIC_APP_URL`, `FRONTEND_URL`, `ALLOWED_ORIGIN` auf `https://www.high-end-homes.de` setzen
6. SMTP-Zugang setzen
7. `npm run prisma:push` gegen die Produktions-DB ausführen
8. Render Healthcheck prüfen: `/api/health`
9. Frontend-Env `NEXT_PUBLIC_BACKEND_URL=https://api.high-end-homes.de` setzen
10. Formular live testen

## Hinweise

- Render-Filesystem ist nicht für persistente Archivierung gedacht. Deshalb ist Dateispeicherung in Production standardmäßig deaktiviert.
- Angebotsanfragen werden in der Datenbank gespeichert.
- E-Mail-Benachrichtigungen werden nur versendet, wenn SMTP-Variablen gesetzt sind.

## Kontakt

**High-End Homes**  
Bennet Pfeifer  
Gerhard-Hauptmann Straße 38  
69221 Dossenheim
