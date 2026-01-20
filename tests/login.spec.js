const { test, expect } = require("@playwright/test");

test("Login with locked_out_user Credentials", async ({ page }) => {
  await page.goto("/");
  //get title
  console.log(await page.title());
  await expect(page).toHaveTitle("Swag Labs");

  const email = page.getByRole('textbox', { name: 'Username' });
  const password = page.getByRole('textbox', { name: 'Password' });

  await email.fill("locked_out_user");
  await password.fill("secret_sauce");

  // await page.screenshot({ path: 'before_click.png' });

  await page.locator('#login-button').click();

  // await page.screenshot({ path: 'after_click.png' });

  await expect(page.getByRole('heading', { name: 'Epic sadface: Sorry, this user has been locked out.' })).toBeVisible();
});
