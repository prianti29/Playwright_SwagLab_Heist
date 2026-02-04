const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { InventoryPage } = require("../pages/InventoryPage");

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