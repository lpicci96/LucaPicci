import type { ImageMetadata } from 'astro';
import type { Text } from '../i18n/types';

export interface Link {
  href: string;
  /** `external` goes off-site and shows ↗. `page` is reserved for project pages on this site. */
  type: 'external' | 'page';
}

/** ONE work carries Luca's role; personal projects don't. */
export type BuiltFor = { org: 'one'; role: Text } | { org: 'personal' };

/** A year for finished work, a stage for ongoing work where one applies, or nothing. For display only. */
export type Time = { year: number } | { stage: Text } | null;

/** Card media has empty alt, since the card's title names the link. */
export type Media =
  | {
      kind: 'image';
      src: ImageMetadata;
      /** `contain` keeps charts whole on white; `cover` lets photos, recordings and pages fill the frame. */
      fit: 'contain' | 'cover';
    }
  | {
      kind: 'video';
      /** A muted H.264 file in `public/media/`. */
      src: string;
      poster: ImageMetadata;
    };

export interface Project {
  /** Stable, and matches the project's future `/projects/<id>` address. */
  id: string;
  /** Card titles stay in English on both pages. */
  title: string;
  link: Link;
  builtFor: BuiltFor;
  time: Time;
  description: Text;
  tools: Text;
  media: Media;
}

export interface Story {
  id: string;
  /** Also the image's alt text. */
  title: string;
  link: Link;
  image: ImageMetadata;
}

/** The health financing stories, shown as one row. */
export interface Group {
  id: string;
  title: string;
  builtFor: BuiltFor;
  year: number;
  description: Text;
  tools: Text;
  stories: [Story, Story, Story, Story];
}

/**
 * One row of the Projects section, in display order. A new kind of row (such as a featured
 * block) needs a new member here, its component in `src/components/rows/` and a data entry.
 */
export type Row =
  | { kind: 'large'; project: Project }
  | { kind: 'pair'; projects: [Project] | [Project, Project] }
  | { kind: 'group'; group: Group };
