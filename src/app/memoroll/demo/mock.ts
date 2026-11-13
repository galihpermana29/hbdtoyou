/**
 * Mock data for the MemoRoll guest demo. Local state only: no backend is
 * called anywhere on this surface. The imagery is Cloudinary-hosted photos
 * checked into public/memoroll-samples (see SAMPLE_SOURCES below): the demo
 * touches no image host, Cloudinary included.
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

/** One photo on a gallery roll, as the demo mocks it. */
export interface MockRollPhoto {
  id: string;
  src: string;
  /** Who took it. */
  shooter: string;
  /** The time heading the gallery groups it under. */
  groupLabel: string;
  /** The Date Stamp the print carries, as the design writes it. */
  stamp: string;
}

/**
 * The sample photographs every MemoRoll surface shows before anybody has shot
 * anything: the creator's welcome, the demo cover, the demo rolls.
 *
 * Checked into `public/memoroll-samples/`, not hosted: these used to be
 * Cloudinary URLs on cloud `dxuumohme`, which Cloudinary disabled (every one
 * answered 401 "cloud_name dxuumohme is disabled", found 2026-11-12), and
 * the creator's welcome showed empty frames. Same remedy as
 * src/lib/template-thumbnail.ts: no image host can take these away again.
 *
 * Source: the design's own "Pile-up stills: Wedding" (Figma Randos, node
 * 734:6366), resized to 720px wide. Eight stills fill ten photo slots, so
 * two of them appear twice on the demo rolls - more stills from the design
 * can replace the repeats in slots 8 and 10.
 */
const SAMPLE = (name: string) => `/memoroll-samples/wedding-${name}.webp`;

export const SAMPLE_SOURCES = [
  SAMPLE('embrace'),
  SAMPLE('group-selfie'),
  SAMPLE('laughing'),
  SAMPLE('cake-cutting'),
  SAMPLE('dancing'),
  SAMPLE('first-bite'),
  SAMPLE('kids-under-table'),
  SAMPLE('kicked-off-shoes'),
  SAMPLE('group-selfie'),
  // Index 9 was a grey placeholder graphic on Cloudinary, used nowhere. The
  // demo touches no image host (owner, 2026-11-13), so a local still holds
  // its place and every index after it keeps its meaning.
  SAMPLE('laughing'),
  SAMPLE('embrace'),
];

const CAM_OWNERS = ['Zidane', 'Widya', 'Nadia'];

/**
 * The gallery's two time headings. The design writes "May 3 at 07:30pm" over
 * both of its groups, which reads as the same placeholder pasted twice - two
 * groups of the same instant is not a state grouping-by-time can produce - so
 * the demo's second group carries a later time the way a real roll would.
 */
const GALLERY_GROUP_LABELS = ['May 3 at 07:30pm', 'May 3 at 08:15pm'];

/** The Date Stamp as the redesigned gallery writes it, curly quote included. */
export const PRINT_STAMP = '5 3 ‘26';

/** Six prints under the first heading, the rest under the second (guest-14/18). */
const rollGroupLabel = (index: number) =>
  GALLERY_GROUP_LABELS[index < 6 ? 0 : 1];

/**
 * The ten sample sources the rolls are dealt from. Index 9 used to be a grey
 * placeholder graphic and stays skipped, so the rolls keep their order. (Index 11, the Memoify mark, lived on the
 * disabled cloud and was used nowhere, so it is gone.)
 */
const ROLL_SOURCES = [...SAMPLE_SOURCES.slice(0, 9), SAMPLE_SOURCES[10]];

/** The Collective Gallery: everybody else's ten Shots (guest-13/14). */
export const MOCK_ALL_ROLL: MockRollPhoto[] = ROLL_SOURCES.map((src, i) => ({
  id: `all-${i}`,
  src,
  shooter: CAM_OWNERS[i % CAM_OWNERS.length],
  groupLabel: rollGroupLabel(i),
  stamp: PRINT_STAMP,
}));

/**
 * A designed stand-in for the guest's own Roll (guest-15/16/17/18), so the
 * demo can stand in every My Roll state without ten trips through the camera.
 * The same ten photographs, dealt from the middle so the two rolls do not
 * mirror each other row for row. The shooter is whoever the guest said they
 * are on "This you?", so it is signed at the demo surface rather than here.
 */
export const MOCK_OWN_SHOTS: Omit<MockRollPhoto, 'shooter'>[] = [
  ...ROLL_SOURCES.slice(4),
  ...ROLL_SOURCES.slice(0, 4),
].map((src, i) => ({
  id: `own-${i}`,
  src,
  groupLabel: rollGroupLabel(i),
  stamp: PRINT_STAMP,
}));

/** The header's tally, at the scale the design mocks (guest-13). */
export const GALLERY_TALLY = { photos: 615, participants: 100 };

/** What remains on the reveal clock while the demo's event runs. */
export const GALLERY_REMAINING = {
  days: 0,
  hours: 16,
  minutes: 32,
  seconds: 9,
};

/** How long the countdown screen says the doors stay shut (guest-02). */
export const WAIT_BEFORE_OPEN = {
  days: 6,
  hours: 7,
  minutes: 6,
  seconds: 7,
};

/** When the demo's Reveal came, as guest-14 prints it. */
export const REVEAL_ENDED_ON = 'May 4th 2026, 12:00PM';

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
export const STAMP_DATE = '5 3 ‘26';
