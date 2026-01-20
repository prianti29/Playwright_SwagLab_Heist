
/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  timeout: 40 * 1000,

  expect: {
    timeout: 40 * 1000
  },
  reporter: [
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com/',
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
  },
});
module.exports = config
