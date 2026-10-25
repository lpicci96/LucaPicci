import type { Link } from './types';

export const email = 'lpicci96@gmail.com';
export const github = 'https://github.com/lpicci96';
export const linkedin = 'https://www.linkedin.com/in/luca-picci-589735b3/';

/** Off-site links open in a new tab, as on the old site. */
export const newTab = { target: '_blank', rel: 'noopener' } as const;

export const linkAttrs = (link: Link) => (link.type === 'external' ? newTab : {});
