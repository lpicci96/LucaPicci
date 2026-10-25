import { test, expect, type Page } from '@playwright/test';

/** Sentences of five or more words on the page, leaving out titles and tools lines, which stay in English. */
async function sentences(page: Page, path: string) {
  await page.goto(path);
  await page.addStyleTag({ content: '.card h3, .group h3, .group li, .tools { display: none !important; }' });
  const text = await page.locator('body').innerText();
  return text
    .split(/(?<=[.!?:])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 5);
}

test('no sentence is the same in English and Italian', async ({ page }) => {
  const english = new Set(await sentences(page, '/'));
  const italian = await sentences(page, '/it/');
  expect(italian.filter((s) => english.has(s))).toEqual([]);
});

test('each Italian typed phrase fits on one line at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/it/');
  const lines = await page.locator('.ghost span[lang="it"]').evaluateAll((spans) =>
    spans.map((s) => s.getBoundingClientRect().height / parseFloat(getComputedStyle(s).lineHeight)),
  );
  expect(lines).toHaveLength(3);
  for (const n of lines) expect(n).toBeLessThan(1.5);
});
