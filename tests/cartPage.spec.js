const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { InventoryPage } = require("../pages/InventoryPage");
const { CartPage } = require("../pages/CartPage");

test.describe("Cart Page Tests", () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    const product = "Sauce Labs Backpack";

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login("standard_user", "secret_sauce");
    });

    test("Verify that a user can add an item to the cart", async ({ page }) => {
        // Add product to cart
        await inventoryPage.addItemToCart(product);

        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);

        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);

        // Navigate to Cart Page
        await inventoryPage.navigateToCart();

        // Verify Cart page displays the added product
        await cartPage.verifyProductInCart(product);
    });

    test("Verify that a user can remove an item from the cart", async ({ page }) => {
        // Add product to cart
        await inventoryPage.addItemToCart(product);
        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);
        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        // Verify Cart page displays the added product
        await cartPage.verifyProductInCart(product);
        // Remove product from cart
        await cartPage.removeItemFromCart(product);
        // Verify cart badge updates with 0 products
        await inventoryPage.verifyCartCount(0);
    });

    test("Verify that a user can proceed to checkout", async ({ page }) => {
        // Add product to cart
        await inventoryPage.addItemToCart(product);
        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);
        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        // Verify Cart page displays the added product
        await cartPage.verifyProductInCart(product);
        // Proceed to checkout
        await cartPage.checkout();
        // Verify that the user is redirected to the checkout page
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
    });

    test("Verify that a user can continue shopping from the cart page", async ({ page }) => {
        // Add product to cart
        await inventoryPage.addItemToCart(product);
        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);
        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        // Verify Cart page displays the added product
        await cartPage.verifyProductInCart(product);
        // Continue shopping
        await cartPage.continueShopping();
        // Verify that the user is redirected to the inventory page
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    test("Verify that the cart badge count updates correctly", async ({ page }) => {
        let product_2 = "Sauce Labs Bike Light";
        // Add product to cart
        await inventoryPage.addItemToCart(product);
        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);
        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        // Verify Cart page displays the added product
        await cartPage.verifyProductInCart(product);
        // Continue shopping
        await cartPage.continueShopping();
        // Verify that the user is redirected to the inventory page
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

        await inventoryPage.addItemToCart(product_2);
        await inventoryPage.verifyRemoveButton(product_2);
        await inventoryPage.verifyCartCount(2);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        await cartPage.verifyProductInCart(product_2);
        await inventoryPage.verifyCartCount(2);
    });

    test("Verify the behavior when the cart is empty", async ({ page }) => {
        test.fail(true, "Cart should display a message like 'Your cart is empty' but it does not.");
        // Add product to cart
        await inventoryPage.addItemToCart(product);
        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);
        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        await cartPage.removeItemFromCart(product);

        // Verify product is removed from cart list
        await cartPage.verifyProductRemoved(product);

        // Verify cart badge updates to 0 (hidden)
        await inventoryPage.verifyCartCount(0);

        // Verify we are still on the cart page
        await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

        // Verify "Your cart is empty" message appears
        await expect(page.locator('body')).toHaveText(/Your cart is empty/);
    });

    test("Verify that a user can add multiple items to the cart", async ({ page }) => {
        let product_2 = "Sauce Labs Bike Light";
        // Add product to cart
        await inventoryPage.addItemToCart(product);
        // Verify button changes to Remove
        await inventoryPage.verifyRemoveButton(product);
        // Verify cart badge updates
        await inventoryPage.verifyCartCount(1);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        // Verify Cart page displays the added product
        await cartPage.verifyProductInCart(product);
        // Continue shopping
        await cartPage.continueShopping();
        // Verify that the user is redirected to the inventory page
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

        await inventoryPage.addItemToCart(product_2);
        await inventoryPage.verifyRemoveButton(product_2);
        await inventoryPage.verifyCartCount(2);
        // Navigate to Cart Page
        await inventoryPage.navigateToCart();
        // Verify both products are present in the cart
        await cartPage.verifyCartItems([product, product_2]);
        await inventoryPage.verifyCartCount(2);
    });

});
