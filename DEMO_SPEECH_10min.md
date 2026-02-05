# 10-Minute Project Demonstration Speech  
**Forecasting and Explainable AI Platform**  
*From data logging to export — script to present while doing the demo*

**Total duration:** ~10 minutes  
**Flow:** Login → Data Management → Model Management → Dashboard → Explainability → Scenario Analysis → Export

---

## Intro (≈45 sec)

**[SHOW: Login page or Dashboard]**

"Good [morning/afternoon]. I'm going to demo the **Forecasting and Explainable AI Platform**—a system for supply chain demand forecasting with explainable AI. I'll walk through the full pipeline: from uploading data and training models, to running forecasts, viewing explanations, doing what‑if scenarios, and finally exporting reports. Let's start."

*[If you begin at login: log in briefly and go to the dashboard.]*

---

## 1. Data Management — Data logging (≈1 min 30 sec)

**[SHOW: Sidebar → Data Management]**

"First step is **data**. Here in **Data Management** we handle the input to the system—this is our data logging layer.

**[DO: Point to Upload CSV]**  
I can upload a CSV dataset—for example sales or demand time series. The backend validates and preprocesses it, and it appears in the table below.

**[DO: If you have a CSV, upload it; otherwise point at the table]**  
We see all uploaded datasets: name, row count, columns, and upload time. I select one and click **Set active** so it becomes the dataset used for training and forecasting. The preview here shows the selected dataset’s columns and row count. So: upload, list, choose one as active—that’s our data foundation."

---

## 2. Model Management — Training (≈1 min 30 sec)

**[SHOW: Sidebar → Model Management]**

"Next, **Model Management**. We need a trained model to forecast. I choose the **dataset** we just set active and the **model type**: **LSTM**, **XGBoost**, or **Ensemble**. Then I click **Start training**.

**[DO: Select dataset and type, click Start training]**  
Training runs on the backend. When it finishes, the new model appears in the table with metrics—MAE, RMSE, MAPE—and I **Set active** the model I want to use for forecasting and explainability. So we now have an active dataset and an active model."

---

## 3. Dashboard — Running forecasts (≈1 min 45 sec)

**[SHOW: Sidebar → Dashboard]**

"On the **Dashboard** we run the actual forecast. The cards show the current **active dataset** and **active model**. I set the **forecast horizon**—for example 7 days—and click **Run forecast**.

**[DO: Set horizon, click Run forecast]**  
The chart shows **actual vs predicted** over time, and we get accuracy metrics: **MAE**, **RMSE**, and **MAPE**. This is the core predictive output of the platform—demand forecasts driven by our data and model."

---

## 4. Explainability — XAI (≈1 min 30 sec)

**[SHOW: Sidebar → Explainability]**

"**Explainability** is where we open the black box. The page uses the **active model**. I click **Run explain**.

**[DO: Click Run explain]**  
We get two kinds of insight: **SHAP feature importance**—which features, like price or promotion, contributed most to the forecast—and **LSTM attention weights**, showing which past time steps the model focused on. So planners can see not only the forecast number but *why* the model produced it—key for trust and decisions."

---

## 5. Scenario Analysis — What‑if (≈1 min 30 sec)

**[SHOW: Sidebar → Scenario Analysis]**

"In **Scenario Analysis** we do **what‑if** planning. I enter a base run ID—for the demo we can use **demo**—and then adjust drivers: **price** and **volume**, using the sliders. I click **Run what‑if**.

**[DO: Adjust sliders, click Run what‑if]**  
The chart and table compare the **base** forecast with the **scenario** forecast and show the **delta**. So we answer questions like: *If we change price or volume, how does the forecast change?*—that’s counterfactual, decision‑support use of the model."

---

## 6. Export — Reports (≈1 min)

**[SHOW: Sidebar → Export]**

"Finally, **Export**. Here we turn results into shareable reports. I choose the format—**PDF** or **Excel**—and optionally enter a **run ID** or **scenario run ID** to tie the export to a specific forecast or scenario. Then I click **Download**.

**[DO: Select PDF or XLSX, click Download]**  
The file is generated and downloaded—for example a forecast report in PDF or an Excel export. So from data upload to forecasts, explanations, scenarios, and export, the full pipeline is in one place."

---

## Outro (≈30 sec)

**[SHOW: Dashboard or Export]**

"That completes the demo: **data logging** in Data Management, **model training** in Model Management, **forecasting** on the Dashboard, **explainability** with SHAP and attention, **scenario analysis** for what‑if, and **export** for PDF or Excel reports. The platform ties together accurate forecasting with explainable AI so supply chain planners can understand and act on the results. Thank you. I’m happy to take questions."

---

## Quick reference — Demo order

| Step | Screen            | Main action                          |
|------|-------------------|--------------------------------------|
| 1    | Data Management   | Upload CSV, set active dataset       |
| 2    | Model Management  | Train model, set active model        |
| 3    | Dashboard         | Set horizon, run forecast            |
| 4    | Explainability    | Run explain (SHAP + attention)       |
| 5    | Scenario Analysis | Adjust drivers, run what‑if          |
| 6    | Export            | Choose PDF/XLSX, download            |

**Tip:** Rehearse once with a timer. If you run short, add one sentence per section; if long, trim the “So …” summary lines. Keep the **[DO]** actions in sync with your clicks.
