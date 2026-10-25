import { readFileSync } from 'node:fs';

export const pages = [
  { lang: 'en', path: '/' },
  { lang: 'it', path: '/it/' },
] as const;

export const widths = [1440, 390] as const;

export const remote = Boolean(process.env.BASE_URL);

/** Hosts the page may contact besides its own: only the Web Analytics beacon, and only in production. */
export const allowedHosts = remote ? ['static.cloudflareinsights.com', 'cloudflareinsights.com'] : [];

/** Project and story IDs, in the order the data file lists them. */
export function projectIds(): string[] {
  const source = readFileSync(new URL('../src/data/projects.ts', import.meta.url), 'utf8');
  return [...source.matchAll(/^\s+id: '([^']+)',$/gm)]
    .map((m) => m[1])
    .filter((id) => id !== 'health-financing-stories');
}

export const reducedMotion = { reducedMotion: 'reduce' } as const;
