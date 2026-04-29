// GET /api/debug/scraper?q=bauschutt - Debug-Route für Scraper (nur Development)

import { NextRequest, NextResponse } from "next/server";
import { sucheProdukte } from "@/lib/scraper";

export async function GET(req: NextRequest) {
  // Nur im Development-Modus erlaubt
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Nur im Development-Modus verfügbar" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query-Parameter 'q' fehlt" }, { status: 400 });
  }

  try {
    console.log(`[Debug] Scraper-Test für: "${query}"`);
    const result = await sucheProdukte(query);

    return NextResponse.json({
      query,
      ergebnisse: result.ergebnisse,
      zusammenfassung: {
        gesamtErgebnisse: result.ergebnisse.length,
        stufe1SerpApi: result.debugInfo.stufe1.erfolgreich ? result.debugInfo.stufe1.ergebnisseAnzahl : 0,
        stufe2ShopApis: result.debugInfo.stufe2.filter(d => d.erfolgreich).reduce((sum, d) => sum + d.ergebnisseAnzahl, 0),
        stufe3Puppeteer: result.debugInfo.stufe3.filter(d => d.erfolgreich).reduce((sum, d) => sum + d.ergebnisseAnzahl, 0),
        gesamtZeitMs: result.debugInfo.gesamtZeitMs,
      },
      debug: result.debugInfo,
    });
  } catch (err) {
    console.error("[Debug] Scraper-Fehler:", err);
    return NextResponse.json(
      { error: "Scraper-Fehler", message: err instanceof Error ? err.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}
