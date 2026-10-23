import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 45000,
  expect: { timeout: 8000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 },
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
          args: ['--no-sandbox'],
        },
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['iPhone 13'],
        defaultBrowserType: 'chromium',
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
          args: ['--no-sandbox'],
        },
      },
    },
    ...(process.env.TEST_WEBKIT
      ? [
          {
            name: 'mobile-webkit',
            use: { ...devices['iPhone 13'], defaultBrowserType: 'webkit' as const },
          },
        ]
      : []),
  ],
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
})
