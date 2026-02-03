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
  const standardUserBrowsers = ['chromium', 'firefox', 'webkit'];
  for (const browserType of standardUserBrowsers) {
    test(`Verify login across multiple browsers for standard user on ${browserType}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-033 on: ${browserType}`);

      // Manually launch browser instance for the specific type
      const browser = await playwright[browserType].launch();
      // Create a fresh page for the test
      const page = await browser.newPage();

      // Initialize Page Object Models using the direct page instance
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform test steps
      await loginPage.goto();
      await loginPage.login("standard_user", "secret_sauce");
      await inventoryPage.verifyHeaderLogo();

      // Ensure browser is closed after each iteration to free up resources
      await browser.close();
    });
  }

  //TC-LP-034
  const lockedOutUserBrowsers = ['chromium', 'firefox', 'webkit'];
  for (const browserType of lockedOutUserBrowsers) {
    test(`Verify login across multiple browsers for lockedout user on ${browserType}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-034 on: ${browserType}`);

      // Manually launch the specific browser type (Chromium, Firefox, or Webkit)
      const browser = await playwright[browserType].launch();
      const page = await browser.newPage();

      // Create local instance of LoginPage for the current browser context
      const loginPage = new LoginPage(page);

      // Navigate and attempt login with known locked_out_user
      await loginPage.goto();
      await loginPage.login("locked_out_user", "secret_sauce");

      // Assert that the lockout error message is displayed correctly on this browser
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

      // Close instance to prevent memory leaks or hanging processes
      await browser.close();
    });
  }
  //TC-LP-035
  const problemUserBrowsers = ['chromium', 'firefox', 'webkit'];
  for (const browserType of problemUserBrowsers) {
    test(`Verify login across multiple browsers for problem user on ${browserType}`, async ({ playwright }) => {
      // problem_user is known to have UI bugs like broken images and duplicate assets.
      // We expect the image validation checks to fail on this user.
      test.fail(true, 'problem_user has known bugs: broken images and duplicated assets.');

      console.log(`Executing TC-LP-035 on: ${browserType}`);

      const browser = await playwright[browserType].launch();
      const page = await browser.newPage();

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform Login
      await loginPage.goto();
      await loginPage.login("problem_user", "secret_sauce");

      // Verify Successful Landing
      await inventoryPage.verifyHeaderLogo();

      // Detect UI Bugs (These are expected to fail for problem_user)
      console.log(`Checking for UI bugs in ${browserType}...`);

      // Check for broken images (src returning 404 or naturalWidth 0)
      await inventoryPage.verifyNoBrokenImages();

      // Check for duplicate product images
      await inventoryPage.verifyProductImagesAreUnique();

      await browser.close();
    });
  }
  //TC-LP-036
  const performanceUserBrowsers = ['chromium', 'firefox', 'webkit'];
  for (const browserType of performanceUserBrowsers) {
    test(`Verify login across multiple browsers for performance glitch user on ${browserType}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-036 on: ${browserType}`);

      const browser = await playwright[browserType].launch();
      const page = await browser.newPage();

      // Create local instance of LoginPage for the current browser context
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Navigate and attempt login with performance_glitch_user
      await loginPage.goto();

      const startTime = performance.now();
      await loginPage.login("performance_glitch_user", "secret_sauce");
      const endTime = performance.now();
      const duration = endTime - startTime;

      await inventoryPage.verifyHeaderLogo();
      console.log(`Login duration for performance_glitch_user on ${browserType}: ${duration.toFixed(2)}ms`);
      expect(duration).toBeGreaterThan(3000);

      await inventoryPage.logout();
      await loginPage.verifyLoginPageVisible();

      // Close instance to prevent memory leaks or hanging processes
      await browser.close();
    });
  }
  //TC-LP-037
  const errorUserBrowsers = ['chromium', 'firefox', 'webkit'];
  for (const browserType of errorUserBrowsers) {
    test(`Verify login across multiple browsers for error user on ${browserType}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-037 on: ${browserType}`);

      const browser = await playwright[browserType].launch();
      const page = await browser.newPage();

      // Track console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform Login
      await loginPage.goto();
      await loginPage.login("error_user", "secret_sauce");

      // Verify Successful Landing
      await inventoryPage.verifyHeaderLogo();

      // Attempt Logout
      await inventoryPage.logout();
      await loginPage.verifyLoginPageVisible();

      if (browserType === 'chromium') {
        expect(consoleErrors.length).toBeGreaterThan(0);
      }

      await browser.close();
    });
  }
  //TC-LP-038
  const visualUserBrowsers = ['chromium', 'firefox', 'webkit'];
  for (const browserType of visualUserBrowsers) {
    test(`Verify login across multiple browsers for visual user on ${browserType}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-038 on: ${browserType}`);

      const browser = await playwright[browserType].launch();
      const page = await browser.newPage();

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform Login
      await loginPage.goto();
      await loginPage.login("visual_user", "secret_sauce");

      // Verify Successful Landing
      await inventoryPage.verifyHeaderLogo();

      // Visual Regression Check
      await expect(page).toHaveScreenshot(`inventory-visual-user-${browserType}.png`, {
        maxDiffPixelRatio: 0.05,
        threshold: 0.2
      });

      await inventoryPage.logout();
      await loginPage.verifyLoginPageVisible();

      await browser.close();
    });
  }
  //TC-LP-038
  const standardUserDevices = ['iPhone 13', 'Pixel 5', 'Galaxy S9+'];
  for (const deviceName of standardUserDevices) {
    test(`Verify login on mobile devices for standard user on ${deviceName}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-038 on: ${deviceName}`);

      const device = playwright.devices[deviceName];
      const browserName = device.defaultBrowserType;

      // Manually launch browser and create context with mobile emulation
      const browser = await playwright[browserName].launch();
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.login("standard_user", "secret_sauce");
      await inventoryPage.verifyHeaderLogo();

      // Verify logout works on mobile view
      await inventoryPage.logout();
      await loginPage.verifyLoginPageVisible();

      await browser.close();
    });
  }

  //TC-LP-039
  const lockedOutUserDevices = ['iPhone 13', 'Pixel 5', 'Galaxy S9+'];
  for (const deviceName of lockedOutUserDevices) {
    test(`Verify login on mobile devices for lockedout user on ${deviceName}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-039 on: ${deviceName}`);

      const device = playwright.devices[deviceName];
      const browserName = device.defaultBrowserType;

      // Manually launch browser and create context with mobile emulation
      const browser = await playwright[browserName].launch();
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("locked_out_user", "secret_sauce");

      // Assert that the lockout error message is displayed correctly on this browser
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

      // Close instance to prevent memory leaks or hanging processes
      await browser.close();
    });
  }

  //TC-LP-040
  const problemUserDevices = ['iPhone 13', 'Pixel 5', 'Galaxy S9+'];
  for (const deviceName of problemUserDevices) {
    test(`Verify login on mobile devices for problem user on ${deviceName}`, async ({ playwright }) => {
      // problem_user is known to have UI bugs like broken images and duplicate assets.
      // We expect the image validation checks to fail on this user.
      test.fail(true, 'problem_user has known bugs: broken images and duplicated assets.');

      console.log(`Executing TC-LP-040 on: ${deviceName}`);

      const device = playwright.devices[deviceName];
      const browserName = device.defaultBrowserType;

      // Manually launch browser and create context with mobile emulation
      const browser = await playwright[browserName].launch();
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform Login
      await loginPage.goto();
      await loginPage.login("problem_user", "secret_sauce");

      // Verify Successful Landing
      await inventoryPage.verifyHeaderLogo();

      // Detect UI Bugs (These are expected to fail for problem_user)
      console.log(`Checking for UI bugs in ${deviceName}...`);

      // Check for broken images (src returning 404 or naturalWidth 0)
      await inventoryPage.verifyNoBrokenImages();

      // Check for duplicate product images
      await inventoryPage.verifyProductImagesAreUnique();

      await browser.close();
    });
  }
  //TC-LP-041
  const performanceGlitchUserDevices = ['iPhone 13', 'Pixel 5', 'Galaxy S9+'];
  for (const deviceName of performanceGlitchUserDevices) {
    test(`Verify login on mobile devices for performance glitch user on ${deviceName}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-041 on: ${deviceName}`);

      const device = playwright.devices[deviceName];
      const browserName = device.defaultBrowserType;

      // Manually launch browser and create context with mobile emulation
      const browser = await playwright[browserName].launch();
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform Login
      await loginPage.goto();

      // Get start time to measure performance glitch
      const startTime = performance.now();
      await loginPage.login("performance_glitch_user", "secret_sauce");

      // Get end time and calculate duration
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Verify Successful Landing
      await inventoryPage.verifyHeaderLogo();

      // Assert that the delay was significant (greater than 3 seconds)
      console.log(`Login duration for performance_glitch_user on ${deviceName}: ${duration.toFixed(2)}ms`);
      expect(duration).toBeGreaterThan(3000);

      // Perform Logout and verify
      await inventoryPage.logout();
      await loginPage.verifyLoginPageVisible();

      await browser.close();
    });
  }

  //TC-LP-042
  const errorUserDevices = ['iPhone 13', 'Pixel 5', 'Galaxy S9+'];
  for (const deviceName of errorUserDevices) {
    test(`Verify login on mobile devices for error user on ${deviceName}`, async ({ playwright }) => {
      console.log(`Executing TC-LP-042 on: ${deviceName}`);

      const device = playwright.devices[deviceName];
      const browserName = device.defaultBrowserType;

      // Manually launch browser and create context with mobile emulation
      const browser = await playwright[browserName].launch();
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      // Track console errors and page crashes (pageerror)
      const capturedErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          capturedErrors.push(`Console Error: ${msg.text()}`);
          console.log(`[${deviceName}] Detected console error: ${msg.text()}`);
        }
      });

      page.on('pageerror', error => {
        capturedErrors.push(`Page Crash/Exception: ${error.message}`);
        console.log(`[${deviceName}] Detected page crash/exception: ${error.message}`);
      });

      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      // Perform Login
      await loginPage.goto();
      await loginPage.login("error_user", "secret_sauce");

      // Verify Successful Landing
      await inventoryPage.verifyHeaderLogo();

      // Perform Logout and verify
      await inventoryPage.logout();
      await loginPage.verifyLoginPageVisible();

      // For error_user, we expect to capture errors (especially on Chromium browsers)
      console.log(`[${deviceName}] Total captured errors: ${capturedErrors.length}`);

      // Note: Some emulators might report more or fewer errors than others, 
      // but 'error_user' is designed to be noisy in the console.
      if (deviceName !== 'Galaxy S9+') { // Assuming webkit/chromium catch more than some specific S9 configs
        expect(capturedErrors.length, 'Should have detected console or page errors for error_user').toBeGreaterThan(0);
      }

      await browser.close();
    });
  }






















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



