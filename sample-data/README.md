# Sample data for demo

Use these CSVs to test **Data Management** and the full flow (train model → forecast → explain → scenario → export).

## Files

| File | Rows | Columns | Use |
|------|------|---------|-----|
| **sample-timeseries.csv** | 30 | `date`, `value` | Short time series |
| **sample-demand.csv** | 60 | `date`, `demand` | Demand-style series (good for forecast chart) |

## How to use

1. Open the app → **Data Management** in the sidebar.
2. Click **Choose file** and select one of the CSVs above (e.g. `sample-demand.csv`).
3. After upload, it appears in the table. Click a row to preview; click **Set active**.
4. Go to **Model Management** → choose that dataset → pick type (e.g. LSTM) → **Start training**.
5. Go to **Dashboard** → **Run forecast** to see the chart and metrics.
6. Use **Explainability**, **Scenario Analysis**, and **Export** as needed.
