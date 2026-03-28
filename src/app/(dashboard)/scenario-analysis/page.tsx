"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { scenarioApi } from "@/services/api";

export default function ScenarioAnalysisPage() {
  const [baseRunId, setBaseRunId] = useState("latest");
  const [price, setPrice] = useState(0.5);
  const [volume, setVolume] = useState(0.5);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    base: { name: string; forecast: number[]; summary?: number };
    scenario: { name: string; forecast: number[]; summary?: number };
    baseRunId?: string;
    scenarioRunId?: string;
  } | null>(null);

  async function handleRunScenario() {
    setScenarioLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await scenarioApi.run({
        baseRunId,
        overrides: { price, volume },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scenario failed");
    } finally {
      setScenarioLoading(false);
    }
  }

  const chartData =
    result?.base.forecast.map((v, i) => ({
      step: i,
      base: result.base.forecast[i],
      scenario: result.scenario.forecast[i],
      delta: Number((result.scenario.forecast[i] - result.base.forecast[i]).toFixed(2)),
    })) ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Scenario Analysis</h1>
        <p className="text-muted-foreground">
          What-if analysis (UC3). Change drivers and compare base vs scenario. Data from /api/scenario.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Base scenario</CardTitle>
          <CardDescription>
            Base forecast run ID used for the what-if comparison. Use &quot;latest&quot; to automatically use your most recent forecast run.
          </CardDescription>
          <div className="mt-4 max-w-xs space-y-2">
            <Label htmlFor="base-run-id">Base run ID</Label>
            <input
              id="base-run-id"
              type="text"
              value={baseRunId}
              onChange={(e) => setBaseRunId(e.target.value || "latest")}
              placeholder="latest"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Override drivers</CardTitle>
          <CardDescription>
            Adjust price and volume factors (0–1). These drivers scale the scenario forecast relative to the selected base run.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label htmlFor="price-driver">Price</Label>
              <span className="text-muted-foreground">{price.toFixed(2)}</span>
            </div>
            <input
              id="price-driver"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label htmlFor="volume-driver">Volume</Label>
              <span className="text-muted-foreground">{volume.toFixed(2)}</span>
            </div>
            <input
              id="volume-driver"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <Button onClick={handleRunScenario} disabled={scenarioLoading}>
            {scenarioLoading ? "Running…" : "Run what-if"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
          <CardDescription>Base vs scenario forecast and summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {result ? (
            <>
              {(result.baseRunId || result.scenarioRunId) && (
                <div className="rounded-lg border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                  {result.baseRunId && (
                    <div>
                      Base run used: <span className="font-medium text-foreground">{result.baseRunId}</span>
                    </div>
                  )}
                  {result.scenarioRunId && (
                    <div>
                      Scenario run saved as:{" "}
                      <span className="font-medium text-foreground">{result.scenarioRunId}</span>
                    </div>
                  )}
                </div>
              )}
              {(result.base.summary != null || result.scenario.summary != null) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm font-medium text-muted-foreground">{result.base.name} summary</p>
                    <p className="text-2xl font-semibold">{result.base.summary?.toFixed(2) ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm font-medium text-muted-foreground">{result.scenario.name} summary</p>
                    <p className="text-2xl font-semibold">{result.scenario.summary?.toFixed(2) ?? "—"}</p>
                  </div>
                </div>
              )}

              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="step" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="base" stroke="var(--chart-1)" strokeWidth={2} name={result.base.name} />
                    <Line type="monotone" dataKey="scenario" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 4" name={result.scenario.name} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto rounded border border-muted">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-muted bg-muted/50">
                      <th className="p-2 text-left font-medium">Step</th>
                      <th className="p-2 text-right font-medium">Base</th>
                      <th className="p-2 text-right font-medium">Scenario</th>
                      <th className="p-2 text-right font-medium">Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((r) => (
                      <tr key={r.step} className="border-b border-muted/50">
                        <td className="p-2">{r.step}</td>
                        <td className="p-2 text-right">{r.base.toFixed(2)}</td>
                        <td className="p-2 text-right">{r.scenario.toFixed(2)}</td>
                        <td className={`p-2 text-right ${r.delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {r.delta >= 0 ? "+" : ""}{r.delta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex h-32 items-center justify-center rounded border border-dashed border-muted-foreground/30 text-muted-foreground">
              Run what-if to see the comparison
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
