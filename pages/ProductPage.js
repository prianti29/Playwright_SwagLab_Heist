const { expect } = require('@playwright/test');

class ProductPage {
     constructor(page) {
          this.page = page;
          this.productName = page.locator('.inventory_details_name');
          this.productDescription = page.locator('.inventory_details_desc');
          this.productPrice = page.locator('.inventory_details_price');
          this.backToProductsButton = page.locator('#back-to-products');
     }

     async verifyProductDetails(expectedName) {
          await expect(this.productName).toBeVisible();
          if (expectedName) {
               await expect(this.productName).toHaveText(expectedName);
          }
          await expect(this.productDescription).toBeVisible();
          await expect(this.productPrice).toBeVisible();
          await expect(this.page).toHaveURL(/.*inventory-item.html\?id=\d+/);
     }

     async goBackToInventory() {
          await this.backToProductsButton.click();
     }
}

module.exports = { ProductPage };
