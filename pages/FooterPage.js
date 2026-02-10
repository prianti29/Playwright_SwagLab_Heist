const { expect } = require('@playwright/test');

class FooterPage {
     constructor(page) {
          this.page = page;
          this.twitterIcon = page.locator('.social_twitter a');
          this.facebookIcon = page.locator('.social_facebook a');
          this.linkedinIcon = page.locator('.social_linkedin a');
          this.copyrightText = page.locator('.footer_copy');
     }

     /**
      * Generic helper to verify social media redirection in a new tab.
      * @param {import('@playwright/test').Locator} locator - The locator of the social media link.
      * @param {RegExp|string} expectedUrl - The expected URL pattern.
      */
     async verifySocialRedirection(locator, expectedUrl) {
          const pagePromise = this.page.context().waitForEvent('page', { timeout: 10000 });
          await locator.click();
          const newPage = await pagePromise;

          try {
               // Use toHaveURL for built-in retries and better error reporting
               await expect(newPage).toHaveURL(expectedUrl, { timeout: 10000 });
          } finally {
               // Always close the tab even if the expectation fails
               await newPage.close();
          }
     }

     async verifyTwitterRedirection() {
          await this.verifySocialRedirection(this.twitterIcon, /.*(twitter\.com|x\.com)\/saucelabs.*/);
     }

     async verifyFacebookRedirection() {
          await this.verifySocialRedirection(this.facebookIcon, /.*facebook\.com\/saucelabs.*/);
     }

     async verifyLinkedInRedirection() {
          await this.verifySocialRedirection(this.linkedinIcon, /.*linkedin\.com\/company\/sauce-labs.*/);
     }
}

module.exports = { FooterPage };
