import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the local `npm run preview` (build first), or against BASE_URL,
 * e.g. BASE_URL=https://lucapicci.com npm run test.
 *
 * Tags: @local tests read files rather than the served site and are skipped against BASE_URL.
 * @chrome tests play video, so they run in Google Chrome. @external tests open the cards' links
 * on other sites; they run only with EXTERNAL=1.
 */
const remote = Boolean(process.env.BASE_URL);
const baseURL = process.env.BASE_URL ?? 'http://localhost:4321';
const skip = [remote && '@local', !process.env.EXTERNAL && '@external'].filter(Boolean).join('|');
const skipPattern = skip ? new RegExp(skip) : undefined;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  timeout: 60_000,
  use: { baseURL },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: new RegExp(['@chrome', '@external', skip].filter(Boolean).join('|')),
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      grep: /@chrome|@external/,
      grepInvert: skipPattern,
    },
  ],
  webServer: remote
    ? undefined
    : { command: 'npm run preview -- --port 4321', url: baseURL, reuseExistingServer: true },
});
