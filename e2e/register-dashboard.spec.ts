import { test, expect } from "@playwright/test";

test.describe("auth", () => {
  test("register then see Dashboard heading", async ({ page }) => {
    const email = `e2e_${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill("Passw0rd!");
    await page.getByLabel(/name/i).fill("E2E User");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});
