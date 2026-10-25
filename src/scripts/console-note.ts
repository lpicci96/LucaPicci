// For anyone who opens the console: the name in dots, and an invitation in the page's language.
import { nameArt } from './dot-letters';

const header = document.querySelector<HTMLElement>('header');
if (header) {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  console.log(`%c${nameArt().join('\n')}`, `color: ${accent}; font: 10px/1.1 monospace;`);
  console.log(
    `%c${header.dataset.note}%c\n${header.dataset.email}`,
    'font: 14px system-ui, sans-serif;',
    `font: 14px system-ui, sans-serif; color: ${accent};`,
  );
}
