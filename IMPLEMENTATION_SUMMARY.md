# Implementation Summary – FYP Forecasting & XAI Platform

Based on your project structure and backend/ML design, here is what to implement and how.

---

## 1. What to implement (from your structure)

### 1.1 Use cases (UC1–UC6) → frontend screens

| UC  | Backend route | ML service           | Frontend page / feature |
|-----|---------------|----------------------|--------------------------|
| UC1 | `forecast.ts` | Forecast (LSTM/XGB/ensemble) | **Dashboard** – run forecast, horizon, view chart & metrics |
| UC2 | `explain.ts`  | SHAP, attention viz  | **Explainability** – feature importance, SHAP/attention charts |
| UC3 | `scenario.ts` | What‑if (sensitivity) | **Scenario Analysis** – change inputs, compare scenarios |
| UC4 | `models.ts`   | Train, list, select  | **Model Management** – train, list models, set active |
| UC5 | `export.ts`   | Report generation    | **Export** – PDF/Excel reports (often from Dashboard or shared) |
| UC6 | `data.ts`     | Upload, list, preprocess | **Data Management** – upload CSV, view, validate, select dataset |

### 1.2 Core features per page

- **Dashboard**
  - Model & dataset selectors
  - Forecast horizon, run button
  - Time‑series chart (actual vs forecast)
  - Metrics: MAE, RMSE, MAPE (or from your report)

- **Explainability**
  - Model + (optional) point/forecast select
  - SHAP summary / bar / beeswarm
  - LSTM attention weights over time (if in scope)

- **Scenario Analysis**
  - Base scenario from last forecast
  - Sliders/inputs to change drivers (e.g. volume, price)
  - Run what‑if, show comparison table/chart

- **Model Management**
  - List trained models (name, type, metrics, date)
  - Train new model (dataset, type, params)
  - Set “active” model for forecast/explain

- **Data Management**
  - Upload CSV
  - Table preview, basic stats, validation (missing, dtypes)
  - Select “active” dataset

- **Export**
  - Trigger from Dashboard or dedicated page: export forecast/explain/scenario as PDF or Excel

---

## 2. How to implement – high level

### 2.1 Frontend (Next.js + TypeScript + shadcn)

- **Framework:** Next.js 14+ (App Router), TypeScript.
- **UI:** shadcn/ui (Button, Card, Table, Tabs, Select, Input, Slider, etc.).
- **Charts:** e.g. Recharts (or similar) for time series and SHAP/attention.
- **Data:** `services/api.ts` calling your Node backend; `types.ts` for DTOs.
- **Layout:** Sidebar (Dashboard, Explainability, Scenario, Models, Data, Export) + main content.

### 2.2 Backend (Node) ↔ ML (Python)

- Node: `mlService` calls Python FastAPI (`/forecast`, `/explain`, `/scenario`, `/train`, etc.).
- Node: `database` (e.g. Prisma) for datasets, runs, models, exports.
- Node: `exportService` for PDF/Excel (e.g. pdf-lib, exceljs).

### 2.3 ML service (Python FastAPI)

- Models: `lstm_model`, `xgboost_model`, `ensemble`.
- XAI: `shap_explainer`, `attention_viz`.
- Preprocessing, training, and route handlers as in your `api/routes`.

---

## 3. Structure adjustments (for Next.js + shadcn)

Your layout is fine; a few alignments for Next.js:

1. **Use App Router**  
   - `app/layout.tsx`, `app/page.tsx` (Dashboard),  
   - `app/(dashboard)/explainability/page.tsx`, `scenario-analysis/page.tsx`, `models/page.tsx`, `data/page.tsx`, etc.

2. **Components**  
   - `components/Dashboard/`, `Explainability/`, `ScenarioAnalysis/`, `ModelManagement/`, `DataManagement/`, `Common/`  
   — matches your plan; we use `components/` at project root for shadcn.

3. **No `App.tsx` / `index.tsx`**  
   - Next.js uses `app/layout.tsx` and `app/page.tsx` (or `app/(dashboard)/page.tsx`).

4. **`src/` optional**  
   - Can use `app/`, `components/`, `lib/`, `services/` at root, or under `src/`.  
   - We’ll put `app/`, `components/`, `lib/`, `services/` at frontend root for simplicity.

5. **`services/api.ts` and `types`**  
   - `services/api.ts` and `lib/types.ts` (or `services/types.ts`) for API and DTOs.

---

## 4. Possible gaps / pitfalls

- **Auth:** Your layout doesn’t show auth; add when required (e.g. NextAuth, JWT via Node).
- **File upload size / validation:** Limit and validate in `data` (Node + ML) for CSVs.
- **Long training:** UC4 train can be slow; use async job + polling or WebSocket.
- **Export:** UC5 can be a separate page or a “Export” action on Dashboard/Explain/Scenario; both are ok.

---

## 5. Suggested order of implementation

1. **Frontend shell** – Next.js, shadcn, layout, nav, placeholder pages.  
2. **API client & types** – `services/api.ts`, `lib/types.ts` matching your Node/ML contracts.  
3. **Data Management (UC6)** – upload, list, select; needed for other UCs.  
4. **Model Management (UC4)** – list, train, set active; needed for forecast/explain.  
5. **Dashboard / Forecast (UC1)** – run forecast, chart, metrics.  
6. **Explainability (UC2)** – SHAP and attention.  
7. **Scenario Analysis (UC3)** – what‑if.  
8. **Export (UC5)** – PDF/Excel from existing results.

---

## 6. Frontend–backend contract (to align with your routes)

Ensure your Node routes and ML API match what the frontend expects, e.g.:

- `POST /api/forecast` – `{ datasetId, modelId, horizon }` → `{ dates, actual, forecast, metrics }`
- `POST /api/explain` – `{ modelId, runId? }` → `{ shap, attention? }`
- `POST /api/scenario` – `{ baseRunId, overrides }` → `{ scenarios }`
- `GET/POST /api/models` – list, train, set active
- `GET/POST /api/data` – list, upload, set active
- `POST /api/export` – `{ type: 'pdf'|'xlsx', runId?, ... }` → file

You can refine request/response shapes in `lib/types.ts` and `services/api.ts` as you implement the Node and ML services.
