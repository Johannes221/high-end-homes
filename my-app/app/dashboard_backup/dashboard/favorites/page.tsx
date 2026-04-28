"use client";

// Favoriten-Seite

import { useEffect, useState } from "react";
import FavoriteCard from "@/components/FavoriteCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

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

export default function FavoritesPage() {
  const [favoriten, setFavoriten] = useState<Favorit[]>([]);
  const [laedt, setLaedt] = useState(true);
  const [fehler, setFehler] = useState("");

  const laden = async () => {
    setLaedt(true);
    setFehler("");
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json() as { favoriten?: Favorit[]; fehler?: string };
      if (!res.ok) {
        setFehler(data.fehler || "Fehler beim Laden");
      } else {
        setFavoriten(data.favoriten || []);
      }
    } catch {
      setFehler("Netzwerkfehler");
    } finally {
      setLaedt(false);
    }
  };

  useEffect(() => {
    laden();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Meine Favoriten</h1>
        <p className="text-gray-500 text-sm">Gespeicherte Produkte mit Preisverlauf und Alarmen</p>
      </div>

      {laedt && <LoadingSpinner text="Favoriten werden geladen..." />}

      {!laedt && fehler && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-600 text-sm">
          {fehler}
        </div>
      )}

      {!laedt && !fehler && favoriten.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <p className="text-lg font-medium text-gray-700 mb-2">Noch keine Favoriten</p>
          <p className="text-sm text-gray-500 mb-5">
            Suche nach Produkten und speichere Favoriten, um Preisverläufe zu verfolgen.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Jetzt suchen
          </Link>
        </div>
      )}

      {!laedt && favoriten.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">{favoriten.length} gespeicherte Produkte</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriten.map((favorit) => (
              <FavoriteCard
                key={favorit.id}
                favorit={favorit}
                onGeloescht={laden}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
