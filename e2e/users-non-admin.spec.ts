import { test, expect } from "@playwright/test";

test.describe("user management (role)", () => {
  test("non-admin sees restricted message on Users page", async ({ page }) => {
    const email = `e2e_user_${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill("Passw0rd!");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/users");
    await expect(page.getByText(/only admin accounts can view/i)).toBeVisible({ timeout: 15_000 });
  });
});
