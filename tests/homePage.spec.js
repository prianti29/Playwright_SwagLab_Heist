const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { InventoryPage } = require("../pages/InventoryPage");
const { ProductPage } = require("../pages/ProductPage");

test.describe("Home Page Tests", () => {
     let loginPage;
     let inventoryPage;

     test.beforeEach(async ({ page }) => {
          loginPage = new LoginPage(page);
          inventoryPage = new InventoryPage(page);

          await loginPage.goto();
          await loginPage.login("standard_user", "secret_sauce");
     });

     //TC-HP-001
     test("Verify the name of each product of each product have a correct name", async () => {
          await inventoryPage.verifyProductName();
     });

     //TC-HP-002
     test("Verify the product name formatting follows 'Sauce Labs' prefix", async () => {
          // Marking this as expected to fail because the Red T-Shirt DOES NOT follow the format.
          test.fail(true, "The 'Test.allTheThings() T-Shirt (Red)' product is known to miss the 'Sauce Labs' prefix.");
          await inventoryPage.verifyProductNameFormat();
     });

     //TC-HP-003
     test("Verify each product has a correct description", async () => {
          await inventoryPage.verifyProductDescriptions();
     });

     //TC-HP-004
     test("Verify the price of each product has a correct price format", async () => {
          await inventoryPage.verifyProductPriceFormat();
     });

     //TC-HP-005
     test("Verify the description of each product has correct details (no syntax errors)", async () => {
          // Marking as failing because the Backpack contains "carry.allTheThings()" syntax error.
          test.fail(true, "The 'Sauce Labs Backpack' is known to have an 'unknown syntax' bug in its description.");
          await inventoryPage.verifyProductDescriptionContent();
     });

     //TC-HP-006
     test("Verify Name (A to Z) sorting", async () => {
          await inventoryPage.verifyProductNameAZ();
     });

     //TC-HP-007
     test("Verify Name (Z to A) sorting", async () => {
          await inventoryPage.verifyProductNameZA();
     });

     //TC-HP-008
     test("Verify Price (low to high) sorting", async () => {
          await inventoryPage.verifyProductPriceLowToHigh();
     });

     //TC-HP-009
     test("Verify Price (high to low) sorting", async () => {
          await inventoryPage.verifyProductPriceHighToLow();
     });

     //TC-HP-010
     test("Verify sorting resets to default on page refresh", async ({ page }) => {
          // Change sorting to Price (high to low)
          await inventoryPage.verifyProductPriceHighToLow();
          // Refresh the page
          await page.reload();
          // Verify that the sort order has returned to default (Name A-Z)
          await inventoryPage.verifySortOrder('az');
     });

     //TC-HP-011
     test("Verify redirection to PDP of each product", async ({ page }) => {
          const productPage = new ProductPage(page);
          const productNames = [
               "Sauce Labs Backpack",
               "Sauce Labs Bike Light",
               "Sauce Labs Bolt T-Shirt",
               "Sauce Labs Fleece Jacket",
               "Sauce Labs Onesie",
               "Test.allTheThings() T-Shirt (Red)"
          ];

          for (const name of productNames) {
               // Click on product name
               await inventoryPage.navigateToProductByName(name);

               // Verify PDP details
               await productPage.verifyProductDetails(name);

               // Go back to inventory
               await productPage.goBackToInventory();

               // Verify back on Inventory page
               await expect(page).toHaveURL(/.*inventory.html/);
          }
     });

     //TC-HP-012
     test("Verify the functionality of add to cart button", async ({ page }) => {
          const product = "Sauce Labs Backpack";

          // Add product to cart
          await inventoryPage.addItemToCart(product);

          // Verify cart count is 1
          await inventoryPage.verifyCartCount(1);
     });

     //TC-HP-013
     test("Verify the functionality of Remove button on the inventory page", async ({ page }) => {
          const product = "Sauce Labs Backpack";

          // Add product to cart so Remove button appears
          await inventoryPage.addItemToCart(product);
          await inventoryPage.verifyCartCount(1);

          // Click Remove button
          await inventoryPage.removeItemFromCart(product);

          // Verify cart count is empty/0
          await inventoryPage.verifyCartCount(0);
     });

     //TC-HP-014
     test("Verify header logo is displayed", async () => {
          await inventoryPage.verifyHeaderLogo();
     });

     //TC-HP-015
     test("Verify no broken images", async () => {
          await inventoryPage.verifyNoBrokenImages();
     });

     //TC-HP-016
     test("Verify product images are unique", async () => {
          await inventoryPage.verifyProductImagesAreUnique();
     });

     //TC-HP-017
     test("Verify logout functionality", async () => {
          await inventoryPage.logout();
     });

     //TC-HP-018
     test("Verify burger menu labels", async () => {
          await inventoryPage.verifySideMenuLabels();
     });

     //TC-HP-019
     test("Verify 'All Items' side menu highlight and functionality", async () => {
          // The user expects the "All Items" label to be highlighted, but says it actually isn't 
          // and clicking it does nothing. This test is expected to fail.
          test.fail(true, "All items label is not highlighted and there is no action after clicking it.");
          await inventoryPage.verifyAllItemsHighlight();
     });

     //TC-HP-020
     test("Verify 'About' side menu link redirection", async ({ page }) => {
          await inventoryPage.navigateToAbout();
          
          // Verify redirection to Sauce Labs
          await expect(page).toHaveURL('https://saucelabs.com/');
     });
});
