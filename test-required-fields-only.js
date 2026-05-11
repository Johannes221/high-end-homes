#!/usr/bin/env node

const https = require('https');

const PRODUCTION_URL = 'https://www.highendhomes.de';

// Test-Daten für alle 4 Formulare mit NUR Pflichtfeldern
const requiredFieldTests = [
  {
    type: "Entrümpelung",
    name: "E2E Pflichtfelder Test - Entrümpelung",
    email: "pflicht.entruempelung@test.com",
    squareMeters: 75,
    buildingType: "Wohnung",
    notes: "E2E TEST - Nur Pflichtfelder"
  },
  {
    type: "Entkernung",
    name: "E2E Pflichtfelder Test - Entkernung",
    email: "pflicht.entkernung@test.com",
    squareMeters: 100,
    buildingType: "Haus",
    notes: "E2E TEST - Nur Pflichtfelder"
  },
  {
    type: "Kombi",
    name: "E2E Pflichtfelder Test - Kombi",
    email: "pflicht.kombi@test.com",
    squareMeters: 150,
    notes: "E2E TEST - Nur Pflichtfelder"
  },
  {
    type: "Ausbau",
    name: "E2E Pflichtfelder Test - Ausbau",
    email: "pflicht.ausbau@test.com",
    notes: "E2E TEST - Nur Pflichtfelder"
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
            console.log(`✅ ${quote.type}: Erfolgreich gesendet (ID: ${response.id})`);
            resolve({ success: true, id: response.id, response });
          } else {
            console.error(`❌ ${quote.type}: Fehler (Status ${res.statusCode})`, response.error || data);
            reject(new Error(response.error || `HTTP ${res.statusCode}`));
          }
        } catch (error) {
          console.error(`❌ ${quote.type}: Parse-Fehler`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${quote.type}: Netzwerkfehler`, error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🧪 Teste alle Formulare mit NUR Pflichtfeldern...');
  console.log(`📍 URL: ${PRODUCTION_URL}/api/quote\n`);
  
  const results = [];
  
  for (const quote of requiredFieldTests) {
    try {
      const result = await submitQuote(quote);
      results.push({
        type: quote.type,
        success: true,
        id: result.id,
        data: quote
      });
      // Kurze Pause
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        type: quote.type,
        success: false,
        error: error.message,
        data: quote
      });
    }
  }
  
  console.log('\n📊 ZUSAMMENFASSUNG:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Erfolgreich: ${successful.length}/${results.length}`);
  console.log(`❌ Fehlgeschlagen: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ Erfolgreiche Anfragen:');
    successful.forEach(r => {
      console.log(`   - ${r.type}: ID ${r.id}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Fehlgeschlagene Anfragen:');
    failed.forEach(r => {
      console.log(`   - ${r.type}: ${r.error}`);
    });
  }
  
  console.log('\n🔍 Backend-Prüfung:');
  console.log(`   Öffne ${PRODUCTION_URL}/intern/quotes um die Anfragen im Backend zu sehen`);
  console.log(`   Suche nach "E2E Pflichtfelder Test" in der Liste\n`);
  
  console.log('='.repeat(50));
  console.log(`✨ Test abgeschlossen!`);
  
  return results;
}

main().catch(console.error);
