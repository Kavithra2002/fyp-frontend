# What's Next – Project Plan

From `IMPLEMENTATION_SUMMARY.md` (Section 5: Suggested order of implementation).

---

## Done

| Step | Item | Status |
|------|------|--------|
| 1 | **Frontend shell** – Next.js, shadcn, layout, nav, placeholder pages | Done |
| 2 | **API client & types** – `services/api.ts`, `lib/types.ts`, backend connected | Done |

---

## Next: Data Management (UC6)

**Why first:** Other use cases need datasets (train model, run forecast). Data is the foundation.

### Backend (already implemented)

- `GET /data` – list datasets  
- `POST /data/upload` – upload CSV (multipart, field `file`)  
- `GET /data/:id` – get one dataset (metadata: name, rows, columns)  
- `PUT /data/:id/active` – set active dataset  

### Frontend (to implement)

Wire the **Data Management** page (`src/app/(dashboard)/data/page.tsx`) to the API:

1. **List datasets**
   - On load: `dataApi.list()` and show in the table (name, rows, columns, uploaded, actions).
   - Empty state: "No datasets yet. Upload a CSV."

2. **Upload CSV**
   - Enable the file input; on `change`, call `dataApi.upload(file)`.
   - On success: refresh the list (call `dataApi.list()` again or append the new item), clear the input.
   - On error: show a short message (e.g. toast or inline).

3. **Set active**
   - In the table, add an action: "Set active" (or a radio/check for the active row).
   - Call `dataApi.setActive(id)` and refresh the list so the active state is shown.

4. **Preview**
   - When a dataset is selected (or active): from `dataApi.get(id)` you get `columns` and `rows`.
   - Show: "Columns: A, B, C" and "Rows: 42". 
   - Optional later: backend `GET /data/:id/preview` (first N rows) if you want a real table preview.

---

## After Data (UC6) – in order

| Step | Use case | Page | What to wire |
|------|----------|------|--------------|
| 4 | **Model Management (UC4)** | `models/page.tsx` | `modelsApi.list()`, `modelsApi.train()`, `modelsApi.setActive()`. Dataset dropdown from `dataApi.list()`. |
| 5 | **Dashboard / Forecast (UC1)** | `dashboard/page.tsx` | Dataset/model from active or selectors. `forecastApi.run()`. Feed `ForecastChart` and metrics (MAE, RMSE, MAPE). |
| 6 | **Explainability (UC2)** | `explainability/page.tsx` | Model/run selectors. `explainApi.run()`. Feed `ShapChart` and attention block. |
| 7 | **Scenario Analysis (UC3)** | `scenario-analysis/page.tsx` | Base run, overrides (sliders). `scenarioApi.run()`. Comparison table/chart. |
| 8 | **Export (UC5)** | `export/page.tsx` | Run selector, format (PDF/Excel). `exportApi.create()`. Download blob. |

---

## Backend note

- **Data, Models:** Implemented (data: real upload/store; models: mock training that returns a model).
- **Forecast, Explain, Scenario, Export:** Implemented with **mock data** (structure matches `api.ts` and `lib/types.ts`). They can be wired from the frontend now; real ML (e.g. Python FastAPI) can replace the mocks later.

---

## Summary

- **Next step:** Implement **Data Management (UC6)** in the frontend: list, upload, set active, and basic preview (columns + rows).
- **Then:** Model Management (UC4) → Dashboard (UC1) → Explainability (UC2) → Scenario (UC3) → Export (UC5).
