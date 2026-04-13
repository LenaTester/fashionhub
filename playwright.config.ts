import { defineConfig, devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';

// Environment configuration with URLs
const isDocker = process.env.RUN_IN_DOCKER === 'true';

const environments = {
  production: {
    url: 'https://pocketaces2.github.io/fashionhub/login.html',
    envFile: '.env-production',
    storageState: 'auth/production-auth.json',
  },
  staging: {
    url: 'https://staging-env/fashionhub/login.html',
    envFile: '.env-staging',
    storageState: 'auth/staging-auth.json',
  },
  local: {
    url: isDocker
      ? 'http://app:4000/fashionhub/login.html'
      : 'http://localhost:4000/fashionhub/login.html',
    envFile: '.env-local',
    storageState: 'auth/local-auth.json',
  },
};

// Get the environment from process env or default to production
const environment = (process.env.PLAYWRIGHT_ENV || 'production') as keyof typeof environments;
const config = environments[environment];

// Load environment-specific variables
dotenvConfig({ path: config.envFile });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: config.url,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
