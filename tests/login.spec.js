const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { InventoryPage } = require("../pages/InventoryPage");

test.describe("Login Tests", () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  //1.1
  test("Verify Swag Labs login page loads successfully", async () => {
    await loginPage.verifyLoginPageVisible();
    await expect(loginPage.page.locator('.login_wrapper')).toBeVisible();
  });

  //1.2
  test("Verify Username input field is displayed", async () => {
    await expect(loginPage.usernameInput).toBeVisible();
  });

  //1.3
  test("Verify Password input field is displayed and masked", async () => {
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  //1.4
  test("Verify Login button is visible and enabled", async () => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });

  //1.5 
  test("Verify login with valid standard user credentials", async () => {
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();
    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();
  });

  //1.6
  test("Verify login with performance_glitch_user", async () => {
    await loginPage.login("performance_glitch_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();
    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();
  });

  //1.7
  test("Login with locked_out_user Credentials", async () => {
    await loginPage.login("locked_out_user", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  //1.8 
  test("Verify login with invalid username", async () => {
    await loginPage.login("invalid_user", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});



