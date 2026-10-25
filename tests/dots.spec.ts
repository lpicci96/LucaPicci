import { test, expect, type Page } from '@playwright/test';
import { pages, reducedMotion } from './helpers';

/** Each circle's distance from its letter position. */
const offsets = (page: Page) =>
  page.locator('.dots circle').evaluateAll((circles) =>
    circles.map((c) =>
      Math.hypot(+c.getAttribute('cx')! - +c.getAttribute('data-tx')!, +c.getAttribute('cy')! - +c.getAttribute('data-ty')!),
    ),
  );
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

test('the dots gather into the name, scatter on hover and gather again', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = page.locator('header');
  await expect(header).toHaveAttribute('data-dots', 'forming');
  await expect(header).toHaveAttribute('data-dots', 'formed', { timeout: 4000 });
  expect(Math.max(...(await offsets(page)))).toBeLessThanOrEqual(0.5);

  await page.locator('.name').hover();
  await expect.poll(async () => mean(await offsets(page)), { timeout: 1600 }).toBeGreaterThan(10);

  await page.mouse.move(700, 600);
  await expect(header).toHaveAttribute('data-dots', 'forming');
  await expect(header).toHaveAttribute('data-dots', 'formed', { timeout: 4000 });
  await expect.poll(async () => Math.max(...(await offsets(page))), { timeout: 1600 }).toBeLessThanOrEqual(0.5);
});

test('on a touch phone the name shows formed and still', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto('/');
  await expect(page.locator('header')).toHaveAttribute('data-dots', 'formed');
  const positions = () =>
    page.locator('.dots circle').evaluateAll((cs) => cs.map((c) => `${c.getAttribute('cx')},${c.getAttribute('cy')}`));
  const before = await positions();
  await page.waitForTimeout(3000);
  expect(await positions()).toEqual(before);
  await page.close();
});

test('with reduced motion the name is plain text', async ({ browser }) => {
  const page = await browser.newPage(reducedMotion);
  await page.goto('/');
  await page.waitForTimeout(500);
  await expect(page.locator('.dots circle')).toHaveCount(0);
  await expect(page.locator('.name')).not.toHaveCSS('color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.name')).toBeVisible();
  await page.close();
});

for (const { lang, path } of pages) {
  test(`${lang}: the header always holds the name as text`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('header .name')).toHaveText('Luca Picci');
    await expect(page.locator('header')).toHaveAttribute('data-dots', 'formed', { timeout: 5000 });
    await expect(page.locator('header .name')).toHaveText('Luca Picci');
  });
}
