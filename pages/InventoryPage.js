const { expect } = require('@playwright/test');

class InventoryPage {
     constructor(page) {
          this.page = page;
          this.headerLogo = page.locator('div.app_logo');
          this.menuButton = page.getByRole('button', { name: 'Open Menu' });
          this.logoutLink = page.getByRole('link', { name: 'Logout' });
          this.allItemsLink = page.getByRole('link', { name: 'All Items' });
          this.aboutLink = page.getByRole('link', { name: 'About' });
          this.resetAppStateLink = page.getByRole('link', { name: 'Reset App State' });
          this.cartBadge = page.locator('.shopping_cart_badge');
          this.cartLink = page.locator('.shopping_cart_link');
     }

     async verifyHeaderLogo() {
          await expect(this.headerLogo).toHaveText('Swag Labs');
     }

     async logout() {
          await this.menuButton.click();
          await this.logoutLink.click();
     }
     // Verifies that all images on the page have loaded correctly.
     // A broken image will have a naturalWidth of 0.
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


     // Verifies that product images are unique. 
     // problem_user often has the same image for all products.
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

     // Verifies that products are sorted alphabetically (Z-A)
     async verifyProductNameZA() {
          // Select 'Name (Z to A)' just in case it's not default (value is 'za')
          await this.page.selectOption('.product_sort_container', 'za');

          const productElements = this.page.locator('.inventory_item_name');
          const productNames = await productElements.allTextContents();

          // Create a sorted copy of the names
          const sortedNames = [...productNames].sort().reverse();

          expect(productNames, "Products should be sorted alphabetically in descending order (Z-A)").toEqual(sortedNames);
     }

     // Verifies that products are sorted by price (low to high)
     async verifyProductPriceLowToHigh() {
          // Select 'Price (low to high)' just in case it's not default (value is 'lohi')
          await this.page.selectOption('.product_sort_container', 'lohi');

          const productElements = this.page.locator('.inventory_item_price');
          const productPrices = await productElements.allTextContents();

          // Create a sorted copy of the prices
          const sortedPrices = [...productPrices].sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')));

          expect(productPrices, "Products should be sorted by price in ascending order (low to high)").toEqual(sortedPrices);
     }

     // Verifies that products are sorted by price (high to low)
     async verifyProductPriceHighToLow() {
          // Select 'Price (high to low)' just in case it's not default (value is 'hilo')
          await this.page.selectOption('.product_sort_container', 'hilo');

          const productElements = this.page.locator('.inventory_item_price');
          const productPrices = await productElements.allTextContents();

          // Create a sorted copy of the prices
          const sortedPrices = [...productPrices].sort((a, b) => parseFloat(b.replace('$', '')) - parseFloat(a.replace('$', '')));

          expect(productPrices, "Products should be sorted by price in descending order (high to low)").toEqual(sortedPrices);
     }

     async getSortOption() {
          return await this.page.locator('.product_sort_container').inputValue();
     }

     /*
      * Verifies that the products are sorted according to the selected option.
      * This method checks both the dropdown value and the actual order of items on the page.
      * @param {string} expectedOption - The sort option value ('az', 'za', 'lohi', 'hilo')
      */
     async verifySortOrder(expectedOption) {
          // Check if the sorting dropdown shows the expected option
          const currentOption = await this.getSortOption();
          expect(currentOption).toBe(expectedOption);

          // Verify Name-based sorting (A-Z or Z-A)
          if (expectedOption === 'az' || expectedOption === 'za') {
               const productElements = this.page.locator('.inventory_item_name');
               const productNames = await productElements.allTextContents();

               // Create the expected order by sorting the actual names alphabetically
               let expectedNames = [...productNames].sort();
               if (expectedOption === 'za') expectedNames.reverse();

               expect(productNames, `Products should be sorted by name (${expectedOption})`).toEqual(expectedNames);

               // Verify Price-based sorting (Low-to-High or High-to-Low)
          } else if (expectedOption === 'lohi' || expectedOption === 'hilo') {
               const productElements = this.page.locator('.inventory_item_price');
               const productPrices = await productElements.allTextContents();

               // Create the expected order by parsing prices as floats and sorting them numerically
               let expectedPrices = [...productPrices].sort((a, b) => {
                    const priceA = parseFloat(a.replace('$', ''));
                    const priceB = parseFloat(b.replace('$', ''));
                    return expectedOption === 'lohi' ? priceA - priceB : priceB - priceA;
               });

               expect(productPrices, `Products should be sorted by price (${expectedOption})`).toEqual(expectedPrices);
          }
     }

     // Navigates to a product's detail page by clicking on its name.
     // name - The name of the product to click.
     async navigateToProductByName(name) {
          await this.page.locator('.inventory_item_name', { hasText: name }).click();
     }


     // Adds a product to the cart by its name.
     // name - The name of the product.
     async addItemToCart(name) {
          const productContainer = this.page.locator('.inventory_item', { hasText: name });
          await productContainer.locator('button[id^="add-to-cart"]').click();
     }

     // Removes a product from the cart by its name.
     // name - The name of the product.
     async removeItemFromCart(name) {
          const productContainer = this.page.locator('.inventory_item', { hasText: name });
          await productContainer.locator('button[id^="remove"]').click();
     }

     // Verifies the number shown on the cart badge.
     // count - The expected count (as a string).
     async verifyCartCount(count) {
          if (count === '0' || count === 0) {
               await expect(this.cartBadge).not.toBeVisible();
          } else {
               await expect(this.cartBadge).toHaveText(count.toString());
          }
     }

     // Opens the side menu and verifies the presence of all expected labels.
     async verifySideMenuLabels() {
          await this.menuButton.click();

          await expect(this.allItemsLink).toBeVisible();
          await expect(this.allItemsLink).toHaveText('All Items');

          await expect(this.aboutLink).toBeVisible();
          await expect(this.aboutLink).toHaveText('About');

          await expect(this.logoutLink).toBeVisible();
          await expect(this.logoutLink).toHaveText('Logout');

          await expect(this.resetAppStateLink).toBeVisible();
          await expect(this.resetAppStateLink).toHaveText('Reset App State');
     }

     // Opens the side menu, clicks "All Items", and verifies it is highlighted and functional.
     async verifyAllItemsHighlight() {
          await this.menuButton.click();

          // Wait for menu to be visible
          await expect(this.allItemsLink).toBeVisible();

          // Capture initial style to compare later
          const initialStyle = await this.allItemsLink.evaluate(el => {
               const style = window.getComputedStyle(el);
               return {
                    color: style.color,
                    fontWeight: style.fontWeight,
                    backgroundColor: style.backgroundColor
               };
          });

          // Click "All Items"
          await this.allItemsLink.click();

          // According to the user, the expected result is that it should be highlighted.
          // Since the actual result is "not highlighted", we check if the style changed at all.
          const finalStyle = await this.allItemsLink.evaluate(el => {
               const style = window.getComputedStyle(el);
               return {
                    color: style.color,
                    fontWeight: style.fontWeight,
                    backgroundColor: style.backgroundColor
               };
          });

          // We expect the style (color, font weight, etc.) to change if it's highlighted.
          // This assertion will fail if the styles are identical, confirming it's "not highlighted".
          expect(finalStyle, "All Items label should be highlighted (style change) when selected").not.toEqual(initialStyle);

          // Also verify that the menu has closed (action happened)
          // Using a shorter timeout (2s) so the test fails quickly instead of the 40s default.
          await expect(this.allItemsLink).not.toBeVisible({ timeout: 2000 });
     }

     // Opens the side menu and clicks on the "About" link.
     async navigateToAbout() {
          await this.menuButton.click();
          await expect(this.aboutLink).toBeVisible();
          await this.aboutLink.click();
     }

     // Opens the side menu and clicks on the "Logout" link.
     async navigateToLogout() {
          await this.menuButton.click();
          await expect(this.logoutLink).toBeVisible();
          await this.logoutLink.click();
     }

     // Opens the side menu and clicks on the "Reset App State" link.
     async navigateToResetAppState() {
          await this.menuButton.click();
          await expect(this.resetAppStateLink).toBeVisible();
          await this.resetAppStateLink.click();
     }

     // High-level verification of the Reset App State functionality.
     async verifyResetAppState() {
          // 1. Setup: Change state if it's not already changed
          const currentCount = await this.cartBadge.count();
          if (currentCount === 0) {
               await this.addItemToCart("Sauce Labs Backpack");
          }
          await this.verifyProductPriceHighToLow();

          await expect(this.cartBadge).toBeVisible();

          // 2. Action: Reset
          await this.navigateToResetAppState();
          await this.page.reload(); // Force UI refresh

          // 3. Validation: Assert defaults
          await this.verifyCartCount(0);
          await this.verifySortOrder('az');
     }

     // Verifies the cart icon is functional (appears when items are added).
     async verifyCartIcon() {
          // The main cart container/link should always be visible
          await expect(this.cartLink).toBeVisible();

          // When cart is empty, the badge should NOT exist
          await expect(this.cartBadge).not.toBeVisible();

          // Add an item to make the badge appear
          await this.addItemToCart("Sauce Labs Backpack");
          await expect(this.cartBadge).toBeVisible();
          await expect(this.cartBadge).toHaveText('1');

          // Cleanup: Remove the item
          await this.removeItemFromCart("Sauce Labs Backpack");
          await expect(this.cartBadge).not.toBeVisible();
     }
     // Verifies that the 'Add to cart' button has changed to 'Remove' for a specific product
     async verifyRemoveButton(name) {
          const productContainer = this.page.locator('.inventory_item', { hasText: name });
          await expect(productContainer.locator('button[id^="remove"]')).toBeVisible();
          await expect(productContainer.locator('button[id^="remove"]')).toHaveText('Remove');
     }

     // Navigates to the cart page
     async navigateToCart() {
          await this.cartLink.click();
     }
}

module.exports = { InventoryPage };
