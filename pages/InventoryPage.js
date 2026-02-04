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

     // Verifies the names of all products on the inventory page.
     async verifyProductName() {
          const expectedNames = [
               "Sauce Labs Backpack",
               "Sauce Labs Bike Light",
               "Sauce Labs Bolt T-Shirt",
               "Sauce Labs Fleece Jacket",
               "Sauce Labs Onesie",
               "Test.allTheThings() T-Shirt (Red)"
          ];

          const productElements = this.page.locator('.inventory_item_name');
          const count = await productElements.count();

          expect(count, `Expected ${expectedNames.length} products, but found ${count}`).toBe(expectedNames.length);

          for (let i = 0; i < count; i++) {
               const actualName = await productElements.nth(i).innerText();
               expect(actualName).toBe(expectedNames[i]);
          }
     }

     // Verifies that product names follow the "Sauce Labs [Name]" format.
     async verifyProductNameFormat() {
          const productElements = this.page.locator('.inventory_item_name');
          const productNames = await productElements.allTextContents();

          // Strict check: every product must start with "Sauce Labs "
          const mismatchedNames = productNames.filter(name => !name.startsWith("Sauce Labs "));

          expect(mismatchedNames, `Found products that do not follow the "Sauce Labs" format: ${mismatchedNames.join(', ')}`).toHaveLength(0);
     }

     // Verifies that each product has a non-empty description.
     async verifyProductDescriptions() {
          const descriptions = this.page.locator('.inventory_item_desc');
          const count = await descriptions.count();

          for (let i = 0; i < count; i++) {
               const text = await descriptions.nth(i).innerText();
               expect(text.length).toBeGreaterThan(0);
          }
     }
     async verifyProductPriceFormat() {
          const prices = this.page.locator('.inventory_item_price');
          const count = await prices.count();

          for (let i = 0; i < count; i++) {
               const text = await prices.nth(i).innerText();
               expect(text).toMatch(/^\$\d+\.\d{2}$/);
          }
     }

     // Verifies that product descriptions do not contain code-like syntax (e.g., carry.allTheThings())
     async verifyProductDescriptionContent() {
          const productItems = this.page.locator('.inventory_item');
          const count = await productItems.count();

          for (let i = 0; i < count; i++) {
               const name = await productItems.nth(i).locator('.inventory_item_name').innerText();
               const description = await productItems.nth(i).locator('.inventory_item_desc').innerText();

               // The "Sauce Labs Backpack" is known to have the "carry.allTheThings()" syntax bug
               expect(description, `Product "${name}" has invalid syntax in its description: "${description}"`).not.toContain('carry.allTheThings()');
          }
     }

     // Verifies that products are sorted alphabetically (A-Z)
     async verifyProductNameAZ() {
          // Select 'Name (A to Z)' just in case it's not default (value is 'az')
          await this.page.selectOption('.product_sort_container', 'az');

          const productElements = this.page.locator('.inventory_item_name');
          const productNames = await productElements.allTextContents();

          // Create a sorted copy of the names
          const sortedNames = [...productNames].sort();

          expect(productNames, "Products should be sorted alphabetically in ascending order (A-Z)").toEqual(sortedNames);
     }
}

module.exports = { InventoryPage };
