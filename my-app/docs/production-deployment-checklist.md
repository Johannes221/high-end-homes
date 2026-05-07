# Production Deployment Checklist

Diese Anleitung ist für genau diese Zielarchitektur geschrieben:

- `www.high-end-homes.de` = öffentliches Frontend
- `api.high-end-homes.de` = Next.js Backend auf Render
- Turso = Produktionsdatenbank
- Cloudflare = DNS, SSL, Proxy, Domainverwaltung

## 1. Turso Datenbank anlegen

1. Öffne https://turso.tech/
2. Klicke auf `Sign up`
3. Logge dich am einfachsten mit `Google` ein
4. Erstelle eine neue Datenbank
5. Vergib einen Namen, z. B. `high-end-homes-prod`
6. Öffne die Datenbankdetails
7. Kopiere die Datenbank-URL
   - Beispiel: `libsql://high-end-homes-prod-xyz.turso.io`
8. Erstelle einen Auth Token
9. Kopiere den Token

Du brauchst danach genau diese zwei Werte:

```env
DATABASE_URL=libsql://high-end-homes-prod-xyz.turso.io
DATABASE_AUTH_TOKEN=dein-token
```

## 2. Render Account und Backend anlegen

1. Öffne https://render.com/
2. Klicke auf `Get Started`
3. Logge dich am einfachsten mit `Google` oder `GitHub` ein
4. Verbinde das Git-Repository von diesem Projekt
5. Klicke in Render auf `New +`
6. Wähle `Blueprint`
7. Wähle dein Repository
8. Render erkennt die Datei `render.yaml`
9. Bestätige die Erstellung

Wichtig:

- Service-Name: `high-end-homes-backend`
- Root Directory: `my-app`
- Healthcheck: `/api/health`

## 3. Render Environment Variablen setzen

Gehe in Render in den Service:

- `Environment`
- `Environment Variables`

Setze dort alles aus dieser Liste:

```env
NODE_ENV=production
AUTH_URL=https://api.high-end-homes.de
AUTH_SECRET=HIER_EINEN_LANGEN_ZUFAELLIGEN_STRING_EINTRAGEN
PUBLIC_APP_URL=https://www.high-end-homes.de
FRONTEND_URL=https://www.high-end-homes.de
ALLOWED_ORIGIN=https://www.high-end-homes.de
DATABASE_URL=libsql://DEINE-TURSO-DB.turso.io
DATABASE_AUTH_TOKEN=DEIN_TURSO_TOKEN
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=DEINE_EMAIL
SMTP_PASS=DEIN_APP_PASSWORT
SMTP_FROM=High-End Homes <noreply@high-end-homes.de>
NOTIFICATION_EMAIL=info@high-end-homes.de
CRON_SECRET=HIER_EINEN_ZUFAELLIGEN_STRING_EINTRAGEN
SERPAPI_KEY=DEIN_SERPAPI_KEY
QUOTE_ARCHIVE_DIR=
```

## 4. AUTH_SECRET und CRON_SECRET erzeugen

Wenn du lokal im Projektordner bist, kannst du einen Secret so erzeugen:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Diesen Befehl machst du zweimal:

- einmal für `AUTH_SECRET`
- einmal für `CRON_SECRET`

## 5. Produktions-DB-Schema anwenden

Nachdem der Render-Service angelegt ist und die Variablen gesetzt sind:

### Variante A: lokal auf deinem Rechner

Im Ordner `my-app` ausführen:

```bash
DATABASE_URL="libsql://DEINE-DB.turso.io" DATABASE_AUTH_TOKEN="DEIN_TOKEN" npm run prisma:push
```

### Variante B: Render Shell

Falls Render Shell verfügbar ist:

```bash
npm run prisma:push
```

Wichtig: Das geht nur, wenn `DATABASE_URL` und `DATABASE_AUTH_TOKEN` bereits in Render gesetzt sind.

## 6. Healthcheck testen

Wenn Render deployed hat:

1. Öffne die Render-URL
2. Hänge `/api/health` an
3. Beispiel:

```txt
https://dein-render-service.onrender.com/api/health
```

Erwartet wird:

```json
{
  "ok": true,
  "service": "high-end-homes-backend",
  "database": "ok"
}
```

## 7. Cloudflare Domain verbinden

1. Öffne https://dash.cloudflare.com/
2. Logge dich ein
3. Domain hinzufügen, falls noch nicht in Cloudflare
4. Wechsle auf deine Domain
5. Öffne `DNS`

Dann:

### Für das Backend

1. In Render beim Service `Settings` öffnen
2. `Custom Domains` öffnen
3. `api.high-end-homes.de` hinzufügen
4. Render zeigt dir den Zielhost oder CNAME an
5. Diesen Eintrag in Cloudflare unter `DNS` anlegen

### Für das Frontend

Wenn dein öffentliches Frontend separat gehostet wird:

- `www.high-end-homes.de` auf diesen Host zeigen lassen

Wenn du es erstmal einfach halten willst:

- lass zunächst alles Backend-seitig über Render laufen
- und verbinde später erst das getrennte Frontend

## 8. Frontend Variable setzen

Dort, wo dein öffentliches Frontend gebaut/gehostet wird, muss diese Variable gesetzt werden:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.high-end-homes.de
```

Dadurch sendet das Formular an:

```txt
https://api.high-end-homes.de/api/quote
```

## 9. Gmail SMTP vorbereiten

Wenn du Gmail nutzt:

1. In dein Google-Konto gehen
2. `2-Faktor-Authentifizierung` aktivieren
3. `App-Passwörter` öffnen
4. Neues App-Passwort erzeugen
5. Dieses Passwort als `SMTP_PASS` verwenden

Beispiel:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=deine@gmail.com
SMTP_PASS=dein-google-app-passwort
```

## 10. Was du nach dem Deploy testen musst

### Öffentliche Tests

1. `https://www.high-end-homes.de` öffnen
2. Formular abschicken
3. Prüfen, ob Anfrage erfolgreich gespeichert wird

### Backend-Tests

1. `https://api.high-end-homes.de/api/health` aufrufen
2. Prüfen, ob `ok: true`

### Render Logs

1. Render öffnen
2. Service auswählen
3. `Logs` öffnen
4. Prüfen, ob keine DB- oder Auth-Fehler auftreten

## 11. Wenn du es maximal einfach willst

Die einfachste sinnvolle Kombination für dieses Projekt ist:

- Turso für DB
- Render für Backend
- Cloudflare für Domain + DNS + SSL

Nicht sinnvoll für den aktuellen Code-Stand:

- MongoDB einbauen
- DB-Technologie jetzt noch wechseln
- komplettes Auth-System umbauen

Grund:

- Prisma + libSQL ist schon eingebaut
- ein Wechsel auf MongoDB wäre unnötige Zusatzarbeit
- ihr habt wenig Datenvolumen, also bringt Mongo hier keinen Vorteil

## 12. Meine Empfehlung

Mach genau in dieser Reihenfolge:

1. Turso Account mit Google anlegen
2. DB erstellen
3. URL + Token kopieren
4. Render Service per `render.yaml` anlegen
5. Env Variablen setzen
6. `npm run prisma:push` mit Produktionswerten ausführen
7. Healthcheck testen
8. Cloudflare `api.high-end-homes.de` auf Render verbinden
9. Frontend `NEXT_PUBLIC_BACKEND_URL` setzen
10. Formular live testen
