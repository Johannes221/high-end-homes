#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Erstelle Test-Bilder als Base64
function createTestImageBase64(color, label) {
  // Einfaches 100x100 PNG in Base64 (1x1 Pixel, dann skaliert)
  const canvas = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${color}"/>
    <text x="200" y="150" font-size="24" text-anchor="middle" fill="white">${label}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

const testQuotes = [
  {
    type: "Entrümpelung",
    name: "Max Mustermann",
    email: "max@example.com",
    phone: "+49 151 12345678",
    company: "Mustermann GmbH",
    squareMeters: 120,
    buildingType: "Wohnung",
    constructionYear: "1985",
    floor: "2. OG",
    elevator: "Ja",
    materials: ["Möbel", "Elektrogeräte", "Kleidung & Textilien"],
    quantityEstimate: "3-4 LKW-Ladungen",
    valuables: "Einige antike Möbelstücke",
    asbestosRequired: false,
    otherPollutants: false,
    disposalWanted: true,
    permitStatus: "Nicht erforderlich",
    desiredDate: "2026-06-15",
    notes: "Bitte Vorsicht mit den Antiquitäten im Wohnzimmer",
    imagesBase64: [
      createTestImageBase64("#FF6B6B", "Wohnzimmer"),
      createTestImageBase64("#4ECDC4", "Schlafzimmer"),
      createTestImageBase64("#45B7D1", "Küche"),
    ],
    imageFileNames: ["wohnzimmer.jpg", "schlafzimmer.jpg", "kueche.jpg"]
  },
  {
    type: "Entkernung",
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    phone: "+49 162 98765432",
    squareMeters: 85,
    buildingType: "Haus",
    constructionYear: "1972",
    floor: "Erdgeschoss",
    elevator: "Nein",
    removalItems: ["Böden", "Wandverkleidungen & Putz", "Sanitär (Bad/WC)", "Fenster & Türen"],
    quantityEstimate: "Komplettsanierung",
    asbestosRequired: true,
    otherPollutants: true,
    disposalWanted: true,
    permitStatus: "In Bearbeitung",
    desiredDate: "2026-07-01",
    notes: "Asbest-Gutachten liegt vor, kann zugeschickt werden",
    imagesBase64: [
      createTestImageBase64("#F7B731", "Badezimmer Alt"),
      createTestImageBase64("#5F27CD", "Flur"),
      createTestImageBase64("#00D2D3", "Keller"),
      createTestImageBase64("#FF9FF3", "Dachboden"),
    ],
    imageFileNames: ["bad-alt.jpg", "flur.jpg", "keller.jpg", "dachboden.jpg"]
  },
  {
    type: "Kombi",
    name: "Thomas Weber",
    email: "t.weber@example.com",
    phone: "+49 170 55555555",
    company: "Weber Immobilien",
    squareMeters: 200,
    buildingType: "Gewerbe",
    constructionYear: "1995",
    floor: "1. OG",
    elevator: "Ja",
    materials: ["Möbel", "Elektrogeräte", "Baumaterialien"],
    removalItems: ["Böden", "Deckenverkleidungen", "Trennwände"],
    quantityEstimate: "Großprojekt, ca. 5-7 LKW",
    valuables: "Keine",
    asbestosRequired: false,
    otherPollutants: false,
    disposalWanted: true,
    permitStatus: "Erteilt",
    desiredDate: "2026-08-10",
    notes: "Zeitfenster ist flexibel, Projekt muss bis Ende August abgeschlossen sein",
    imagesBase64: [
      createTestImageBase64("#EE5A6F", "Büroraum 1"),
      createTestImageBase64("#C56CF0", "Büroraum 2"),
      createTestImageBase64("#FFB8B8", "Lager"),
      createTestImageBase64("#3AE374", "Eingangsbereich"),
      createTestImageBase64("#FDA7DF", "Sanitärbereich"),
    ],
    imageFileNames: ["buero1.jpg", "buero2.jpg", "lager.jpg", "eingang.jpg", "sanitaer.jpg"]
  },
  {
    type: "Entrümpelung",
    name: "Maria Hoffmann",
    email: "maria.h@example.com",
    phone: "+49 176 22334455",
    squareMeters: 45,
    buildingType: "Keller",
    floor: "Keller",
    elevator: "Nein",
    materials: ["Möbel", "Holz", "Metall", "Kunststoff", "Sondermüll"],
    quantityEstimate: "1-2 LKW-Ladungen",
    valuables: "Alte Werkzeuge, evtl. wertvoll",
    asbestosRequired: false,
    otherPollutants: true,
    disposalWanted: true,
    permitStatus: "Nicht erforderlich",
    desiredDate: "2026-06-20",
    notes: "Zugang über Außentreppe, sehr eng",
    imagesBase64: [
      createTestImageBase64("#FFA502", "Kellerraum Übersicht"),
      createTestImageBase64("#2ED573", "Werkbank"),
    ],
    imageFileNames: ["keller-uebersicht.jpg", "werkbank.jpg"]
  },
  {
    type: "Entkernung",
    name: "Peter Müller",
    email: "p.mueller@example.com",
    phone: "+49 160 77889900",
    squareMeters: 150,
    buildingType: "Dachgeschoss",
    constructionYear: "1960",
    floor: "3. OG+",
    elevator: "Nein",
    removalItems: ["Böden", "Deckenverkleidungen", "Wandverkleidungen & Putz", "Elektroinstallationen", "Heizung & Rohre"],
    quantityEstimate: "Vollständige Entkernung",
    asbestosRequired: true,
    otherPollutants: false,
    disposalWanted: true,
    permitStatus: "Erteilt",
    desiredDate: "2026-09-01",
    notes: "Dachschrägen beachten, sehr verwinkelt",
    imagesBase64: [
      createTestImageBase64("#FF6348", "Dachschräge Links"),
      createTestImageBase64("#1E90FF", "Dachschräge Rechts"),
      createTestImageBase64("#2ECC71", "Dachfenster"),
      createTestImageBase64("#E74C3C", "Treppe"),
      createTestImageBase64("#9B59B6", "Isolierung"),
      createTestImageBase64("#F39C12", "Elektrik"),
    ],
    imageFileNames: ["dach-links.jpg", "dach-rechts.jpg", "fenster.jpg", "treppe.jpg", "isolierung.jpg", "elektrik.jpg"]
  }
];

async function submitQuote(quote) {
  try {
    const response = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Anfrage von ${quote.name} erfolgreich gesendet (ID: ${data.id})`);
      console.log(`   Typ: ${quote.type}, Bilder: ${quote.imagesBase64.length}`);
      console.log(`   Komplexität: ${data.complexity?.level}, Preis: ${data.estimate?.min}€ - ${data.estimate?.max}€\n`);
    } else {
      console.error(`❌ Fehler bei ${quote.name}:`, data.error);
    }
  } catch (error) {
    console.error(`❌ Netzwerkfehler bei ${quote.name}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Sende Test-Anfragen mit Bildern...\n');
  
  for (const quote of testQuotes) {
    await submitQuote(quote);
    // Kurze Pause zwischen Anfragen
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('✨ Alle Test-Anfragen wurden abgeschickt!');
  console.log('📋 Öffne http://localhost:3000/intern/quotes um die Anfragen zu sehen\n');
}

main().catch(console.error);
