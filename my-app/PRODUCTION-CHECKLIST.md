# Production Deployment Checklist

## ✅ Code-Änderungen abgeschlossen

- [x] ImageUpload Komponente erweitert
- [x] QuoteFormTabs neu implementiert mit Submit-Handlern
- [x] Navigation um "Angebot einholen" erweitert
- [x] Backend-Bildanzeige verifiziert
- [x] Tests mit echten Bildern durchgeführt

## 📋 Pre-Deployment Checks

### 1. Umgebungsvariablen (Render)

Stelle sicher, dass folgende Variablen in Render konfiguriert sind:

```bash
# Auth & URLs
AUTH_URL=https://www.high-end-homes.de
AUTH_SECRET=<secure-random-string>
PUBLIC_APP_URL=https://www.high-end-homes.de

# Datenbank (Turso)
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=<turso-token>

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<gmail-address>
SMTP_PASS=<gmail-app-password>
SMTP_FROM=High-End Homes <noreply@high-end-homes.de>
NOTIFICATION_EMAIL=info@high-end-homes.de
CONTACT_EMAIL=info@high-end-homes.de

# Optional
NEXT_PUBLIC_BACKEND_URL=
FRONTEND_URL=
ALLOWED_ORIGIN=
QUOTE_ARCHIVE_DIR=
```

### 2. Build-Konfiguration

- [x] `package.json` Build-Script vorhanden
- [x] Next.js 16 kompatibel
- [x] Prisma Generate im Build-Prozess
- [ ] Render Build-Command: `npm run build`
- [ ] Render Start-Command: `npm start`

### 3. Datenbank-Migration

```bash
# Lokal testen
npx prisma db push

# Auf Production (über Render Console)
npx prisma db push
```

### 4. Git Commit & Push

```bash
git add .
git commit -m "feat: Kontaktformular mit Bild-Upload funktionsfähig gemacht

- ImageUpload Komponente erweitert um onChange callback
- QuoteFormTabs komplett neu mit Submit-Handlern
- Navigation um 'Angebot einholen' Link erweitert
- Tests mit echten Bildern erfolgreich (bis 4 MB)
- Backend-Bildanzeige verifiziert
- Lightbox funktioniert einwandfrei"

git push origin main
```

## 🚀 Deployment-Prozess

### 1. Render Deployment

1. Push zu GitHub triggert automatisch Render Build
2. Warte auf Build-Completion (~5-10 Min)
3. Prüfe Render Logs auf Fehler

### 2. Cloudflare DNS

Stelle sicher, dass DNS korrekt konfiguriert ist:

```
Type: CNAME
Name: www
Content: <render-app-url>.onrender.com
Proxy: Enabled (Orange Cloud)
```

### 3. SSL-Zertifikat

- [ ] Cloudflare SSL/TLS Mode: Full (strict)
- [ ] Auto HTTPS Rewrites: Enabled
- [ ] Always Use HTTPS: Enabled

## 🧪 Production-Tests

### Test 1: Homepage
```bash
curl -I https://www.high-end-homes.de
# Erwarte: 200 OK
```

### Test 2: Angebot-Seite
```bash
curl -I https://www.high-end-homes.de/angebot
# Erwarte: 200 OK
```

### Test 3: Quote-API
```bash
curl -X POST https://www.high-end-homes.de/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Entrümpelung",
    "name": "Production Test",
    "email": "test@example.com",
    "squareMeters": 100,
    "buildingType": "Wohnung",
    "notes": "Production API Test"
  }'
# Erwarte: {"success":true,"id":"..."}
```

### Test 4: Formular mit Bild

1. Öffne https://www.high-end-homes.de/angebot
2. Fülle Formular aus
3. Lade 1-3 Testbilder hoch (z.B. Baustellenfotos)
4. Sende Formular ab
5. Prüfe Success-Screen
6. Logge dich ins Backend ein: https://www.high-end-homes.de/intern/quotes
7. Prüfe ob Anfrage mit Bildern angezeigt wird
8. Klicke auf Bilder → Lightbox sollte öffnen
9. Teste Navigation zwischen Bildern
10. Teste Zoom-Funktionalität

### Test 5: Email-Benachrichtigung

- [ ] Prüfe ob Email an NOTIFICATION_EMAIL gesendet wurde
- [ ] Prüfe ob Bildinfo in Email enthalten ist

## 🔍 Monitoring

### Render Dashboard
- [ ] CPU-Auslastung normal
- [ ] Memory-Auslastung normal
- [ ] Keine Error-Logs

### Cloudflare Analytics
- [ ] Traffic-Statistiken prüfen
- [ ] Cache-Hit-Rate prüfen
- [ ] Error-Rate prüfen

## 🐛 Troubleshooting

### Problem: Bilder werden nicht angezeigt

**Lösung:**
1. Prüfe Browser Console auf Fehler
2. Prüfe ob `imagesBase64` Array leer ist
3. Prüfe Datenbank-Eintrag: `SELECT imagesBase64Json FROM QuoteRequest WHERE id = '...'`
4. Prüfe ob Base64-String korrekt formatiert ist (muss mit `data:image/...;base64,` beginnen)

### Problem: Formular sendet nicht

**Lösung:**
1. Prüfe Browser Console auf Fehler
2. Prüfe Network-Tab für API-Request
3. Prüfe Render Logs für Server-Fehler
4. Prüfe ob alle Pflichtfelder ausgefüllt sind

### Problem: Email wird nicht gesendet

**Lösung:**
1. Prüfe SMTP-Credentials in Render
2. Prüfe ob Gmail "Less secure app access" aktiviert ist (oder App-Password verwendet)
3. Prüfe Render Logs für SMTP-Fehler

## ✅ Post-Deployment Verification

Nach erfolgreichem Deployment:

- [ ] Homepage lädt korrekt
- [ ] Navigation funktioniert
- [ ] "Angebot einholen" Link ist sichtbar
- [ ] Formular lädt korrekt
- [ ] Bild-Upload funktioniert
- [ ] Formular-Submission funktioniert
- [ ] Backend zeigt Anfragen korrekt an
- [ ] Bilder werden im Backend angezeigt
- [ ] Lightbox funktioniert
- [ ] Email-Benachrichtigung wird gesendet

## 🎉 Go-Live

Wenn alle Tests bestanden:

1. Informiere Stakeholder
2. Aktiviere Monitoring
3. Beobachte erste echte Anfragen
4. Sammle User-Feedback

---

**Status:** Bereit für Production-Deployment 🚀
**Letzte Aktualisierung:** 8. Mai 2026
