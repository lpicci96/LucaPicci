export const langs = ['en', 'it'] as const;
export type Lang = (typeof langs)[number];

/** Text in both languages. */
export type Text = Record<Lang, string>;

/**
 * All the page's copy in one language. Both language files are typed against this,
 * so a missing or extra key fails the build.
 */
export interface Copy {
  meta: {
    title: string;
    description: string;
    ogLocale: string;
  };
  sections: {
    projects: string;
    about: string;
    contact: string;
  };
  labels: {
    email: string;
    github: string;
    linkedin: string;
    personal: string;
    headshotAlt: string;
    aboutPhotoAlt: string;
  };
  intro: {
    greeting: string;
    lead: string;
    phrases: [string, string, string];
    /** All three phrases in one sentence, for screen readers. */
    phrasesSpoken: string;
    paragraph: string;
  };
  about: [string, string, string, string, string];
  footer: {
    privacy: string;
  };
  consoleNote: string;
}
