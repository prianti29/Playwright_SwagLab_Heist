# Playwright SwagLab Heist 

A robust end-to-end testing suite for [SauceDemo (Swag Labs)](https://www.saucedemo.com/) built with **Playwright**. This project demonstrates automated testing of common e-commerce flows, including authentication and error handling.

##  Features

- **Cross-browser Testing**: Configured for Chromium (easily extensible to Firefox/WebKit).
- **Page Object Model Ready**: Structured for scalability (see `tests/`).
- **CI/CD Integration**: Automated test runs via GitHub Actions.
- **Rich Reporting**: HTML reports generated for every test run.
- **Smart Selectors**: Uses Playwright's best practices (`getByRole`, `getByTestId`).

## 🛠 Project Structure

```text
Playwright_SwagLab_Heist/
├── .github/workflows/    # CI/CD Configuration
├── tests/               # E2E Test Scripts
│   └── login.spec.js    # Login flow tests
├── playwright.config.js # Playwright Settings
├── package.json         # Dependencies and Scripts
└── README.md            # You are here!
```

##  Prerequisites

- **Node.js**: v18 or higher (LTS recommended)
- **npm**: v8 or higher

##  Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prianti29/Playwright_SwagLab_Heist.git
   cd Playwright_SwagLab_Heist
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

Execution commands are simplified via `npm` scripts:

| Command | Description |
| :--- | :--- |
| `npm test` | Run all tests in headless mode (default). |
| `npm run test:headed` | Run tests in headed mode to see the browser. |
| `npm run test:ui` | Open Playwright UI Mode for interactive debugging. |
| `npm run test:debug` | Launch tests in Playwright Inspector for step-by-step debugging. |
| `npm run report` | View the last generated HTML test report. |

##  GitHub Actions

The project includes a `.github/workflows/playwright.yml` file which automatically:
- Runs all tests on every `push` or `pull_request` to `main` or `master`.
- Uploads the HTML report as an artifact for 30 days.

##  Test Scenarios

Currently implemented:
- **Locked Out User**: Verifies that users with locked accounts see the correct error message.
- *(More to come...)*

##  Contribution

Feel free to fork this project and submit a PR for additional test scenarios!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Happy Testing!* 🎭

