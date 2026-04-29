"use client";

// Preishistorie-Chart mit Recharts

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface PriceHistoryEintrag {
  id: string;
  preis: number;
  checkedAt: string;
}

interface PriceHistoryChartProps {
  verlauf: PriceHistoryEintrag[];
  zielPreis?: number;
}

interface TooltipPayloadItem {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="font-bold text-blue-600">{payload[0].value.toFixed(2)} €</p>
    </div>
  );
}

export default function PriceHistoryChart({ verlauf, zielPreis }: PriceHistoryChartProps) {
  if (verlauf.length === 0) {
    return (
      <div className="py-10 text-gray-400 text-sm">
        Noch kein Preisverlauf vorhanden.
      </div>
    );
  }

  const daten = verlauf.map((eintrag) => ({
    datum: new Date(eintrag.checkedAt).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    }),
    preis: eintrag.preis,
  }));

  const minPreis = Math.min(...daten.map((d) => d.preis));
  const maxPreis = Math.max(...daten.map((d) => d.preis));
  const puffer = (maxPreis - minPreis) * 0.1 || 1;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={daten} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="datum"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          domain={[minPreis - puffer, maxPreis + puffer]}
          tickFormatter={(v: number) => `${v.toFixed(0)} €`}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        {zielPreis && (
          <ReferenceLine
            y={zielPreis}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: `Ziel: ${zielPreis.toFixed(2)} €`, fill: "#ef4444", fontSize: 11 }}
          />
        )}
        <Line
          type="monotone"
          dataKey="preis"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
