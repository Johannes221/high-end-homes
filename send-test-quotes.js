const fs = require('fs');
const path = require('path');

const API_URL = 'https://high-end-homes.onrender.com/api/quote';

// Funktion zum Konvertieren einer Datei in Base64
function convertToBase64(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');
  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'image/png';
  
  if (ext === '.jpg' || ext === '.jpeg') {
    mimeType = 'image/jpeg';
  } else if (ext === '.png') {
    mimeType = 'image/png';
  } else if (ext === '.pdf') {
    mimeType = 'application/pdf';
  } else if (ext === '.webp') {
    mimeType = 'image/webp';
  }
  
  return `data:${mimeType};base64,${base64}`;
}

// Funktion zum Senden einer Testanfrage
async function sendQuote(data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log('✓ Anfrage gesendet:', result.success ? 'Erfolg' : 'Fehler');
    if (result.success) {
      console.log('  ID:', result.id);
      console.log('  Preis:', result.estimate.min, '-', result.estimate.max, result.estimate.currency);
    } else {
      console.log('  Fehler:', result.error);
    }
    return result;
  } catch (error) {
    console.error('✗ Fehler beim Senden:', error.message);
    return { success: false, error: error.message };
  }
}

// Alle Anfragen löschen
async function deleteAllQuotes() {
  console.log('Lösche alle Anfragen...');
  try {
    const { execSync } = require('child_process');
    execSync('DATABASE_URL="file:libsql://anfragen-bennet221.aws-eu-west-1.turso.io" DATABASE_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgzMzMwNzgsImlkIjoiMDE5ZTAyZDktYjYwMS03ZjlmLTliZDEtNjZkMThjYTNjZDk4IiwicmlkIjoiNTYyZjA4NzMtOGJkZi00YjNjLTg4ZGMtNGMyZjBjMzBlZWExIn0.EtEpHVXL31ztr9Dt0Jhlm87qLnKxcPsrA_jTKrhu4VqgUAVlH7xkUMfuEZ0EduIow-7_amD1otki_UJUsRYWDw" npx prisma db execute --stdin <<< "DELETE FROM QuoteRequest;"', {
      cwd: '/Users/johan/high-end-homes/my-app',
      stdio: 'ignore'
    });
    console.log('✓ Alle Anfragen gelöscht');
  } catch (error) {
    console.error('✗ Fehler beim Löschen:', error.message);
  }
}

// Testanfragen senden
async function sendTestQuotes() {
  await deleteAllQuotes();
  
  const assetsDir = '/Users/johan/high-end-homes/Assets';
  
  // Testanfrage 1: Entrümpelung mit PNG
  console.log('\n1. Entrümpelung mit PNG...');
  const fassadeBase64 = convertToBase64(path.join(assetsDir, 'fassade hero.png'));
  await sendQuote({
    type: 'Entrümpelung',
    name: 'Thomas Weber',
    email: 'thomas.weber@example.com',
    phone: '017612345678',
    company: 'Weber GmbH',
    squareMeters: '85',
    buildingType: 'Wohnung',
    floor: '3.OG',
    elevator: 'Ja',
    materials: ['Möbel', 'Elektrogeräte', 'Küche'],
    quantityEstimate: 'Viel',
    valuables: 'Ja',
    asbestosRequired: false,
    desiredDate: '2025-06-15',
    imageFileNames: ['fassade-hero.png'],
    imagesBase64: [fassadeBase64],
    notes: 'Komplette Wohnung zu räumen mit echtem PNG-Bild'
  });
  
  // Testanfrage 2: Entkernung mit PNG
  console.log('\n2. Entkernung mit PNG...');
  const villaBase64 = convertToBase64(path.join(assetsDir, 'villa-bild.png'));
  await sendQuote({
    type: 'Entkernung',
    name: 'Klaus Müller',
    email: 'klaus.mueller@example.com',
    phone: '017698765432',
    squareMeters: '150',
    buildingType: 'Haus',
    constructionYear: '1985',
    floor: 'Erdgeschoss',
    elevator: 'Nein',
    removalItems: ['Böden', 'Deckenverkleidungen', 'Sanitär (Bad/WC)', 'Fenster & Türen'],
    asbestosRequired: false,
    otherPollutants: false,
    disposalWanted: true,
    permitStatus: 'Ja',
    desiredDate: '2025-08-01',
    imageFileNames: ['villa-bild.png'],
    imagesBase64: [villaBase64],
    notes: 'Altbau komplett entkernen mit echtem PNG-Bild'
  });
  
  // Testanfrage 3: Entrümpelung & Entkernung mit PNG
  console.log('\n3. Entrümpelung & Entkernung mit PNG...');
  const logoBase64 = convertToBase64(path.join(assetsDir, 'high-end homes logo b 1.png'));
  await sendQuote({
    type: 'Entrümpelung & Entkernung',
    name: 'Peter Krause',
    email: 'peter.krause@example.com',
    phone: '01623334455',
    company: 'Krause Immobilien',
    squareMeters: '250',
    buildingType: 'Gewerbe',
    floor: '1.OG',
    elevator: 'Ja',
    effortEstimate: 'Hoch',
    materials: ['Möbel', 'Elektrogeräte', 'Büroausstattung'],
    removalItems: ['Böden', 'Wandverkleidungen & Putz', 'Elektroinstallationen'],
    asbestosRequired: false,
    desiredDate: '2025-09-01',
    imageFileNames: ['logo-b-1.png'],
    imagesBase64: [logoBase64],
    notes: 'Komplette Bürosäule räumen und entkernen mit echtem PNG-Bild'
  });
  
  console.log('\n✓ Alle Testanfragen gesendet!');
}

sendTestQuotes().catch(console.error);
