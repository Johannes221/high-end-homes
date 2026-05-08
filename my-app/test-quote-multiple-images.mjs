#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join } from 'path'

// Lade mehrere echte Bilder
const images = [
  'high end homes look.jpg',
  'fassade hero.png',
  'villa-bild.png'
]

const imagesBase64 = []
const imageFileNames = []
let totalSize = 0

console.log('📸 Lade Bilder...\n')

for (const imageName of images) {
  try {
    const imagePath = join(process.cwd(), '..', 'Assets', imageName)
    const imageBuffer = readFileSync(imagePath)
    const ext = imageName.split('.').pop()
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'
    const base64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`
    
    imagesBase64.push(base64)
    imageFileNames.push(imageName)
    totalSize += imageBuffer.length
    
    console.log(`   ✓ ${imageName} (${(imageBuffer.length / 1024).toFixed(2)} KB)`)
  } catch (error) {
    console.log(`   ✗ ${imageName} - Fehler: ${error.message}`)
  }
}

console.log(`\n   Gesamt: ${imagesBase64.length} Bilder, ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`)

const testPayload = {
  type: "Kombi",
  name: "Anna Schmidt",
  email: "anna.schmidt@example.com",
  phone: "+49 621 987654",
  company: "Schmidt Immobilien",
  squareMeters: 180,
  buildingType: "Haus",
  floor: "Erdgeschoss",
  elevator: "nein",
  materials: ["Möbel", "Elektrogeräte", "Baumaterialien"],
  removalItems: ["Böden", "Sanitär (Bad/WC)", "Elektroinstallationen"],
  quantityEstimate: "Sehr hoch",
  valuables: "Keine",
  asbestosRequired: true,
  otherPollutants: false,
  disposalWanted: true,
  permitStatus: "In Bearbeitung",
  desiredDate: "2026-08-01",
  notes: "Testanfrage mit MEHREREN echten Bildern - bitte prüfen ob alle Bilder im Backend korrekt angezeigt werden und die Lightbox funktioniert.",
  imagesBase64,
  imageFileNames,
}

async function testQuoteSubmission() {
  console.log('🧪 Teste Quote-Submission mit mehreren echten Bildern...\n')
  
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
      console.log('\n📸 Bilder wurden gesendet:')
      imageFileNames.forEach((name, i) => console.log(`   ${i + 1}. ${name}`))
      console.log('\n👉 Prüfe jetzt im Backend unter http://localhost:3000/intern/quotes')
      console.log('   - Werden alle Bilder als Thumbnails angezeigt?')
      console.log('   - Funktioniert die Lightbox beim Klick?')
      console.log('   - Kann man zwischen den Bildern navigieren?')
      console.log('   - Funktioniert der Zoom?\n')
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
