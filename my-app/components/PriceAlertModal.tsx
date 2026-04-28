"use client";

// Modal: Preisalarm setzen

import { useState } from "react";
import { X, Bell } from "lucide-react";

interface PriceAlertModalProps {
  favoriteId: string;
  produktName: string;
  aktuellerPreis: number;
  onSchliessen: () => void;
  onGespeichert: () => void;
}

export default function PriceAlertModal({
  favoriteId,
  produktName,
  aktuellerPreis,
  onSchliessen,
  onGespeichert,
}: PriceAlertModalProps) {
  const [zielPreis, setZielPreis] = useState<string>(
    Math.max(aktuellerPreis * 0.9, 0.01).toFixed(2)
  );
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");

  const handleSpeichern = async () => {
    const preis = parseFloat(zielPreis);
    if (isNaN(preis) || preis <= 0) {
      setFehler("Bitte gib einen gültigen Preis ein");
      return;
    }

    setLaedt(true);
    setFehler("");

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteId, targetPreis: preis }),
      });

      if (!res.ok) {
        const data = await res.json() as { fehler?: string };
        setFehler(data.fehler || "Fehler beim Speichern");
        return;
      }

      onGespeichert();
      onSchliessen();
    } catch {
      setFehler("Netzwerkfehler – bitte versuche es erneut");
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Preisalarm setzen</h2>
          </div>
          <button onClick={onSchliessen} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inhalt */}
        <div className="p-5">
          <p className="text-sm text-gray-600 mb-1">Produkt</p>
          <p className="font-medium text-gray-900 mb-4 truncate">{produktName}</p>

          <p className="text-sm text-gray-600 mb-1">Aktueller Preis</p>
          <p className="text-lg font-bold text-gray-900 mb-5">{aktuellerPreis.toFixed(2)} €</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Benachrichtige mich, wenn der Preis unter ___ € fällt
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={zielPreis}
              onChange={(e) => setZielPreis(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>

          {fehler && <p className="text-red-500 text-sm mt-2">{fehler}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 pt-0">
          <button
            onClick={onSchliessen}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSpeichern}
            disabled={laedt}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {laedt ? "Wird gespeichert..." : "Alarm aktivieren"}
          </button>
        </div>
      </div>
    </div>
  );
}
