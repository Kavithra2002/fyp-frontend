"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ForecastChart } from "@/components/Dashboard/ForecastChart";
import { dataApi, modelsApi, forecastApi } from "@/services/api";
import type { Dataset, Model } from "@/lib/types";

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [horizon, setHorizon] = useState(7);
  const [forecastResult, setForecastResult] = useState<{
    dates: string[];
    actual: (number | null)[];
    forecast: number[];
    metrics: { mae: number; rmse: number; mape: number };
  } | null>(null);

  const activeDataset = datasets.find((d) => d.isActive) ?? null;
  const activeModel = models.find((m) => m.isActive) ?? null;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [datasetsRes, modelsRes] = await Promise.all([
        dataApi.list(),
        modelsApi.list(),
      ]);
      setDatasets(datasetsRes);
      setModels(modelsRes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleRunForecast() {
    if (!activeDataset || !activeModel) return;
    setForecastLoading(true);
    setError(null);
    try {
      const res = await forecastApi.run({
        datasetId: activeDataset.id,
        modelId: activeModel.id,
        horizon,
      });
      setForecastResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Forecast failed");
    } finally {
      setForecastLoading(false);
    }
  }

  const chartData =
    forecastResult?.dates.map((date, i) => ({
      date,
      actual: forecastResult.actual[i] ?? undefined,
      forecast: forecastResult.forecast[i],
    })) ?? [];

  const canRun = Boolean(activeDataset && activeModel && !forecastLoading);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Run and view forecasts (UC1). Use the active dataset and model from Data and Model Management.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dataset</CardTitle>
            <CardDescription>Active dataset for forecasting</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : activeDataset ? (
              <p className="text-sm font-medium">{activeDataset.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No dataset selected. Set one in Data Management.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model</CardTitle>
            <CardDescription>Active model (LSTM / XGBoost / Ensemble)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : activeModel ? (
              <p className="text-sm font-medium">{activeModel.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No model selected. Set one in Model Management.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Forecast</CardTitle>
            <CardDescription>Horizon (days) and run</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="horizon">Horizon</Label>
              <input
                id="horizon"
                type="number"
                min={1}
                max={90}
                value={horizon}
                onChange={(e) => setHorizon(Math.min(90, Math.max(1, Number(e.target.value) || 7)))}
                className="flex h-9 w-full max-w-[120px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button className="w-full" onClick={handleRunForecast} disabled={!canRun}>
              {forecastLoading ? "Running…" : "Run forecast"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecast: Actual vs Predicted</CardTitle>
          <CardDescription>Time series from /api/forecast. Run a forecast to update.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ForecastChart data={chartData} />
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded border border-dashed border-muted-foreground/30 text-muted-foreground">
              Run a forecast to see the chart
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">MAE</CardTitle>
            <CardDescription>Mean Absolute Error</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {forecastResult?.metrics.mae != null
                ? forecastResult.metrics.mae.toFixed(4)
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">RMSE</CardTitle>
            <CardDescription>Root Mean Squared Error</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {forecastResult?.metrics.rmse != null
                ? forecastResult.metrics.rmse.toFixed(4)
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">MAPE</CardTitle>
            <CardDescription>Mean Absolute % Error</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {forecastResult?.metrics.mape != null
                ? `${forecastResult.metrics.mape.toFixed(2)}%`
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
