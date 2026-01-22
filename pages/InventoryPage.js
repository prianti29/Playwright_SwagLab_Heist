const { expect } = require('@playwright/test');

class InventoryPage {
     constructor(page) {
          this.page = page;
          this.headerLogo = page.locator('div.app_logo');
          this.menuButton = page.getByRole('button', { name: 'Open Menu' });
          this.logoutLink = page.getByRole('link', { name: 'Logout' });
     }

     async verifyHeaderLogo() {
          await expect(this.headerLogo).toHaveText('Swag Labs');
     }

     async logout() {
          await this.menuButton.click();
          await this.logoutLink.click();
     }


     //   Verifies that all images on the page have loaded correctly.
     //   A broken image will have a naturalWidth of 0.

     async verifyNoBrokenImages() {
          const images = this.page.locator('img');
          const allImages = await images.all();

          for (const img of allImages) {
               const isBroken = await img.evaluate((node) => {
                    return !node.complete || (typeof node.naturalWidth !== 'undefined' && node.naturalWidth === 0);
               });
               expect(isBroken, `Image with src "${await img.getAttribute('src')}" matches as broken`).toBe(false);
          }
     }


     //   Verifies that product images are unique. 
     //   problem_user often has the same image for all products.

     async verifyProductImagesAreUnique() {
          const productImages = this.page.locator('.inventory_item_img img');
          const srcs = await productImages.evaluateAll(imgs => imgs.map(img => img.src));
          const uniqueSrcs = new Set(srcs);

          expect(uniqueSrcs.size, `Found ${uniqueSrcs.size} unique images for ${srcs.length} products. Is this the problem_user bug?`).toBe(srcs.length);
     }
}

module.exports = { InventoryPage };
