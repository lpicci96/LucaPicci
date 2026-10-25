import type { Copy, Lang } from './types';
import { en } from './en';
import { it } from './it';

export const copy: Record<Lang, Copy> = { en, it };

/** The home page's address in each language. */
export const homePath: Record<Lang, string> = { en: '/', it: '/it/' };
