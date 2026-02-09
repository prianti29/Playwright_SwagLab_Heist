const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { InventoryPage } = require("../pages/InventoryPage");
const { CartPage } = require("../pages/CartPage");
const { CheckoutPage } = require("../pages/CheckoutPage");
const { CheckoutOverviewPage } = require("../pages/CheckoutOverviewPage");
const { CheckoutCompletePage } = require("../pages/CheckoutCompletePage");




test.describe("Checkout Page Tests", () => {
     let loginPage;
     let inventoryPage;
     let cartPage;
     let checkoutPage;
     let checkoutOverviewPage;
     let checkoutCompletePage;



     const product = "Sauce Labs Backpack";

     test.beforeEach(async ({ page }) => {
          loginPage = new LoginPage(page);
          inventoryPage = new InventoryPage(page);
          cartPage = new CartPage(page);
          checkoutPage = new CheckoutPage(page);
          checkoutOverviewPage = new CheckoutOverviewPage(page);
          checkoutCompletePage = new CheckoutCompletePage(page);


          await loginPage.goto();
          await loginPage.login("standard_user", "secret_sauce");
     });

     test("Verify that a user can checkout with valid information", async ({ page }) => {
          // Add product to cart
          await inventoryPage.addItemToCart(product);
          // Verify button changes to Remove
          await inventoryPage.verifyRemoveButton(product);
          // Navigate to Cart Page
          await inventoryPage.navigateToCart();
          // Verify Cart page displays the added product
          await cartPage.verifyProductInCart(product);
          // Proceed to checkout
          await cartPage.checkout();
          // Verify that the user is redirected to the checkout page
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
     });


     test("Register in Checkout: Your Information page using valid inputs", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.verifyRemoveButton(product);
          await inventoryPage.navigateToCart();
          await cartPage.verifyProductInCart(product);
          await cartPage.checkout();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          //Input valid information
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
     });

     test("Register in Checkout: Your Information page  without filling mandatory fields", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.verifyRemoveButton(product);
          await inventoryPage.navigateToCart();
          await cartPage.verifyProductInCart(product);
          await cartPage.checkout();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          await checkoutPage.continue();
          await checkoutPage.verifyErrorMessage("Error: First Name is required");
     });

     test("Register in Checkout: Your Information page using edge cases inputs", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();

          const edgeCases = [
               { firstName: 'A'.repeat(100), lastName: 'B'.repeat(100), postalCode: '9'.repeat(20), expectedError: 'Error: First Name too long', description: 'Very long strings' },
               { firstName: '!@#$%^&*()', lastName: '+=[]{}|;:', postalCode: '!@#$%', expectedError: 'Error: Invalid characters', description: 'Special characters' },
               { firstName: '   John   ', lastName: '   Doe   ', postalCode: '   12345   ', expectedError: 'Error: Invalid spaces', description: 'Leading/trailing spaces' },
               { firstName: '12345', lastName: '67890', postalCode: 'ABCDE', expectedError: 'Error: Invalid format', description: 'Numbers in names and letters in postal code' }
          ];

          for (const data of edgeCases) {
               await checkoutPage.fillInformation(data.firstName, data.lastName, data.postalCode);
               await checkoutPage.continue();

               // Asserting EXPECTED result: Error message should be visible and NO navigation
               await checkoutPage.verifyErrorMessage(data.expectedError);
               await expect(page, `Should not proceed to step two for ${data.description}`).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

               // Clear inputs for next iteration since we didn't navigate away
               await page.locator('[data-test="firstName"]').clear();
               await page.locator('[data-test="lastName"]').clear();
               await page.locator('[data-test="postalCode"]').clear();
          }
     });

     test("verify canel button functionality in Checkout: Your Information page [clickable,redirection]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          await checkoutPage.cancel();
          await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
     });

     test("Verify only selected items appear in checkout overview page and correct item[no,name,price]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

          // Validation: Only selected items should be displayed correctly [no, name, price]
          await checkoutOverviewPage.verifyNoOfItems(1);
          await checkoutOverviewPage.verifyProductInOverview(product, "$29.99");
          await checkoutOverviewPage.verifySubtotal("29.99");
     });


     test("verify that shipment serial number change when make a second order compared to the previous one", async ({ page }) => {
          // --- Order 1 ---
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();

          const shippingInfo1 = await checkoutOverviewPage.getShippingInfo();
          await checkoutOverviewPage.finish();
          await checkoutCompletePage.verifyComplete();
          await checkoutCompletePage.backHome();

          // --- Order 2 ---
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('Jane', 'Doe', '54321');
          await checkoutPage.continue();

          const shippingInfo2 = await checkoutOverviewPage.getShippingInfo();

          // Assertion: Shipping info (serial number) should be different
          // Note: In SauceDemo, this will fail because it's always "FREE PONY EXPRESS DELIVERY!"
          expect(shippingInfo1, "Order 1 shipping info should not be empty").not.toBe('');
          expect(shippingInfo2, "Order 2 shipping info should not be empty").not.toBe('');
          expect(shippingInfo1, `Shipment serial numbers should be different. Record 1: "${shippingInfo1}", Record 2: "${shippingInfo2}"`).not.toBe(shippingInfo2);
     });

     test("verify delivery address functionality [input, visibility]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          const address = "123 Main St, Springfield";

          // This is expected to fail because the 'address' input field is missing in the actual system
          await checkoutPage.fillInformation('John', 'Doe', '12345', address);
          await checkoutPage.continue();

          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

          // This is also expected to fail as the address won't be visible in the overview
          await checkoutOverviewPage.verifyAddress(address);
     });

     test("verify payment method functionality [selection, visibility]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          const paymentMethod = "Visa ending in 1234";

          // This is expected to fail because there is no 'paymentMethod' selection in the actual system
          await checkoutPage.fillInformation('John', 'Doe', '12345', null, paymentMethod);
          await checkoutPage.continue();

          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

          // This will likely fail to match the specific selected method as the system hardcodes it
          await checkoutOverviewPage.verifyPaymentMethod(paymentMethod);
     });

     test("Verify total price calculation [Subtotal + Tax = Total] for multiple items", async ({ page }) => {
          const products = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];

          for (const p of products) {
               await inventoryPage.addItemToCart(p);
          }
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();

          // Prices: Backpack ($29.99) + Bike Light ($9.99) = $39.98
          // Tax: 8% of 39.98 = $3.20
          // Total: 39.98 + 3.20 = $43.18
          await checkoutOverviewPage.verifyNoOfItems(2);
          await checkoutOverviewPage.verifySubtotal("39.98");
          await checkoutOverviewPage.verifyTax("3.20");
          await checkoutOverviewPage.verifyTotal("43.18");
     });

     test("verify cancel button functionality in checkout overview page [clickable, redirection]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

          await checkoutOverviewPage.cancel();
          await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
     });

     test("verify finish button functionality in checkout overview page [clickable, redirection]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

          await checkoutOverviewPage.finish();
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
          await checkoutCompletePage.verifyComplete();
     });

     test("verify success message in checkout complete page", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();
          await checkoutOverviewPage.finish();

          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
          await checkoutCompletePage.verifyComplete();
     });

     test("verify backhome button functionality in checkout complete page [clickable, redirection]", async ({ page }) => {
          await inventoryPage.addItemToCart(product);
          await inventoryPage.navigateToCart();
          await cartPage.checkout();
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();
          await checkoutOverviewPage.finish();

          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
          await checkoutCompletePage.backHome();
          await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
     });

     test("Verify user cannot proceed to final checkout without adding an item [Empty Cart Validation]", async ({ page }) => {
          // Navigate to Cart without adding any items
          await inventoryPage.navigateToCart();
          await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

          // Expected: Checkout button should be disabled or an error should be shown
          // Actual: It is enabled and allows proceeding
          await cartPage.checkout();

          // If the system allows proceeding, we'll reach step-one
          await expect(page, "Should not be allowed to proceed to information step with empty cart").not.toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

          // Alternatively, if we fill info and reach overview:
          await checkoutPage.fillInformation('John', 'Doe', '12345');
          await checkoutPage.continue();

          await expect(page, "Should not be allowed to reach overview with empty cart").not.toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

          // Verify that finish button is not functional or items are required
          await checkoutOverviewPage.finish();

          // Expected: Should not reach completion page
          await expect(page, "Order should not be completed with empty cart").not.toHaveURL("https://www.saucedemo.com/checkout-complete.html");
     });
});








