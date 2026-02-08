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

    test("Verify system behavior when adding the same item more than one", async ({ page }) => {
        // Add product to cart
        await inventoryPage.addItemToCart(product);

        // Navigate to Cart Page
        await inventoryPage.navigateToCart();

        // Verify that the user CAN increment the product quantity (Expected Behavior)
        // This assertion will fail because the feature doesn't exist yet, highlighting the gap.
        await cartPage.verifyItemQuantityIsEditable(product);

        // If the above passed (e.g. if we implemented it), we would then try:
        // await cartPage.incrementQuantity(product);
        // await cartPage.verifyProductQuantity(product, 2);
    });

    test.describe("Mobile Support Tests", () => {
        // iPhone 12/13 viewport
        test.use({ viewport: { width: 390, height: 844 } });

        test("Verify cart functionality on mobile devices", async ({ page }) => {
            // Verify layout is responsive - Hamburger menu should be visible (it is on desktop too, but critical here)
            await expect(inventoryPage.menuButton).toBeVisible();

            // Add product to cart
            await inventoryPage.addItemToCart(product);

            // Verify cart badge updates
            await inventoryPage.verifyCartCount(1);

            // Navigate to Cart Page
            await inventoryPage.navigateToCart();

            // Verify Cart page displays the added product
            await cartPage.verifyProductInCart(product);

            // Verify layout efficiency: ensure checkout button is visible without scrolling (simple check)
            await expect(cartPage.checkoutButton).toBeVisible();

            // Verify items flow correctly (width check to ensure it's not overflowing)
            const cartItemBox = await page.locator('.cart_item').first().boundingBox();
            expect(cartItemBox.width).toBeLessThan(390); // Should fit within viewport width
        });
    });

});
