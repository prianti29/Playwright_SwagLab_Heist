const { test, expect } = require("@playwright/test");

test.describe("Login Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Swag Labs");
  });

  test("Login with locked_out_user Credentials", async ({ page }) => {
    const usernameInput = page.getByRole('textbox', { name: 'Username' });
    const passwordInput = page.getByRole('textbox', { name: 'Password' });

    await usernameInput.fill("locked_out_user");
    await passwordInput.fill("secret_sauce");
    await page.locator('#login-button').click();

    await expect(page.getByRole('heading', { name: 'Epic sadface: Sorry, this user has been locked out.' })).toBeVisible();
  });
});


