const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { FooterPage } = require("../pages/FooterPage");
const { InventoryPage } = require("../pages/InventoryPage");
const { ProductPage } = require("../pages/ProductPage");
const { CartPage } = require("../pages/CartPage");
const { CheckoutPage } = require("../pages/CheckoutPage");
const { CheckoutOverviewPage } = require("../pages/CheckoutOverviewPage");

test.describe("Footer Page Tests", () => {
     let loginPage;
     let footerPage;

     test.beforeEach(async ({ page }) => {
          loginPage = new LoginPage(page);
          footerPage = new FooterPage(page);

          await loginPage.goto();
          await loginPage.login("standard_user", "secret_sauce");
     });

     // TC-FP-001
     test("Verify functionality of the social media icon 'Twitter'", async () => {
          await footerPage.verifyTwitterRedirection();
     });

     // TC-FP-002
     test("Verify functionality of the social media icon 'Facebook'", async () => {
          await footerPage.verifyFacebookRedirection();
     });

     test("Verify functionality of the social media icon 'LinkedIn'", async () => {
          await footerPage.verifyLinkedInRedirection();
     });

     test("Verify copyright year is current", async () => {
          await footerPage.verifyCopyrightYear();
     });

     test("Check that 'Terms of Service' and 'Privacy Policy' links are clickable and functional.", async () => {
          // Marking as failing because in SauceDemo, these are currently just static text or spans, not links.
          test.fail(true, "The 'Terms of Service' and 'Privacy Policy' texts are not hyperlinks and have no click action.");
          await footerPage.verifyTermsAndPrivacyLinks();
     });

     test("Verify footer is consistently displayed across all pages", async ({ page }) => {
          const inventoryPage = new InventoryPage(page);
          const productPage = new ProductPage(page);
          const cartPage = new CartPage(page);
          const checkoutPage = new CheckoutPage(page);
          const checkoutOverviewPage = new CheckoutOverviewPage(page);

          // 1. Inventory Page (Home)
          await footerPage.verifyFooterPresence();

          // 2. Product Detail Page
          await inventoryPage.navigateToProductByName("Sauce Labs Backpack");
          await footerPage.verifyFooterPresence();

          // 3. Cart Page
          await inventoryPage.navigateToCart();
          await footerPage.verifyFooterPresence();

          // 4. Checkout: Your Information
          await cartPage.checkout();
          await footerPage.verifyFooterPresence();

          // 5. Checkout: Overview
          await checkoutPage.fillInformation("Prianti", "Deb", "12345");
          await checkoutPage.continue();
          await footerPage.verifyFooterPresence();

          // 6. Checkout: Complete
          await checkoutOverviewPage.finish();
          await footerPage.verifyFooterPresence();
     });
});
