# LSTM, XGBoost & Ensemble: Training, Integration & User Selection

This guide explains how **training** the three models (LSTM, XGBoost, Ensemble), **integrating** them into your project, and letting **users select one model to run forecasts** fits together—and what’s already built vs what you still need to implement.

---

## 1. High-level flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TRAINING (you / ML pipeline)                                                │
│  • Train LSTM, XGBoost, Ensemble on your datasets                            │
│  • Save trained models (weights, artifacts) + metadata (MAE, RMSE, MAPE)     │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  INTEGRATION                                                                 │
│  • Store model metadata (id, name, type, datasetId, metrics) in your system  │
│  • Backend can load and run the right model for a given modelId              │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  USER SELECTION & FORECAST                                                   │
│  • User picks Dataset + Model (LSTM / XGBoost / Ensemble) + Horizon          │
│  • Backend runs inference with selected model → returns forecast + metrics   │
│  • Frontend shows chart (actual vs forecast) and MAE/RMSE/MAPE               │
└─────────────────────────────────────────────────────────────────────────────┘
```

So: **train** the models → **integrate** them (register + inference API) → **user selects** one → **forecast** with that model.

---

## 2. What “train the models” means

You need three real ML models:

| Model      | Role / Typical use                          | Common stack                |
|-----------|---------------------------------------------|-----------------------------|
| **LSTM**  | Capture temporal patterns in time series    | Python, TensorFlow/Keras    |
| **XGBoost** | Tabular/feature-based forecasting         | Python, XGBoost             |
| **Ensemble** | Combine LSTM + XGBoost (e.g. average or learned blend) | Same + your ensemble logic |

Training pipeline (conceptually):

1. **Input**: Your time-series CSV (e.g. from Data Management upload).
2. **Preprocessing**: Train/val/test split, scaling, feature engineering, sliding windows for LSTM, etc.
3. **Train**:
   - LSTM: sequence in → forecast out; tune architecture, epochs, etc.
   - XGBoost: feature matrix → forecast; tune hyperparameters.
   - Ensemble: e.g. `α * LSTM + (1−α) * XGBoost` or stacking.
4. **Output**: Saved model files (e.g. `.h5` / `.keras` for LSTM, `.json`/`.ubj` for XGBoost, plus any ensemble config) and **validation metrics** (MAE, RMSE, MAPE).

Your **project does not implement this training logic yet**. The backend only mocks it. You have to implement it (typically in a **Python ML service**).

---

## 3. What “integrate the three models” means

Integration = **your app** (frontend + Node backend) **can use** each trained model for **inference**:

1. **Model registry**
   - When a model is trained (by you or by a “Train” action in the app), you store:
     - `id`, `name`, `type` (`lstm` | `xgboost` | `ensemble`), `datasetId`, `trainedAt`
     - Optional: `mae`, `rmse`, `mape`, paths to artifacts.
   - Your backend already has a *logical* notion of “models” (see `models` store, `Model` type). Right now it’s mock; you’ll align this with real training outputs.

2. **Inference API**
   - Given `modelId` (+ `datasetId`, `horizon`), the backend must:
     - Know which saved model corresponds to `modelId`.
     - Load the right artifacts (LSTM, XGBoost, or Ensemble).
     - Run inference on the dataset (or its latest values) for `horizon` steps.
     - Return `dates`, `actual`, `forecast`, `metrics`.

So “integrate” = **wire your Node backend (and/or a Python service) so that**:

- **Training** produces stored models and metadata.
- **Forecast** runs the **selected** model and returns real predictions.

---

## 4. What “user selects one model and does forecast” means

Desired UX:

1. User goes to **Model Management**.
2. User **trains** a model: chooses a **dataset** and **model type** (LSTM, XGBoost, or Ensemble).
3. User **sets one** of the trained models as **active**.
4. User goes to **Dashboard**.
5. User sets **horizon** (e.g. 7 days) and clicks **“Run forecast”**.
6. The app uses the **active dataset** and **active model** (the one they selected) to run the forecast and shows:
   - Chart: actual vs forecast.
   - Metrics: MAE, RMSE, MAPE.

So “user selects” = **choose model type when training** + **set active model** in Model Management. The **forecast always uses the active model**.

---

## 5. What your project already has

### Frontend (Next.js)

- **Model Management** (`/models`):
  - Dropdowns: **Dataset**, **Model type** (LSTM / XGBoost / Ensemble).
  - “Train” calls `modelsApi.train({ datasetId, type })`.
  - Lists trained models, **“Set active”** calls `modelsApi.setActive(id)`.
- **Dashboard** (`/dashboard`):
  - Shows **active dataset** and **active model** (name, including type).
  - **Horizon** input and **“Run forecast”**.
  - Calls `forecastApi.run({ datasetId, modelId, horizon })`.
  - Renders `ForecastChart` (actual vs forecast) and MAE / RMSE / MAPE cards.

So: **UI for “select model type → train → set active → run forecast” is already there.** The flow is correct; it just uses **mock** backend responses.

### Backend (Node)

- **Models**
  - `POST /models/train`: accepts `datasetId`, `type` (`lstm` | `xgboost` | `ensemble`). **Mock**: creates a fake model, no real training.
  - `GET /models`, `GET /models/:id`, `PUT /models/:id/active`: list, get, set active.
- **Forecast**
  - `POST /forecast`: accepts `datasetId`, `modelId`, `horizon`. **Mock**: returns random time series, not real model inference.

### Types

- `ModelType = "lstm" | "xgboost" | "ensemble"`.
- `Model`, `TrainRequest`, `ForecastRequest`, `ForecastResponse` match the above.

So: **integration points exist** (APIs, types, UI). What’s missing is **real training** and **real inference**.

---

## 6. What you still need to implement

### 6.1. Train the three models (Python ML service)

- Implement **LSTM**, **XGBoost**, and **Ensemble** training (e.g. in Python with TensorFlow, XGBoost, NumPy/Pandas).
- Use your actual data format (e.g. CSV from Data Management).
- Save:
  - Model artifacts (file paths or blob storage).
  - Validation metrics (MAE, RMSE, MAPE) and optionally config (e.g. `horizon`, feature list).

### 6.2. Connect training to your backend

- When the user clicks “Train” in Model Management:
  - Option A: Backend calls your **Python ML service** (e.g. REST or internal RPC) to train; ML service trains, saves artifacts, returns `modelId` + metrics. Backend stores metadata in `models` (or DB).
  - Option B: You run training **offline** (scripts / notebooks), then **import** model metadata (+ artifact paths) into your backend (e.g. register via an admin API or script).

Replace the **mock** `POST /models/train` logic with one of these.

### 6.3. Connect forecast to real inference

- When the user runs a forecast:
  - Backend receives `datasetId`, `modelId`, `horizon`.
  - It must **load the correct model** (LSTM, XGBoost, or Ensemble) and run **real inference** on the dataset.
- Typical approach:
  - **Python ML service** exposes e.g. `POST /predict` (or `/forecast`) with `modelId`, `datasetId`, `horizon`.
  - Node `POST /forecast` calls this service, then returns `ForecastResponse` (dates, actual, forecast, metrics) to the frontend.

Replace the **mock** `POST /forecast` logic with this.

### 6.4. Optional improvements

- **Async training**: `POST /models/train` returns `jobId`; frontend polls `GET /models/job/:jobId` until “done”, then refreshes the model list. Your backend already has a stub for this.
- **Persistence**: Replace in-memory `models`/`datasets` stores with a **database** (e.g. PostgreSQL + Prisma) and store artifact paths, metrics, etc.
- **Explainability / scenario**: Your explain and scenario routes are also mocked; those can later call the same ML service for SHAP, attention, scenario overrides, etc.

---

## 7. Suggested architecture (after you add real ML)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Next.js        │     │  Node backend    │     │  Python ML service  │
│  (Frontend)     │────▶│  /models,        │────▶│  - Train LSTM,      │
│                 │     │  /forecast,      │     │    XGBoost,         │
│  - Model Mgmt   │     │  /data, ...      │     │    Ensemble         │
│  - Dashboard    │     │                  │     │  - Predict (inference)│
│  - ForecastChart│     │  - Auth, DB,     │     │  - Save/load        │
│                 │     │    orchestration │     │    artifacts        │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
```

- **User** selects dataset + model type → **Train** → Node calls Python to train → Python saves models, returns metadata → Node stores model, updates UI.
- **User** sets active model → **Run forecast** → Node calls Python with `modelId` + `datasetId` + `horizon` → Python runs the **selected** model (LSTM, XGBoost, or Ensemble), returns forecast + metrics → Node returns `ForecastResponse` → **ForecastChart** and metrics cards update.

---

## 8. Summary

| Requirement | Meaning | In your project |
|-------------|---------|------------------|
| **Train LSTM, XGBoost, Ensemble** | Real ML training code, producing saved models + metrics | ❌ To implement (Python ML service) |
| **Integrate the three models** | Registry + inference API so the app can run any of them | ⚠️ Structure exists (models, forecast APIs); **implementation is mock** |
| **User selects one model & forecasts** | Train by type → set active → run forecast using that model | ✅ **Implemented in UI**; backend still uses mocks |

So: you need to **add real training and inference** (via a Python ML service or equivalent) and **replace the mocks** in `POST /models/train` and `POST /forecast`. The **selection flow** (choose type → train → set active → forecast) is already in place; once the backend uses real ML, users will be selecting and forecasting with your LSTM, XGBoost, and Ensemble models as intended.
