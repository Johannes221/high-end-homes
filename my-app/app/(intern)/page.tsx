"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle, TrendingUp, Euro } from "lucide-react";

type QuoteStats = {
  total: number;
  pending: number;
  approved: number;
  totalVolume: number;
  pendingVolume: number;
  avgVolume: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    pending: 0,
    approved: 0,
    totalVolume: 0,
    pendingVolume: 0,
    avgVolume: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/quotes");
        const data = await response.json();
        
        if (data.success && data.quotes) {
          const quotes = data.quotes;
          const pending = quotes.filter((q: any) => q.approvalStatus === "pending");
          const approved = quotes.filter((q: any) => q.approvalStatus === "approved");
          
          const totalVolume = quotes.reduce((sum: number, q: any) => {
            return sum + ((q.estimatedMinPrice + q.estimatedMaxPrice) / 2);
          }, 0);
          
          const pendingVolume = pending.reduce((sum: number, q: any) => {
            return sum + ((q.estimatedMinPrice + q.estimatedMaxPrice) / 2);
          }, 0);
          
          setStats({
            total: quotes.length,
            pending: pending.length,
            approved: approved.length,
            totalVolume: Math.round(totalVolume),
            pendingVolume: Math.round(pendingVolume),
            avgVolume: quotes.length > 0 ? Math.round(totalVolume / quotes.length) : 0,
          });
        }
      } catch (error) {
        console.error("Fehler beim Laden der Statistiken:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Übersicht über alle Angebotsanfragen
        </p>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Gesamt Anfragen */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">GESAMT</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.total}
          </div>
          <p className="text-sm text-gray-500">Anfragen insgesamt</p>
        </div>

        {/* Offene Anfragen */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">OFFEN</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.pending}
          </div>
          <p className="text-sm text-gray-500">Warten auf Bearbeitung</p>
        </div>

        {/* Freigegebene Anfragen */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">FREIGEGEBEN</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.approved}
          </div>
          <p className="text-sm text-gray-500">Bereits bearbeitet</p>
        </div>

        {/* Offenes geschätztes Volumen */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">OFFENES VOLUMEN</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : formatCurrency(stats.pendingVolume)}
          </div>
          <p className="text-sm text-gray-500">Geschätzter Wert offener Anfragen</p>
        </div>

        {/* Gesamtvolumen */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Euro className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">GESAMTVOLUMEN</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : formatCurrency(stats.totalVolume)}
          </div>
          <p className="text-sm text-gray-500">Geschätzter Gesamtwert aller Anfragen</p>
        </div>

        {/* Durchschnittlicher Auftragswert */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Ø AUFTRAGSWERT</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : formatCurrency(stats.avgVolume)}
          </div>
          <p className="text-sm text-gray-500">Durchschnittlicher Wert pro Anfrage</p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => router.push("/intern/quotes")}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-gray-300 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Alle Angebotsanfragen anzeigen</h2>
          <p className="text-sm text-gray-500">Detaillierte Übersicht mit Bearbeitungsmöglichkeiten</p>
        </button>
      </div>
    </div>
  );
}
