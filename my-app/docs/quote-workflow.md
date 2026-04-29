# Quote Workflow

## Ziel

Angebotsanfragen für High-End Homes werden zentral gesammelt, automatisch bewertet und intern freigegeben.

## Eingang

- Das Formular auf der Startseite sendet an `POST /api/quote`
- Unterstützt werden die Typen `Entrümpelung` und `Entkernung`
- Pflichtfelder werden im Frontend validiert

## Serverseitige Verarbeitung

Bei Eingang einer Anfrage passiert Folgendes:

1. Normalisierung der Formdaten in `lib/quote.ts`
2. Berechnung von:
   - Komplexität
   - Aufwandsspanne
   - Preisspanne
3. Speicherung in Prisma `QuoteRequest`
4. Benachrichtigung per E-Mail an `NOTIFICATION_EMAIL`
5. Zusätzliche Archivierung als JSON in `data/quotes/`

## Freigabe

- Interne Übersicht: `/intern/quotes`
- Dort sind sichtbar:
  - Anfrage
  - Bewertung
  - Preisspanne
  - Status
- Statuswechsel erfolgt über `PATCH /api/quotes/[id]`
- Standardstatus ist `pending`
- Freigabe setzt Status auf `approved`

## Formular per E-Mail versenden

- Im oberen Bereich des Formulars kann eine Empfänger-E-Mail eingetragen werden
- Der Versand läuft über `PUT /api/quote`
- Versendet wird ein robuster Link auf das Webformular, kein eingebettetes HTML-Mail-Formular

## Technische Voraussetzungen

- Prisma-Modell `QuoteRequest`
- `DATABASE_URL` gesetzt
- SMTP-Variablen gesetzt:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `NOTIFICATION_EMAIL`

## Nach Schema-Änderungen

Prisma muss nach Änderungen am Schema neu erzeugt werden und die Datenbank muss aktualisiert werden.
