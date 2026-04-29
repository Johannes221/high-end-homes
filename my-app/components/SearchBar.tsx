"use client";

// Suchleiste für Preisvergleich

import { useState, KeyboardEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSuche: (suchanfrage: string) => void;
  laedt: boolean;
}

export default function SearchBar({ onSuche, laedt }: SearchBarProps) {
  const [wert, setWert] = useState("");

  const handleSuche = () => {
    if (wert.trim() && !laedt) {
      onSuche(wert.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSuche();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={wert}
            onChange={(e) => setWert(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Produkt suchen, z.B. Dachrinne, Bauholz, Zement..."
            disabled={laedt}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
        <button
          onClick={handleSuche}
          disabled={!wert.trim() || laedt}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {laedt ? "Suche..." : "Preise vergleichen"}
        </button>
      </div>
    </div>
  );
}
