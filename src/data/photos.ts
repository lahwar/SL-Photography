import type { ImageMetadata } from 'astro';
import { chapters, type ChapterId } from './chapters';

/**
 * The portfolio. To add a photo: drop the JPEG in src/photos/<chapter>/ and add one entry below.
 * Order within a chapter = order on the page.
 */
export interface PhotoEntry {
  /** Path under src/photos without extension, e.g. "salt/02-flight". */
  file: string;
  title: string;
  /** What is actually in the frame — written for someone who cannot see it. */
  alt: string;
  /** Only where certain. Leave undefined otherwise. */
  place?: string;
  /** Layout hint for the editorial grid. */
  feature?: 'wide' | 'tall' | 'large';
  /** CSS object-position used when the image is cropped in the layout (CSS only; sharp ignores it). */
  focal?: string;
}

const entries: Record<ChapterId, PhotoEntry[]> = {
  salt: [
    {
      file: 'salt/01-sun-rise',
      title: 'Sun Rise',
      alt: 'A swimmer flips their wet hair back in an arc of spray, waist-deep in a calm sea, as an orange sun sinks behind a dark hill.',
      focal: '50% 45%',
    },
    {
      file: 'salt/02-flight',
      title: 'Flight',
      alt: 'A boy leaps from a jagged limestone rock toward clear blue water while an older man on the rocks watches, smiling.',
      feature: 'wide',
      focal: '55% 45%',
    },
    {
      file: 'salt/03-escape',
      title: 'Escape',
      alt: 'A lone rower in a small red-and-white inflatable boat, a shirt draped over their head against the sun, on deep blue open sea.',
    },
    {
      file: 'salt/04-rocks',
      title: 'Rocks',
      alt: 'Weathered limestone cliffs dotted with green shrubs rise from deep blue water under a cloudless sky.',
    },
    {
      file: 'salt/05-sea',
      title: 'Sea',
      alt: 'The view from inside a dark ochre sea cave, its arched mouth framing bright blue waves.',
      feature: 'large',
    },
    {
      file: 'salt/06-family',
      title: 'Family',
      alt: 'A woman with wet hair holds the steel rail of a swimming pool, the turquoise water rippling around her.',
    },
    {
      file: 'salt/07-happiness',
      title: 'Happiness',
      alt: 'A young man kisses the cheek of a laughing woman as they hug on a windy beach, a football held between them.',
    },
    {
      file: 'salt/08-shade',
      title: 'Shade',
      alt: 'A man in a bright orange smiley-face T-shirt stands beneath a woven straw beach umbrella against a clear blue sky.',
    },
  ],
  stone: [
    {
      file: 'stone/01-regret',
      title: 'Regret',
      alt: 'Black silhouette of a centaur statue carrying off a woman whose arm reaches up into a grey sky.',
      feature: 'tall',
    },
    {
      file: 'stone/02-marble',
      title: 'Marble',
      alt: 'A weathered marble statue of a man holding the limp body of a youth across his knee, bare winter trees behind.',
    },
    {
      file: 'stone/03-regret-2',
      title: 'Regret 2',
      alt: 'A tall green baroque church door between stone columns and statues, a lone man sitting on the steps below.',
    },
    {
      file: 'stone/04-structure',
      title: 'Structure',
      alt: 'Looking straight up the corner of a sandstone building, its striped stone courses forming chevrons against a deep blue sky.',
    },
    {
      file: 'stone/05-nobody',
      title: 'Nobody',
      alt: 'A grey sculpture of an empty hooded sweatshirt with no face inside, standing before a wall of brightly coloured vertical pipes.',
    },
    {
      file: 'stone/06-moonrise',
      title: 'Moonrise',
      alt: 'Black-and-white silhouette of a man in profile above the rooftops of Paris, a small moon in the sky.',
      place: 'Paris',
      feature: 'wide',
    },
  ],
  strangers: [
    {
      file: 'strangers/01-summer',
      title: 'Summer',
      alt: 'Close portrait of a young man with voluminous curly hair glancing over his bare shoulder, sunlit hills blurred behind.',
      feature: 'large',
    },
    {
      file: 'strangers/02-life',
      title: 'Life',
      alt: 'A smiling little girl with curly hair and big brown eyes looks up into the camera, wearing a turquoise top.',
    },
    {
      file: 'strangers/03-sadness',
      title: 'Sadness',
      alt: 'Profile of a man in a blue pom-pom beanie in a night-time crowd, a city bus and a yellow taxi behind him.',
      place: 'New York',
    },
    {
      file: 'strangers/04-love',
      title: 'Love',
      alt: 'Two people in winter coats hold each other tightly in front of brightly lit Times Square storefronts.',
      place: 'New York',
    },
    {
      file: 'strangers/05-smiles',
      title: 'Smiles',
      alt: 'Three smiling friends walk side by side down a white glass corridor under a ribbed blue ceiling.',
      feature: 'wide',
    },
    {
      file: 'strangers/06-courage',
      title: 'Courage',
      alt: 'On an airfield, a man pushes another man in a wheelchair while a skydiver in helmet and harness walks past, a small plane behind.',
    },
    {
      file: 'strangers/07-veterans',
      title: 'Veterans',
      alt: 'Black-and-white photo of men in vintage military uniforms gathered on and around an old armoured vehicle beneath trees.',
    },
    {
      file: 'strangers/08-liberation',
      title: 'Liberation',
      alt: 'A woman in a white beret and gingham dress raises a small French flag beside a vintage U.S. Army truck as a crowd in period clothes waves flags.',
      place: 'Paris',
    },
  ],
  ember: [
    {
      file: 'ember/01-chaos',
      title: 'Chaos',
      alt: 'A towering bonfire of stacked wooden pallets erupts in flame and smoke at night while a man takes a selfie in the foreground.',
      feature: 'tall',
    },
    {
      file: 'ember/02-home',
      title: 'Home',
      alt: 'Sunset over a tree-lined avenue, a clock tower silhouetted against a teal and peach sky as a pedestrian crosses the road.',
      place: 'Tunis',
    },
    {
      file: 'ember/03-thoughts',
      title: 'Thoughts',
      alt: 'A hand holds a glowing cigarette in the dark, blurred building lights behind.',
    },
    {
      file: 'ember/04-dancers',
      title: 'Dancers',
      alt: 'A spotlight throws warm light across a mural of three figures caught mid-movement in loose red brushstrokes.',
      feature: 'wide',
    },
    {
      file: 'ember/05-control',
      title: 'Control',
      alt: 'Black-and-white mural on a tiled wall: a man in a suit with small red devil horns leads a giant saddled pigeon on a rope.',
      feature: 'wide',
    },
  ],
  green: [
    {
      file: 'green/01-nature',
      title: 'Nature',
      alt: 'Dense, vine-covered forest fading into thick fog.',
      feature: 'wide',
    },
    {
      file: 'green/02-trees',
      title: 'Trees',
      alt: 'Autumn trees arch over a pale gravel clearing beside a ridge of dark rocks, under a blue sky with clouds.',
    },
    {
      file: 'green/03-hide-and-seek',
      title: 'Hide & Seek',
      alt: 'Close-up of a snail tucked inside a hole in a weathered, blue-painted wooden post, soft green behind.',
    },
    {
      file: 'green/04-i-dont-really-know',
      title: "I don't really know",
      alt: 'Two brown catkins hang from a bare twig above a blurred street of parked cars.',
    },
  ],
};

const files = import.meta.glob<{ default: ImageMetadata }>('../photos/*/*.jpg', { eager: true });

export interface Photo extends PhotoEntry {
  /** Stable id used for deep links, e.g. "salt-02-flight". */
  id: string;
  chapter: ChapterId;
  /** 1-based frame number across the whole book, like a contact sheet. */
  frame: number;
  image: ImageMetadata;
}

let frame = 0;
export const photos: Photo[] = chapters.flatMap((chapter) =>
  entries[chapter.id].map((entry) => {
    const module = files[`../photos/${entry.file}.jpg`];
    if (!module) throw new Error(`Missing image file: src/photos/${entry.file}.jpg`);
    frame += 1;
    return {
      ...entry,
      id: entry.file.replace('/', '-'),
      chapter: chapter.id,
      frame,
      image: module.default,
    };
  }),
);

export const photosByChapter = (id: ChapterId) => photos.filter((p) => p.chapter === id);

export const heroPhoto = photos.find((p) => p.id === 'salt-01-sun-rise')!;
/** Landscape frame used for link previews (cropped to 1200×630). */
export const socialPhoto = photos.find((p) => p.id === 'salt-02-flight')!;

/** Two-digit frame label, e.g. "04". */
export const frameLabel = (n: number) => String(n).padStart(2, '0');
