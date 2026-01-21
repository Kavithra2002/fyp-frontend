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

const sampleShap = [
  { feature: "volume", importance: 0.32 },
  { feature: "price", importance: 0.24 },
  { feature: "lag_1", importance: 0.18 },
  { feature: "trend", importance: 0.14 },
  { feature: "season", importance: 0.12 },
];

export function ShapChart({ data = sampleShap }: { data?: { feature: string; importance: number }[] }) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" className="text-xs" />
          <YAxis type="category" dataKey="feature" className="text-xs" width={70} />
          <Tooltip />
          <Bar dataKey="importance" fill="var(--chart-1)" radius={[0, 4, 4, 0]} name="SHAP" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
