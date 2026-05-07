const fs = require('fs');
const path = require('path');

// Load real images from Assets directory
function fileToBase64(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : 'image/png';
  return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
}

const assetsDir = path.join(__dirname, '../../Assets');
const image1 = fileToBase64(path.join(assetsDir, 'high end homes look.jpg'));
const image2 = fileToBase64(path.join(assetsDir, 'high-end homes logo b 1.png'));
const image3 = fileToBase64(path.join(assetsDir, 'high-end homes logo b 2.webp'));

async function sendTestQuote() {
  const testData = {
    type: "Entrümpelung",
    name: "Test Kunde 1",
    email: "test1@example.com",
    phone: "0123456789",
    company: "Test Firma",
    squareMeters: "50",
    buildingType: "Wohnung",
    floor: "2.OG",
    elevator: "Nein",
    materials: ["Möbel", "Elektrogeräte"],
    quantityEstimate: "Mittel",
    valuables: "Nein",
    asbestosRequired: false,
    desiredDate: "2026-06-01",
    imageFileNames: ["high end homes look.jpg", "high-end homes logo b 1.png"],
    imagesBase64: [image1, image2],
    notes: "Testanfrage mit Bildern"
  };

  try {
    const response = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Testanfrage 1 gesendet:', result);
  } catch (error) {
    console.error('Fehler beim Senden:', error);
  }
}

async function sendTestQuote2() {
  const testData = {
    type: "Entkernung",
    name: "Test Kunde 2",
    email: "test2@example.com",
    phone: "0987654321",
    company: "",
    squareMeters: "80",
    buildingType: "Haus",
    constructionYear: "1980",
    floor: "Erdgeschoss",
    elevator: "Ja",
    removalItems: ["Böden", "Deckenverkleidungen"],
    asbestosRequired: true,
    otherPollutants: false,
    disposalWanted: true,
    permitStatus: "Ja",
    desiredDate: "2026-07-15",
    imageFileNames: ["high-end homes logo b 2.webp"],
    imagesBase64: [image3],
    notes: "Testanfrage Entkernung mit Asbest"
  };

  try {
    const response = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Testanfrage 2 gesendet:', result);
  } catch (error) {
    console.error('Fehler beim Senden:', error);
  }
}

async function sendTestQuote3() {
  const testData = {
    type: "Entkernung & Entrümpelung",
    name: "Test Kunde 3",
    email: "test3@example.com",
    phone: "",
    company: "Bau GmbH",
    squareMeters: "120",
    buildingType: "Gewerbe",
    floor: "1.OG",
    elevator: "Nein",
    effortEstimate: "Viel",
    materials: ["Möbel", "Holz", "Metall"],
    removalItems: ["Sanitär (Bad/WC)", "Elektroinstallationen"],
    asbestosRequired: false,
    desiredDate: "2026-08-01",
    imageFileNames: ["high end homes look.jpg"],
    imagesBase64: [image1],
    notes: "Großprojekt Gewerbe"
  };

  try {
    const response = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Testanfrage 3 gesendet:', result);
  } catch (error) {
    console.error('Fehler beim Senden:', error);
  }
}

async function main() {
  console.log('Sende Testanfragen...');
  await sendTestQuote();
  await new Promise(resolve => setTimeout(resolve, 500));
  await sendTestQuote2();
  await new Promise(resolve => setTimeout(resolve, 500));
  await sendTestQuote3();
  console.log('Alle Testanfragen gesendet!');
}

main();
