"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { dataApi } from "@/services/api";
import type { Dataset } from "@/lib/types";
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

export default function DataManagementPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await dataApi.list();
      setDatasets(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load datasets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // Auto-select the active dataset for preview when the list loads
  useEffect(() => {
    if (datasets.length > 0 && !selectedId) {
      const active = datasets.find((d) => d.isActive);
      if (active) setSelectedId(active.id);
    }
  }, [datasets, selectedId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await dataApi.upload(file);
      await loadList();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSetActive(id: string) {
    setError(null);
    try {
      await dataApi.setActive(id);
      await loadList();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set active");
    }
  }

  function confirmDeleteDataset() {
    const id = deleteTargetId;
    if (!id) return;
    setDeleteTargetId(null);
    setError(null);
    void (async () => {
      try {
        await dataApi.remove(id);
        if (selectedId === id) setSelectedId(null);
        await loadList();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete dataset");
      }
    })();
  }

  const selected = selectedId ? datasets.find((d) => d.id === selectedId) : null;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Data Management</h1>
        <p className="text-muted-foreground">
          Upload, list, and select dataset (UC6). CSV upload, preview, validation.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
          <CardDescription>
            Upload a dataset for forecasting. Validated and preprocessed by backend.
          </CardDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              id="csv-upload"
              onChange={handleUpload}
              disabled={uploading}
            />
            <label
              htmlFor="csv-upload"
              className={
                "inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground " +
                (uploading ? "cursor-not-allowed opacity-50" : "")
              }
            >
              {uploading ? "Uploading…" : "Choose file"}
            </label>
            <span className="text-sm text-muted-foreground">
              Saves to backend; appears in the table below.
            </span>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datasets</CardTitle>
          <CardDescription>
            List of uploaded datasets. Set one as active for training and forecasting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded border border-muted">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-muted bg-muted/50">
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Rows</th>
                  <th className="p-3 text-left font-medium">Columns</th>
                  <th className="p-3 text-left font-medium">Uploaded</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-b border-muted/50">
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : datasets.length === 0 ? (
                  <tr className="border-b border-muted/50">
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      No datasets yet. Upload a CSV above.
                    </td>
                  </tr>
                ) : (
                  datasets.map((d) => (
                    <tr
                      key={d.id}
                      className={
                        "cursor-pointer border-b border-muted/50 transition-colors " +
                        (selectedId === d.id ? "bg-muted/50" : "hover:bg-muted/30")
                      }
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button")) return;
                        setSelectedId(d.id);
                      }}
                    >
                      <td className="p-3">
                        <span className="font-medium">{d.name}</span>
                        {d.isActive && (
                          <span className="ml-2 inline-flex rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3">{d.rows.toLocaleString()}</td>
                      <td className="max-w-[200px] truncate p-3" title={d.columns.join(", ")}>
                        {d.columns.join(", ")}
                      </td>
                      <td className="p-3 text-muted-foreground">{formatDate(d.uploadedAt)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(d.id)}
                            disabled={d.isActive}
                          >
                            {d.isActive ? "Active" : "Set active"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(d.id);
                            }}
                            aria-label="Delete dataset"
                            title="Delete dataset"
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

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Columns and row count of the selected dataset. Click a row above to select.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selected ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {selected.name}
              </p>
              <p>
                <span className="font-medium">Columns:</span> {selected.columns.join(", ")}
              </p>
              <p>
                <span className="font-medium">Rows:</span> {selected.rows.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Uploaded:</span> {formatDate(selected.uploadedAt)}
              </p>
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded border border-dashed border-muted-foreground/30 text-muted-foreground">
              Select a dataset to preview
            </div>
          )}
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
            <AlertDialogTitle>Delete dataset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will also remove the uploaded CSV file from the server. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={confirmDeleteDataset}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
