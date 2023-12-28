import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

if (!process.env.CI) {
  dotenv.config()
}

export default defineConfig({
  testDir: './app-tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.DEPLOYMENT_URL || 'http://localhost:5000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'app-tests',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'smoke-tests',
      use: { ...devices['Desktop Chrome'] },
      testDir: './smoke-tests',
      retries: 0
    }
  ]
})
