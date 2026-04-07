# FashionHub Test Automation

This project contains automated tests for the FashionHub application using Playwright.

## Prerequisites

- **Node.js** 16+ and npm
- A `.env` file with test credentials (see Configuration below)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fashionhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the project root with your test credentials:

```env
USER_NAME=<your_user>
PASSWORD=<your-password>
```

### Environment Selection

The project supports three environments:

- **Local**: `http://localhost:4000/fashionhub/`
- **Staging**: `https://staging-env/fashionhub/`
- **Production**: `https://pocketaces2.github.io/fashionhub/`

Production is the default environment. To run tests against a different environment, set the `PLAYWRIGHT_ENV` variable:

```bash
PLAYWRIGHT_ENV=local npx playwright test
PLAYWRIGHT_ENV=staging npx playwright test
PLAYWRIGHT_ENV=production npx playwright test
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests on a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests in a specific environment
```bash
PLAYWRIGHT_ENV=local npx playwright test
PLAYWRIGHT_ENV=staging npx playwright test
```

### Run a specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Run tests in debug/headed mode
```bash
npx playwright test --headed
npx playwright test --debug
```

### View test results
After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Project Structure

```
fashionhub/
├── page-objects/         # Page Object Model classes
│   ├── login.page.ts    # Login page interactions
│   └── account.page.ts  # Account/dashboard page
├── tests/
│   └── login.spec.ts    # Login test scenarios
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies
├── .env                 # Environment variables (credentials)
└── README.md           # This file
```

## Test Structure

Tests follow the Page Object Model (POM) pattern for better maintainability:

- **Page Objects** (`page-objects/`): Encapsulate selectors and interactions for each page
- **Test Specs** (`tests/`): Define test scenarios and assertions

Example test run:
```typescript
test('Successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  
  await loginPage.login('demouser', 'fashion123');
  await expect(accountPage.welcomeMessage).toHaveText('Welcome, demouser!');
});
```

## CI/CD

### GitHub Actions

The project includes GitHub Actions workflow for automated testing. Tests run on the production environment by default.

### Jenkins

This project includes a `Jenkinsfile` for running tests in Jenkins. 

#### Setup

1. Create a new **Pipeline** job in Jenkins
2. Configure the job to use **Pipeline script from SCM**
3. Point to your repository and select the `Jenkinsfile`
4. Ensure Jenkins has Node.js installed (16+)
5. Store your `.env` file securely in Jenkins credentials or on the Jenkins agent

#### Running Tests in Jenkins

1. Click **Build with Parameters** on the Jenkins job
2. Select your desired parameters:
   - **ENVIRONMENT**: Choose between `production`, `staging`, or `local`
   - **BROWSER**: Choose between `chromium`, `firefox`, `webkit`, or `all`
3. Click **Build**
4. View the test results in the **Playwright Test Report** published to Jenkins

#### Pipeline Parameters

The Jenkinsfile accepts the following parameters:

| Parameter | Options | Description |
|-----------|---------|-------------|
| ENVIRONMENT | production, staging, local | Target environment for tests |
| BROWSER | chromium, firefox, webkit, all | Browser(s) to run tests on |

#### Example Jenkins Build Commands

```bash
# Run all tests on production with all browsers
# (Select parameters in Jenkins UI: ENVIRONMENT=production, BROWSER=all)

# Run tests on staging with chromium only
# (Select parameters in Jenkins UI: ENVIRONMENT=staging, BROWSER=chromium)

# Run tests on local environment with firefox
# (Select parameters in Jenkins UI: ENVIRONMENT=local, BROWSER=firefox)
```

#### Jenkins Build Output

The Jenkins pipeline will:
- Install dependencies with `npm ci`
- Load environment variables from `.env`
- Run Playwright tests based on selected parameters
- Publish the HTML test report to Jenkins
- Archive test artifacts for later review
- Display pass/fail status in the build log

## Troubleshooting

### Tests fail with "Cannot find module 'dotenv'"
```bash
npm install --save-dev dotenv
```

### TypeScript type errors
Make sure you have:
- `tsconfig.json` in the project root
- `@types/node` installed: `npm install --save-dev @types/node`

### Tests navigate to wrong URL
Verify the `PLAYWRIGHT_ENV` is set correctly and the `baseURL` in `playwright.config.ts` matches your target environment.

