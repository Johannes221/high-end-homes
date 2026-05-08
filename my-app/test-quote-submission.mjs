#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Testbild als Base64 (kleines 1x1 PNG)
const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const testPayload = {
  type: "Entrümpelung",
  name: "Test Kunde",
  email: "test@example.com",
  phone: "+49 123 456789",
  company: "Test GmbH",
  squareMeters: 120,
  buildingType: "Wohnung",
  floor: "2. OG",
  elevator: "ja",
  materials: ["Möbel", "Elektrogeräte", "Holz"],
  quantityEstimate: "Mittel",
  valuables: "Einige Antiquitäten vorhanden",
  desiredDate: "2026-06-01",
  notes: "Testanfrage mit Bildern - bitte prüfen ob Bilder korrekt angezeigt werden",
  imagesBase64: [testImageBase64, testImageBase64],
  imageFileNames: ["test-bild-1.png", "test-bild-2.png"],
}

async function testQuoteSubmission() {
  console.log('🧪 Teste Quote-Submission mit Bildern...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log('✅ Quote erfolgreich erstellt!')
      console.log('   ID:', data.id)
      console.log('   Komplexität:', data.complexity?.level, `(Score: ${data.complexity?.score})`)
      console.log('   Preisspanne:', `${data.estimate?.min} € - ${data.estimate?.max} €`)
      console.log('\n📸 Bilder wurden gesendet:', testPayload.imageFileNames.join(', '))
      console.log('\n👉 Prüfe jetzt im Backend unter http://localhost:3000/intern/quotes')
      console.log('   ob die Bilder korrekt angezeigt werden!\n')
    } else {
      console.error('❌ Fehler:', data.error || 'Unbekannter Fehler')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Netzwerkfehler:', error.message)
    process.exit(1)
  }
}

testQuoteSubmission()
