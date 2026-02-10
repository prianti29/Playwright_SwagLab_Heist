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
│   ├── InventoryPage.js  # Product & Navigation actions
│   ├── CartPage.js       # Cart verification & interaction actions
│   ├── CheckoutPage.js   # Checkout: Your Information actions
│   ├── CheckoutOverviewPage.js # Checkout: Overview actions
│   ├── CheckoutCompletePage.js # Checkout: Complete actions
│   └── FooterPage.js         # Footer & Social Media actions
├── snapshots/            # Baseline images for Visual Regression
├── tests/                # E2E Test Scripts
│   ├── login.spec.js     # Comprehensive login & auth tests
│   ├── homePage.spec.js  # Product inventory & UI audit tests
│   ├── cartPage.spec.js  # Cart management tests
│   ├── checkoutPage.spec.js # Multi-step checkout flow & edge case tests
│   └── footerPage.spec.js # Social media and footer consistency tests
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
| `npx playwright test tests/footerPage.spec.js` | Run only the footer specific tests. |

> **Note**: For Visual Regression tests, use `npx playwright test --update-snapshots` if you need to update the baseline images.

## Test Scenarios

The suite currently implements test cases covering:

- **Authentication Flows (TC-LP-001 to TC-LP-026)**: Valid/Invalid credentials, locked-out accounts, empty fields, and case sensitivity.
- **Home Page & Inventory Audits (TC-HP-001 to TC-HP-005)**:
  - **Product Name Consistency**: Verifies names follow the "Sauce Labs" prefix (Detects known Red T-Shirt bug).
  - **Description Integrity**: Scans for "unknown syntax" bugs like `carry.allTheThings()`.
  - **Pricing Checks**: Validates currency formatting and price correctness.
  - **UI Stability**: Verifies header logos, broken images, and asset uniqueness.
- **Buggy Personas**:
  - `problem_user`: Identifies broken images and duplicate assets.
  - `performance_glitch_user`: Measures and asserts login performance delays.
  - `error_user`: Monitors and detects browser console errors during navigation.
  - `visual_user`: Uses visual regression to detect UI distortions.
- **Cart & Checkout Flows**:
  - **Add/Remove Items**: Verifies cart badge updates and button state changes.
  - **Checkout Flow**: 
    - **Edge Cases**: Validates name/postal code inputs for length, special characters, and formatting.
    - **Uniqueness**: Asserts that shipment serial numbers should be unique per order.
    - **Visibility**: Verifies delivery address and payment method functionality.
    - **Calculations**: Rigorous verification of Subtotal + Tax = Total logic for multiple items.
    - **Redirection**: Validates Cancel/Finish/BackHome button behavior across all checkout steps.
    - **Validations**: Asserts that the system should prevent checkout with an empty cart.
- **Footer & Social Audits (TC-FP-001 to TC-FP-004)**:
  - **Social Redirections**: Verifies Twitter, Facebook, and LinkedIn links open the correct official pages in new tabs.
  - **Copyright Validation**: Dynamically verifies the copyright year is current.
  - **Consistency Check**: Ensures the footer is visible and identical across all major application pages.
  - **Interactive Elements**: Audits "Terms of Service" and "Privacy Policy" for functional clickability (Documents current static text bug).

## Bug Documentation (Intentionally failing tests)

Some tests in this suite are designed to **fail** to document existing system bugs and regressions:
- **Empty Cart Validation**: Currently allows purchase with 0 items.
- **Shipment Uniqueness**: Currently provides the same serial number for all orders.
- **Missing Fields**: Identifies missing "Delivery Address" and "Payment Method" inputs during checkout.
- **Edge Case Inputs**: Documents the lack of validation for special characters or excessively long strings.

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


