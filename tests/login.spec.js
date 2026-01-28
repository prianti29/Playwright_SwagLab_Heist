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

  //TC-LP-001 , TC-LP-003
  test("Verify login with valid standard user credentials", async () => {
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();
    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();
  });

  //TC-LP-002
  test("Verify login with incorrect password", async () => {
    await loginPage.login("standard_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  //TC-LP-004
  test("Login with locked_out_user Credentials", async () => {
    await loginPage.login("locked_out_user", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  //TC-LP-005
  test("Verify login and UI issues with problem_user", async ({ page }) => {
    // Sauce Labs intentionally added bugs to 'problem_user'.
    // This user is known to have duplicate images, so the unique image check will fail.
    test.fail(true, 'problem_user has known bugs: duplicated assets.');
    await loginPage.login("problem_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();

    // Take a snapshot to document the UI issues (like broken images)
    await expect(page).toHaveScreenshot('inventory-problem-user.png');

    await inventoryPage.verifyNoBrokenImages();
    await inventoryPage.verifyProductImagesAreUnique();
  });


  //TC-LP-006
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

  //TC-LP-007
  test("Verify login with error_user", async ({ page }) => {
    // error_user is known to trigger console errors and have broken functional logic.
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`Detected console error: ${msg.text()}`);
      }
    });

    // error_user is known to trigger console errors. 
    // We verify these errors via the console event listener and expect assertion below.

    await loginPage.login("error_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();

    // Take a snapshot of the buggy state
    await expect(page).toHaveScreenshot('inventory-error-user.png');

    // Attempting to logout or clicking specific items often triggers the bugs
    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();

    // Validation: We expect to have caught at least one console error
    expect(consoleErrors.length, 'Should have detected console errors for error_user').toBeGreaterThan(0);
  });

  //TC-LP-008
  test("Verify login with visual_user", async ({ page }) => {
    // visual_user has distorted UI elements (CSS issues).
    // The best way to validate this is through Visual Regression Testing.

    await loginPage.login("visual_user", "secret_sauce");
    await inventoryPage.verifyHeaderLogo();

    // visual_user has distorted UI elements. 
    // We verify this via Visual Regression Testing (Screenshots).

    // Capture and compare screenshots
    await expect(page).toHaveScreenshot('inventory-visual-user.png', {
      maxDiffPixelRatio: 0.01,
      threshold: 0.1
    });

    await inventoryPage.logout();
    await loginPage.verifyLoginPageVisible();
  });

  //TC-LP-009
  test("Verify login with incorrect password with lockedout user", async () => {
    await loginPage.login("locked_out_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  //TC-LP-010
  test("Verify login with incorrect password with problem user", async () => {
    await loginPage.login("problem_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  //TC-LP-011
  test("Verify login with incorrect password with performance glitch user", async () => {
    await loginPage.login("performance_glitch_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  //TC-LP-012
  test("Verify login with incorrect password with error user", async () => {
    await loginPage.login("error_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  //TC-LP-013
  test("Verify login with incorrect password with visual user", async () => {
    await loginPage.login("visual_user", "invalid_password");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match');
  });

  //TC-LP-014
  test("Verify login without entering credentials", async () => {
    await loginPage.login("", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username is required');
  });

  //TC-LP-015
  test("Verify login without entering password for standard user", async () => {
    await loginPage.login("standard_user", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  //TC-LP-016
  test("Verify login without entering password for locked out user", async () => {
    await loginPage.login("locked_out_user", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  //TC-LP-017 
  test("Verify login without entering password for problem_user", async () => {
    await loginPage.login("problem_user", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  //TC-LP-018 
  test("Verify login without entering password for performance_glitch_user", async () => {
    await loginPage.login("performance_glitch_user", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  //TC-LP-019
  test("Verify login without entering password for error_user", async () => {
    await loginPage.login("error_user", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  //TC-LP-020
  test("Verify login without entering password for visual_user", async () => {
    await loginPage.login("visual_user", "");
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  //TC-LP-021
  test("Verify case sensitivity of login for standard_user", async () => {
    await loginPage.login("STANDARD_USER", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  //TC-LP-022
  test("Verify case sensitivity of login for locked_out_user", async () => {
    await loginPage.login("LOCKED_OUT_USER", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  //TC-LP-023
  test("Verify case sensitivity of login for Problem User", async () => {
    await loginPage.login("PROBLEM_USER", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  //TC-LP-024
  test("Verify case sensitivity of login for Performance Glitch User", async () => {
    await loginPage.login("PERFORMANCE_GLITCH_USER", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  //TC-LP-025
  test("Verify case sensitivity of login for Error User", async () => {
    await loginPage.login("ERROR_USER", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  //TC-LP-026
  test("Verify case sensitivity of login for Visual User", async () => {
    await loginPage.login("VISUAL_USER", "secret_sauce");
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  //TC-LP-027
  test("Verify account lockout on multiple failed attempts for standard user", async () => {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await loginPage.login("standard_user", "wrong_password");

      if (i < maxAttempts - 1) {
        // Assert generic error for initial failed attempts
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
      }
    }
    // Final assertion for the specific lockout message
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, your account has been locked due to multiple failed login attempts. Please try again later.');
  });

  //TC-LP-028
  test("Verify account lockout on multiple failed attempts for lockedout user", async () => {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await loginPage.login("locked_out_user", "wrong_password");

      if (i < maxAttempts - 1) {
        // Assert generic error for initial failed attempts
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
      }
    }
    // Final assertion for the specific lockout message
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, your account has been locked due to multiple failed login attempts. Please try again later.');
  });

  //TC-LP-029
  test("Verify account lockout on multiple failed attempts for problem user", async () => {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await loginPage.login("problem_user", "wrong_password");

      if (i < maxAttempts - 1) {
        // Assert generic error for initial failed attempts
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
      }
    }
    // Final assertion for the specific lockout message
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, your account has been locked due to multiple failed login attempts. Please try again later.');
  });

  //TC-LP-030 
  test("Verify account lockout on multiple failed attempts for performance glitch user", async () => {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await loginPage.login("performance_glitch_user", "wrong_password");

      if (i < maxAttempts - 1) {
        // Assert generic error for initial failed attempts
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
      }
    }
    // Final assertion for the specific lockout message
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, your account has been locked due to multiple failed login attempts. Please try again later.');
  });

  //TC-LP-031 
  test("Verify account lockout on multiple failed attempts for error user", async () => {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await loginPage.login("error_user", "wrong_password");

      if (i < maxAttempts - 1) {
        // Assert generic error for initial failed attempts
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
      }
    }
    // Final assertion for the specific lockout message
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, your account has been locked due to multiple failed login attempts. Please try again later.');
  });

  //TC-LP-032
  test("Verify account lockout on multiple failed attempts visual user", async () => {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await loginPage.login("visual_user", "wrong_password");

      if (i < maxAttempts - 1) {
        // Assert generic error for initial failed attempts
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
      }
    }
    // Final assertion for the specific lockout message
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, your account has been locked due to multiple failed login attempts. Please try again later.');
  });

  //TC-LP-033
  test("Verify login across multiple browsers", async ({ playwright }) => {
    const browserTypes = ['chromium', 'firefox', 'webkit'];
    for (const browserType of browserTypes) {
      console.log(`Verifying login on: ${browserType}`);
      const browser = await playwright[browserType].launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      const multiLoginPage = new LoginPage(page);
      const multiInventoryPage = new InventoryPage(page);

      await multiLoginPage.goto();
      await multiLoginPage.login("standard_user", "secret_sauce");
      await multiInventoryPage.verifyHeaderLogo();

      await browser.close();
    }
  });




















  // //1.2
  // test("Verify Swag Labs login page loads successfully", async () => {
  //   await loginPage.verifyLoginPageVisible();
  //   await expect(loginPage.page.locator('.login_wrapper')).toBeVisible();
  // });

  // //1.2
  // test("Verify Username input field is displayed", async () => {
  //   await expect(loginPage.usernameInput).toBeVisible();
  // });

  // //1.3
  // test("Verify Password input field is displayed and masked", async () => {
  //   await expect(loginPage.passwordInput).toBeVisible();
  //   await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  // });

  // //1.4
  // test("Verify Login button is visible and enabled", async () => {
  //   await expect(loginPage.loginButton).toBeVisible();
  //   await expect(loginPage.loginButton).toBeEnabled();
  // });


  // //1.8 
  // test("Verify login with invalid username", async () => {
  //   await loginPage.login("invalid_user", "secret_sauce");
  //   await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  // });
});



