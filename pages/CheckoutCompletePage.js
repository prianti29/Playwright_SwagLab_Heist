const { expect } = require('@playwright/test');

class CheckoutCompletePage {
     constructor(page) {
          this.page = page;
          this.completeHeader = this.page.locator('.complete-header');
          this.backHomeButton = this.page.locator('#back-to-products');
     }

     async verifyComplete() {
          await expect(this.completeHeader).toHaveText('Thank you for your order!');
     }

     async backHome() {
          await this.backHomeButton.click();
     }
}

module.exports = { CheckoutCompletePage };
