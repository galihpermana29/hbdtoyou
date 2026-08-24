/**
 * Mock data for the MemoRoll guest demo. Local state only: no backend is
 * called anywhere on this surface. The imagery is Cloudinary-hosted photos
 * already referenced by this repo's sample content (graduation/scrapbook
 * samples), so the demo invents no external asset dependency.
 */

export interface MockWedding {
  coupleNames: string;
  /** The handwritten title on the landing, e.g. "Elias & Freya's wedding". */
  title: string;
  dateLabel: string;
  /** The "event hasn't started" calendar leaf. */
  calendar: { month: string; day: string; year: string };
  /** Where the day happens; the creator demo's venue prefill. */
  venue: string;
}

export const MOCK_WEDDING: MockWedding = {
  coupleNames: 'Elias & Freya',
  title: 'Elias & Freya’s wedding',
  dateLabel: '3 May 2026',
  calendar: { month: 'May', day: '03', year: '2026' },
  venue: 'The Orchard House',
};

/** One photo somebody shot on the collective roll. */
export interface MockPhoto {
  id: string;
  src: string;
  /** Whose cam it came from, possessive-free ("Zidane"). */
  camOwner: string;
  /** Handwritten group label the gallery sorts under, e.g. "May 3 19:30". */
  groupLabel: string;
  /** Handwritten stamp burned onto the photo in the single view. */
  stamp: string;
}

export const SAMPLE_SOURCES = [
  'https://res.cloudinary.com/dxuumohme/image/upload/v1735834469/tccbqffnucbsyeeioutb.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736878627/bubjbkztn7xfrxmusjtp.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880564/zm9qkwdjbbnugbohko9x.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880576/kdf19qhcabj6gnaoxx7s.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880581/ajhrmyr1qz4n1u1fscha.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880586/mwnbkxb11oo2ew2squ1z.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880592/sc6uynh62vjcvquu1dur.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880662/pm1dz6f6cq1ttk8b1vjh.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736880667/jzdtgs5klr20uyyngxae.jpg',
  'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/w_800/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1737048992/vz6tqrzgcht45fstloxc.png',
];

const CAM_OWNERS = ['Zidane', 'Widya', 'Nadia'];

const GROUPS = [
  { label: 'May 3 19:30', stampTime: '19:30' },
  { label: 'May 3 19:35', stampTime: '19:35' },
  { label: 'May 3 20:21', stampTime: '20:21' },
];

/** The collective roll everybody else shot, grouped like guest-09/13. */
export const MOCK_PHOTOS: MockPhoto[] = SAMPLE_SOURCES.map((src, i) => {
  const group = GROUPS[Math.floor(i / 4) % GROUPS.length];
  return {
    id: `mock-${i}`,
    src,
    camOwner: CAM_OWNERS[i % CAM_OWNERS.length],
    groupLabel: group.label,
    stamp: `03/05/2026 ${group.stampTime}`,
  };
});

/** The landing collage (guest-01): one big polaroid over a strip of three. */
export const COLLAGE_MAIN = SAMPLE_SOURCES[0];
export const COLLAGE_BACK = SAMPLE_SOURCES[1];
export const COLLAGE_STRIP = SAMPLE_SOURCES.slice(2, 5);

/** What the placeholder viewfinder shows when the camera is not granted. */
export const VIEWFINDER_FALLBACK = SAMPLE_SOURCES[10];

/**
 * The demo's fictional wedding day as every stamp writes it. The camera
 * bakes this date (with the real capture time) so a guest's own shots agree
 * with the mock roll's stamps instead of betraying the demo's date.
 */
export const STAMP_DATE = '03/05/2026';

/** The designer's literal gallery copy (guest-05/08/09/12). */
export const GALLERY_COPY = {
  revealedHeading: 'The roll dropped. Go relive the chaos.',
  revealedSub: '1.000 memories captured by 50 guests',
  developingHeading: 'The roll dropped in',
  allTab: 'All (1000)',
  ownTab: 'Captured by you',
};
