# Produktionstest - Anleitung

## Status
- ✅ Code gepusht zu GitHub (Commit: bfe95d8)
- ⏳ Render Deployment läuft (kann 3-5 Minuten dauern)
- 📍 Produktions-URL: **https://www.highendhomes.de**

## Manuelle Tests durchführen

### 1. Formular testen
1. Öffne: **https://www.highendhomes.de/angebot**
2. Fülle das Formular aus:
   - Name: "Test Produktiv"
   - E-Mail: "test@example.com"
   - Telefon: "+49 123 456789"
   - Quadratmeter: 100
   - Gebäudetyp: "Wohnung"
   - Wähle ein paar Materialien aus
3. **Bilder hochladen**:
   - Klicke auf den Upload-Bereich
   - Wähle 2-3 Bilder aus (JPG, PNG oder WebP)
   - Prüfe die Vorschau
4. Sende das Formular ab
5. Erwarte Erfolgsmeldung

### 2. Backend-Ansicht testen
1. Öffne: **https://www.highendhomes.de/intern/quotes**
2. Logge dich ein (falls erforderlich)
3. Prüfe, ob die Test-Anfrage angezeigt wird
4. **Bilder prüfen**:
   - Siehst du die Thumbnail-Galerie?
   - Klicke auf "Alle anzeigen"
   - Öffnet sich die Lightbox?

### 3. Lightbox-Funktionen testen
Wenn die Lightbox offen ist:
- ✅ Drücke **→** (Pfeil rechts) - Nächstes Bild
- ✅ Drücke **←** (Pfeil links) - Vorheriges Bild
- ✅ Drücke **+** - Zoom In
- ✅ Drücke **-** - Zoom Out
- ✅ Drücke **0** - Zoom zurücksetzen
- ✅ Drücke **ESC** - Lightbox schließen
- ✅ Klicke auf Thumbnails unten - Springe zu Bild

### 4. Automatische Tests (wenn Deployment fertig)

Warte bis Render Deployment abgeschlossen ist, dann:

```bash
# Test DB-Verbindung
curl -s https://www.highendhomes.de/api/test-db | jq .

# Sollte zeigen:
# {
#   "success": true,
#   "message": "Datenbankverbindung erfolgreich",
#   "quoteCount": <anzahl>
# }
```

Wenn DB-Test erfolgreich:

```bash
# Sende Test-Anfragen mit Bildern
node test-production-quotes.js
```

## Erwartete Ergebnisse

### ✅ Formular
- Bilder können hochgeladen werden
- Vorschau wird angezeigt
- Formular kann abgeschickt werden
- Erfolgsmeldung erscheint

### ✅ Backend
- Anfragen werden angezeigt
- Bilder werden als Thumbnails gezeigt
- "Alle anzeigen"-Button funktioniert

### ✅ Lightbox
- Vollbild-Ansicht mit schwarzem Hintergrund
- Pfeiltasten-Navigation funktioniert
- Zoom-Funktionen funktionieren
- Thumbnail-Leiste wird angezeigt
- Bildnummer wird angezeigt (z.B. "3 / 5")

## Troubleshooting

### Deployment dauert zu lange
- Prüfe Render Dashboard: https://dashboard.render.com
- Schaue in die Build-Logs
- Deployment kann 3-5 Minuten dauern

### 500-Fehler beim Formular
- Prüfe `/api/test-db` Endpunkt
- Wenn DB-Fehler: Prüfe Turso-Verbindung
- Wenn andere Fehler: Schaue Render Logs

### Bilder werden nicht angezeigt
- Prüfe Browser-Konsole (F12)
- Prüfe Netzwerk-Tab
- Bilder sollten als Base64 gespeichert sein

## Nächste Schritte nach erfolgreichem Test

1. ✅ Formular funktioniert
2. ✅ Bilder werden hochgeladen
3. ✅ Backend zeigt Bilder an
4. ✅ Lightbox mit Pfeiltasten funktioniert
5. 📝 Dokumentiere Ergebnisse
6. 🎉 Feature ist produktionsreif!
