"use client";

// Suchverlauf-Seite

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Clock, Search } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SuchverlaufEintrag {
  id: string;
  searchTerm: string;
  resultsCount: number;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [verlauf, setVerlauf] = useState<SuchverlaufEintrag[]>([]);
  const [laedt, setLaedt] = useState(true);
  const [loescheId, setLoescheId] = useState<string | null>(null);

  const laden = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json() as { verlauf?: SuchverlaufEintrag[] };
      setVerlauf(data.verlauf || []);
    } catch {
      // Fehler still ignorieren
    } finally {
      setLaedt(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void laden();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleLoeschen = async (id: string) => {
    setLoescheId(id);
    try {
      await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      setVerlauf((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Löschen fehlgeschlagen");
    } finally {
      setLoescheId(null);
    }
  };

  const handleSucheWiederholen = (suchbegriff: string) => {
    router.push(`/intern?q=${encodeURIComponent(suchbegriff)}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Suchverlauf</h1>
        <p className="text-gray-500 text-sm">Deine letzten 10 Suchanfragen</p>
      </div>

      {laedt && <LoadingSpinner text="Suchverlauf wird geladen..." />}

      {!laedt && verlauf.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <p className="text-sm text-gray-500">Noch kein Suchverlauf vorhanden.</p>
        </div>
      )}

      {!laedt && verlauf.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {verlauf.map((eintrag, index) => (
            <div
              key={eintrag.id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                index < verlauf.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{eintrag.searchTerm}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {eintrag.resultsCount} Ergebnisse ·{" "}
                  {new Date(eintrag.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleSucheWiederholen(eintrag.searchTerm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  Suchen
                </button>
                <button
                  onClick={() => handleLoeschen(eintrag.id)}
                  disabled={loescheId === eintrag.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
