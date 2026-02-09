const { expect } = require('@playwright/test');

class CheckoutOverviewPage {
     constructor(page) {
          this.page = page;
          this.cartItem = this.page.locator('.cart_item');
          this.finishButton = this.page.locator('#finish');
          this.cancelButton = this.page.locator('#cancel');
          this.subtotalLabel = this.page.locator('.summary_subtotal_label');
          this.taxLabel = this.page.locator('.summary_tax_label');
          this.totalLabel = this.page.locator('.summary_total_label');
          this.shippingInfoLabel = this.page.locator('.summary_value_label').nth(1);
          this.paymentInfoLabel = this.page.locator('.summary_value_label').nth(0); // This is usually where "SauceCard #31337" is
          this.deliveryAddressLabel = this.page.locator('.summary_value_label').nth(2); // Assuming it would be the 3rd summary value
     }

     async getShippingInfo() {
          return await this.shippingInfoLabel.innerText();
     }

     async verifyPaymentMethod(expectedPaymentMethod) {
          await expect(this.paymentInfoLabel).toBeVisible();
          await expect(this.paymentInfoLabel).toContainText(expectedPaymentMethod);
     }

     async verifyAddress(expectedAddress) {
          await expect(this.deliveryAddressLabel).toBeVisible();
          await expect(this.deliveryAddressLabel).toContainText(expectedAddress);
     }


     async verifyProductInOverview(productName, expectedPrice) {
          const product = this.cartItem.filter({ hasText: productName });
          await expect(product).toBeVisible();
          await expect(product.locator('.inventory_item_name')).toHaveText(productName);
          if (expectedPrice) {
               await expect(product.locator('.inventory_item_price')).toHaveText(expectedPrice);
          }
     }

     async verifyNoOfItems(count) {
          await expect(this.cartItem).toHaveCount(count);
     }

     async verifySubtotal(expectedSubtotal) {
          await expect(this.subtotalLabel).toContainText(`Item total: $${expectedSubtotal}`);
     }

     async verifyTax(expectedTax) {
          await expect(this.taxLabel).toContainText(`Tax: $${expectedTax}`);
     }

     async verifyTotal(expectedTotal) {
          await expect(this.totalLabel).toContainText(`Total: $${expectedTotal}`);
     }

     async finish() {
          await this.finishButton.click();
     }

     async cancel() {
          await this.cancelButton.click();
     }
}

module.exports = { CheckoutOverviewPage };
