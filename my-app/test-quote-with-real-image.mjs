#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join } from 'path'

// Lade ein echtes Bild aus dem Assets-Ordner
const imagePath = join(process.cwd(), '..', 'Assets', 'high end homes look.jpg')
const imageBuffer = readFileSync(imagePath)
const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`

console.log(`📸 Bild geladen: ${imagePath}`)
console.log(`   Größe: ${(imageBuffer.length / 1024).toFixed(2)} KB`)
console.log(`   Base64 Länge: ${imageBase64.length} Zeichen\n`)

const testPayload = {
  type: "Entkernung",
  name: "Max Mustermann",
  email: "max@mustermann.de",
  phone: "+49 6221 123456",
  company: "Mustermann Bau GmbH",
  squareMeters: 250,
  buildingType: "Haus",
  constructionYear: "1985",
  floor: "Erdgeschoss",
  elevator: "nein",
  removalItems: ["Böden", "Wandverkleidungen & Putz", "Sanitär (Bad/WC)", "Fenster & Türen"],
  quantityEstimate: "Hoch",
  asbestosRequired: false,
  otherPollutants: false,
  disposalWanted: true,
  permitStatus: "Vorhanden",
  desiredDate: "2026-07-15",
  notes: "Testanfrage mit ECHTEM Bild - bitte prüfen ob das Bild im Backend korrekt angezeigt wird. Das ist ein Foto einer Villa.",
  imagesBase64: [imageBase64],
  imageFileNames: ["villa-testbild.jpg"],
}

async function testQuoteSubmission() {
  console.log('🧪 Teste Quote-Submission mit echtem Bild...\n')
  
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
      console.log('\n📸 Echtes Bild wurde gesendet:', testPayload.imageFileNames[0])
      console.log('   Bildgröße:', (imageBuffer.length / 1024).toFixed(2), 'KB')
      console.log('\n👉 Prüfe jetzt im Backend unter http://localhost:3000/intern/quotes')
      console.log('   ob das Bild korrekt angezeigt wird!\n')
      console.log('💡 Tipp: Klicke auf das Bild, um es in voller Größe zu sehen.')
    } else {
      console.error('❌ Fehler:', data.error || 'Unbekannter Fehler')
      console.error('   Response:', JSON.stringify(data, null, 2))
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Netzwerkfehler:', error.message)
    process.exit(1)
  }
}

testQuoteSubmission()
