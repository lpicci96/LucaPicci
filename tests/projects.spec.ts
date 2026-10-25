import { test, expect, type Page } from '@playwright/test';
import { pages, projectIds, reducedMotion } from './helpers';

/** Scroll through the page so lazy images load. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(60);
  }
}

for (const { lang, path } of pages) {
  test.describe(`${lang} projects`, () => {
    test('all 19 projects render in data order, with real links', async ({ page }) => {
      await page.goto(path);
      const ids = await page.locator('[data-project]').evaluateAll((els) => els.map((e) => e.getAttribute('data-project')));
      expect(ids).toHaveLength(19);
      expect(ids).toEqual(projectIds());
      const hrefs = await page.locator('a').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
      expect(hrefs.filter((h) => !h || h === '#')).toEqual([]);
    });

    test('external titles end with one ↗, and nothing else has one', async ({ page }) => {
      await page.goto(path);
      const titles = await page.evaluate(() =>
        [...document.querySelectorAll('.card h3, .group li a, .group h3')].map((el) => {
          const link = el.closest('a');
          return { text: el.textContent!.trim(), external: !!link && /^https?:/.test(link.getAttribute('href')!) };
        }),
      );
      expect(titles).toHaveLength(20);
      for (const { text, external } of titles) {
        expect(text.split('↗').length - 1, text).toBe(external ? 1 : 0);
        if (external) expect(text.endsWith('↗'), text).toBe(true);
      }
    });

    test('external links open in a new tab; mailto links don\'t', async ({ page }) => {
      await page.goto(path);
      const links = await page.locator('a').evaluateAll((els) =>
        els.map((e) => ({ href: e.getAttribute('href')!, target: e.getAttribute('target'), rel: e.getAttribute('rel') })),
      );
      for (const l of links.filter((l) => /^https?:/.test(l.href))) expect(l, l.href).toMatchObject({ target: '_blank', rel: 'noopener' });
      for (const l of links.filter((l) => l.href.startsWith('mailto:'))) expect(l.target, l.href).toBeNull();
    });

    test('card images are optimised and every card has real media', async ({ page }) => {
      await page.goto(path);
      const media = await page.locator('.card .media').evaluateAll((els) =>
        els.map((m) => {
          const img = m.querySelector('img');
          const video = m.querySelector('video');
          return { src: img?.getAttribute('src') ?? video?.getAttribute('poster') ?? '', srcset: img?.getAttribute('srcset') ?? '' };
        }),
      );
      expect(media).toHaveLength(15);
      for (const { src, srcset } of media) {
        expect(src).toMatch(/^\/_astro\/.+\.(webp|avif)$/);
        expect(src).not.toMatch(/todo/);
        for (const candidate of srcset.split(',').filter(Boolean)) expect(candidate.trim()).toMatch(/^\/_astro\/\S+\.(webp|avif) \d+w$/);
      }
    });

    test('no image request fails', async ({ page }) => {
      const failed: string[] = [];
      page.on('response', (r) => {
        if (r.request().resourceType() === 'image' && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      page.on('requestfailed', (r) => {
        if (r.resourceType() === 'image') failed.push(`failed ${r.url()}`);
      });
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForLoadState('networkidle');
      expect(failed).toEqual([]);
    });
  });
}

test('hovering a story tile highlights its title and dims the other tiles', async ({ page }) => {
  await page.goto('/');
  const tile = page.locator('.group .tiles a').nth(1);
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  await expect(page.locator('.group li').nth(1)).toHaveClass(/hl/);
  await expect(page.locator('.group li').nth(0)).not.toHaveClass(/hl/);
  await expect(page.locator('.group li a').nth(1)).toHaveCSS('color', 'rgb(10, 122, 144)');
  await expect(page.locator('.group li a').nth(1)).toHaveCSS('text-decoration-thickness', '1px');
  for (const i of [0, 2, 3]) await expect(page.locator('.group .tiles a img').nth(i)).toHaveCSS('opacity', '0.45');
  await expect(page.locator('.group .tiles a img').nth(1)).toHaveCSS('opacity', '1');
  await page.locator('.group li a').nth(2).hover();
  await expect(page.locator('.group li').nth(2)).toHaveClass(/hl/);
  await expect(page.locator('.group li a').nth(2)).toHaveCSS('color', 'rgb(10, 122, 144)');
});

test('demo videos play while on screen and pause when off it', { tag: '@chrome' }, async ({ page }) => {
  await page.goto('/');
  for (const id of ['dfo', 'unesco-mcp']) {
    const video = page.locator(`[data-project="${id}"] video`);
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0), { timeout: 10_000 }).toBe(true);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  }
});

test('with reduced motion, demo videos stay on their poster', { tag: '@chrome' }, async ({ browser }) => {
  const page = await browser.newPage(reducedMotion);
  await page.goto('/');
  for (const video of await page.locator('video').all()) {
    await video.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    expect(await video.evaluate((v: HTMLVideoElement) => [v.paused, v.currentTime])).toEqual([true, 0]);
  }
  await page.close();
});
