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
    headless: false,
    trace: 'on-first-retry',
  },
});
module.exports = config
