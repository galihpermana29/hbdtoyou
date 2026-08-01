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
  dressCode: string;
  photoShareCover: string;
  photoShareUrl: string;
  galleryPhotos: string[];
  tokenMessage: string;
  tokenPhoto: string;
  accountHolder: string;
  accountNumber: string;
  guestMessagesEnabled: boolean;
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
  mapsUrl?: string;
  photoShareCover?: string;
  photoShareUrl?: string;
  galleryPhotos?: string[];
  tokenMessage?: string;
  tokenPhoto?: string;
  accountHolder?: string;
  accountNumber?: string;
  guestMessagesEnabled?: boolean;
}

/** Placeholder music options until the internal API is ready. */
export const DUMMY_BACKGROUND_MUSIC_OPTIONS = [
  { label: 'Sal Priadi - Mencintaimu', value: 'sal-priadi-mencintaimu' },
  { label: 'Raim Laode - Komang', value: 'raim-laode-komang' },
  { label: 'Nadhif Basalamah - Penjaga Hati', value: 'nadhif-penjaga-hati' },
];

export const DEFAULT_WEDDING_TEMPLATE_1_CONTENT: WeddingTemplate1Content = {
  groomName: 'Elias',
  brideName: 'Freya',
  groomFullName: 'Elias Frank Simanjuntak',
  brideFullName: 'Freya Putri Magellan',
  groomFatherName: 'Frank Simajuntak',
  groomMotherName: 'Esther Triasningsih',
  brideFatherName: 'Ferdinand Magellan',
  brideMotherName: 'Tuti Pudjiastuti',
  heroPhotos: [],
  weddingDateIso: '2026-05-03T19:00:00+07:00',
  backgroundMusicId: 'sal-priadi-mencintaimu',
  verseText:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir',
  verseCitation: 'Q.S Ar-Rum : 21',
  loveStoryPhotos: [],
  milestones: [
    {
      year: '2020',
      title: 'The meeting',
      body: 'Elias and Freya met during a summer volunteering program at a local wildlife sanctuary. Elias, always quiet and meticulous, found himself fascinated by Freya\u2019s contagious energy and deep empathy for every animal in her care. A shared task repairing an aviary roof led to hours of conversation that flowed with surprising ease.',
    },
    {
      year: '2022',
      title: 'Getting serious',
      body: 'They discovered a mutual love for hiking, old maps, and the kind of late-night calls that make time stand still. Over the years, they\u2019ve built a relationship grounded in shared values, unwavering respect, and a genuine delight in each other\u2019s success.',
    },
    {
      year: '2023',
      title: 'On his one knee!',
      body: 'Five years later, they are each other\u2019s anchor and wildest adventure. Freya still makes Elias laugh until his sides ache, and Elias\u2019s calm presence remains her haven. Now, they are excited to begin their next chapter together, celebrating not just their love, but the unique path they\u2019ve carved side by side\u2014surrounded by the family and friends who mean the most.',
    },
  ],
  polaroidPhoto: '',
  mapPhoto: '',
  loveStoryVideo: '',
  eventPhotos: [],
  eventStartTime: '19:00',
  eventEndTime: '21:00',
  venueName: 'Mandarin Hotel, Jakarta',
  address:
    'Jl. Imam Bonjol, Menteng, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10310',
  mapsUrl: '',
  dressCode: 'Exclusively in black, white, or a combination of both',
  photoShareCover: '',
  photoShareUrl: '',
  galleryPhotos: [],
  tokenMessage:
    'While we wish you could be here with us, your presence in our lives is the greatest gift of all. Should you wish to send a token of your love, please follow the link below.',
  tokenPhoto: '',
  accountHolder: 'Elias Frank Simanjuntak (BRI)',
  accountNumber: '3331 0908 1766',
  guestMessagesEnabled: true,
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
    weddingDateIso: weddingDateToIso(v.weddingDate, v.eventStartTime),
    backgroundMusicId: v.backgroundMusic || defaults.backgroundMusicId,
    verseText: v.verseText?.trim() || defaults.verseText,
    verseCitation: v.verseCitation?.trim() || defaults.verseCitation,
    loveStoryPhotos: v.loveStoryPhotos ?? defaults.loveStoryPhotos,
    milestones,
    polaroidPhoto: pickPhoto(v.polaroidPhoto, 0, defaults.polaroidPhoto),
    // The design asks for no map keepsake, no street address and no dress code
    // anywhere in the flow, so the invitation prints the sample's. Filed as
    // `hbd-byb.20` rather than answered here by adding fields the design does
    // not draw.
    mapPhoto: defaults.mapPhoto,
    loveStoryVideo: v.loveStoryVideo || defaults.loveStoryVideo,
    eventPhotos: v.eventPhotos ?? defaults.eventPhotos,
    eventStartTime: formatTime(v.eventStartTime, defaults.eventStartTime),
    eventEndTime: formatTime(v.eventEndTime, defaults.eventEndTime),
    venueName: v.venueName?.trim() || defaults.venueName,
    address: defaults.address,
    mapsUrl: v.mapsUrl?.trim() || defaults.mapsUrl,
    dressCode: defaults.dressCode,
    photoShareCover: v.photoShareCover || defaults.photoShareCover,
    photoShareUrl: v.photoShareUrl?.trim() || defaults.photoShareUrl,
    galleryPhotos: v.galleryPhotos ?? defaults.galleryPhotos,
    tokenMessage: v.tokenMessage?.trim() || defaults.tokenMessage,
    tokenPhoto: v.tokenPhoto || defaults.tokenPhoto,
    accountHolder: v.accountHolder?.trim() || defaults.accountHolder,
    accountNumber: v.accountNumber?.trim() || defaults.accountNumber,
    guestMessagesEnabled:
      v.guestMessagesEnabled ?? defaults.guestMessagesEnabled,
  };
}

/**
 * Initial form values for the creator (prefills preview on first paint).
 *
 * The fields of the Cover Header, the Holy Verse, the Bride & Groom's
 * Introduction, the Love Story and the Venue Details are deliberately absent.
 * The design draws every one of them empty, with its example written as grey
 * placeholder text, so filling them in would put the design's examples into a
 * couple's invitation as if they had chosen them. Nothing is lost by leaving
 * them out: `formValuesToContent` falls back to the sample invitation for
 * anything unanswered, so the Site Preview still has a wedding to show.
 *
 * The remaining Sections' defaults stand until their own beads reach them.
 */
export function getDefaultFormValues(): WeddingInvitationFormValues {
  const d = DEFAULT_WEDDING_TEMPLATE_1_CONTENT;
  return {
    heroPhotos: [],
    loveStoryPhotos: [],
    polaroidPhoto: [],
    loveStoryVideo: '',
    eventPhotos: [],
    photoShareCover: '',
    photoShareUrl: '',
    galleryPhotos: [],
    tokenMessage: d.tokenMessage,
    tokenPhoto: '',
    accountHolder: d.accountHolder,
    accountNumber: d.accountNumber,
    guestMessagesEnabled: d.guestMessagesEnabled,
  };
}

export { pickPhoto };
