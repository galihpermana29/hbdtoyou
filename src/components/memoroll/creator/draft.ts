import type { CoverStyle } from '../guest/cover';

/**
 * What a creator has answered so far, and the eight questions they answer it
 * with.
 *
 * A draft, not a MemoRoll: nothing here has been saved anywhere, and the demo
 * surface holds it in local state while the product will hold it in a record
 * (ADR 0007). The screens take it as a prop and never reach for it, which is
 * what lets both surfaces render the same eight steps.
 */

/** What kind of event a MemoRoll is for - the creator's first answer. */
export type Vibe = 'wedding' | 'birthday' | 'moments';

export interface VibeOption {
  key: Vibe;
  /** The design's own words, and it names the event kind inside the brackets. */
  copy: string;
  /** The design draws an emoji here, so an emoji is what it is. */
  emoji: string;
}

export const VIBES: VibeOption[] = [
  { key: 'wedding', copy: 'Romantic & timeless (Wedding)', emoji: '❤️' },
  { key: 'birthday', copy: 'Fun & spontaneous (Birthday)', emoji: '🥳' },
  {
    key: 'moments',
    copy: 'For all the little moments (Trips, Parties, Gatherings)',
    emoji: '🪩',
  },
];

export interface CoverStyleOption {
  key: CoverStyle;
  copy: string;
  /**
   * How many photographs the Cover Style has room for.
   *
   * The design shows six waiting slots under Collage and one under both Taped
   * wall and Simple, which is the same count their Covers draw. So this is read
   * off the Cover rather than chosen: a style with room for one photograph
   * cannot ask for six.
   */
  slots: number;
}

export const COVER_STYLES: CoverStyleOption[] = [
  { key: 'collage', copy: 'Collage', slots: 6 },
  { key: 'taped', copy: 'Taped wall', slots: 1 },
  { key: 'simple', copy: 'Simple', slots: 1 },
];

/** The most photographs any Cover Style has room for. */
export const COVER_SLOTS = 6;

export interface MemorollDraft {
  vibe: Vibe;
  /** The event's name, which is what a guest reads on the Cover in script. */
  eventName: string;
  coverStyle: CoverStyle;
  /** One entry per Cover slot; a slot with nothing in it is still waiting. */
  photos: (string | null)[];
  /** When the roll opens, as the design writes it: a date and an hour. */
  opensOn: string;
  opensAt: string;
  venue: string;
  address: string;
  /** Whether a phone more than 500m away is refused. */
  onlyAtTheVenue: boolean;
  shotsPerGuest: number;
  /** When the roll develops, which is the Reveal. */
  revealOn: string;
  revealAt: string;
}

/**
 * The fewest shots a guest can be given.
 *
 * The design draws ten with the minus already unavailable, which is the only
 * thing in the file that says where the floor is. There is no ceiling drawn and
 * none is invented.
 */
export const FEWEST_SHOTS = 10;

/**
 * The eight steps, in the order the steppers give.
 *
 * They are not the order the frames are laid out in, and the frames are not
 * evidence: every creator frame draws its own numbered mark, and the highest lit
 * one says which step it is. This list is that reading, written down once.
 *
 * "TIme" is the design's own spelling of step four and it ships as written, the
 * way every other copy error in the file does (ADR 0002).
 */
export const CREATOR_STEPS = [
  'Choose your vibe',
  'Name your roll',
  'Make it yours',
  'TIme',
  'Venue & Location',
  'Shots per guest',
  'Reveal timing',
  'Ready to publish',
] as const;

export const LAST_STEP = CREATOR_STEPS.length;
