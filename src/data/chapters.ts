export type ChapterId = 'salt' | 'stone' | 'strangers' | 'ember' | 'green';

export interface Chapter {
  id: ChapterId;
  numeral: string;
  title: string;
  /** One-line statement shown under the chapter title. */
  statement: string;
  /** CSS custom property holding the chapter tint (see tokens.css). */
  tint: string;
}

export const chapters: Chapter[] = [
  {
    id: 'salt',
    numeral: 'I',
    title: 'Salt',
    statement: 'Summers spent half in the water — a sea to leap into, float on, and hide from the sun.',
    tint: 'var(--tint-salt)',
  },
  {
    id: 'stone',
    numeral: 'II',
    title: 'Stone',
    statement: 'What stays still: marble, limestone, and the people who pause in front of it.',
    tint: 'var(--tint-stone)',
  },
  {
    id: 'strangers',
    numeral: 'III',
    title: 'Strangers',
    statement: 'Faces met in passing — on beaches, in crowds, and on the streets of Paris and New York.',
    tint: 'var(--tint-strangers)',
  },
  {
    id: 'ember',
    numeral: 'IV',
    title: 'Ember',
    statement: 'After the sun goes: firelight, streetlight, and the glow at the end of a cigarette.',
    tint: 'var(--tint-ember)',
  },
  {
    id: 'green',
    numeral: 'V',
    title: 'Green',
    statement: 'Small, quiet things — fog over a forest, a snail asleep in the wood.',
    tint: 'var(--tint-green)',
  },
];

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, Chapter>;
