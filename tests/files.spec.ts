import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
const builtFiles = () => walk(dist).map((f) => '/' + relative(dist, f));
const textFiles = () => builtFiles().filter((f) => /\.(html|css|js|xml|txt|svg)$/.test(f));

test.describe('built files', { tag: '@local' }, () => {
  test('both pages exist, in their language', () => {
    expect(read('dist/index.html')).toContain('<html lang="en"');
    expect(read('dist/it/index.html')).toContain('<html lang="it"');
  });

  test('no placeholder is left in the build', () => {
    for (const f of textFiles()) {
      const text = read('dist' + f);
      expect(text, f).not.toContain('[IT]');
      expect(text, f).not.toContain('TODO');
    }
    expect(builtFiles().filter((f) => /\/todo\./.test(f))).toEqual([]);
  });

  test('the serif is only the Latin optical-size file', () => {
    const serif = builtFiles().filter((f) => f.includes('source-serif'));
    expect(serif).toHaveLength(1);
    expect(serif[0]).toMatch(/source-serif-4-latin-opsz-normal\.[\w-]+\.woff2$/);
  });

  test('no file is over 25 MiB', () => {
    for (const f of builtFiles()) expect(statSync(join(dist, f)).size, f).toBeLessThan(25 * 1024 * 1024);
  });

  test('every built file is referenced', () => {
    const texts = textFiles()
      .map((f) => read('dist' + f))
      .join('\n');
    const exempt = ['/robots.txt', '/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/og.png'];
    const unused = builtFiles().filter(
      (f) => !exempt.includes(f) && !/^\/sitemap-.*\.xml$/.test(f) && !f.endsWith('.html') && !texts.includes(f),
    );
    expect(unused).toEqual([]);
  });

  test('the favicon has its letters as outlines', () => {
    const svg = read('public/favicon.svg');
    expect(svg).not.toMatch(/<text/);
    expect(svg).toMatch(/<path/);
  });

  test('wrangler.jsonc serves the build as static assets, with previews', () => {
    const config = JSON.parse(read('wrangler.jsonc').replace(/^\s*\/\/.*$/gm, ''));
    expect(config.name).toBe('website');
    expect(config.assets).toEqual({ directory: './dist' });
    expect(config.main).toBeUndefined();
    expect(config.workers_dev).toBe(false);
    expect(config.preview_urls).toBe(true);
    expect(config.previews).toEqual({});
  });

  test('D3 comes as separate modules, not the whole package', () => {
    const pkg = JSON.parse(read('package.json'));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(deps).not.toContain('d3');
    expect(deps).toEqual(expect.arrayContaining(['d3-selection', 'd3-timer', 'd3-ease']));
    expect(JSON.parse(read('package-lock.json')).packages['node_modules/d3']).toBeUndefined();
  });
});
