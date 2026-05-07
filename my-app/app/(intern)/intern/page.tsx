"use client";

// Dashboard Hauptseite – Willkommen

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div>
      {/* Seitenheader */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Willkommen</h1>
        <p className="text-gray-500 text-sm">
          Verwalte deine Angebotsanfragen
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/intern/quotes")}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-gray-300 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Angebotsanfragen</h2>
          <p className="text-sm text-gray-500">Alle eingehenden Anfragen anzeigen und verwalten</p>
        </button>

        <button
          onClick={() => router.push("/intern/settings")}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-gray-300 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Einstellungen</h2>
          <p className="text-sm text-gray-500">Konto und Anwendungseinstellungen</p>
        </button>
      </div>
    </div>
  );
}
