import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/** A single love-story timeline entry shown in the viewer. */
export interface WeddingMilestone {
  year: string;
  title: string;
  body: string;
}

/**
 * Normalized content shape for the BNW wedding invitation viewer.
 * Stored in `detail_content_json_text` once publish is wired.
 */
export interface WeddingTemplate1Content {
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomParents: string;
  brideParents: string;
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
  groomParents?: string;
  brideParents?: string;
  weddingDate?: Dayjs;
  backgroundMusic?: string;
  verseText?: string;
  verseCitation?: string;
  loveStoryPhotos?: string[];
  milestones?: WeddingMilestone[];
  polaroidPhoto?: string;
  mapPhoto?: string;
  loveStoryVideo?: string;
  eventPhotos?: string[];
  eventStartTime?: Dayjs;
  eventEndTime?: Dayjs;
  venueName?: string;
  address?: string;
  mapsUrl?: string;
  dressCode?: string;
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
  groomParents: 'Frank Simajuntak & Esther Triasningsih',
  brideParents: 'Ferdinand Magellan & Tuti Pudjiastuti',
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

const DEFAULT_MILESTONES: WeddingMilestone[] = [
  { year: '', title: '', body: '' },
];

function formatTime(value?: Dayjs, fallback = '19:00'): string {
  if (!value || !value.isValid()) return fallback;
  return value.format('HH:mm');
}

function weddingDateToIso(value?: Dayjs, startTime?: Dayjs): string {
  if (!value || !value.isValid()) {
    return DEFAULT_WEDDING_TEMPLATE_1_CONTENT.weddingDateIso;
  }
  const date = value.format('YYYY-MM-DD');
  const time = formatTime(startTime, '19:00');
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

  const milestones =
    v.milestones && v.milestones.length > 0
      ? v.milestones.filter((m) => m.year || m.title || m.body)
      : defaults.milestones;

  return {
    groomName: v.groomName?.trim() || defaults.groomName,
    brideName: v.brideName?.trim() || defaults.brideName,
    groomFullName: v.groomFullName?.trim() || defaults.groomFullName,
    brideFullName: v.brideFullName?.trim() || defaults.brideFullName,
    groomParents: v.groomParents?.trim() || defaults.groomParents,
    brideParents: v.brideParents?.trim() || defaults.brideParents,
    heroPhotos: v.heroPhotos ?? defaults.heroPhotos,
    weddingDateIso: weddingDateToIso(v.weddingDate, v.eventStartTime),
    backgroundMusicId: v.backgroundMusic || defaults.backgroundMusicId,
    verseText: v.verseText?.trim() || defaults.verseText,
    verseCitation: v.verseCitation?.trim() || defaults.verseCitation,
    loveStoryPhotos: v.loveStoryPhotos ?? defaults.loveStoryPhotos,
    milestones: milestones.length > 0 ? milestones : defaults.milestones,
    polaroidPhoto: v.polaroidPhoto || defaults.polaroidPhoto,
    mapPhoto: v.mapPhoto || defaults.mapPhoto,
    loveStoryVideo: v.loveStoryVideo || defaults.loveStoryVideo,
    eventPhotos: v.eventPhotos ?? defaults.eventPhotos,
    eventStartTime: formatTime(v.eventStartTime, defaults.eventStartTime),
    eventEndTime: formatTime(v.eventEndTime, defaults.eventEndTime),
    venueName: v.venueName?.trim() || defaults.venueName,
    address: v.address?.trim() || defaults.address,
    mapsUrl: v.mapsUrl?.trim() || defaults.mapsUrl,
    dressCode: v.dressCode?.trim() || defaults.dressCode,
    photoShareCover: v.photoShareCover || defaults.photoShareCover,
    photoShareUrl: v.photoShareUrl?.trim() || defaults.photoShareUrl,
    galleryPhotos: v.galleryPhotos ?? defaults.galleryPhotos,
    tokenMessage: v.tokenMessage?.trim() || defaults.tokenMessage,
    tokenPhoto: v.tokenPhoto || defaults.tokenPhoto,
    accountHolder: v.accountHolder?.trim() || defaults.accountHolder,
    accountNumber: v.accountNumber?.trim() || defaults.accountNumber,
    guestMessagesEnabled: v.guestMessagesEnabled ?? defaults.guestMessagesEnabled,
  };
}

/** Initial form values for the creator (prefills preview on first paint). */
export function getDefaultFormValues(): WeddingInvitationFormValues {
  const d = DEFAULT_WEDDING_TEMPLATE_1_CONTENT;
  return {
    groomName: d.groomName,
    brideName: d.brideName,
    groomFullName: d.groomFullName,
    brideFullName: d.brideFullName,
    groomParents: d.groomParents,
    brideParents: d.brideParents,
    heroPhotos: [],
    weddingDate: dayjs('2026-05-03'),
    backgroundMusic: d.backgroundMusicId,
    verseText: d.verseText,
    verseCitation: d.verseCitation,
    loveStoryPhotos: [],
    milestones: d.milestones.map((m) => ({ ...m })),
    polaroidPhoto: '',
    mapPhoto: '',
    loveStoryVideo: '',
    eventPhotos: [],
    eventStartTime: dayjs('19:00', 'HH:mm'),
    eventEndTime: dayjs('21:00', 'HH:mm'),
    venueName: d.venueName,
    address: d.address,
    mapsUrl: d.mapsUrl,
    dressCode: d.dressCode,
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

export { pickPhoto, DEFAULT_MILESTONES };
