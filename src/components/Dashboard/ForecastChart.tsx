"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const sampleForecast = [
  { date: "2024-01", actual: 100, forecast: 98 },
  { date: "2024-02", actual: 110, forecast: 108 },
  { date: "2024-03", actual: 105, forecast: 112 },
  { date: "2024-04", actual: 120, forecast: 118 },
  { date: "2024-05", actual: 115, forecast: 122 },
  { date: "2024-06", actual: 130, forecast: 128 },
];

export function ForecastChart({ data = sampleForecast }: { data?: { date: string; actual?: number; forecast: number }[] }) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="var(--chart-1)" strokeWidth={2} name="Actual" />
          <Line type="monotone" dataKey="forecast" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 4" name="Forecast" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
