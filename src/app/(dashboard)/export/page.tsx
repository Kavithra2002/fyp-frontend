"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { exportApi } from "@/services/api";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const [type, setType] = useState<"pdf" | "xlsx">("pdf");
  const [runId, setRunId] = useState("");
  const [scenarioRunId, setScenarioRunId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    try {
      const body = {
        type,
        runId: runId.trim() || undefined,
        scenarioRunId: scenarioRunId.trim() || undefined,
      };
      const blob = await exportApi.create(body);
      const filename = type === "pdf" ? "forecast-report.pdf" : "forecast-export.xlsx";
      downloadBlob(blob, filename);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Export</h1>
        <p className="text-muted-foreground">
          Export reports (UC5). PDF or Excel for forecast, explain, or scenario. Data from /api/export.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Export options</CardTitle>
          <CardDescription>Choose format and optional run IDs. The backend mock returns a sample file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Format</Label>
            <div className="flex gap-2">
              <Button
                variant={type === "pdf" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("pdf")}
              >
                PDF
              </Button>
              <Button
                variant={type === "xlsx" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("xlsx")}
              >
                Excel (XLSX)
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="run-id">Run ID (optional)</Label>
              <input
                id="run-id"
                type="text"
                value={runId}
                onChange={(e) => setRunId(e.target.value)}
                placeholder="e.g. last, run-1"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario-run-id">Scenario run ID (optional)</Label>
              <input
                id="scenario-run-id"
                type="text"
                value={scenarioRunId}
                onChange={(e) => setScenarioRunId(e.target.value)}
                placeholder="e.g. scenario-1"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <Button onClick={handleExport} disabled={loading}>
            {loading ? "Exporting…" : "Download"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent exports</CardTitle>
          <CardDescription>Exports are saved to your device. The backend does not list them.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 items-center justify-center rounded border border-dashed border-muted-foreground/30 text-muted-foreground">
            No exports listed (files are downloaded locally)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
