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
}

module.exports = { InventoryPage };
