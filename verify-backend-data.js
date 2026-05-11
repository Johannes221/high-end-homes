#!/usr/bin/env node

/**
 * Backend-Verifikations-Script für Pflichtfelder-Tests
 * 
 * Dieses Script zeigt, wie man die Backend-Daten verifizieren kann.
 * Für die volle Automation benötigt man Admin-Credentials für NextAuth.
 * 
 * Alternative: Direkter Datenbank-Zugriff via Prisma
 */

console.log('🔍 BACKEND-VERIFIKATION - Pflichtfelder-Tests');
console.log('='.repeat(60));
console.log('');

console.log('GESSENDETE ANFRAGEN (via API POST /api/quote):');
console.log('');

const sentRequests = [
  {
    type: 'Entrümpelung',
    id: 'cmp1bgxgy000f2becczupn5p6',
    name: 'E2E Pflichtfelder Test - Entrümpelung',
    email: 'pflicht.entruempelung@test.com',
    squareMeters: 75,
    buildingType: 'Wohnung',
    notes: 'E2E TEST - Nur Pflichtfelder'
  },
  {
    type: 'Entkernung',
    id: 'cmp1bh10v000g2becgshdrqkt',
    name: 'E2E Pflichtfelder Test - Entkernung',
    email: 'pflicht.entkernung@test.com',
    squareMeters: 100,
    buildingType: 'Haus',
    notes: 'E2E TEST - Nur Pflichtfelder'
  },
  {
    type: 'Kombi',
    id: 'cmp1bh20e000h2becvl9ya8az',
    name: 'E2E Pflichtfelder Test - Kombi',
    email: 'pflicht.kombi@test.com',
    squareMeters: 150,
    notes: 'E2E TEST - Nur Pflichtfelder'
  },
  {
    type: 'Ausbau',
    id: 'cmp1bh3bc000i2becsmoodf5h',
    name: 'E2E Pflichtfelder Test - Ausbau',
    email: 'pflicht.ausbau@test.com',
    notes: 'E2E TEST - Nur Pflichtfelder'
  }
];

sentRequests.forEach((req, index) => {
  console.log(`${index + 1}. ${req.type}`);
  console.log(`   ID: ${req.id}`);
  console.log(`   Name: ${req.name}`);
  console.log(`   E-Mail: ${req.email}`);
  console.log(`   Daten: ${JSON.stringify({
    squareMeters: req.squareMeters,
    buildingType: req.buildingType,
    notes: req.notes
  })}`);
  console.log('');
});

console.log('='.repeat(60));
console.log('');
console.log('MANUELLE VERIFIKATION IM BACKEND:');
console.log('');
console.log('1. Öffne: https://www.highendhomes.de/intern/login');
console.log('2. Login mit Admin-Credentials');
console.log('3. Navigiere zu: https://www.highendhomes.de/intern/quotes');
console.log('4. Suche nach den oben genannten Anfragen');
console.log('');
console.log('ERWARTETES ERGEBNIS:');
console.log('- Alle 4 Anfragen sollten in der Liste sichtbar sein');
console.log('- Die IDs sollten übereinstimmen');
console.log('- Die Daten sollten korrekt gespeichert sein');
console.log('- Die Preiskalkulation sollte durchgeführt sein');
console.log('');
console.log('='.repeat(60));
console.log('');
console.log('AUTOMATISIERTE VERIFIKATION (mit Admin-Credentials):');
console.log('');
console.log('Für vollautomatische Tests kann folgendes Script verwendet werden:');
console.log('');
console.log('```javascript');
console.log('// Mit NextAuth Session');
console.log('const response = await fetch("https://www.highendhomes.de/api/quotes", {');
console.log('  headers: {');
console.log('    "Cookie": sessionCookie // Von NextAuth Login');
console.log('  }');
console.log('});');
console.log('const quotes = await response.json();');
console.log('const testQuotes = quotes.filter(q => q.name.includes("E2E Pflichtfelder Test"));');
console.log('console.log("Gefundene Test-Anfragen:", testQuotes.length);');
console.log('```');
console.log('');
console.log('ODER Direkter Datenbank-Zugriff (lokal):');
console.log('');
console.log('```bash');
console.log('cd my-app');
console.log('npx prisma studio');
console.log('# Dann Tabelle "QuoteRequest" öffnen und suchen');
console.log('```');
console.log('');
console.log('='.repeat(60));
