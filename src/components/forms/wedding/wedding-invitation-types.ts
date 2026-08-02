import type { Dayjs } from 'dayjs';

/** A single love-story timeline entry shown in the viewer. */
export interface WeddingMilestone {
  year: string;
  title: string;
  body: string;
}

/**
 * One chapter of the Love Story, as the design asks for it.
 *
 * The design does not offer a couple a list to add to. It asks three questions
 * with three sets of words of its own - how they met, how they grew closer, and
 * the proposal - and the invitation has room for exactly those three, one in
 * the middle of the page and two down the side. So a chapter is not something a
 * couple creates; it is something they answer, and what it is called is the
 * design's to say rather than theirs.
 */
export interface WeddingLoveStoryChapter {
  /** What the invitation prints beside the year. */
  title: string;
  /** What the form asks for the year, as the design writes it. */
  yearLabel: string;
  /** What the form asks for the story, as the design writes it. */
  storyLabel: string;
}

export const LOVE_STORY_CHAPTERS: WeddingLoveStoryChapter[] = [
  {
    title: 'The meeting',
    yearLabel: 'The year when you first met',
    storyLabel: 'How you first met?',
  },
  {
    title: 'Getting serious',
    yearLabel: 'The year you both getting closer',
    storyLabel: 'How you both getting closer?',
  },
  {
    title: 'On his one knee!',
    yearLabel: 'The year they asked the BIG question!',
    storyLabel: 'Finally, the happy ending',
  },
];

/** How many characters the design gives each chapter's story room for. */
export const LOVE_STORY_LIMIT = 320;

/**
 * Normalized content shape for the BNW wedding invitation viewer.
 * Stored in `detail_content_json_text` once publish is wired.
 */
export interface WeddingTemplate1Content {
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  heroPhotos: string[];
  /**
   * Each partner's own portrait, inside the frame the Bride & Groom's
   * Introduction draws around it.
   *
   * These are two faces, so they are the couple's rather than the template's,
   * and they are content for the same reason the photograph inside a polaroid
   * is. The Create Flow does not ask for them yet - `hbd-a09.20` - so
   * `formValuesToContent` takes both from the sample whatever a couple answers.
   */
  bridePhoto: string;
  groomPhoto: string;
  weddingDateIso: string;
  backgroundMusicId: string;
  verseText: string;
  verseCitation: string;
  loveStoryPhotos: string[];
  milestones: WeddingMilestone[];
  polaroidPhoto: string;
  mapPhoto: string;
  loveStoryVideo: string;
  eventPhotos: string[];
  eventStartTime: string;
  eventEndTime: string;
  venueName: string;
  address: string;
  mapsUrl: string;
  photoShareUrl: string;
  galleryPhotos: string[];
  tokenMessage: string;
  tokenPhoto: string;
  /** Who the account is in, and where it is held. Two answers, joined for display. */
  accountHolder: string;
  bankProvider: string;
  accountNumber: string;
  /** Whether guests are invited to send back their own photographs of the day. */
  memoRollEnabled: boolean;
  /** Whether the block saying where a gift can be sent appears at all. */
  digitalGiftEnabled: boolean;
  /**
   * Whether the invitation offers the couple's background track.
   *
   * The invitation has no audio yet - it draws a record and plays nothing - so
   * today this decides only whether the record is drawn. That defect is the
   * epic's `Further Notes` rather than this field being decorative: the answer
   * is the couple's either way, and it is the answer the create payload has
   * always carried as `song_request_enabled`.
   */
  songRequestEnabled: boolean;
}

/** Ant Design form field values for the wedding invitation creator. */
export interface WeddingInvitationFormValues {
  heroPhotos?: string[];
  groomName?: string;
  brideName?: string;
  groomFullName?: string;
  brideFullName?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  /** Each partner's portrait, held as the one-photo list its field hands back. */
  bridePhoto?: string[];
  groomPhoto?: string[];
  weddingDate?: Dayjs;
  backgroundMusic?: string;
  verseText?: string;
  verseCitation?: string;
  loveStoryPhotos?: string[];
  milestones?: WeddingMilestone[];
  /** The proposal photo, held as the one-photo list its field hands back. */
  polaroidPhoto?: string[];
  loveStoryVideo?: string;
  eventPhotos?: string[];
  /** The reception's start and end, each as the `HH:mm` a couple typed. */
  eventStartTime?: string;
  eventEndTime?: string;
  venueName?: string;
  /** The venue's street address, printed on the invitation. */
  address?: string;
  mapsUrl?: string;
  galleryPhotos?: string[];
  /** The gift section's photo, held as the one-photo list its field hands back. */
  tokenPhoto?: string[];
  /** The words above the account, as the couple writes them. */
  tokenMessage?: string;
  accountHolder?: string;
  bankProvider?: string;
  accountNumber?: string;
  memoRollEnabled?: boolean;
  digitalGiftEnabled?: boolean;
  songRequestEnabled?: boolean;
}

/**
 * Where a couple can be sent a gift.
 *
 * The design draws BRI as its example and offers no list, so this is the one
 * the product serves: Indonesia's largest banks and the e-wallets most guests
 * already have. The chosen name is what the invitation prints, so an entry is
 * its own value rather than a code standing for one.
 */
export const BANK_PROVIDER_OPTIONS = [
  'BCA',
  'BNI',
  'BRI',
  'BSI',
  'BTN',
  'CIMB Niaga',
  'Danamon',
  'Mandiri',
  'Permata',
  'DANA',
  'GoPay',
  'LinkAja',
  'OVO',
  'ShopeePay',
];

/** Placeholder music options until the internal API is ready. */
export const DUMMY_BACKGROUND_MUSIC_OPTIONS = [
  { label: 'Sal Priadi - Mencintaimu', value: 'sal-priadi-mencintaimu' },
  { label: 'Raim Laode - Komang', value: 'raim-laode-komang' },
  { label: 'Nadhif Basalamah - Penjaga Hati', value: 'nadhif-penjaga-hati' },
];

/** Where Wedding Template 1's artwork is served from. */
const TEMPLATE_1_ASSET = '/templates/wedding-template-1';

/**
 * The photographs of the designer's own example wedding.
 *
 * Every one of these is somebody's picture, taken at somebody's wedding, and
 * none of them is the couple's. They are content, not artwork: the template
 * draws the polaroid's border on every invitation, but the photograph inside it
 * belongs to whoever is getting married. So they are held here, in the sample
 * invitation, rather than inside the sections - a section with a photograph
 * baked into it would put a stranger's face on a published invitation and look
 * deliberate doing it, and no section can now do that because none of them
 * names a photograph at all.
 *
 * They are still what an unanswered photo falls back to, exactly as an
 * unanswered name falls back to "Elias": a draft has to look like something
 * before it is finished. What changes is that the fallback is one nameable
 * wedding rather than a path buried in a component, so a published invitation
 * can be given nothing to fall back to.
 */
export const DEFAULT_WEDDING_TEMPLATE_1_CONTENT: WeddingTemplate1Content = {
  groomName: 'Elias',
  brideName: 'Freya',
  groomFullName: 'Elias Frank Simanjuntak',
  brideFullName: 'Freya Putri Magellan',
  groomFatherName: 'Frank Simajuntak',
  groomMotherName: 'Esther Triasningsih',
  brideFatherName: 'Ferdinand Magellan',
  brideMotherName: 'Tuti Pudjiastuti',
  heroPhotos: [`${TEMPLATE_1_ASSET}/couple-photo.png`],
  bridePhoto: `${TEMPLATE_1_ASSET}/bride-photo.jpg`,
  groomPhoto: `${TEMPLATE_1_ASSET}/groom-photo.jpg`,
  weddingDateIso: '2026-05-03T19:00:00+07:00',
  backgroundMusicId: 'sal-priadi-mencintaimu',
  verseText:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir',
  verseCitation: 'Q.S Ar-Rum : 21',
  loveStoryPhotos: [
    `${TEMPLATE_1_ASSET}/lovestory-photo-1.png`,
    `${TEMPLATE_1_ASSET}/lovestory-photo-2.png`,
    `${TEMPLATE_1_ASSET}/lovestory-photo-3.png`,
  ],
  milestones: [
    {
      year: '2020',
      title: 'The meeting',
      body: 'Elias and Freya met during a summer volunteering program at a wildlife sanctuary. Elias, always quiet and meticulous, found himself fascinated by Freya\u2019s contagious energy and deep empathy for every animal in her care. A shared task repairing an aviary roof led to hours of conversation that flowed with surprising ease.',
    },
    {
      year: '2022',
      title: 'Getting serious',
      body: 'They discovered a mutual love for hiking, old maps, and the kind of late-night calls that make time stand still. Over the years, they\u2019ve built a relationship grounded in shared values, unwavering respect, and a genuine delight in each other\u2019s success.',
    },
    {
      year: '2023',
      title: 'On his one knee!',
      body: 'Five years later, they are each other\u2019s anchor and wildest adventure. Freya still makes Elias laugh until his sides ache, and Elias\u2019s calm presence remains her haven. Now, they are excited to begin their next chapter together, surrounded by the family and friends who mean the most.',
    },
  ],
  polaroidPhoto: `${TEMPLATE_1_ASSET}/lovestory-polaroid-photo.jpg`,
  mapPhoto: `${TEMPLATE_1_ASSET}/lovestory-map-photo.png`,
  loveStoryVideo: '',
  eventPhotos: [`${TEMPLATE_1_ASSET}/event-photo.png`],
  eventStartTime: '19:00',
  eventEndTime: '21:00',
  venueName: 'Mandarin Hotel, Jakarta',
  address:
    'Jl. Imam Bonjol, Menteng, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10310',
  mapsUrl: '',
  photoShareUrl: '',
  galleryPhotos: [
    `${TEMPLATE_1_ASSET}/gallery-1.png`,
    `${TEMPLATE_1_ASSET}/gallery-2.png`,
    `${TEMPLATE_1_ASSET}/gallery-3.png`,
    `${TEMPLATE_1_ASSET}/gallery-4.png`,
    `${TEMPLATE_1_ASSET}/gallery-5.png`,
  ],
  tokenMessage:
    'While we wish you could be here with us, your presence in our lives is the greatest gift of all. Should you wish to send a token of your love, please follow the link below.',
  tokenPhoto: `${TEMPLATE_1_ASSET}/token-photo.jpg`,
  accountHolder: 'Elias Frank Simanjuntak',
  bankProvider: 'BRI',
  accountNumber: '3331 0908 1766',
  memoRollEnabled: true,
  digitalGiftEnabled: true,
  songRequestEnabled: true,
};

/**
 * A partner's parents on the one line the invitation prints them on.
 *
 * The couple names a father and a mother separately, because they are two
 * people, and the invitation has room for one line. Joining happens here, at the
 * point of display, so that the two names stay two names everywhere else.
 *
 * A record that carries only one of the two names prints that one name, without
 * a stranded ampersand beside it. The Create Flow cannot produce such a record -
 * `formValuesToContent` falls back to the sample invitation for anything a
 * couple leaves blank - but the viewer also renders content it was handed rather
 * than content it built, and half an answer is not a reason to print punctuation
 * for a person who is not there.
 */
export function joinParents(father?: string, mother?: string): string {
  return [father, mother]
    .map((name) => name?.trim() ?? '')
    .filter((name) => name.length > 0)
    .join(' & ');
}

/**
 * An account on the one line the invitation prints it on.
 *
 * The couple names the holder and the provider separately, because a name and a
 * bank are two answers, and the invitation has room for one line. Joining
 * happens here, at the point of display, for the same reason `joinParents` does.
 *
 * A record carrying only one of the two prints that one, without empty brackets
 * beside it.
 */
export function joinAccountHolder(holder?: string, provider?: string): string {
  const name = holder?.trim() ?? '';
  const bank = provider?.trim() ?? '';
  if (bank.length === 0) return name;
  return name.length > 0 ? `${name} (${bank})` : bank;
}

/**
 * A time of day the invitation can print, or the sample's when there is none.
 *
 * The field a couple types into keeps them to four digits and to a real hour
 * and minute as they go, so what arrives here is either `HH:mm` or half of one.
 * Half of one is an answer still being given rather than an answer, and the
 * invitation shows the sample's time until it is finished.
 */
function formatTime(value: string | undefined, fallback: string): string {
  return value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : fallback;
}

function weddingDateToIso(value?: Dayjs, startTime?: string): string {
  if (!value || !value.isValid()) {
    return DEFAULT_WEDDING_TEMPLATE_1_CONTENT.weddingDateIso;
  }
  const date = value.format('YYYY-MM-DD');
  const time = formatTime(
    startTime,
    DEFAULT_WEDDING_TEMPLATE_1_CONTENT.eventStartTime
  );
  return `${date}T${time}:00+07:00`;
}

function pickPhoto(
  photos: string[] | undefined,
  index: number,
  fallback: string
): string {
  const url = photos?.[index];
  return url && url.length > 0 ? url : fallback;
}

/** Maps live form values onto the viewer content model, falling back to defaults. */
export function formValuesToContent(
  values: Partial<WeddingInvitationFormValues> | null | undefined
): WeddingTemplate1Content {
  const defaults = DEFAULT_WEDDING_TEMPLATE_1_CONTENT;
  const v = values ?? {};

  // One entry per chapter the design asks about, always, because the invitation
  // draws three and a couple cannot add a fourth or take one away. A chapter
  // they have not answered falls back to the sample's, the same as every other
  // field, and its title is the design's rather than anything they typed. The
  // sample is asked for by chapter rather than by position, so a chapter added
  // to one list and not the other reads as unanswered instead of throwing.
  const milestones: WeddingMilestone[] = LOVE_STORY_CHAPTERS.map(
    (chapter, index) => {
      const answered = v.milestones?.[index];
      const sample = defaults.milestones.find(
        (milestone) => milestone.title === chapter.title
      );
      return {
        year: answered?.year?.trim() || sample?.year || '',
        title: chapter.title,
        body: answered?.body?.trim() || sample?.body || '',
      };
    }
  );

  return {
    groomName: v.groomName?.trim() || defaults.groomName,
    brideName: v.brideName?.trim() || defaults.brideName,
    groomFullName: v.groomFullName?.trim() || defaults.groomFullName,
    brideFullName: v.brideFullName?.trim() || defaults.brideFullName,
    groomFatherName: v.groomFatherName?.trim() || defaults.groomFatherName,
    groomMotherName: v.groomMotherName?.trim() || defaults.groomMotherName,
    brideFatherName: v.brideFatherName?.trim() || defaults.brideFatherName,
    brideMotherName: v.brideMotherName?.trim() || defaults.brideMotherName,
    heroPhotos: v.heroPhotos ?? defaults.heroPhotos,
    // The two portraits are the sample's, because the Create Flow has no
    // question that hands back either of them yet: `hbd-a09.20`.
    bridePhoto: pickPhoto(v.bridePhoto, 0, defaults.bridePhoto),
    groomPhoto: pickPhoto(v.groomPhoto, 0, defaults.groomPhoto),
    weddingDateIso: weddingDateToIso(v.weddingDate, v.eventStartTime),
    backgroundMusicId: v.backgroundMusic || defaults.backgroundMusicId,
    verseText: v.verseText?.trim() || defaults.verseText,
    verseCitation: v.verseCitation?.trim() || defaults.verseCitation,
    loveStoryPhotos: v.loveStoryPhotos ?? defaults.loveStoryPhotos,
    milestones,
    polaroidPhoto: pickPhoto(v.polaroidPhoto, 0, defaults.polaroidPhoto),
    // The map keepsake is the venue, so it is the first of the photos the
    // Venue Details Section already collects rather than a field of its own.
    mapPhoto: pickPhoto(v.eventPhotos, 0, defaults.mapPhoto),
    loveStoryVideo: v.loveStoryVideo || defaults.loveStoryVideo,
    eventPhotos: v.eventPhotos ?? defaults.eventPhotos,
    eventStartTime: formatTime(v.eventStartTime, defaults.eventStartTime),
    eventEndTime: formatTime(v.eventEndTime, defaults.eventEndTime),
    venueName: v.venueName?.trim() || defaults.venueName,
    address: v.address?.trim() || defaults.address,
    mapsUrl: v.mapsUrl?.trim() || defaults.mapsUrl,
    // The photo sharing block's card is product art rather than a couple's
    // choice, so the block draws it itself and it is no longer content. The
    // link under it is still the sample's: see `hbd-byb.22`.
    photoShareUrl: defaults.photoShareUrl,
    galleryPhotos: v.galleryPhotos ?? defaults.galleryPhotos,
    tokenMessage: v.tokenMessage?.trim() || defaults.tokenMessage,
    tokenPhoto: pickPhoto(v.tokenPhoto, 0, defaults.tokenPhoto),
    accountHolder: v.accountHolder?.trim() || defaults.accountHolder,
    bankProvider: v.bankProvider || defaults.bankProvider,
    accountNumber: v.accountNumber?.trim() || defaults.accountNumber,
    memoRollEnabled: v.memoRollEnabled ?? defaults.memoRollEnabled,
    digitalGiftEnabled: v.digitalGiftEnabled ?? defaults.digitalGiftEnabled,
    songRequestEnabled: v.songRequestEnabled ?? defaults.songRequestEnabled,
  };
}

/**
 * Initial form values for the creator (prefills preview on first paint).
 *
 * Every field a couple types in or chooses is deliberately absent. The design
 * draws all of them empty, with its example written as grey placeholder text,
 * so filling them in would put the design's examples into a couple's invitation
 * as if they had chosen them. Nothing is lost by leaving them out:
 * `formValuesToContent` falls back to the sample invitation for anything
 * unanswered, so the Site Preview still has a wedding to show.
 *
 * What is here is the state a field cannot start without: an empty list for
 * every field that holds files, and the three switches, each of which starts on.
 *
 * On, because every one of them decides whether a block a couple has not looked
 * at yet appears, and the invitation the design draws has all three. A couple
 * who never touches them gets the invitation they were shown; turning something
 * off is the decision, and it is theirs to make.
 */
export function getDefaultFormValues(): WeddingInvitationFormValues {
  const d = DEFAULT_WEDDING_TEMPLATE_1_CONTENT;
  return {
    heroPhotos: [],
    loveStoryPhotos: [],
    polaroidPhoto: [],
    loveStoryVideo: '',
    eventPhotos: [],
    galleryPhotos: [],
    tokenPhoto: [],
    memoRollEnabled: d.memoRollEnabled,
    digitalGiftEnabled: d.digitalGiftEnabled,
    songRequestEnabled: d.songRequestEnabled,
  };
}

export { pickPhoto };
