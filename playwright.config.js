const config = ({
  testDir: './tests',
  snapshotDir: './snapshots',
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
    // Run headless in CI, but headed locally (if you prefer)
    headless: !!process.env.CI,
    trace: 'on-first-retry',
  },
});
module.exports = config
