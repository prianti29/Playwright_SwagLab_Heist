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
     test("Verify the name of each product of each product have a correct description", async () => {
          await inventoryPage.verifyProductNameFormat();
     });

     //TC-HP-002
     test("Verify the product name formatting follows 'Sauce Labs' prefix", async () => {
          await inventoryPage.verifyProductNameFormat();
     });

     //TC-HP-003
     test("Verify each product has a correct description", async () => {
          await inventoryPage.verifyProductDescriptions();
     });

     //TC-HP-004
     test("verify the price of each product of each product have a correct price format", async () => {
          await inventoryPage.verifyProductPriceFormat();
     });

     //TC-HP-005
     test("verify the description of each product of each product have a correct details", async () => {
          await inventoryPage.verifyProductPriceFormat();
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