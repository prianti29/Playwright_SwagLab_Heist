const { expect } = require('@playwright/test');

class CheckoutCompletePage {
     constructor(page) {
          this.page = page;
          this.completeHeader = this.page.locator('.complete-header');
          this.completeText = this.page.locator('.complete-text');
          this.backHomeButton = this.page.locator('#back-to-products');
     }

     async verifyComplete() {
          await expect(this.completeHeader).toHaveText('Thank you for your order!');
          await expect(this.completeText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
     }

     async backHome() {
          await this.backHomeButton.click();
     }
}

module.exports = { CheckoutCompletePage };
