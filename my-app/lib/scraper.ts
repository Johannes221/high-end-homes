// 3-Stufen Scraper: SerpApi → Shop-APIs → Puppeteer (Fallback)

import puppeteer from "puppeteer";

// Neue erweiterte Schnittstelle mit Quelle
export interface Produktergebnis {
  produktName: string;
  preis: number;
  preisString: string;
  url: string;
  baumarktName: string;
  baumarktLogo: string;
  verfuegbarkeit: "verfuegbar" | "begrenzt" | "nicht_verfuegbar";
  quelle: "serpapi" | "hornbach_api" | "obi_api" | "bauhaus_api" | "puppeteer";
  bildUrl?: string;
}

// Legacy-Interface für Kompatibilität
export interface ScraperErgebnis {
  produktName: string;
  preis: number;
  waehrung: string;
  url: string;
  verfuegbarkeit: "verfuegbar" | "begrenzt" | "nicht_verfuegbar";
  baumarktName: string;
  baumarktLogo: string;
}

// Debug-Info für API-Route
export interface ScraperDebugInfo {
  stufe: number;
  quelle: string;
  erfolgreich: boolean;
  ergebnisseAnzahl: number;
  fehler?: string;
  rohdaten?: unknown;
}

// Baumarkt-Konfigurationen
const BAUMÄRKTE = [
  {
    name: "OBI",
    logo: "/logos/obi.svg",
    url: (q: string) => `https://www.obi.de/suche/${encodeURIComponent(q)}`,
    preisSelector: "[data-testid='product-price'], .ob-price__selling-price, .price, [class*='price']",
    nameSelector: "[data-testid='product-title'], .ob-product-title, h2.product-name, a[data-test='product-title']",
    linkSelector: "a[data-testid='product-link'], .ob-product-item a, a[href*='/p/'], a[data-test='product-title']",
    verfuegbarkeitSelector: ".availability, .ob-availability, [data-testid='availability']",
  },
  {
    name: "Bauhaus",
    logo: "/logos/bauhaus.svg",
    url: (q: string) => `https://www.bauhaus.info/search?q=${encodeURIComponent(q)}`,
    preisSelector: ".price__value, .price-tag, .selling-price",
    nameSelector: ".product-name, .product-title, h2",
    linkSelector: ".product-item a, .product-link",
    verfuegbarkeitSelector: ".availability-info, .stock-info",
  },
  {
    name: "Hornbach",
    logo: "/logos/hornbach.svg",
    url: (q: string) => `https://www.hornbach.de/search?q=${encodeURIComponent(q)}`,
    preisSelector: ".price__amount, .productbox__price, .product-price",
    nameSelector: ".productbox__title, .product-name, h3",
    linkSelector: "a.productbox__link, .product-item a",
    verfuegbarkeitSelector: ".delivery-info, .availability",
  },
  {
    name: "Hagebau",
    logo: "/logos/hagebau.svg",
    url: (q: string) => `https://www.hagebau.de/suche/?q=${encodeURIComponent(q)}`,
    preisSelector: ".price, .product-price, .selling-price",
    nameSelector: ".product-name, .product-title",
    linkSelector: ".product-item a",
    verfuegbarkeitSelector: ".availability",
  },
  {
    name: "Toom",
    logo: "/logos/toom.svg",
    url: (q: string) => `https://www.toom.de/search?q=${encodeURIComponent(q)}`,
    preisSelector: ".price, .product-price",
    nameSelector: ".product-name, .product-title",
    linkSelector: ".product-item a, .product-card a",
    verfuegbarkeitSelector: ".availability",
  },
  {
    name: "Globus Bau",
    logo: "/logos/globus.svg",
    url: (q: string) => `https://www.globus-baumarkt.de/search?q=${encodeURIComponent(q)}`,
    preisSelector: ".price, .selling-price",
    nameSelector: ".product-name, .product-title",
    linkSelector: ".product-item a",
    verfuegbarkeitSelector: ".availability",
  },
  {
    name: "Hellweg",
    logo: "/logos/hellweg.svg",
    url: (q: string) => `https://www.hellweg.de/search?q=${encodeURIComponent(q)}`,
    preisSelector: ".price, .product-price, .selling-price",
    nameSelector: ".product-name, .product-title",
    linkSelector: ".product-item a",
    verfuegbarkeitSelector: ".availability",
  },
];

// Hilfsfunktion: Preis aus Text extrahieren
function preisExtrahieren(text: string): number | null {
  const match = text.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  return null;
}

// Hilfsfunktion: Preis formatieren
function preisFormatieren(preis: number): string {
  return `${preis.toFixed(2).replace(".", ",")} €`;
}

// ========== STUFE 1: SerpApi Google Shopping ==========
const BAUMARKT_NAMEN = ["obi", "hornbach", "bauhaus", "hagebau", "toom", "globus", "hellweg"];
const BAUMARKT_LOGOS: Record<string, string> = {
  obi: "/logos/obi.svg",
  hornbach: "/logos/hornbach.svg",
  bauhaus: "/logos/bauhaus.svg",
  hagebau: "/logos/hagebau.svg",
  toom: "/logos/toom.svg",
  globus: "/logos/globus.svg",
  hellweg: "/logos/hellweg.svg",
};

async function serpApiSuche(suchanfrage: string): Promise<{ ergebnisse: Produktergebnis[]; debug: ScraperDebugInfo }> {
  const debug: ScraperDebugInfo = { stufe: 1, quelle: "serpapi", erfolgreich: false, ergebnisseAnzahl: 0 };
  const apiKey = process.env.SERPAPI_KEY || process.env.SERP_API_KEY;
  
  if (!apiKey) {
    debug.fehler = "SERPAPI_KEY oder SERP_API_KEY nicht gesetzt";
    return { ergebnisse: [], debug };
  }

  try {
    const params = new URLSearchParams({
      engine: "google_shopping",
      q: suchanfrage,
      gl: "de",
      hl: "de",
      google_domain: "google.de",
      num: "20",
      api_key: apiKey,
    });

    const url = `https://serpapi.com/search?${params.toString()}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    
    if (!response.ok) {
      debug.fehler = `HTTP ${response.status}: ${response.statusText}`;
      return { ergebnisse: [], debug };
    }

    const data = await response.json();
    debug.rohdaten = { shoppingResults: data.shopping_results?.length };

    const shoppingResults = data.shopping_results || [];
    
    // Debug: Alle source-Felder ausgeben
    console.log("\n=== SerpApi ALLE source-Felder (unfiltriert) ===");
    console.log("Anzahl Ergebnisse:", shoppingResults.length);
    console.log("Sources:", shoppingResults.map((item: { source?: string; title?: string; link?: string }) => ({ 
      source: item.source, 
      title: item.title?.substring(0, 40),
      link: item.link?.substring(0, 50)
    })));
    console.log("=====================================\n");
    
    const gefiltert: Produktergebnis[] = [];

    for (const item of shoppingResults) {
      // Prüfe sowohl source als auch link auf Baumarkt-Namen
      const sourceText = (item.source || "").toLowerCase();
      const linkText = (item.link || "").toLowerCase();
      const titleText = (item.title || "").toLowerCase();
      
      const baumarktKey = BAUMARKT_NAMEN.find(name => 
        sourceText.includes(name) || 
        linkText.includes(name) ||
        titleText.includes(name)
      );
      
      if (!baumarktKey) continue;
      if (!item.link || !item.price) continue;

      const preis = preisExtrahieren(item.price);
      if (!preis || preis <= 0) continue;

      gefiltert.push({
        produktName: item.title || "Unbekanntes Produkt",
        preis,
        preisString: preisFormatieren(preis),
        url: item.link,
        baumarktName: item.source || baumarktKey.charAt(0).toUpperCase() + baumarktKey.slice(1),
        baumarktLogo: BAUMARKT_LOGOS[baumarktKey] || "/logos/default.svg",
        verfuegbarkeit: "verfuegbar",
        quelle: "serpapi",
        bildUrl: item.thumbnail,
      });
    }

    debug.erfolgreich = gefiltert.length > 0;
    debug.ergebnisseAnzahl = gefiltert.length;
    
    console.log(`[SerpApi] ${gefiltert.length} Ergebnisse gefunden`);
    return { ergebnisse: gefiltert, debug };
  } catch (err) {
    debug.fehler = err instanceof Error ? err.message : "Unbekannter Fehler";
    return { ergebnisse: [], debug };
  }
}

// ========== STUFE 2: Direkte Shop-APIs ==========
async function hornbachApiSuche(suchanfrage: string): Promise<{ ergebnisse: Produktergebnis[]; debug: ScraperDebugInfo }> {
  const debug: ScraperDebugInfo = { stufe: 2, quelle: "hornbach_api", erfolgreich: false, ergebnisseAnzahl: 0 };
  
  try {
    const url = `https://www.hornbach.de/api/articles/search?q=${encodeURIComponent(suchanfrage)}&storeId=10&pageSize=5`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    console.log(`[Hornbach API] Status: ${response.status}`);
    const text = await response.text();
    console.log(`[Hornbach API] Response (first 500 chars): ${text.substring(0, 500)}`);

    if (!response.ok) {
      debug.fehler = `HTTP ${response.status}`;
      return { ergebnisse: [], debug };
    }

    const data = JSON.parse(text);
    const articles = data.articles || data.results || data.data || [];
    const ergebnisse: Produktergebnis[] = [];

    for (const item of articles.slice(0, 5)) {
      const preisRaw = item.price?.gross || item.price || item.grossPrice || item.preis;
      const preis = typeof preisRaw === "number" ? preisRaw : preisExtrahieren(String(preisRaw || ""));
      
      if (!preis) continue;

      const url = item.articleUrl || item.url || item.link || `https://www.hornbach.de/suche/${encodeURIComponent(suchanfrage)}`;
      if (!url || url.includes("/suche/")) continue;

      ergebnisse.push({
        produktName: item.title || item.name || item.articleName || "Hornbach Produkt",
        preis,
        preisString: preisFormatieren(preis),
        url,
        baumarktName: "Hornbach",
        baumarktLogo: "/logos/hornbach.svg",
        verfuegbarkeit: "verfuegbar",
        quelle: "hornbach_api",
        bildUrl: item.imageUrl || item.thumbnail,
      });
    }

    debug.erfolgreich = ergebnisse.length > 0;
    debug.ergebnisseAnzahl = ergebnisse.length;
    console.log(`[Hornbach API] ${ergebnisse.length} Produkte gefunden`);
    
    return { ergebnisse, debug };
  } catch (err) {
    debug.fehler = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.log(`[Hornbach API] Fehler: ${debug.fehler}`);
    return { ergebnisse: [], debug };
  }
}

async function obiApiSuche(suchanfrage: string): Promise<{ ergebnisse: Produktergebnis[]; debug: ScraperDebugInfo }> {
  const debug: ScraperDebugInfo = { stufe: 2, quelle: "obi_api", erfolgreich: false, ergebnisseAnzahl: 0 };
  
  try {
    const url = `https://www.obi.de/search/api/products?q=${encodeURIComponent(suchanfrage)}&limit=5`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    console.log(`[OBI API] Status: ${response.status}`);
    const text = await response.text();
    console.log(`[OBI API] Response (first 500 chars): ${text.substring(0, 500)}`);

    if (!response.ok) {
      debug.fehler = `HTTP ${response.status}`;
      return { ergebnisse: [], debug };
    }

    const data = JSON.parse(text);
    const products = data.products || data.results || data.data || [];
    const ergebnisse: Produktergebnis[] = [];

    for (const item of products.slice(0, 5)) {
      const preisRaw = item.price?.value || item.price || item.grossPrice;
      const preis = typeof preisRaw === "number" ? preisRaw : preisExtrahieren(String(preisRaw || ""));
      
      if (!preis) continue;

      const url = item.url || item.productUrl || item.link;
      if (!url) continue;

      ergebnisse.push({
        produktName: item.name || item.title || item.productName || "OBI Produkt",
        preis,
        preisString: preisFormatieren(preis),
        url: url.startsWith("http") ? url : `https://www.obi.de${url}`,
        baumarktName: "OBI",
        baumarktLogo: "/logos/obi.svg",
        verfuegbarkeit: "verfuegbar",
        quelle: "obi_api",
        bildUrl: item.image || item.thumbnail,
      });
    }

    debug.erfolgreich = ergebnisse.length > 0;
    debug.ergebnisseAnzahl = ergebnisse.length;
    console.log(`[OBI API] ${ergebnisse.length} Produkte gefunden`);
    
    return { ergebnisse, debug };
  } catch (err) {
    debug.fehler = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.log(`[OBI API] Fehler: ${debug.fehler}`);
    return { ergebnisse: [], debug };
  }
}

async function bauhausApiSuche(suchanfrage: string): Promise<{ ergebnisse: Produktergebnis[]; debug: ScraperDebugInfo }> {
  const debug: ScraperDebugInfo = { stufe: 2, quelle: "bauhaus_api", erfolgreich: false, ergebnisseAnzahl: 0 };
  
  try {
    const url = `https://www.bauhaus.info/search-api/search?q=${encodeURIComponent(suchanfrage)}&limit=5&lang=de`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    console.log(`[Bauhaus API] Status: ${response.status}`);
    const text = await response.text();
    console.log(`[Bauhaus API] Response (first 500 chars): ${text.substring(0, 500)}`);

    if (!response.ok) {
      debug.fehler = `HTTP ${response.status}`;
      return { ergebnisse: [], debug };
    }

    const data = JSON.parse(text);
    const products = data.products || data.results || data.data || data.items || [];
    const ergebnisse: Produktergebnis[] = [];

    for (const item of products.slice(0, 5)) {
      const preisRaw = item.price?.value || item.price || item.grossPrice || item.prices?.[0]?.value;
      const preis = typeof preisRaw === "number" ? preisRaw : preisExtrahieren(String(preisRaw || ""));
      
      if (!preis) continue;

      const url = item.url || item.productUrl || item.link || item.slug;
      if (!url) continue;

      ergebnisse.push({
        produktName: item.name || item.title || item.productName || "Bauhaus Produkt",
        preis,
        preisString: preisFormatieren(preis),
        url: url.startsWith("http") ? url : `https://www.bauhaus.info${url}`,
        baumarktName: "Bauhaus",
        baumarktLogo: "/logos/bauhaus.svg",
        verfuegbarkeit: "verfuegbar",
        quelle: "bauhaus_api",
        bildUrl: item.image || item.thumbnail || item.imageUrl,
      });
    }

    debug.erfolgreich = ergebnisse.length > 0;
    debug.ergebnisseAnzahl = ergebnisse.length;
    console.log(`[Bauhaus API] ${ergebnisse.length} Produkte gefunden`);
    
    return { ergebnisse, debug };
  } catch (err) {
    debug.fehler = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.log(`[Bauhaus API] Fehler: ${debug.fehler}`);
    return { ergebnisse: [], debug };
  }
}

async function shopApisSuchen(suchanfrage: string): Promise<{ ergebnisse: Produktergebnis[]; debugs: ScraperDebugInfo[] }> {
  const [hornbach, obi, bauhaus] = await Promise.all([
    hornbachApiSuche(suchanfrage),
    obiApiSuche(suchanfrage),
    bauhausApiSuche(suchanfrage),
  ]);

  const alleErgebnisse = [...hornbach.ergebnisse, ...obi.ergebnisse, ...bauhaus.ergebnisse];
  
  return {
    ergebnisse: alleErgebnisse,
    debugs: [hornbach.debug, obi.debug, bauhaus.debug],
  };
}

// ========== STUFE 3: Puppeteer (Fallback) ==========
async function baumarktScrapen(
  baumarkt: (typeof BAUMÄRKTE)[0],
  suchanfrage: string
): Promise<Produktergebnis[]> {
  console.log(`[Puppeteer] Fallback für ${baumarkt.name}...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setDefaultTimeout(15000);

    await page.goto(baumarkt.url(suchanfrage), { waitUntil: "domcontentloaded", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    const ergebnisse = await page.evaluate(
      (preisSelector, nameSelector, linkSelector, verfSelector, baumarktName, baumarktLogo) => {
        const produkte: Array<{
          produktName: string;
          preisText: string;
          url: string;
          verfuegbarkeit: string;
          baumarktName: string;
          baumarktLogo: string;
          waehrung: string;
        }> = [];

        const nameElems = document.querySelectorAll(nameSelector);

        nameElems.forEach((nameElem, index) => {
          if (index >= 5) return;

          const container = nameElem.closest("li, article, div[class*='product'], div[class*='item']") || nameElem.parentElement;
          if (!container) return;

          const preisElem = container.querySelector(preisSelector) || document.querySelectorAll(preisSelector)[index];
          const linkElem = container.querySelector(linkSelector) as HTMLAnchorElement | null;
          const verfElem = container.querySelector(verfSelector);

          const produktName = nameElem.textContent?.trim() || "";
          const preisText = preisElem?.textContent?.trim() || "";
          const url = linkElem?.href || "";
          const verfuegbarkeit = verfElem?.textContent?.trim() || "verfuegbar";

          if (produktName && preisText && url && !url.includes("/suche") && !url.includes("/search")) {
            produkte.push({
              produktName,
              preisText,
              url,
              verfuegbarkeit,
              baumarktName,
              baumarktLogo,
              waehrung: "EUR",
            });
          }
        });

        return produkte;
      },
      baumarkt.preisSelector,
      baumarkt.nameSelector,
      baumarkt.linkSelector,
      baumarkt.verfuegbarkeitSelector,
      baumarkt.name,
      baumarkt.logo
    );

    const produkte: Produktergebnis[] = [];
    
    for (const e of ergebnisse) {
      const preis = preisExtrahieren(e.preisText);
      if (!preis) continue;

      let verfuegbarkeit: Produktergebnis["verfuegbarkeit"] = "verfuegbar";
      const verfText = e.verfuegbarkeit.toLowerCase();
      if (verfText.includes("nicht") || verfText.includes("ausverkauft")) {
        verfuegbarkeit = "nicht_verfuegbar";
      } else if (verfText.includes("begrenzt") || verfText.includes("wenige")) {
        verfuegbarkeit = "begrenzt";
      }

      produkte.push({
        produktName: e.produktName,
        preis,
        preisString: preisFormatieren(preis),
        url: e.url,
        verfuegbarkeit,
        baumarktName: e.baumarktName,
        baumarktLogo: e.baumarktLogo,
        quelle: "puppeteer",
      });
    }
    
    return produkte;
  } finally {
    await browser.close();
  }
}

async function puppeteerSuchen(suchanfrage: string): Promise<{ ergebnisse: Produktergebnis[]; debugs: ScraperDebugInfo[] }> {
  const ergebnisse = await Promise.allSettled(
    BAUMÄRKTE.map((baumarkt) => baumarktScrapen(baumarkt, suchanfrage))
  );

  const alleErgebnisse: Produktergebnis[] = [];
  const debugs: ScraperDebugInfo[] = [];

  BAUMÄRKTE.forEach((baumarkt, index) => {
    const ergebnis = ergebnisse[index];
    const erfolgreich = ergebnis.status === "fulfilled";
    const items = erfolgreich ? ergebnis.value : [];
    
    debugs.push({
      stufe: 3,
      quelle: `puppeteer_${baumarkt.name.toLowerCase()}`,
      erfolgreich: erfolgreich && items.length > 0,
      ergebnisseAnzahl: items.length,
      fehler: !erfolgreich && ergebnis.status === "rejected" ? String(ergebnis.reason) : undefined,
    });

    if (erfolgreich) {
      alleErgebnisse.push(...items);
    }
  });

  return { ergebnisse: alleErgebnisse, debugs };
}

// ========== SUCHBEGRIFF-ERWEITERUNG ==========
const SYNONYME: Record<string, string[]> = {
  bauschutt: ["schutt", "bauschuttbeutel", "schuttbeutel", "bauschuttsack", "big bag bauschutt"],
  schutt: ["bauschutt", "schuttbeutel", "bauschuttsack"],
  dachrinne: ["rinne", "dachrinnen", "regenrinne"],
  bauholz: ["holz", "kantholz", "latten", "bretter", "konstruktionsholz"],
  holz: ["bauholz", "kantholz", "latten", "bretter"],
  zement: ["zementmörtel", "mörtel", "beton"],
  farbe: ["wandfarbe", "deckenfarbe", "acrylfarbe"],
  schrauben: ["dübel", "schraubenset", "schraubenbox"],
  werkzeug: ["werkzeuge", "handwerkzeug", "elektrowerkzeug"],
};

function suchbegriffeErweitern(suchanfrage: string): string[] {
  const begriffe = new Set<string>();
  begriffe.add(suchanfrage.toLowerCase().trim());
  
  const basis = suchanfrage.toLowerCase().replace(/\s+/g, " ");
  
  for (const [hauptwort, synonyme] of Object.entries(SYNONYME)) {
    if (basis.includes(hauptwort)) {
      synonyme.forEach(syn => begriffe.add(syn));
    }
  }
  
  return Array.from(begriffe);
}

// ========== HAUPTFUNKTION: 3-STUFEN-SUCHE ==========
export interface SuchergebnisMitDebug {
  ergebnisse: Produktergebnis[];
  debugInfo: {
    stufe1: ScraperDebugInfo;
    stufe2: ScraperDebugInfo[];
    stufe3: ScraperDebugInfo[];
    gesamtZeitMs: number;
  };
}

export async function sucheProdukte(suchanfrage: string): Promise<SuchergebnisMitDebug> {
  const startZeit = Date.now();
  const suchbegriffe = suchbegriffeErweitern(suchanfrage);
  
  console.log(`\n[Suche] Starte Suche für: "${suchanfrage}"`);
  console.log(`[Suche] Erweiterte Begriffe: ${suchbegriffe.join(", ")}`);

  let alleErgebnisse: Produktergebnis[] = [];
  let stufe1Debug: ScraperDebugInfo = { stufe: 1, quelle: "serpapi", erfolgreich: false, ergebnisseAnzahl: 0 };
  const stufe2Debugs: ScraperDebugInfo[] = [];
  const stufe3Debugs: ScraperDebugInfo[] = [];

  // === STUFE 1: SerpApi ===
  for (const begriff of suchbegriffe) {
    const { ergebnisse, debug } = await serpApiSuche(begriff);
    alleErgebnisse.push(...ergebnisse);
    if (debug.erfolgreich) {
      stufe1Debug = debug;
    }
  }

  // Deduplizieren nach URL
  const geseheneUrls = new Set<string>();
  alleErgebnisse = alleErgebnisse.filter(e => {
    if (geseheneUrls.has(e.url)) return false;
    geseheneUrls.add(e.url);
    return true;
  });

  console.log(`[Suche] Stufe 1 (SerpApi): ${alleErgebnisse.length} Ergebnisse`);

  // Wenn >= 3 Ergebnisse: überspringe Stufe 2
  if (alleErgebnisse.length >= 3) {
    console.log("[Suche] Genug Ergebnisse aus SerpApi – überspringe Shop-APIs");
  } else {
    // === STUFE 2: Shop-APIs ===
    for (const begriff of suchbegriffe) {
      const { ergebnisse, debugs } = await shopApisSuchen(begriff);
      
      for (const e of ergebnisse) {
        if (!geseheneUrls.has(e.url)) {
          alleErgebnisse.push(e);
          geseheneUrls.add(e.url);
        }
      }
      stufe2Debugs.push(...debugs);
    }
    
    console.log(`[Suche] Stufe 1+2 (SerpApi + Shop-APIs): ${alleErgebnisse.length} Ergebnisse`);

    // Wenn >= 3 Ergebnisse: überspringe Stufe 3
    if (alleErgebnisse.length >= 3) {
      console.log("[Suche] Genug Ergebnisse – überspringe Puppeteer");
    } else {
      // === STUFE 3: Puppeteer Fallback ===
      for (const begriff of suchbegriffe) {
        const { ergebnisse, debugs } = await puppeteerSuchen(begriff);
        
        for (const e of ergebnisse) {
          if (!geseheneUrls.has(e.url)) {
            alleErgebnisse.push(e);
            geseheneUrls.add(e.url);
          }
        }
        stufe3Debugs.push(...debugs);
      }
      
      console.log(`[Suche] Stufe 1+2+3 (alle): ${alleErgebnisse.length} Ergebnisse`);
    }
  }

  // Sortieren nach Preis
  alleErgebnisse.sort((a, b) => a.preis - b.preis);

  const gesamtZeit = Date.now() - startZeit;
  console.log(`[Suche] Abgeschlossen in ${gesamtZeit}ms mit ${alleErgebnisse.length} Ergebnissen\n`);

  return {
    ergebnisse: alleErgebnisse,
    debugInfo: {
      stufe1: stufe1Debug,
      stufe2: stufe2Debugs,
      stufe3: stufe3Debugs,
      gesamtZeitMs: gesamtZeit,
    },
  };
}

// Legacy-Wrapper für Kompatibilität mit bestehendem Code
export async function allePreisScrapen(suchanfrage: string): Promise<ScraperErgebnis[]> {
  const { ergebnisse } = await sucheProdukte(suchanfrage);
  
  return ergebnisse.map(e => ({
    produktName: e.produktName,
    preis: e.preis,
    waehrung: "EUR",
    url: e.url,
    verfuegbarkeit: e.verfuegbarkeit,
    baumarktName: e.baumarktName,
    baumarktLogo: e.baumarktLogo,
  }));
}

// Einzelne URL scrapen (für Preisalarm-Checks)
export async function einzelPreisScrapen(url: string): Promise<number | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    const preisText = await page.$eval(
      ".price, .product-price, [class*='price'], [itemprop='price']",
      (el) => el.textContent || ""
    );

    return preisExtrahieren(preisText);
  } catch {
    return null;
  } finally {
    await browser.close();
  }
}
