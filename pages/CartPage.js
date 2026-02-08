const { expect } = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItem = this.page.locator('.cart_item');
        this.checkoutButton = this.page.locator('#checkout');
        this.continueShoppingButton = this.page.locator('#continue-shopping');
    }

    async verifyProductInCart(productName) {
        const product = this.cartItem.filter({ hasText: productName });
        await expect(product).toBeVisible();
        await expect(product.locator('.inventory_item_name')).toHaveText(productName);
    }

    async verifyCartItems(productNames) {
        const items = this.cartItem.locator('.inventory_item_name');
        await expect(items).toHaveText(productNames);
    }

    async verifyRemoveButton(productName) {
        const product = this.cartItem.filter({ hasText: productName });
        await expect(product.locator('#remove-button')).toBeVisible();
    }

    async removeItemFromCart(productName) {
        const product = this.cartItem.filter({ hasText: productName });
        await product.locator('button[id^="remove"]').click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async verifyProductQuantity(productName, expectedQuantity) {
        const product = this.cartItem.filter({ hasText: productName });
        const quantity = await product.locator('.cart_quantity').textContent();
        await expect(quantity).toBe(expectedQuantity.toString());
    }

    async verifyItemQuantityReadOnly(productName) {
        const product = this.cartItem.filter({ hasText: productName });
        const quantityElement = product.locator('.cart_quantity');

        // Verify the element exists
        await expect(quantityElement).toBeVisible();

        // Verify it is not an input field
        const tagName = await quantityElement.evaluate(el => el.tagName.toLowerCase());
        expect(tagName, "Quantity should not be an input field").not.toBe('input');

        // Verify there are no obvious increment buttons/controls inside the cart item
        const hasIncrementButton = await product.getByRole('button', { name: '+' }).count() > 0 ||
            await product.getByRole('button', { name: 'plus' }).count() > 0;
        expect(hasIncrementButton, "Increment button should not exist").toBe(false);
    }

    // Verifies that the item quantity IS editable (Expected Behavior)
    async verifyItemQuantityIsEditable(productName) {
        const product = this.cartItem.filter({ hasText: productName });
        const quantityElement = product.locator('.cart_quantity');

        // Check if it's an input field or has increment buttons
        const tagName = await quantityElement.evaluate(el => el.tagName.toLowerCase());

        // We assert true to fail if it's not an input.
        // Or we could check for an increment button.
        // Since we want to verify "Quantity should be increased", valid generic checks are:
        // 1. Is it an input?
        // 2. Are there buttons?

        const hasIncrementButton = await product.locator('button').filter({ hasText: '+' }).count() > 0;

        expect(tagName === 'input' || hasIncrementButton,
            `Expected product "${productName}" to have editable quantity (input field or '+' button), but found read-only "${tagName}" and no buttons.`
        ).toBe(true);
    }
}

module.exports = { CartPage };
