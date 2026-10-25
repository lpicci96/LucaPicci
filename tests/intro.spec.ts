import { test, expect } from '@playwright/test';
import { pages, reducedMotion, widths } from './helpers';

for (const { lang, path } of pages) {
  for (const width of widths) {
    test(`${lang} at ${width}px: the typed line runs through every phrase without moving the layout`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(path);
      const phrases: string[] = JSON.parse((await page.locator('.typed').getAttribute('data-phrases'))!);
      // sample the intro's height and the typed text every 100ms for 25s
      const { heights, texts } = await page.evaluate(
        () =>
          new Promise<{ heights: number[]; texts: string[] }>((resolve) => {
            const intro = document.querySelector('.intro')!;
            const typed = document.querySelector('.typed')!;
            const heights: number[] = [];
            const texts: string[] = [];
            const id = setInterval(() => {
              heights.push(intro.getBoundingClientRect().height);
              texts.push(typed.textContent!);
            }, 100);
            setTimeout(() => (clearInterval(id), resolve({ heights, texts })), 25_000);
          }),
      );
      expect(new Set(heights).size).toBe(1);
      for (const phrase of phrases) expect(texts).toContain(phrase);
    });
  }

  test(`${lang}: with reduced motion the typed line stays on the first phrase`, async ({ browser }) => {
    const page = await browser.newPage(reducedMotion);
    await page.goto(path);
    const phrases: string[] = JSON.parse((await page.locator('.typed').getAttribute('data-phrases'))!);
    await page.waitForTimeout(5000);
    await expect(page.locator('.typed')).toHaveText(phrases[0]);
    await page.close();
  });

  test(`${lang}: screen readers get all three phrases, and the headshot loads eagerly`, async ({ page }) => {
    await page.goto(path);
    const phrases: string[] = JSON.parse((await page.locator('.typed').getAttribute('data-phrases'))!);
    const spoken = (await page.locator('h1 .sr').textContent())!;
    for (const phrase of phrases) expect(spoken).toContain(phrase.replace(/\.$/, ''));
    await expect(page.locator('h1 .typer')).toHaveAttribute('aria-hidden', 'true');
    expect(await page.locator('.avatar').getAttribute('loading')).not.toBe('lazy');
  });

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
  ]) {
    test(`${lang} at ${viewport.width}×${viewport.height}: Projects and the DFO card show on the first screen`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const heading = (await page.locator('#projects').boundingBox())!;
      expect(heading.y / viewport.height).toBeGreaterThanOrEqual(0.6);
      expect(heading.y / viewport.height).toBeLessThanOrEqual(0.85);
      const media = (await page.locator('[data-project="dfo"] .media').boundingBox())!;
      expect(media.y).toBeLessThan(viewport.height);
    });
  }
}
