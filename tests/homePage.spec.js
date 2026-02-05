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
          // 1. Change sorting to Price (high to low)
          await inventoryPage.verifyProductPriceHighToLow();
          // 2. Refresh the page
          await page.reload();
          // 3. Verify that the sort order has returned to default (Name A-Z)
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
               // 1. Click on product name
               await inventoryPage.navigateToProductByName(name);

               // 2. Verify PDP details
               await productPage.verifyProductDetails(name);

               // 3. Go back to inventory
               await productPage.goBackToInventory();

               // 4. Verify back on Inventory page
               await expect(page).toHaveURL(/.*inventory.html/);
          }
     });


     // //TC-HP-049
     // test("Verify header logo is displayed", async () => {
     //      await inventoryPage.verifyHeaderLogo();
     // });

     // //TC-HP-050
     // test("Verify no broken images", async () => {
     //      await inventoryPage.verifyNoBrokenImages();
     // });

     // //TC-HP-051
     // test("Verify product images are unique", async () => {
     //      await inventoryPage.verifyProductImagesAreUnique();
     // });
});