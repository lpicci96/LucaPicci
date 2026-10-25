import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The pages GitHub Pages publishes at the old address, so that it lands on lucapicci.com.
for (const file of ['index.html', '404.html']) {
  const url = new URL(`../github-pages/${file}`, import.meta.url);

  test(`github-pages/${file} sends visitors to lucapicci.com within a second`, { tag: '@local' }, async ({ page }) => {
    await page.route('https://lucapicci.com/**', (route) => route.fulfill({ body: 'lucapicci.com', contentType: 'text/html' }));
    const start = Date.now();
    await page.goto(url.href);
    await page.waitForURL('https://lucapicci.com/', { timeout: 1000 });
    expect(Date.now() - start).toBeLessThan(1000);
  });

  test(`github-pages/${file} has a canonical link, a refresh, a script and a visible link`, { tag: '@local' }, () => {
    const html = readFileSync(url, 'utf8');
    expect(html).toContain('<link rel="canonical" href="https://lucapicci.com/">');
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=https://lucapicci.com/">');
    expect(html).toContain("location.replace('https://lucapicci.com/')");
    expect(html).toContain('<a href="https://lucapicci.com/">');
    expect(html).not.toContain('noindex');
  });
}
