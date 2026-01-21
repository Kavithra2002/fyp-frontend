"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AttentionChart({ data }: { data: { step: number; weight: number }[] }) {
  const chartData = data.map((d) => ({ ...d, step: String(d.step) }));
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="step" className="text-xs" label={{ value: "Step", position: "insideBottom", offset: -5 }} />
          <YAxis className="text-xs" label={{ value: "Weight", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(v: number) => [v.toFixed(3), "Weight"]} />
          <Bar dataKey="weight" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Attention" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
