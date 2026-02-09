const { expect } = require('@playwright/test');

class CheckoutPage {
     constructor(page) {
          this.page = page;
          this.firstNameInput = this.page.locator('[data-test="firstName"]');
          this.lastNameInput = this.page.locator('[data-test="lastName"]');
          this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
          this.addressInput = this.page.locator('[data-test="address"]');
          this.paymentMethodSelect = this.page.locator('[data-test="paymentMethod"]');
          this.continueButton = this.page.locator('[data-test="continue"]');
          this.cancelButton = this.page.locator('[data-test="cancel"]');
          this.errorMessage = this.page.locator('[data-test="error"]');
     }

     async fillInformation(firstName, lastName, postalCode, address = null, paymentMethod = null) {
          if (firstName !== null) await this.firstNameInput.fill(firstName);
          if (lastName !== null) await this.lastNameInput.fill(lastName);
          if (postalCode !== null) await this.postalCodeInput.fill(postalCode);
          if (address !== null) await this.addressInput.fill(address);
          if (paymentMethod !== null) await this.paymentMethodSelect.selectOption(paymentMethod);
     }

     async continue() {
          await this.continueButton.click();
     }

     async cancel() {
          await this.cancelButton.click();
     }

     async verifyErrorMessage(expectedMessage) {
          await expect(this.errorMessage).toBeVisible();
          await expect(this.errorMessage).toContainText(expectedMessage);
     }
}

module.exports = { CheckoutPage };
