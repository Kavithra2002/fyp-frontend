import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.join(__dirname, "fixtures", "sample.csv");

test.describe("upload → train → forecast", () => {
  test("full UC1 path", async ({ page }) => {
    const email = `e2e_flow_${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill("Passw0rd!");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/data");
    await page.setInputFiles("#csv-upload", fixture);
    await expect(page.getByText("sample.csv", { exact: false })).toBeVisible({ timeout: 30_000 });
    await page.getByRole("button", { name: "Set active" }).first().click();

    await page.goto("/models");
    await page.locator("#train-dataset").selectOption({ label: /sample\.csv/i });
    await page.locator("#train-type").selectOption("xgboost");
    await page.getByRole("button", { name: "Start training" }).click();
    await expect(page.getByText(/xgboost|XGBoost/i).first()).toBeVisible({ timeout: 60_000 });

    await page.getByRole("button", { name: "Set active" }).first().click();

    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Run forecast" }).click();
    await expect(page.locator(".recharts-responsive-container")).toBeVisible({ timeout: 30_000 });
  });
});
