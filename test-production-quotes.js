#!/usr/bin/env node

const https = require('https');

const PRODUCTION_URL = 'https://www.highendhomes.de';

// Erstelle Test-Bilder als Base64
function createTestImageBase64(color, label) {
  const canvas = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${color}"/>
    <text x="200" y="150" font-size="24" text-anchor="middle" fill="white">${label}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

const testQuotes = [
  {
    type: "Entrümpelung",
    name: "Max Mustermann (PROD TEST)",
    email: "max.prod@example.com",
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
    notes: "PRODUKTIONSTEST - Bitte Vorsicht mit den Antiquitäten",
    imagesBase64: [
      createTestImageBase64("#FF6B6B", "Wohnzimmer"),
      createTestImageBase64("#4ECDC4", "Schlafzimmer"),
      createTestImageBase64("#45B7D1", "Küche"),
    ],
    imageFileNames: ["wohnzimmer.jpg", "schlafzimmer.jpg", "kueche.jpg"]
  },
  {
    type: "Entkernung",
    name: "Anna Schmidt (PROD TEST)",
    email: "anna.prod@example.com",
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
    notes: "PRODUKTIONSTEST - Asbest-Gutachten liegt vor",
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
    name: "Thomas Weber (PROD TEST)",
    email: "t.weber.prod@example.com",
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
    notes: "PRODUKTIONSTEST - Zeitfenster ist flexibel",
    imagesBase64: [
      createTestImageBase64("#EE5A6F", "Büroraum 1"),
      createTestImageBase64("#C56CF0", "Büroraum 2"),
      createTestImageBase64("#FFB8B8", "Lager"),
      createTestImageBase64("#3AE374", "Eingangsbereich"),
      createTestImageBase64("#FDA7DF", "Sanitärbereich"),
    ],
    imageFileNames: ["buero1.jpg", "buero2.jpg", "lager.jpg", "eingang.jpg", "sanitaer.jpg"]
  }
];

async function submitQuote(quote) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(quote);
    
    const options = {
      hostname: 'www.highendhomes.de',
      port: 443,
      path: '/api/quote',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log(`✅ Anfrage von ${quote.name} erfolgreich gesendet (ID: ${response.id})`);
            console.log(`   Typ: ${quote.type}, Bilder: ${quote.imagesBase64.length}`);
            console.log(`   Komplexität: ${response.complexity?.level}, Preis: ${response.estimate?.min}€ - ${response.estimate?.max}€\n`);
            resolve(response);
          } else {
            console.error(`❌ Fehler bei ${quote.name} (Status ${res.statusCode}):`, response.error || data);
            reject(new Error(response.error || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          console.error(`❌ Parse-Fehler bei ${quote.name}:`, error.message);
          console.error(`   Response: ${data}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Netzwerkfehler bei ${quote.name}:`, error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 Sende Test-Anfragen an PRODUKTION...');
  console.log(`📍 URL: ${PRODUCTION_URL}/api/quote\n`);
  
  for (const quote of testQuotes) {
    try {
      await submitQuote(quote);
      // Kurze Pause zwischen Anfragen
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Fehler bei ${quote.name}, fahre fort...`);
    }
  }
  
  console.log('✨ Alle Test-Anfragen wurden abgeschickt!');
  console.log(`📋 Öffne ${PRODUCTION_URL}/intern/quotes um die Anfragen zu sehen\n`);
  console.log(`🔗 Formular: ${PRODUCTION_URL}/angebot`);
  console.log(`🔗 Backend: ${PRODUCTION_URL}/intern/quotes\n`);
}

main().catch(console.error);
