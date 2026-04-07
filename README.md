# FashionHub Test Automation

This project contains automated tests for the FashionHub application using Playwright.

## Prerequisites

- **Node.js** 16+ and npm
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

To run tests against a different environment, use the specific config file:

```bash
# Production environment
npx playwright test --config=playwright.config.production.ts

# Staging environment
npx playwright test --config=playwright.config.staging.ts

# Local environment (starts Docker container automatically)
npx playwright test --config=playwright.config.local.ts
```

### Run tests on a specific browser (e.g. production)
```bash
npx playwright test --config=playwright.config.production.ts --project=chromium
npx playwright test --config=playwright.config.production.ts --project=firefox
npx playwright test --config=playwright.config.production.ts --project=webkit
```

### Run a specific test file (e.g. production)
```bash
npx playwright test --config=playwright.config.production.ts tests/login.spec.ts
```

### Run tests in debug/headed mode (e.g. production)
```bash
npx playwright test --config=playwright.config.production.ts --headed
npx playwright test --config=playwright.config.production.ts --debug
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
├── playwright.config.production.ts  # Production environment config
├── playwright.config.staging.ts     # Staging environment config
├── playwright.config.local.ts       # Local environment config
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