"use client";

// Dashboard Hauptseite – Preisvergleich mit Suche

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsTable from "@/components/ResultsTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { ScraperErgebnis } from "@/lib/scraper";

export default function DashboardPage() {
  const [ergebnisse, setErgebnisse] = useState<ScraperErgebnis[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");
  const [gesucht, setGesucht] = useState(false);
  const [gespeicherteFavoriten, setGespeicherteFavoriten] = useState<Set<string>>(new Set());

  const handleSuche = async (suchanfrage: string) => {
    setLaedt(true);
    setFehler("");
    setGesucht(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suchanfrage }),
      });

      const data = await res.json() as { ergebnisse?: ScraperErgebnis[]; fehler?: string };

      if (!res.ok) {
        setFehler(data.fehler || "Fehler bei der Suche");
        setErgebnisse([]);
      } else {
        setErgebnisse(data.ergebnisse || []);
      }
    } catch {
      setFehler("Netzwerkfehler – bitte versuche es erneut");
      setErgebnisse([]);
    } finally {
      setLaedt(false);
    }
  };

  const handleFavoritHinzufuegen = async (ergebnis: ScraperErgebnis) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: ergebnis.produktName,
          baumarkt: ergebnis.baumarktName,
          preis: ergebnis.preis,
          url: ergebnis.url,
        }),
      });

      if (res.ok) {
        const favKey = `${ergebnis.baumarktName}-${ergebnis.produktName}`;
        setGespeicherteFavoriten((prev) => new Set([...prev, favKey]));
      }
    } catch {
      alert("Fehler beim Speichern des Favoriten");
    }
  };

  return (
    <div>
      {/* Seitenheader */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Preisvergleich</h1>
        <p className="text-gray-500 text-sm">
          Vergleiche Preise aus 7 Baumärkten im Rhein-Neckar-Kreis
        </p>
      </div>

      {/* Suchfeld */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <SearchBar onSuche={handleSuche} laedt={laedt} />
      </div>

      {/* Ladezustand */}
      {laedt && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <LoadingSpinner text="Durchsuche 7 Baumärkte..." />
        </div>
      )}

      {/* Fehler */}
      {!laedt && fehler && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-600 text-sm">
          {fehler}
        </div>
      )}

      {/* Ergebnistabelle */}
      {!laedt && !fehler && gesucht && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {ergebnisse.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              {ergebnisse.length} Ergebnisse gefunden – sortiert nach Preis
            </p>
          )}
          <ResultsTable
            ergebnisse={ergebnisse}
            onFavoritHinzufuegen={handleFavoritHinzufuegen}
            gespeicherteFavoriten={gespeicherteFavoriten}
          />
        </div>
      )}

      {/* Willkommens-Zustand (noch keine Suche) */}
      {!gesucht && !laedt && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { emoji: "🏪", titel: "7 Baumärkte", text: "OBI, Bauhaus, Hornbach, Hagebau, Toom, Globus & Hellweg" },
            { emoji: "💡", titel: "Echtzeit-Preise", text: "Aktuelle Preise direkt von den Webseiten der Baumärkte" },
            { emoji: "⭐", titel: "Preisalarme", text: "Speichere Favoriten und lass dich bei Preisänderungen benachrichtigen" },
          ].map((karte) => (
            <div key={karte.titel} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="text-3xl mb-3">{karte.emoji}</div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{karte.titel}</p>
              <p className="text-gray-500 text-xs">{karte.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
