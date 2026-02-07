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

    // async verifyProductQuantity(productName, expectedQuantity) {
    //     const product = this.cartItem.filter({ hasText: productName });
    //     const quantity = await product.locator('.cart_quantity').textContent();
    //     await expect(quantity).toBe(expectedQuantity);
    // }

    // async verifyProductPrice(productName, expectedPrice) {
    //     const product = this.cartItem.filter({ hasText: productName });
    //     const price = await product.locator('.cart_item_price').textContent();
    //     await expect(price).toBe(expectedPrice);
    // }

    // async verifyProductDescription(productName, expectedDescription) {
    //     const product = this.cartItem.filter({ hasText: productName });
    //     const description = await product.locator('.cart_item_desc').textContent();
    //     await expect(description).toBe(expectedDescription);
    // }

    // async verifyProductImage(productName, expectedImage) {
    //     const product = this.cartItem.filter({ hasText: productName });
    //     const image = await product.locator('.cart_item_img').getAttribute('src');
    //     await expect(image).toBe(expectedImage);
    // }

    // async verifyProductTotal(productName, expectedTotal) {
    //     const product = this.cartItem.filter({ hasText: productName });
    //     const total = await product.locator('.cart_item_price').textContent();
    //     await expect(total).toBe(expectedTotal);
    // }

    // async verifyProductInCart(productName) {
    //     const product = this.cartItem.filter({ hasText: productName });
    //     await expect(product).toBeVisible();
    // }
}

module.exports = { CartPage };
