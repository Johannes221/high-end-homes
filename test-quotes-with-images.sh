#!/bin/bash

# Script zum Senden von Testanfragen mit echten Bildern

API_URL="https://high-end-homes.onrender.com/api/quote"

# Funktion zum Konvertieren einer Datei in Base64
convert_to_base64() {
    local file="$1"
    local mime_type=$(file -b --mime-type "$file")
    local base64_data=$(base64 -i "$file" | tr -d '\n')
    echo "data:$mime_type;base64,$base64_data"
}

# Testanfrage 1: Entrümpelung mit PNG
echo "Sende Testanfrage 1: Entrümpelung mit PNG..."
fassade_base64=$(convert_to_base64 "/Users/johan/high-end-homes/Assets/fassade hero.png")
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"Entrümpelung\",
    \"name\": \"Thomas Weber\",
    \"email\": \"thomas.weber@example.com\",
    \"phone\": \"017612345678\",
    \"company\": \"Weber GmbH\",
    \"squareMeters\": \"85\",
    \"buildingType\": \"Wohnung\",
    \"floor\": \"3.OG\",
    \"elevator\": \"Ja\",
    \"materials\": [\"Möbel\", \"Elektrogeräte\", \"Küche\"],
    \"quantityEstimate\": \"Viel\",
    \"valuables\": \"Ja\",
    \"asbestosRequired\": false,
    \"desiredDate\": \"2025-06-15\",
    \"imageFileNames\": [\"fassade-hero.png\"],
    \"imagesBase64\": [\"$fassade_base64\"],
    \"notes\": \"Komplette Wohnung zu räumen mit echtem PNG-Bild\"
  }"
echo ""

# Testanfrage 2: Entkernung mit PNG
echo "Sende Testanfrage 2: Entkernung mit PNG..."
villa_base64=$(convert_to_base64 "/Users/johan/high-end-homes/Assets/villa-bild.png")
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"Entkernung\",
    \"name\": \"Klaus Müller\",
    \"email\": \"klaus.mueller@example.com\",
    \"phone\": \"017698765432\",
    \"squareMeters\": \"150\",
    \"buildingType\": \"Haus\",
    \"constructionYear\": \"1985\",
    \"floor\": \"Erdgeschoss\",
    \"elevator\": \"Nein\",
    \"removalItems\": [\"Böden\", \"Deckenverkleidungen\", \"Sanitär (Bad/WC)\", \"Fenster & Türen\"],
    \"asbestosRequired\": false,
    \"otherPollutants\": false,
    \"disposalWanted\": true,
    \"permitStatus\": \"Ja\",
    \"desiredDate\": \"2025-08-01\",
    \"imageFileNames\": [\"villa-bild.png\"],
    \"imagesBase64\": [\"$villa_base64\"],
    \"notes\": \"Altbau komplett entkernen mit echtem PNG-Bild\"
  }"
echo ""

# Testanfrage 3: Entrümpelung & Entkernung mit PNG
echo "Sende Testanfrage 3: Entrümpelung & Entkernung mit PNG..."
logo_base64=$(convert_to_base64 "/Users/johan/high-end-homes/Assets/high-end homes logo b 1.png")
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"Entrümpelung & Entkernung\",
    \"name\": \"Peter Krause\",
    \"email\": \"peter.krause@example.com\",
    \"phone\": \"01623334455\",
    \"company\": \"Krause Immobilien\",
    \"squareMeters\": \"250\",
    \"buildingType\": \"Gewerbe\",
    \"floor\": \"1.OG\",
    \"elevator\": \"Ja\",
    \"effortEstimate\": \"Hoch\",
    \"materials\": [\"Möbel\", \"Elektrogeräte\", \"Büroausstattung\"],
    \"removalItems\": [\"Böden\", \"Wandverkleidungen & Putz\", \"Elektroinstallationen\"],
    \"asbestosRequired\": false,
    \"desiredDate\": \"2025-09-01\",
    \"imageFileNames\": [\"logo-b-1.png\"],
    \"imagesBase64\": [\"$logo_base64\"],
    \"notes\": \"Komplette Bürosäule räumen und entkernen mit echtem PNG-Bild\"
  }"
echo ""

echo "Alle Testanfragen gesendet!"
