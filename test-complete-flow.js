#!/usr/bin/env node

const fs = require('fs');

// Erstelle Test-Bilder als Base64
function createTestImageBase64(color, label) {
  const canvas = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${color}"/>
    <text x="200" y="150" font-size="24" text-anchor="middle" fill="white">${label}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

const testQuote = {
  type: "Entkernung",
  name: "Johannes Schartl",
  email: "johannes.schartl@gmail.com",
  phone: "+49 151 12345678",
  company: "Test GmbH",
  address: "Hauptstraße 1, 69115 Heidelberg",
  squareMeters: 120,
  buildingType: "Wohnung",
  constructionYear: "1985",
  floor: "2. OG",
  elevator: "Ja",
  removalItems: ["Böden", "Wandverkleidungen & Putz", "Sanitär (Bad/WC)", "Fenster & Türen"],
  quantityEstimate: "Komplettsanierung",
  valuables: "Keine",
  asbestosRequired: false,
  otherPollutants: false,
  disposalWanted: true,
  permitStatus: "Erteilt",
  desiredDate: "2026-07-01",
  notes: "Test-Anfrage für kompletten Workflow",
  imagesBase64: [
    createTestImageBase64("#FF6B6B", "Wohnzimmer"),
    createTestImageBase64("#4ECDC4", "Schlafzimmer"),
    createTestImageBase64("#45B7D1", "Küche"),
  ],
  imageFileNames: ["wohnzimmer.jpg", "schlafzimmer.jpg", "kueche.jpg"]
};

async function createQuote() {
  console.log('📝 Schritt 1: Anfrage erstellen...');
  
  const response = await fetch('http://localhost:3000/api/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testQuote)
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Fehler beim Erstellen der Anfrage:', data.error);
    throw new Error(data.error);
  }

  console.log(`✅ Anfrage erstellt (ID: ${data.id})`);
  console.log(`   Typ: ${testQuote.type}, Bilder: ${testQuote.imagesBase64.length}`);
  console.log(`   Komplexität: ${data.complexity?.level}, Preis: ${data.estimate?.min}€ - ${data.estimate?.max}€\n`);
  
  return data.id;
}

async function adjustPrices(quoteId) {
  console.log('💰 Schritt 2: Preise im Backend anpassen...');
  
  // Preise um 10% erhöhen als Beispiel
  const lineItemOverrides = [
    { id: "base", label: "Basispreis (angepasst)", price: 2500 },
    { id: "complexity", label: "Komplexitätszuschlag (angepasst)", price: 800 },
    { id: "disposal", label: "Entsorgung (angepasst)", price: 600 }
  ];

  const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-test-mode': 'true'
    },
    body: JSON.stringify({
      lineItemOverrides,
      internalNotes: "Preise manuell angepasst für Test-Workflow"
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Fehler beim Anpassen der Preise:', data.error);
    console.log('⚠️  Preis-Anpassung übersprungen (Auth erforderlich)\n');
    return null;
  }

  console.log('✅ Preise angepasst');
  console.log(`   Neuer Gesamtpreis: ${data.quote?.pricingSummary?.finalTotal}€\n`);
  
  return data.quote;
}

async function sendEmailWithPdf(quoteId) {
  console.log('📧 Schritt 3: E-Mail mit PDF senden...');
  
  const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-test-mode': 'true'
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Fehler beim Senden der E-Mail:', data.error);
    throw new Error(data.error);
  }

  console.log('✅ E-Mail erfolgreich gesendet');
  console.log(`   An: ${testQuote.email}`);
  console.log(`   E-Mail ID: ${data.emailId}`);
  console.log(`   Hat PDF: ${data.hasPdf ? 'Ja' : 'Nein'}\n`);
  
  return data;
}

async function approveQuote(quoteId) {
  console.log('✅ Schritt 4: Anfrage auf "approved" setzen...');
  
  const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-test-mode': 'true'
    },
    body: JSON.stringify({
      approvalStatus: "approved"
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Fehler beim Setzen des Status:', data.error);
    console.log('⚠️  Status-Änderung übersprungen (Auth erforderlich)\n');
    return null;
  }

  console.log('✅ Anfrage auf "approved" gesetzt');
  console.log(`   Approved at: ${data.quote?.approvedAt}`);
  console.log(`   Approved by: ${data.quote?.approvedBy}\n`);
  
  return data.quote;
}

async function verifyQuote(quoteId) {
  console.log('🔍 Schritt 5: Anfrage verifizieren...');
  
  const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}?includeImages=false`, {
    headers: {
      'x-test-mode': 'true'
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Fehler beim Verifizieren:', data.error);
    return null;
  }

  const quote = data.quote;
  console.log('📋 Anfrage-Status:');
  console.log(`   ID: ${quote.id}`);
  console.log(`   Typ: ${quote.type}`);
  console.log(`   Kunde: ${quote.name} (${quote.email})`);
  console.log(`   Status: ${quote.approvalStatus}`);
  console.log(`   Approved at: ${quote.approvedAt}`);
  console.log(`   Shared at: ${quote.sharedAt}`);
  console.log(`   Gesamtpreis: ${quote.pricingSummary?.finalTotal}€`);
  console.log(`   Bilder: ${quote.imageFileNames?.length || 0}`);
  console.log(`   Interne Notizen: ${quote.pricing?.internalNotes || 'Keine'}\n`);
  
  return quote;
}

async function main() {
  console.log('🚀 Kompletter Workflow-Test: Anfrage → Preise anpassen → Approved → E-Mail\n');
  
  try {
    const quoteId = await createQuote();
    
    await adjustPrices(quoteId);
    await approveQuote(quoteId);
    await sendEmailWithPdf(quoteId);
    await verifyQuote(quoteId);
    
    console.log('✨ Workflow-Test abgeschlossen!');
    console.log('📧 Prüfe deine E-Mail (johannes.schartl@gmail.com) für das Angebot mit PDF\n');
  } catch (error) {
    console.error('❌ Fehler im Workflow:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
