# Kontaktformular

## Übersicht

Das Kontaktformular ist in alle Service-Seiten (Entrümpelung, Entkernung, Ausbau, Kombi) integriert und ermöglicht Besuchern, direkt Kontakt aufzunehmen.

## Features

### 1. Kontaktformular
- **Felder:**
  - Name (Pflichtfeld)
  - E-Mail (Pflichtfeld)
  - Telefon (optional)
  - Nachricht (Pflichtfeld)
- **Validierung:** Client- und serverseitig
- **Feedback:** Erfolgs- und Fehlermeldungen
- **Service-Kontext:** Automatische Zuordnung zum jeweiligen Service

### 2. Direkte Kontaktinformationen
- **E-Mail:** info@high-end-homes.de (klickbar mit mailto:)
- **Telefon:** +49 6221 999 99 99 (klickbar mit tel:)
- **Öffnungszeiten:** Montag bis Freitag, 8:00 bis 18:00 Uhr

### 3. E-Mail-Versand
- Automatischer E-Mail-Versand bei Formularabsendung
- Enthält alle Formularinformationen
- Service-Name wird im Betreff angegeben
- Zeitstempel der Anfrage

## Technische Details

### API-Endpunkt
- **Route:** `/api/contact`
- **Methode:** POST
- **Body:**
  ```json
  {
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "+49 123 456789",
    "message": "Ihre Nachricht",
    "service": "Entrümpelung"
  }
  ```

### Umgebungsvariablen
Für den E-Mail-Versand werden folgende Variablen benötigt:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="deine@gmail.com"
SMTP_PASS="dein-app-passwort"
SMTP_FROM="High-End Homes <noreply@high-end-homes.de>"
CONTACT_EMAIL="info@high-end-homes.de"
```

**Hinweis:** Das Formular funktioniert auch ohne SMTP-Konfiguration. Die Anfragen werden dann nur in der Konsole geloggt.

## Integration

Das Kontaktformular ist Teil der `ServicePageLayout` Komponente und wird automatisch auf allen Service-Seiten angezeigt:

- `/entruempelung`
- `/entkernung`
- `/ausbau`
- `/kombi`

## Anpassungen

### E-Mail-Adresse ändern
Die E-Mail-Adresse kann an zwei Stellen geändert werden:

1. **In der Komponente** (`components/service-page-layout.tsx`):
   ```tsx
   <a href="mailto:info@high-end-homes.de">
     info@high-end-homes.de
   </a>
   ```

2. **In der Umgebungsvariable** (`.env`):
   ```env
   CONTACT_EMAIL="neue@email.de"
   ```

### Telefonnummer ändern
In der Komponente (`components/service-page-layout.tsx`):
```tsx
<a href="tel:+4962219999999">
  +49 6221 999 99 99
</a>
```

## Styling

Das Formular folgt dem High-End Homes Design:
- Dunkler Hintergrund (#0a0a0a, #111111)
- Weiße Schrift mit verschiedenen Transparenzstufen
- Minimale Border-Radius (3px)
- Hover-Effekte auf interaktiven Elementen
- Responsive Layout (2-spaltig auf Desktop, 1-spaltig auf Mobile)
