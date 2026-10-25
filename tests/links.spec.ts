import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Opens every card and story link on its own site, in Google Chrome. Run with EXTERNAL=1.
const source = readFileSync(new URL('../src/data/projects.ts', import.meta.url), 'utf8');
const hrefs = [...new Set([...source.matchAll(/href: '([^']+)'/g)].map((m) => m[1]))];

for (const href of hrefs) {
  test(`${href} opens`, { tag: '@external' }, async ({ page }) => {
    const response = await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForTimeout(2000);
    expect(response?.status()).toBeLessThan(300);
    // bot checks can answer 200 too; those links need opening by hand
    expect(await page.title()).not.toMatch(/Just a moment|Oh noes|Security Checkpoint|Access denied/i);
  });
}
