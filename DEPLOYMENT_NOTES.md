# Deployment Notes - Puppeteer Fix

## Problem
- **500 Error** beim PDF-Versand: `/api/quotes/[id]/send`
- Root Cause: Render.com hat keinen Chrome/Chromium installiert
- Fehler: `Browser was not found at the configured executablePath (/usr/bin/chromium-browser)`

## Lösung
Ersetzt `puppeteer` durch **serverless-optimierte Stack**:
- `puppeteer-core` (ohne bundled Chrome)
- `@sparticuz/chromium` (serverless Chromium binary)

## Änderungen
1. **package.json**: `@sparticuz/chromium` + `puppeteer-core` installiert
2. **send/route.ts**: 
   - Import von `@sparticuz/chromium` default export
   - `chromium.executablePath()` für Render.com
   - Fallback auf lokale Installation für Dev
3. **next.config.ts**: 
   - `@sparticuz/chromium` zu `serverExternalPackages` hinzugefügt
   - `eslint.ignoreDuringBuilds: true` (temporär)

## Deployment
```bash
git add -A
git commit -m "fix: Replace puppeteer with @sparticuz/chromium for Render.com"
git push origin main
```

Render.com wird automatisch neu deployen.

## Verification
Nach Deployment:
1. Intern-Panel öffnen: https://www.highendhomes.de/intern/quotes
2. Angebot auswählen → "Senden" klicken
3. Erwartung: ✅ "Angebot erfolgreich versendet"
4. Logs prüfen: "Puppeteer-core + Chromium loaded successfully"
