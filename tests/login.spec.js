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
  test("Verify login with valid standard user credentials", async () => {
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();
    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();
  });

  //1.2
  test("Verify login with incorrect password", async () => {
    await loginPage.login("standard_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  //1.3
  test("Login with locked_out_user Credentials", async () => {
    await loginPage.login("locked_out_user", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  //1.4
  test("Verify login and UI issues with problem_user", async () => {
    // Sauce Labs intentionally added bugs to 'problem_user'.
    // We use test.fail() to acknowledge these known bugs.
    test.fail(true, 'problem_user has known bugs: broken images and duplicated assets.');
    await loginPage.login("problem_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();
    await inventoryPage.verifyNoBrokenImages();
    await inventoryPage.verifyProductImagesAreUnique();
  });


  //1.5
  test("Verify login with performance glitch user", async () => {
    // Get start time
    const startTime = performance.now();
    await loginPage.login("performance_glitch_user", "secret_sauce");
    // Get end time and calculate duration
    const endTime = performance.now();
    const duration = endTime - startTime;
    // Verify successful login
    await inventoryPage.verifyHeaderLogo();
    // Assert that the delay was significant (greater than 3 seconds)
    console.log(`Login duration for performance_glitch_user: ${duration.toFixed(2)}ms`);
    expect(duration).toBeGreaterThan(3000);

    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();
  });











  //1.2
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



  //1.7


  //1.8 
  test("Verify login with invalid username", async () => {
    await loginPage.login("invalid_user", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});



