"use client";

// Ergebnistabelle für Preisvergleich

import { ExternalLink, Star } from "lucide-react";
import type { ScraperErgebnis } from "@/lib/scraper";

interface ResultsTableProps {
  ergebnisse: ScraperErgebnis[];
  onFavoritHinzufuegen: (ergebnis: ScraperErgebnis) => void;
  gespeicherteFavoriten: Set<string>;
}

const VERFUEGBARKEIT_CONFIG = {
  verfuegbar: { label: "Verfügbar", klasse: "bg-green-100 text-green-700" },
  begrenzt: { label: "Begrenzt", klasse: "bg-yellow-100 text-yellow-700" },
  nicht_verfuegbar: { label: "Ausverkauft", klasse: "bg-red-100 text-red-700" },
};

export default function ResultsTable({
  ergebnisse,
  onFavoritHinzufuegen,
  gespeicherteFavoriten,
}: ResultsTableProps) {
  if (ergebnisse.length === 0) {
    return (
      <div className="py-10 text-gray-400 text-sm">
        Keine Ergebnisse gefunden – anderen Suchbegriff versuchen.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Rang</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Baumarkt</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Produktname</th>
            <th className="text-right py-3 px-4 text-gray-500 font-medium">Preis</th>
            <th className="text-center py-3 px-4 text-gray-500 font-medium">Verfügbarkeit</th>
            <th className="text-center py-3 px-4 text-gray-500 font-medium">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {ergebnisse.map((ergebnis, index) => {
            const verfConfig = VERFUEGBARKEIT_CONFIG[ergebnis.verfuegbarkeit];
            const favKey = `${ergebnis.baumarktName}-${ergebnis.produktName}`;
            const istFavorit = gespeicherteFavoriten.has(favKey);

            return (
              <tr
                key={`${ergebnis.baumarktName}-${index}`}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Rang */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                </td>

                {/* Baumarkt */}
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-800">{ergebnis.baumarktName}</span>
                </td>

                {/* Produktname */}
                <td className="py-3 px-4">
                  <span className="text-gray-700">{ergebnis.produktName}</span>
                </td>

                {/* Preis */}
                <td className="py-3 px-4 text-right">
                  <span className={`font-bold text-base ${index === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {ergebnis.preis.toFixed(2)} €
                  </span>
                </td>

                {/* Verfügbarkeit */}
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${verfConfig.klasse}`}>
                    {verfConfig.label}
                  </span>
                </td>

                {/* Aktionen */}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onFavoritHinzufuegen(ergebnis)}
                      disabled={istFavorit}
                      title={istFavorit ? "Bereits in Favoriten" : "Zu Favoriten hinzufügen"}
                      className={`p-1.5 rounded transition-colors ${
                        istFavorit
                          ? "text-yellow-500 cursor-default"
                          : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                      }`}
                    >
                      <Star className="w-4 h-4" fill={istFavorit ? "currentColor" : "none"} />
                    </button>
                    <a
                      href={ergebnis.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Zur Produktseite"
                      className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
