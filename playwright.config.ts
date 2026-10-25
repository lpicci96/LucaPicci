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
const baseURL = process.env.BASE_URL ?? 'http://localhost:4329'; // not 4321, so `npm run dev` is never mistaken for the build
const skip = [remote && '@local', process.env.EXTERNAL !== '1' && '@external'].filter(Boolean).join('|');
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
      grep: /@chrome/,
      grepInvert: skipPattern,
    },
    {
      // plain Chrome, announcing itself as headless: sites with bot checks fail and get opened by hand
      name: 'external',
      use: { channel: 'chrome' },
      grep: /@external/,
      grepInvert: skipPattern,
    },
  ],
  webServer: remote
    ? undefined
    : // --ignore-lock keeps the server in the foreground (Astro backgrounds it when it detects an agent)
      { command: 'npm run preview -- --port 4329 --ignore-lock', url: baseURL, reuseExistingServer: true },
});
