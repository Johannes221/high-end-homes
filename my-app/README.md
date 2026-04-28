# High-End Homes Website

Professionelle Website für Entrümpelung, Entkernung und Kernsanierung.

## Features

- Modernes, edles Design mit Gold-Akzenten
- Interaktives Angebotsformular mit sofortiger Preiskalkulation
- Responsives Layout für alle Geräte
- Animationen mit Framer Motion
- E-Mail-Versand via Resend

## Tech Stack

- Next.js 16 mit App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui Komponenten
- Framer Motion
- React Hook Form + Zod
- Resend (E-Mail)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Deployment

### Frontend (Cloudflare Pages)

1. Build erstellen:
```bash
npm run build
```

2. Den `dist` Ordner auf Cloudflare Pages deployen:
   - Build command: `npm run build`
   - Build output directory: `dist`

### Backend (Render)

Da die API-Route für das Angebotsformular serverseitige Verarbeitung benötigt:

1. **Option A - Render Node.js Service:**
   - Deploye das gesamte Projekt als Node.js Service auf Render
   - Setze die Umgebungsvariable `RESEND_API_KEY`
   - Die API läuft dann unter `https://your-app.onrender.com/api/quote`

2. **Frontend konfigurieren:**
   - Setze in Cloudflare Pages die Umgebungsvariable:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/quote
   ```

### Umgebungsvariablen

| Variable | Beschreibung | Erforderlich |
|----------|-------------|--------------|
| `RESEND_API_KEY` | API Key für E-Mail-Versand | Ja (Backend) |
| `NEXT_PUBLIC_API_URL` | URL des Backends für das Formular | Ja (Frontend) |

## Projektstruktur

```
my-app/
├── app/
│   ├── api/quote/      # API-Route für Angebotsberechnung
│   ├── globals.css     # Globale Styles
│   ├── layout.tsx      # Root Layout
│   └── page.tsx        # Hauptseite
├── components/
│   ├── navigation.tsx  # Header Navigation
│   ├── hero.tsx        # Hero Section
│   ├── quote-form.tsx  # Angebotsformular
│   ├── services.tsx    # Leistungen Section
│   ├── about.tsx       # Über uns / USP
│   └── footer.tsx      # Footer mit Impressum
├── public/             # Statische Assets (Logos, Bilder)
└── dist/              # Build-Output
```

## Preiskalkulation

Die Preise werden basierend auf folgenden Faktoren berechnet:
- **Quadratmeter**: Basispreis 12€/m²
- **Gebäudetyp**: Multiplikator 1.0x - 1.5x
- **Materialien**: Komplexitätsfaktor 0.9x - 1.5x
- **Asbest**: Zuschlag 15€/m²

## Kontakt

**High-End Homes**  
Bennet Pfeifer  
Gerhard-Hauptmann Straße 38  
69221 Dossenheim
