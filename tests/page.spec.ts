import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { allowedHosts, pages, widths } from './helpers';

const site = 'https://lucapicci.com';
const accent = 'rgb(10, 122, 144)';

const attr = (page: Page, selector: string, name = 'content') => page.locator(selector).getAttribute(name);

for (const { lang, path } of pages) {
  const other = pages.find((p) => p.lang !== lang)!;

  test.describe(`${lang} page`, () => {
    test('carries its metadata', async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle('Luca Picci');
      const description = await attr(page, 'meta[name="description"]');
      expect(description?.length).toBeGreaterThan(40);
      expect(await attr(page, 'link[rel="canonical"]', 'href')).toBe(site + path);
      expect(await attr(page, 'link[rel="alternate"][hreflang="en"]', 'href')).toBe(site + '/');
      expect(await attr(page, 'link[rel="alternate"][hreflang="it"]', 'href')).toBe(site + '/it/');
      expect(await attr(page, 'link[rel="alternate"][hreflang="x-default"]', 'href')).toBe(site + '/');
      expect(await attr(page, 'meta[property="og:title"]')).toBe('Luca Picci');
      expect(await attr(page, 'meta[property="og:description"]')).toBe(description);
      expect(await attr(page, 'meta[property="og:url"]')).toBe(site + path);
      expect(await attr(page, 'meta[property="og:image"]')).toBe(site + '/og.png');
      const locale = { en: 'en_GB', it: 'it_IT' };
      expect(await attr(page, 'meta[property="og:locale"]')).toBe(locale[lang]);
      expect(await attr(page, 'meta[property="og:locale:alternate"]')).toBe(locale[other.lang]);
      expect(await attr(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
      expect(await attr(page, 'link[rel="icon"][type="image/svg+xml"]', 'href')).toBe('/favicon.svg');
      expect(await attr(page, 'link[rel="icon"][type="image/png"]', 'href')).toBe('/favicon-32.png');
      expect(await attr(page, 'link[rel="apple-touch-icon"]', 'href')).toBe('/apple-touch-icon.png');
    });

    test('makes no requests to third parties on load', async ({ page, baseURL }) => {
      const hosts = new Set<string>();
      page.on('request', (r) => hosts.add(new URL(r.url()).hostname));
      await page.goto(path, { waitUntil: 'networkidle' });
      const own = new URL(baseURL!).hostname;
      expect([...hosts].filter((h) => h !== own && !allowedHosts.includes(h))).toEqual([]);
    });

    test('loads both self-hosted fonts', async ({ page }) => {
      await page.goto(path);
      const loaded = await page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
      });
      expect(loaded).toEqual(expect.arrayContaining(['Source Serif 4 Variable', 'Instrument Sans Variable']));
    });

    test('marks the current language by weight as well as colour', async ({ page }) => {
      await page.goto(path);
      const current = page.locator('.lang a[aria-current="page"]');
      await expect(current).toHaveText(lang.toUpperCase());
      await expect(current).toHaveCSS('font-weight', '600');
      await expect(current).toHaveCSS('color', accent);
      await expect(page.locator('.lang a:not([aria-current])')).toHaveText(other.lang.toUpperCase());
    });

    test('shows the side icons only at 1280px and wider', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path);
      const icons = page.locator('.side a');
      await expect(icons).toHaveCount(3);
      for (const icon of await icons.all()) {
        await expect(icon).toBeVisible();
        expect(await icon.getAttribute('aria-label')).toBeTruthy();
      }
      await page.setViewportSize({ width: 1279, height: 800 });
      await expect(page.locator('.side')).toBeHidden();
    });

    test('prints the console note in its language', async ({ page }) => {
      const messages: string[] = [];
      page.on('console', (m) => messages.push(m.text()));
      await page.goto(path);
      const note = await page.locator('header').getAttribute('data-note');
      await expect.poll(() => messages.join('\n')).toContain(note!);
      expect(messages.join('\n')).toContain('lpicci96@gmail.com');
      expect(messages.join('\n')).toContain('●');
      if (lang === 'en') expect(note).toBe("If you're reading this, you're as nerdy as me. Let's chat!");
    });

    test('shows the build year in the footer', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('footer')).toContainText(`© ${new Date().getFullYear()} Luca Picci`);
    });

    test('has no text under 13px', async ({ page }) => {
      await page.goto(path);
      const small = await page.evaluate(() => {
        const found: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const el = node.parentElement!;
          if (!node.textContent!.trim() || el.closest('.sr, script, style')) continue;
          const size = parseFloat(getComputedStyle(el).fontSize);
          if (size < 13) found.push(`${size}px: ${node.textContent!.trim().slice(0, 40)}`);
        }
        return found;
      });
      expect(small).toEqual([]);
    });

    for (const width of widths) {
      test(`passes an axe scan at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
        await page.goto(path, { waitUntil: 'networkidle' });
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      });
    }

    test('does not overflow sideways at phone width', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });

    test('weighs under 1.5MB on first load, video aside', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const sizes: Promise<number>[] = [];
      page.on('response', (r) => {
        const video = r.request().resourceType() === 'media' || (r.headers()['content-type'] ?? '').startsWith('video/');
        if (!video && r.status() < 300) sizes.push(r.body().then((b) => b.length, () => 0));
      });
      await page.goto(path, { waitUntil: 'networkidle' });
      const total = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
      expect(total).toBeLessThan(1.5 * 1000 * 1000);
    });
  });
}

test('the about text is the agreed copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.about .text p')).toHaveText([
    "I'm originally from Sardinia and grew up in Zimbabwe. I moved to the US to play tennis in college, but it was economics that stuck. I'm now based in Paris.",
    "Growing up in Zimbabwe in the early 2000s gave me a first-hand view of how economic policies affect ordinary lives. Yet finding data and information on important global issues is exceedingly difficult, and that's what drew me to work in data. I fell in love with data visualisation in particular. It's a superpower: it can clarify complex issues and make the data behind them human, inspiring action.",
    "These days I'm focused on building data and AI tools at ONE, research into development finance, and my own projects.",
    "I still love tennis and play as often as I can. I'm fiercely competitive.",
    "Reach out if you'd like to collaborate on something, or just to chat about my work.",
  ]);
});

test('the Open Graph image is 1200×630', async ({ request }) => {
  const png = await (await request.get('/og.png')).body();
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});

test('robots.txt blocks AI training crawlers and nothing else', async ({ request }) => {
  const text = await (await request.get('/robots.txt')).text();
  // group the rules by user agent
  const rules = new Map<string, string[]>();
  let agents: string[] = [];
  let inRules = false;
  for (const line of text.split('\n').map((l) => l.replace(/#.*/, '').trim()).filter(Boolean)) {
    const [key, value] = line.split(/:\s*/, 2);
    if (/^user-agent$/i.test(key)) {
      if (inRules) agents = [];
      agents.push(value.toLowerCase());
      inRules = false;
    } else if (/^(allow|disallow)$/i.test(key)) {
      inRules = true;
      for (const a of agents) rules.set(a, [...(rules.get(a) ?? []), `${key.toLowerCase()}: ${value}`]);
    }
  }
  const training = ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'Bytespider',
    'Meta-ExternalAgent', 'Amazonbot', 'Google-CloudVertexBot'];
  for (const bot of training) expect(rules.get(bot.toLowerCase()), bot).toContain('disallow: /');
  const search = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot',
    'Perplexity-User', 'Googlebot', 'Applebot', 'Bingbot'];
  for (const bot of search) expect(rules.has(bot.toLowerCase()), bot).toBe(false);
  expect(rules.get('*')).toEqual(['allow: /']);
  expect(text).toContain('Sitemap: https://lucapicci.com/sitemap-index.xml');
});

test('the sitemap lists both pages with their alternates', async ({ request }) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const xml = (await Promise.all(sitemaps.map(async (s) => (await request.get(s)).text()))).join('\n');
  expect([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort()).toEqual([`${site}/`, `${site}/it/`]);
  expect(xml).toContain(`hreflang="en" href="${site}/"`);
  expect(xml).toContain(`hreflang="it" href="${site}/it/"`);
});
