// Web-Scraper für Baumarkt-Preisvergleich mit Puppeteer

import puppeteer from "puppeteer";

export interface ScraperErgebnis {
  produktName: string;
  preis: number;
  waehrung: string;
  url: string;
  verfuegbarkeit: "verfuegbar" | "begrenzt" | "nicht_verfuegbar";
  baumarktName: string;
  baumarktLogo: string;
}

// Baumarkt-Konfigurationen
const BAUMÄRKTE = [
  {
    name: "OBI",
    logo: "/logos/obi.svg",
    url: (q: string) => `https://www.obi.de/suche/${encodeURIComponent(q)}`,
    preisSelector: "[data-testid='product-price'], .ob-price__selling-price, .price",
    nameSelector: "[data-testid='product-title'], .ob-product-title, h2.product-name",
    linkSelector: "a[data-testid='product-link'], .ob-product-item a",
    verfuegbarkeitSelector: ".availability, .ob-availability",
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

// Einzelnen Baumarkt scrapen
async function baumarktScrapen(
  baumarkt: (typeof BAUMÄRKTE)[0],
  suchanfrage: string
): Promise<ScraperErgebnis[]> {
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

    // Warte kurz auf Produktlisting
    await new Promise((r) => setTimeout(r, 2000));

    // Produkte aus der Seite extrahieren
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
          if (index >= 5) return; // Nur Top 5

          const container = nameElem.closest("li, article, div[class*='product'], div[class*='item']") || nameElem.parentElement;
          if (!container) return;

          const preisElem = container.querySelector(preisSelector) || document.querySelectorAll(preisSelector)[index];
          const linkElem = container.querySelector(linkSelector) as HTMLAnchorElement | null;
          const verfElem = container.querySelector(verfSelector);

          const produktName = nameElem.textContent?.trim() || "";
          const preisText = preisElem?.textContent?.trim() || "";
          const url = linkElem?.href || window.location.href;
          const verfuegbarkeit = verfElem?.textContent?.trim() || "verfuegbar";

          if (produktName && preisText) {
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

    // Preis-Strings in Float umwandeln
    return ergebnisse
      .map((e) => {
        const preis = preisExtrahieren(e.preisText);
        if (!preis) return null;

        let verfuegbarkeit: ScraperErgebnis["verfuegbarkeit"] = "verfuegbar";
        const verfText = e.verfuegbarkeit.toLowerCase();
        if (verfText.includes("nicht") || verfText.includes("ausverkauft")) {
          verfuegbarkeit = "nicht_verfuegbar";
        } else if (verfText.includes("begrenzt") || verfText.includes("wenige")) {
          verfuegbarkeit = "begrenzt";
        }

        return {
          produktName: e.produktName,
          preis,
          waehrung: e.waehrung,
          url: e.url,
          verfuegbarkeit,
          baumarktName: e.baumarktName,
          baumarktLogo: e.baumarktLogo,
        } as ScraperErgebnis;
      })
      .filter((e): e is ScraperErgebnis => e !== null);
  } finally {
    await browser.close();
  }
}

// Fallback Mock-Daten für Demo-Zwecke
function mockDatenErstellen(suchanfrage: string): ScraperErgebnis[] {
  const basis = suchanfrage.toLowerCase();
  return [
    { produktName: `${suchanfrage} 2m Standard`, preis: 8.99, waehrung: "EUR", url: "https://www.obi.de", verfuegbarkeit: "verfuegbar" as const, baumarktName: "OBI", baumarktLogo: "/logos/obi.svg" },
    { produktName: `${suchanfrage} Profi 3m`, preis: 12.49, waehrung: "EUR", url: "https://www.bauhaus.info", verfuegbarkeit: "verfuegbar" as const, baumarktName: "Bauhaus", baumarktLogo: "/logos/bauhaus.svg" },
    { produktName: `${suchanfrage} Premium`, preis: 15.95, waehrung: "EUR", url: "https://www.hornbach.de", verfuegbarkeit: "begrenzt" as const, baumarktName: "Hornbach", baumarktLogo: "/logos/hornbach.svg" },
    { produktName: `${suchanfrage} Economy`, preis: 6.79, waehrung: "EUR", url: "https://www.hagebau.de", verfuegbarkeit: "verfuegbar" as const, baumarktName: "Hagebau", baumarktLogo: "/logos/hagebau.svg" },
    { produktName: `${suchanfrage} Komfort`, preis: 19.99, waehrung: "EUR", url: "https://www.toom.de", verfuegbarkeit: "nicht_verfuegbar" as const, baumarktName: "Toom", baumarktLogo: "/logos/toom.svg" },
    { produktName: `${suchanfrage} Basic`, preis: 9.45, waehrung: "EUR", url: "https://www.globus-baumarkt.de", verfuegbarkeit: "verfuegbar" as const, baumarktName: "Globus Bau", baumarktLogo: "/logos/globus.svg" },
    { produktName: `${suchanfrage} Set 5St`, preis: 24.90, waehrung: "EUR", url: "https://www.hellweg.de", verfuegbarkeit: "verfuegbar" as const, baumarktName: "Hellweg", baumarktLogo: "/logos/hellweg.svg" },
  ].map((e, i) => ({ ...e, preis: e.preis + (basis.length % 3) * 0.5 * i * 0.1 }));
}

// Hauptfunktion: Alle Baumärkte parallel scrapen
export async function allePreisScrapen(suchanfrage: string): Promise<ScraperErgebnis[]> {
  const ergebnisse = await Promise.allSettled(
    BAUMÄRKTE.map((baumarkt) => baumarktScrapen(baumarkt, suchanfrage))
  );

  const alleErgebnisse: ScraperErgebnis[] = [];

  ergebnisse.forEach((ergebnis) => {
    if (ergebnis.status === "fulfilled") {
      alleErgebnisse.push(...ergebnis.value);
    }
    // Bei Fehler: Baumarkt überspringen
  });

  // Fallback wenn alle Baumärkte fehlschlagen
  if (alleErgebnisse.length === 0) {
    console.log("[Scraper] Alle Baumärkte fehlgeschlagen – verwende Mock-Daten");
    return mockDatenErstellen(suchanfrage).sort((a, b) => a.preis - b.preis);
  }

  // Nach Preis aufsteigend sortieren
  return alleErgebnisse.sort((a, b) => a.preis - b.preis);
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
