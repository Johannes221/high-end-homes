const fetch = require('node-fetch');

// Generate a simple test image as base64 (1x1 red pixel PNG)
const redPixelBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// Generate a simple test image (1x1 blue pixel PNG)
const bluePixelBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

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
    imageFileNames: [redPixelBase64, bluePixelBase64],
    imagesBase64: [redPixelBase64, bluePixelBase64],
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
    imageFileNames: [redPixelBase64],
    imagesBase64: [redPixelBase64],
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
    imageFileNames: [bluePixelBase64],
    imagesBase64: [bluePixelBase64],
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
