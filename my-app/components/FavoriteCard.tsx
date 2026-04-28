"use client";

// Karte für einen gespeicherten Favoriten

import { useState } from "react";
import { BarChart2, Bell, Trash2, TrendingDown, TrendingUp, Minus, ExternalLink } from "lucide-react";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import PriceAlertModal from "@/components/PriceAlertModal";

interface PriceHistoryEintrag {
  id: string;
  preis: number;
  checkedAt: string;
}

interface PriceAlertEintrag {
  id: string;
  targetPreis: number;
  active: boolean;
}

interface Favorit {
  id: string;
  productName: string;
  baumarkt: string;
  preis: number;
  url: string;
  createdAt: string;
  priceHistory: PriceHistoryEintrag[];
  alerts: PriceAlertEintrag[];
}

interface FavoriteCardProps {
  favorit: Favorit;
  onGeloescht: () => void;
}

export default function FavoriteCard({ favorit, onGeloescht }: FavoriteCardProps) {
  const [zeigChart, setZeigChart] = useState(false);
  const [zeigAlarmModal, setZeigAlarmModal] = useState(false);
  const [chartVerlauf, setChartVerlauf] = useState<PriceHistoryEintrag[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [hatAlarm, setHatAlarm] = useState(favorit.alerts.length > 0);

  // Aktueller Preis aus der neuesten Historie
  const aktuellerPreis = favorit.priceHistory[0]?.preis ?? null;
  const preisAenderung = aktuellerPreis !== null ? aktuellerPreis - favorit.preis : null;

  const handlePreisverlauf = async () => {
    setLaedt(true);
    try {
      const res = await fetch(`/api/favorites/${favorit.id}/history`);
      const data = await res.json() as { verlauf?: PriceHistoryEintrag[] };
      setChartVerlauf(data.verlauf || []);
      setZeigChart(true);
    } catch {
      setChartVerlauf([]);
      setZeigChart(true);
    } finally {
      setLaedt(false);
    }
  };

  const handleLoeschen = async () => {
    if (!confirm("Favorit wirklich entfernen?")) return;

    try {
      await fetch(`/api/favorites/${favorit.id}`, { method: "DELETE" });
      onGeloescht();
    } catch {
      alert("Fehler beim Löschen");
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{favorit.productName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{favorit.baumarkt}</p>
          </div>
          {hatAlarm && (
            <span title="Preisalarm aktiv" className="text-blue-500 flex-shrink-0">
              <Bell className="w-4 h-4" fill="currentColor" />
            </span>
          )}
        </div>

        {/* Preise */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">Gespeicherter Preis</p>
          <p className="text-xl font-bold text-gray-900">{favorit.preis.toFixed(2)} €</p>

          {aktuellerPreis !== null && preisAenderung !== null && (
            <div className="flex items-center gap-1 mt-1">
              {preisAenderung < 0 ? (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    ↓ {Math.abs(preisAenderung).toFixed(2)} € günstiger
                  </span>
                </>
              ) : preisAenderung > 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">
                    ↑ +{preisAenderung.toFixed(2)} € teurer
                  </span>
                </>
              ) : (
                <>
                  <Minus className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">Unverändert</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Datum + Link */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            {new Date(favorit.createdAt).toLocaleDateString("de-DE")}
          </p>
          <a
            href={favorit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Aktionen */}
        <div className="flex gap-2">
          <button
            onClick={handlePreisverlauf}
            disabled={laedt}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Verlauf
          </button>
          <button
            onClick={() => setZeigAlarmModal(true)}
            disabled={hatAlarm}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-50 disabled:cursor-default transition-colors text-gray-600"
          >
            <Bell className="w-3.5 h-3.5" />
            {hatAlarm ? "Alarm aktiv" : "Alarm"}
          </button>
          <button
            onClick={handleLoeschen}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preisverlauf Modal */}
      {zeigChart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-semibold text-gray-900">Preisverlauf</h2>
                <p className="text-sm text-gray-500 truncate max-w-xs">{favorit.productName}</p>
              </div>
              <button
                onClick={() => setZeigChart(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-5">
              <PriceHistoryChart
                verlauf={chartVerlauf}
                zielPreis={favorit.alerts[0]?.targetPreis}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preisalarm Modal */}
      {zeigAlarmModal && (
        <PriceAlertModal
          favoriteId={favorit.id}
          produktName={favorit.productName}
          aktuellerPreis={favorit.preis}
          onSchliessen={() => setZeigAlarmModal(false)}
          onGespeichert={() => setHatAlarm(true)}
        />
      )}
    </>
  );
}
