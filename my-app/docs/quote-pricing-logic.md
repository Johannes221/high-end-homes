---
description: Preislogik für Angebotsanfragen
---

# Quote Pricing Logic

## Ziel

Die Kalkulation soll für `Entrümpelung`, `Entkernung` und `Entkernung & Entrümpelung` grob plausibel, intern nachvollziehbar und im Backend manuell übersteuerbar sein.

## Grundprinzip

Die automatische Kalkulation besteht aus:

1. `Baustelleneinrichtung / Anfahrt`
2. `Grundaufwand` je Leistung auf Basis der Quadratmeter
3. `Auswahlabhängige Zuschläge` für Materialien oder Rückbaupositionen
4. `Erschwernis-/Sonderzuschläge`
5. `Preisspanne`, abgeleitet aus derselben automatischen Kalkulation

## 1. Entrümpelung

### Basis

- Baustelleneinrichtung: `220 €`
- Grundaufwand: `16 €/m²`

### Material-Zuschläge

Die Materialauswahl erzeugt nur Zuschläge, keine vollständige Zweitkalkulation der Gesamtfläche.

Beispiele:

- Möbel: `2.2 €/m²`, mindestens `120 €`
- Elektrogeräte: `1.8 €/m²`, mindestens `110 €`
- Kleidung & Textilien: `0.8 €/m²`, mindestens `60 €`
- Baumaterialien: `3.2 €/m²`, mindestens `180 €`
- Sondermüll: `5.5 €/m²`, mindestens `320 €`

### Weitere Zuschläge

- Wertgegenstände sichten: `120 €`
- Mengenfaktor:
  - `Wenig` -> `-10 %` auf Entrümpelungs-Teil
  - `Mittel` -> `0 %`
  - `Viel` -> `+15 %`

## 2. Entkernung

### Basis

- Baustelleneinrichtung: `420 €`
- Grundaufwand: `18 €/m²`

### Rückbaupositionen

Die Rückbaupositionen sind modulare Zuschläge auf die Entkernung, nicht nochmals volle Projektkosten.

Beispiele:

- Böden: `3.5 €/m²`, mindestens `200 €`
- Deckenverkleidungen: `3 €/m²`, mindestens `180 €`
- Wandverkleidungen & Putz: `4.5 €/m²`, mindestens `280 €`
- Sanitär (Bad/WC): `3.5 €/m²`, mindestens `420 €`
- Elektroinstallationen: `3.5 €/m²`, mindestens `420 €`
- Fenster & Türen: `3.5 €/m²`, mindestens `320 €`
- Heizung & Rohre: `4.5 €/m²`, mindestens `520 €`
- Trennwände: `3.5 €/m²`, mindestens `260 €`

### Weitere Zuschläge

- Entsorgung Rückbaumaterial: mindestens `280 €`, sonst `3 €/m²`
- Asbest: mindestens `1.200 €`, sonst `9 €/m²`
- Weitere Schadstoffe: mindestens `650 €`, sonst `4 €/m²`

## 3. Kombination Entkernung & Entrümpelung

### Basis

- Baustelleneinrichtung: `560 €`
- Grundaufwand Entrümpelung: `13 €/m²`
- Grundaufwand Entkernung: `16 €/m²`

### Logik

Die Kombination erhält bewusst reduzierte Basisraten gegenüber zwei vollständig separaten Projekten,
weil Anfahrt, Einrichtung, Koordination und Teilflächen sich überschneiden.

Material- und Rückbauzuschläge bleiben aktiv.

## 4. Erschwernisse

### Stockwerk ohne Aufzug

- 1.OG: `120 €`
- 2.OG: `260 €`
- 3.OG+: `420 €`
- Keller: `140 €`

Für Entkernung wird der Zuschlag stärker gewichtet.
Für die Kombination leicht erhöht.

### Aufzug vorhanden

- kein Zuschlag

## 5. Komplexität

Komplexität ist nicht direkt der Preis, sondern ein Steuerwert für Aufwand und Bandbreite.

Einflussfaktoren:

- Kombination aus zwei Gewerken
- Fläche ab `80 m²`
- Großfläche ab `150 m²`
- Asbest / Schadstoffe
- schwieriger Transport
- entsorgungsintensive Materialien
- technische Rückbaupositionen
- viele Einzelpositionen
- Aufwand `Viel`

Ausgabe:

- `Low`
- `Medium`
- `High`

## 6. Preisspanne

Die Preisspanne wird aus der automatischen Kalkulation abgeleitet.

Beispielidee:

- `Low`: enger Korridor
- `Medium`: mittlerer Korridor
- `High`: breiter Korridor

Zusätzliche Bandbreite bei:

- Schadstoffen
- Kombi-Projekten
- vielen Positionen
- hohem Aufwand

## 7. Zielbild

Die automatische Kalkulation ist eine interne Erstbewertung.

Sie soll:

- im Verhältnis zur Anfrage plausibel sein
- nicht um Größenordnungen eskalieren
- im Backend leicht manuell korrigierbar sein
- für PDF/Angebot eine brauchbare Ausgangsbasis liefern

## 8. Beispiel

Kombi-Projekt, `200 m²`, `Möbel`, `Sondermüll`, `Fenster & Türen`, `Trennwände`, Aufwand `Viel`, Aufzug `Ja`:

- kein 90.000€-Ausreißer
- stattdessen eine grob plausible Kalkulation im niedrigen bis mittleren fünfstelligen Bereich
- je nach manueller Prüfung danach Freigabe oder Anpassung
