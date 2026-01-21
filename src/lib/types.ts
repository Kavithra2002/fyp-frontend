/**
 * Types aligned with backend (Node) and ML service.
 * Adjust when you implement routes: forecast, explain, scenario, models, data, export.
 */

// ---- Data (UC6) ----
export interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: string[];
  uploadedAt: string;
  isActive?: boolean;
}

// ---- Models (UC4) ----
export type ModelType = "lstm" | "xgboost" | "ensemble";

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  datasetId: string;
  mae?: number;
  rmse?: number;
  mape?: number;
  trainedAt: string;
  isActive?: boolean;
}

export interface TrainRequest {
  datasetId: string;
  type: ModelType;
  params?: Record<string, unknown>;
}

// ---- Forecast (UC1) ----
export interface ForecastRequest {
  datasetId: string;
  modelId: string;
  horizon: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast: number;
}

export interface ForecastResponse {
  dates: string[];
  actual: (number | null)[];
  forecast: number[];
  metrics: { mae: number; rmse: number; mape: number };
}

// ---- Explain (UC2) ----
export interface ExplainRequest {
  modelId: string;
  runId?: string;
}

export interface ExplainResponse {
  shap: { feature: string; importance: number }[];
  attention?: { step: number; weight: number }[];
}

// ---- Scenario (UC3) ----
export interface ScenarioRequest {
  baseRunId: string;
  overrides: Record<string, number>;
}

export interface ScenarioResult {
  name: string;
  forecast: number[];
  summary?: number;
}

export interface ScenarioResponse {
  base: ScenarioResult;
  scenario: ScenarioResult;
}

// ---- Export (UC5) ----
export interface ExportRequest {
  type: "pdf" | "xlsx";
  runId?: string;
  scenarioRunId?: string;
}
