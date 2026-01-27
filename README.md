# Playwright SwagLab Heist 🎭

A comprehensive end-to-end testing suite for [SauceDemo (Swag Labs)](https://www.saucedemo.com/) built with **Playwright**. This project demonstrates advanced automated testing techniques, including the Page Object Model, Visual Regression Testing, and handling of various "buggy" user personas.

## Key Features

- **Page Object Model (POM)**: Scalable and maintainable architecture separating page logic from test scripts.
- **Multi-Persona Testing**: Validates system behavior across various user types (Standard, Locked, Problem, Performance Glitch, Error, and Visual).
- **Visual Regression Testing**: Automated screenshot comparison to detect UI inconsistencies.
- **UI & Functional Audits**: Checks for broken images, asset uniqueness, and console errors.
- **Smart Selectors**: Leverages Playwright's best practices (`getByRole`, `getByTestId`).
- **CI/CD Integrated**: Automated test runs via GitHub Actions with HTML reporting.

## Project Structure

```text
Playwright_SwagLab_Heist/
├── .github/workflows/    # CI/CD Configuration (GitHub Actions)
├── pages/                # Page Object Model classes
│   ├── LoginPage.js      # Auth-related actions & locators
│   └── InventoryPage.js  # Product & Navigation actions
├── snapshots/            # Baseline images for Visual Regression
├── tests/                # E2E Test Scripts
│   └── login.spec.js     # Comprehensive login & auth tests
├── playwright.config.js  # Global Playwright settings & timeouts
├── package.json          # Project dependencies & scripts
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher (LTS recommended)
- **npm**: v8 or higher

### Installation

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

Execution commands are managed via `npm` scripts:

| Command | Description |
| :--- | :--- |
| `npm test` | Run all tests in headless mode (default). |
| `npm run test:headed` | Run tests in headed mode to see the browser. |
| `npm run test:ui` | Open Playwright UI Mode for interactive debugging. |
| `npm run test:debug` | Launch tests in Playwright Inspector for step-by-step debugging. |
| `npm run report` | View the last generated HTML test report. |

> **Note**: For Visual Regression tests, use `npx playwright test --update-snapshots` if you need to update the baseline images.

## Test Scenarios

The suite currently implements 26 test cases (**TC-LP-001** to **TC-LP-026**) covering:

- **Authentication Flows**: Valid/Invalid credentials, locked-out accounts.
- **Edge Cases**: Empty fields, case sensitivity, and incorrect passwords.
- **Buggy Personas**:
  - `problem_user`: Identifies broken images and duplicate assets.
  - `performance_glitch_user`: Measures and asserts login performance delays.
  - `error_user`: Monitors and detects browser console errors during navigation.
  - `visual_user`: Uses visual regression to detect UI distortions.

##  Troubleshooting

### Cross-Platform Snapshot Mismatch
If tests fail in GitHub Actions with a message like `A snapshot doesn't exist at ...-linux.png`, it's because Playwright requires different baseline images for different operating systems (Windows vs Linux).

**How to fix:**
1. **Download from CI**: Download the `playwright-report` from the failed GitHub Action run, extract the "Actual" images, and commit them as `-linux.png` in your snapshots folder.
2. **Use Docker**: If you have Docker installed, run:
   ```bash
   npm run test:docker -- --update-snapshots
   ```
   This will generate Linux-compatible snapshots on your Windows machine.

---
*Happy Testing.*


