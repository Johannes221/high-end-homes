import Link from "next/link";
import { FileText, Clock, CheckCircle, TrendingUp, Euro, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

async function loadStats() {
  const [total, pending, approved, priceAgg, pendingAgg, latest] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { approvalStatus: "pending" } }),
    prisma.quoteRequest.count({ where: { approvalStatus: "approved" } }),
    prisma.quoteRequest.aggregate({
      _sum: { estimatedMinPrice: true, estimatedMaxPrice: true },
      _avg: { estimatedMinPrice: true, estimatedMaxPrice: true },
    }),
    prisma.quoteRequest.aggregate({
      where: { approvalStatus: "pending" },
      _sum: { estimatedMinPrice: true, estimatedMaxPrice: true },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        approvalStatus: true,
        estimatedMinPrice: true,
        estimatedMaxPrice: true,
        createdAt: true,
      },
    }),
  ]);

  const mid = (mi: number | null | undefined, ma: number | null | undefined) =>
    Math.round(((mi ?? 0) + (ma ?? 0)) / 2);

  return {
    total,
    pending,
    approved,
    totalVolume: mid(priceAgg._sum.estimatedMinPrice, priceAgg._sum.estimatedMaxPrice),
    pendingVolume: mid(pendingAgg._sum.estimatedMinPrice, pendingAgg._sum.estimatedMaxPrice),
    avgVolume: mid(priceAgg._avg.estimatedMinPrice, priceAgg._avg.estimatedMaxPrice),
    latest,
  };
}

type Tone = "blue" | "orange" | "green" | "purple" | "emerald" | "indigo";

const toneClasses: Record<Tone, { wrap: string; icon: string }> = {
  blue: { wrap: "bg-blue-50", icon: "text-blue-600" },
  orange: { wrap: "bg-orange-50", icon: "text-orange-600" },
  green: { wrap: "bg-green-50", icon: "text-green-600" },
  purple: { wrap: "bg-purple-50", icon: "text-purple-600" },
  emerald: { wrap: "bg-emerald-50", icon: "text-emerald-600" },
  indigo: { wrap: "bg-indigo-50", icon: "text-indigo-600" },
};

function KpiCard({
  href,
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  href?: string;
  icon: typeof FileText;
  tone: Tone;
  label: string;
  value: string | number;
  hint: string;
}) {
  const classes = toneClasses[tone];
  const inner = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${classes.wrap} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
        <span className="text-xs text-gray-500 font-medium tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">{value}</div>
      <p className="text-sm text-gray-500">{hint}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all block group"
      >
        {inner}
        <div className="mt-3 text-xs text-gray-400 group-hover:text-gray-600 flex items-center gap-1 transition-colors">
          Details <ArrowRight className="w-3 h-3" />
        </div>
      </Link>
    );
  }

  return <div className="bg-white rounded-xl border border-gray-200 p-6">{inner}</div>;
}

const statusBadge: Record<string, { label: string; cls: string }> = {
  pending: { label: "Offen", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  approved: { label: "Freigegeben", cls: "bg-green-50 text-green-700 border-green-200" },
};

export default async function DashboardPage() {
  const stats = await loadStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Übersicht über alle Angebotsanfragen</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard
          href="/intern/quotes"
          icon={FileText}
          tone="blue"
          label="GESAMT"
          value={stats.total}
          hint="Anfragen insgesamt"
        />
        <KpiCard
          href="/intern/quotes?filter=pending"
          icon={Clock}
          tone="orange"
          label="OFFEN"
          value={stats.pending}
          hint="Warten auf Bearbeitung"
        />
        <KpiCard
          href="/intern/quotes?filter=approved"
          icon={CheckCircle}
          tone="green"
          label="FREIGEGEBEN"
          value={stats.approved}
          hint="Bereits bearbeitet"
        />
        <KpiCard
          icon={TrendingUp}
          tone="purple"
          label="OFFENES VOLUMEN"
          value={formatCurrency(stats.pendingVolume)}
          hint="Geschätzter Wert offener Anfragen"
        />
        <KpiCard
          icon={Euro}
          tone="emerald"
          label="GESAMTVOLUMEN"
          value={formatCurrency(stats.totalVolume)}
          hint="Geschätzter Gesamtwert aller Anfragen"
        />
        <KpiCard
          icon={TrendingUp}
          tone="indigo"
          label="Ø AUFTRAGSWERT"
          value={formatCurrency(stats.avgVolume)}
          hint="Durchschnittlicher Wert pro Anfrage"
        />
      </div>

      {/* Latest Anfragen */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Neueste Anfragen</h2>
          <Link
            href="/intern/quotes"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            Alle anzeigen <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats.latest.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">Noch keine Anfragen vorhanden.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.latest.map((q) => {
              const badge = statusBadge[q.approvalStatus] ?? statusBadge.pending;
              const mid = Math.round((q.estimatedMinPrice + q.estimatedMaxPrice) / 2);
              return (
                <Link
                  key={q.id}
                  href={`/intern/quotes#${q.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{q.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {q.type} · {formatDate(q.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900 tabular-nums hidden sm:inline">
                      {formatCurrency(mid)}
                    </span>
                    <span className={`text-xs px-2 py-1 border rounded-full ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
