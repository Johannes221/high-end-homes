#!/bin/bash

echo "🔍 Prüfe Deployment-Status..."
echo ""

# Health Check
echo "1️⃣ Health Check:"
curl -s https://www.highendhomes.de/api/health | jq . || echo "❌ Health Check fehlgeschlagen"
echo ""

# Teste Quote API
echo "2️⃣ Quote API Test (ohne Daten):"
curl -s -X POST https://www.highendhomes.de/api/quote \
  -H "Content-Type: application/json" \
  -d '{}' | jq . || echo "❌ API nicht erreichbar"
echo ""

echo "✅ Deployment-Check abgeschlossen"
echo ""
echo "📋 Nächste Schritte:"
echo "   - Warte 2-3 Minuten auf Render Deployment"
echo "   - Führe dann aus: node test-production-quotes.js"
echo "   - Öffne: https://www.highendhomes.de/intern/quotes"
