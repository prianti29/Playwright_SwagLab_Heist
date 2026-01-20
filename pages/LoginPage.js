const { expect } = require('@playwright/test');

class LoginPage {
     constructor(page) {
          this.page = page;
          this.usernameInput = page.getByRole('textbox', { name: 'Username' });
          this.passwordInput = page.getByRole('textbox', { name: 'Password' });
          this.loginButton = page.locator('#login-button');
          this.loginLogo = page.locator('.login_logo');
          this.errorMessage = page.locator('[data-test="error"]');
     }

     async goto() {
          await this.page.goto('/');
     }

     async login(username, password) {
          await this.usernameInput.fill(username);
          await this.passwordInput.fill(password);

          // For glitchy users or unresponsive buttons, we can use a loop 
          // that clicks the button until the page starts to navigate or the button disappears.
          // This ensures the login action is actually triggered.
          let attempts = 0;
          while (attempts < 3) {
               await this.loginButton.click();
               try {
                    // Wait for either the button to be hidden (success) OR an error to appear (failure)
                    await Promise.race([
                         this.loginButton.waitFor({ state: 'hidden', timeout: 2000 }),
                         this.errorMessage.waitFor({ state: 'visible', timeout: 2000 })
                    ]);
                    break;
               } catch (e) {
                    attempts++;
                    console.log(`Login button still visible and no error shown, retrying click... attempt ${attempts}`);
               }
          }
     }


     async verifyLoginPageVisible() {
          await expect(this.loginLogo).toBeVisible();
     }

     async getErrorMessage() {
          return this.errorMessage;
     }
}

module.exports = { LoginPage };
