"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SystemInfoPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">System Info & User Guide</h1>
        <p className="text-muted-foreground">
          Step-by-step instructions to use the Forecast & XAI system. Follow these steps in order for the best experience.
        </p>
      </div>

      <Alert>
        <AlertTitle>Quick overview</AlertTitle>
        <AlertDescription>
          This system lets you upload time-series data, train forecasting models (LSTM, XGBoost, or Ensemble), run forecasts, view explainability (SHAP and attention), compare scenarios, and export reports. You must set an <strong>active dataset</strong> and <strong>active model</strong> before running forecasts or explainability.
        </AlertDescription>
      </Alert>

      {/* Step 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Data Management</CardTitle>
          <CardDescription>
            Prepare and select the dataset used for forecasting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">1.1 Upload a dataset</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Go to <strong>Data Management</strong> from the sidebar.</li>
              <li>Click the upload button and choose a CSV or Excel file with your time-series data.</li>
              <li>After upload, the new dataset appears in the list with name and creation date.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">1.2 Set the active dataset</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>In the dataset list, find the dataset you want to use for forecasts.</li>
              <li>Click <strong>Set active</strong> on that dataset. The active dataset is used by the Dashboard and Model Management (for training).</li>
              <li>Only one dataset can be active at a time.</li>
            </ul>
          </div>
          <Link href="/data" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Go to Data Management →
          </Link>
        </CardContent>
      </Card>

      {/* Step 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Model Management</CardTitle>
          <CardDescription>
            Train or register a model and set it as active for forecasting and explainability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">2.1 Train a new model</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Go to <strong>Model Management</strong> from the sidebar.</li>
              <li>Select an <strong>active dataset</strong> first (see Step 1) — training uses this dataset.</li>
              <li>Choose the model type: <strong>LSTM</strong>, <strong>XGBoost</strong>, or <strong>Ensemble</strong>.</li>
              <li>Click <strong>Train</strong>. When training finishes, the new model appears in the list.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">2.2 Set the active model</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>In the model list, click <strong>Set active</strong> on the model you want to use for forecasts and explainability.</li>
              <li>The Dashboard and Explainability page use this active model.</li>
            </ul>
          </div>
          <Alert>
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              If you see &quot;No model selected&quot; on the Dashboard or Explainability page, go back to Model Management and set an active model.
            </AlertDescription>
          </Alert>
          <Link href="/models" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Go to Model Management →
          </Link>
        </CardContent>
      </Card>

      {/* Step 3 */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Dashboard — Run a forecast</CardTitle>
          <CardDescription>
            Generate and view forecasts using the active dataset and model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">3.1 Run a forecast</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Go to <strong>Dashboard</strong> from the sidebar.</li>
              <li>Confirm the displayed <strong>Dataset</strong> and <strong>Model</strong> are the ones you want (from Steps 1 and 2).</li>
              <li>Set the <strong>Horizon</strong> (number of days to forecast, e.g. 7).</li>
              <li>Click <strong>Run forecast</strong>. The chart updates with actual vs predicted values, and metrics (MAE, RMSE, MAPE) are shown below.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">3.2 Understand the results</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li><strong>Forecast chart</strong>: Compares actual (historical) and predicted values over the horizon.</li>
              <li><strong>MAE / RMSE / MAPE</strong>: Lower values indicate better forecast accuracy.</li>
            </ul>
          </div>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Go to Dashboard →
          </Link>
        </CardContent>
      </Card>

      {/* Step 4 */}
      <Card>
        <CardHeader>
          <CardTitle>Step 4: Explainability</CardTitle>
          <CardDescription>
            Understand why the model made its predictions (SHAP feature importance and LSTM attention).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">4.1 Run explainability</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Go to <strong>Explainability</strong> from the sidebar.</li>
              <li>Ensure an <strong>active model</strong> is set in Model Management.</li>
              <li>Click <strong>Run explain</strong>. The system runs the explainability API for the active model.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">4.2 Interpret the results</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li><strong>Plain-language explanation</strong>: A text summary of which features increase or decrease the prediction.</li>
              <li><strong>SHAP chart</strong>: Bar chart of feature importance; positive/negative values show how each feature pushes the prediction up or down.</li>
              <li><strong>Attention weights (LSTM)</strong>: When available, shows which past time steps the model focused on.</li>
            </ul>
          </div>
          <Link href="/explainability" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Go to Explainability →
          </Link>
        </CardContent>
      </Card>

      {/* Step 5 */}
      <Card>
        <CardHeader>
          <CardTitle>Step 5: Scenario Analysis</CardTitle>
          <CardDescription>
            Compare a base forecast with a scenario where you change drivers (e.g. price, volume).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">5.1 Run a scenario</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Go to <strong>Scenario Analysis</strong> from the sidebar.</li>
              <li>Enter a <strong>Base run ID</strong> (e.g. &quot;demo&quot; for the mock, or a run ID from a previous forecast).</li>
              <li>Adjust the <strong>Price</strong> and <strong>Volume</strong> sliders to define your scenario.</li>
              <li>Click <strong>Run scenario</strong>. The chart shows base vs scenario forecasts and the difference.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">5.2 Use cases</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>What-if analysis: &quot;What if price or volume changes?&quot;</li>
              <li>Compare two forecasts side by side to support planning decisions.</li>
            </ul>
          </div>
          <Link href="/scenario-analysis" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Go to Scenario Analysis →
          </Link>
        </CardContent>
      </Card>

      {/* Step 6 */}
      <Card>
        <CardHeader>
          <CardTitle>Step 6: Export</CardTitle>
          <CardDescription>
            Export forecast, explain, or scenario results as PDF or Excel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">6.1 Export a report</Label>
            <ul className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Go to <strong>Export</strong> from the sidebar.</li>
              <li>Choose <strong>PDF</strong> or <strong>Excel (XLSX)</strong> as the format.</li>
              <li>Optionally enter a <strong>Run ID</strong> (from a previous forecast) and/or <strong>Scenario run ID</strong> to include specific runs in the export.</li>
              <li>Click <strong>Export</strong>. The file downloads to your device.</li>
            </ul>
          </div>
          <Alert>
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              If you leave run IDs empty, the backend may use default or demo data. For production, use run IDs from your Dashboard or Scenario Analysis runs.
            </AlertDescription>
          </Alert>
          <Link href="/export" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Go to Export →
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended workflow</CardTitle>
          <CardDescription>
            For a full workflow, follow the steps in order: Data → Model → Dashboard (forecast) → Explainability → Scenario Analysis (optional) → Export.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you encounter errors such as &quot;No dataset selected&quot; or &quot;No model selected&quot;, return to Data Management or Model Management and set the active dataset or model. For API or connection errors, ensure the backend is running and your session is valid.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
