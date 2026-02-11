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

  // Generate plain-language explanation from SHAP and attention for users who prefer text over charts
  function getTextExplanation(): string[] {
    const lines: string[] = [];
    if (!result) return lines;

    if (result.shap && result.shap.length > 0) {
      const sorted = [...result.shap].sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance));
      const top = sorted.slice(0, 5);
      const positive = top.filter((x) => x.importance > 0);
      const negative = top.filter((x) => x.importance < 0);

      lines.push(
        "The model’s forecast is mainly driven by the following factors. Features with positive impact tend to increase the predicted demand; features with negative impact tend to decrease it."
      );
      if (positive.length > 0) {
        const desc = positive
          .map((x) => `"${x.feature}" (impact: ${x.importance >= 0 ? "+" : ""}${x.importance.toFixed(3)})`)
          .join(", ");
        lines.push(`Factors that increase the prediction: ${desc}.`);
      }
      if (negative.length > 0) {
        const desc = negative
          .map((x) => `"${x.feature}" (impact: ${x.importance.toFixed(3)})`)
          .join(", ");
        lines.push(`Factors that decrease the prediction: ${desc}.`);
      }
      const topFeature = sorted[0];
      lines.push(
        `Overall, "${topFeature.feature}" has the strongest influence on this prediction, so when planning demand you should pay special attention to this factor.`
      );
    }

    if (result.attention && result.attention.length > 0) {
      const sorted = [...result.attention].sort((a, b) => b.weight - a.weight);
      const topSteps = sorted.slice(0, 3).map((x) => `step ${x.step}`);
      lines.push("");
      lines.push(
        "For the LSTM part of the model, the network focused most on certain past time steps. The steps with the highest attention were: " +
          topSteps.join(", ") +
          ". This means the model relied more on those periods in history when making the forecast—for example, recent weeks or specific past events—so you can interpret the prediction in light of what happened in those time steps."
      );
    }

    return lines;
  }

  const textExplanation = getTextExplanation();

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

      {result && (result.shap?.length > 0 || (result.attention?.length ?? 0) > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Plain-language explanation</CardTitle>
            <CardDescription>
              What the model is doing in simple terms—no charts required. Use this to quickly understand why the model made this prediction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 rounded-lg border border-muted/50 bg-muted/20 p-4 text-sm leading-relaxed">
              {textExplanation.length > 0 ? (
                textExplanation.map((line, i) =>
                  line === "" ? (
                    <div key={i} className="h-2" aria-hidden />
                  ) : (
                    <p key={i} className="text-foreground">
                      {line}
                    </p>
                  )
                )
              ) : (
                <p className="text-muted-foreground">Run explain to see a text summary here.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
