"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { dataApi, modelsApi } from "@/services/api";
import type { Dataset, Model, ModelType } from "@/lib/types";
import { Trash2 } from "lucide-react";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatType(t: ModelType) {
  return t === "lstm" ? "LSTM" : t === "xgboost" ? "XGBoost" : "Ensemble";
}

const MODEL_TYPES: { value: ModelType; label: string }[] = [
  { value: "lstm", label: "LSTM" },
  { value: "xgboost", label: "XGBoost" },
  { value: "ensemble", label: "Ensemble" },
];

export default function ModelManagementPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [training, setTraining] = useState(false);
  const [datasetId, setDatasetId] = useState("");
  const [modelType, setModelType] = useState<ModelType | "">("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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

  const loadDatasets = useCallback(async () => {
    setLoadingDatasets(true);
    try {
      const list = await dataApi.list();
      setDatasets(list);
    } catch {
      setDatasets([]);
    } finally {
      setLoadingDatasets(false);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  async function handleTrain() {
    if (!datasetId || !modelType) return;
    setTraining(true);
    setError(null);
    try {
      await modelsApi.train({ datasetId, type: modelType });
      await loadModels();
      setDatasetId("");
      setModelType("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Training failed");
    } finally {
      setTraining(false);
    }
  }

  async function handleSetActive(id: string) {
    setError(null);
    try {
      await modelsApi.setActive(id);
      await loadModels();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set active");
    }
  }

  function confirmDeleteModel() {
    const id = deleteTargetId;
    if (!id) return;
    setDeleteTargetId(null);
    setError(null);
    void (async () => {
      try {
        await modelsApi.remove(id);
        await loadModels();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete model");
      }
    })();
  }

  const canTrain = Boolean(datasetId && modelType && !training);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Model Management</h1>
        <p className="text-muted-foreground">
          Train, list, and set active model (UC4). LSTM, XGBoost, Ensemble.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Train new model</CardTitle>
          <CardDescription>
            Choose a dataset and model type. Training uses the backend.
          </CardDescription>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="train-dataset">Dataset</Label>
              <select
                id="train-dataset"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                disabled={loadingDatasets}
                className="flex h-9 w-[220px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select dataset</option>
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.isActive ? "(active)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="train-type">Type</Label>
              <select
                id="train-type"
                value={modelType}
                onChange={(e) => setModelType((e.target.value || "") as ModelType | "")}
                className="flex h-9 w-[160px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select type</option>
                {MODEL_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleTrain} disabled={!canTrain}>
              {training ? "Training…" : "Start training"}
            </Button>
          </div>
          {datasets.length === 0 && !loadingDatasets && (
            <p className="mt-2 text-sm text-muted-foreground">
              No datasets yet. Upload one in Data Management first.
            </p>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>
            List of trained models. Set one as active for forecast and explain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded border border-muted">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-muted bg-muted/50">
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">MAE</th>
                  <th className="p-3 text-left font-medium">RMSE</th>
                  <th className="p-3 text-left font-medium">MAPE</th>
                  <th className="p-3 text-left font-medium">Trained</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-b border-muted/50">
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : models.length === 0 ? (
                  <tr className="border-b border-muted/50">
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      No models yet. Train one above.
                    </td>
                  </tr>
                ) : (
                  models.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-muted/50 transition-colors hover:bg-muted/30"
                    >
                      <td className="p-3">
                        <span className="font-medium">{m.name}</span>
                        {m.isActive && (
                          <span className="ml-2 inline-flex rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3">{formatType(m.type)}</td>
                      <td className="p-3">{m.mae != null ? m.mae.toFixed(4) : "—"}</td>
                      <td className="p-3">{m.rmse != null ? m.rmse.toFixed(4) : "—"}</td>
                      <td className="p-3">{m.mape != null ? `${m.mape.toFixed(2)}%` : "—"}</td>
                      <td className="p-3 text-muted-foreground">{formatDate(m.trainedAt)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(m.id)}
                            disabled={m.isActive}
                          >
                            {m.isActive ? "Active" : "Set active"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTargetId(m.id)}
                            aria-label="Delete model"
                            title="Delete model"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete model?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the model from the server. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={confirmDeleteModel}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
