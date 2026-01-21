"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShapChart } from "@/components/Explainability/ShapChart";
import { AttentionChart } from "@/components/Explainability/AttentionChart";
import { modelsApi, explainApi } from "@/services/api";
import type { Model } from "@/lib/types";

export default function ExplainabilityPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [result, setResult] = useState<{
    shap: { feature: string; importance: number }[];
    attention?: { step: number; weight: number }[];
  } | null>(null);

  const activeModel = models.find((m) => m.isActive) ?? null;

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await modelsApi.list();
      setModels(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load models");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  async function handleRunExplain() {
    if (!activeModel) return;
    setExplainLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await explainApi.run({ modelId: activeModel.id });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Explain failed");
    } finally {
      setExplainLoading(false);
    }
  }

  const canRun = Boolean(activeModel && !explainLoading);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Explainability</h1>
        <p className="text-muted-foreground">
          XAI insights (UC2): SHAP feature importance and LSTM attention. Uses the active model.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Model & run</CardTitle>
          <CardDescription>Active model from Model Management. runId is optional for the API.</CardDescription>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : activeModel ? (
              <p className="text-sm font-medium">{activeModel.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No model selected. Set one in Model Management.</p>
            )}
            <Button onClick={handleRunExplain} disabled={!canRun}>
              {explainLoading ? "Running…" : "Run explain"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SHAP – Feature importance</CardTitle>
          <CardDescription>Feature contribution to the model from /api/explain.</CardDescription>
        </CardHeader>
        <CardContent>
          {result?.shap && result.shap.length > 0 ? (
            <ShapChart data={result.shap} />
          ) : (
            <div className="flex h-[280px] items-center justify-center rounded border border-dashed border-muted-foreground/30 text-muted-foreground">
              Run explain to see SHAP feature importance
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attention weights (LSTM)</CardTitle>
          <CardDescription>Attention over input steps from /api/explain when available.</CardDescription>
        </CardHeader>
        <CardContent>
          {result?.attention && result.attention.length > 0 ? (
            <AttentionChart data={result.attention} />
          ) : (
            <div className="flex h-[220px] items-center justify-center rounded border border-dashed border-muted-foreground/30 text-muted-foreground">
              Run explain to see attention weights (when available)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
