#!/bin/bash

echo "🧪 Teste einfache Quote ohne Bilder..."

curl -X POST https://www.highendhomes.de/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Entrümpelung",
    "name": "Simple Test",
    "email": "simple@test.com",
    "phone": "+49 123 456789",
    "squareMeters": 50,
    "buildingType": "Wohnung",
    "floor": "2. OG",
    "elevator": "Ja",
    "materials": ["Möbel"],
    "notes": "Einfacher Test ohne Bilder"
  }' | jq .

echo ""
echo "✅ Test abgeschlossen"
