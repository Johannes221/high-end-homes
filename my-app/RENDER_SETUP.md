# Render Setup für PDF-Versand

## Build Command

```bash
./render-build.sh
```

## Environment Variables (zusätzlich)

```bash
# Puppeteer Chrome Path
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
CHROME_BIN=/usr/bin/chromium

# Puppeteer Skip Download (Chrome wird via apt installiert)
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Wichtig

- **Build Command** in Render Dashboard auf `./render-build.sh` setzen
- **Start Command** bleibt `npm start`
- Chrome-Dependencies werden automatisch installiert

## Falls Build fehlschlägt

Alternative: Puppeteer deaktivieren und PDF-Versand ohne Anhang:

1. Entferne `puppeteer` aus `package.json`
2. Ändere `/api/quotes/[id]/send` zu "Link zum PDF" statt Anhang
