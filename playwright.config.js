const config = ({
  testDir: './tests',
  snapshotDir: './snapshots',
  timeout: 40 * 1000,

  expect: {
    timeout: 40 * 1000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05, // Allow up to 5% pixel difference
      threshold: 0.2,          // Sensitivty to color changes
      animations: 'disabled',  // Stop animations before taking screenshot
    }
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
