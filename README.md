# FashionHub Test Automation

This project contains automated tests for the FashionHub application using Playwright.

## Prerequisites

- **Node.js** 22+ and npm
- A `.env` file with test credentials (see Configuration below)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LenaTester/fashionhub.git
   cd fashionhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create environment-specific `.env` files in the project root:

- `.env-production` - Production environment credentials
- `.env-staging` - Staging environment credentials  
- `.env-local` - Local environment credentials

Example `.env-production`:

```env
USER_NAME=<your_user>
PASSWORD=<your-password>
```

### Environment Selection

The project supports three environments:

- **Local**: `http://localhost:4000`
- **Staging**: `https://staging-env`
- **Production**: `https://pocketaces2.github.io`

To run tests against a different environment, set the `PLAYWRIGHT_ENV` variable:

```bash
# Production environment (default)
npx playwright test
# or explicitly:
PLAYWRIGHT_ENV=production npx playwright test

# Staging environment
PLAYWRIGHT_ENV=staging npx playwright test

# Local environment (starts Docker container automatically)
PLAYWRIGHT_ENV=local npx playwright test
```

### Run tests on a specific browser (e.g. production)
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests on a specific browser and environment
```bash
# Staging environment with Firefox
PLAYWRIGHT_ENV=production npx playwright test --project=firefox
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
├── playwright.config.ts  # Unified Playwright configuration with environment support
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies
├── .env-*               # Environment-specific credential files
└── README.md           # This file
```

## CI/CD

### GitHub Actions

The project includes GitHub Actions workflow for automated testing. Tests run on the production environment and chromium browser by default.

### Jenkins

This project includes a `Jenkinsfile` for running tests in Jenkins. 

#### Setup

1. Create a new **Pipeline** job in Jenkins
2. Configure the job to use **Pipeline script from Git**
3. Point to the repository and select the `Jenkinsfile`
4. Ensure Jenkins has Node.js installed
5. Store your `.env` file securely in Jenkins credentials or on the Jenkins agent

#### Running Tests in Jenkins

1. Click **Build with Parameters** on the Jenkins job
2. Select your desired parameters:
   - **ENVIRONMENT**: Choose between `production`, `staging`, or `local`
   - **BROWSER**: Choose between `chromium`, `firefox`, `webkit`, or `all`
3. Click **Build**
4. View the test results in the **Playwright Test Report** published to Jenkins