const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { FooterPage } = require("../pages/FooterPage");

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

     // TC-FP-003
     test("Verify functionality of the social media icon 'LinkedIn'", async () => {
          await footerPage.verifyLinkedInRedirection();
     });
});
