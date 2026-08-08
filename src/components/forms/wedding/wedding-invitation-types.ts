import type { Dayjs } from 'dayjs';

import type { IWeddingInvitationPayload } from '@/action/interfaces';
import type { FlowCopyKey } from './copy';

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
  yearLabel: FlowCopyKey;
  /** What the form asks for the story, as the design writes it. */
  storyLabel: FlowCopyKey;
}

export const LOVE_STORY_CHAPTERS: WeddingLoveStoryChapter[] = [
  {
    title: 'The meeting',
    yearLabel: 'chapterMetYear',
    storyLabel: 'chapterMetStory',
  },
  {
    title: 'Getting serious',
    yearLabel: 'chapterCloserYear',
    storyLabel: 'chapterCloserStory',
  },
  {
    title: 'On his one knee!',
    yearLabel: 'chapterProposalYear',
    storyLabel: 'chapterProposalStory',
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
  /**
   * The photographs the Token of Love block cross-fades between.
   *
   * A list rather than one, because the block shows three in the space the
   * design draws for one and moves between them.
   */
  tokenPhotos: string[];
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
 * Nothing falls back to them any more. They were once what an unanswered
 * photograph became, exactly as an unanswered name became "Elias", on the
 * reasoning that a draft has to look like something before it is finished. What
 * that actually did was write this wedding into other people's saved records:
 * `formValuesToContent` is serialised verbatim, so a couple who had answered
 * nothing had Elias, Freya, Ferdinand Magellan and a hotel in Jakarta stored
 * under their own invitation.
 *
 * So this is now one thing only: the wedding the Showcase renders, and the
 * default a template component is given when it is handed no content at all.
 * Neither of those is anybody's invitation.
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
  // Three, because the Token of Love block cross-fades between them and a
  // sample holding one would demonstrate a still picture. The second and third
  // are borrowed from the gallery: this is the designer's example wedding, and
  // its job is to show what the block does.
  tokenPhotos: [
    `${TEMPLATE_1_ASSET}/token-photo.jpg`,
    `${TEMPLATE_1_ASSET}/gallery-2.png`,
    `${TEMPLATE_1_ASSET}/gallery-4.png`,
  ],
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
 * a stranded ampersand beside it, and a record carrying neither prints nothing
 * at all rather than an empty line where a family should be. Both are ordinary
 * now that parents are optional and nothing is invented for them: half an answer
 * is not a reason to print punctuation for a person who is not there, and no
 * answer is not a reason to print somebody else's.
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
function formatTime(value: string | undefined): string {
  return value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : '';
}

/**
 * The wedding's moment, or nothing at all.
 *
 * A date with no time is still a date, so a couple who has said which day but
 * not which hour gets midnight rather than nothing. The reverse is not true:
 * an hour with no day is not a moment, and the invitation prints no date at all
 * rather than guessing at the year.
 */
function weddingDateToIso(value?: Dayjs, startTime?: string): string {
  if (!value || !value.isValid()) return '';
  const date = value.format('YYYY-MM-DD');
  const time = formatTime(startTime) || '00:00';
  return `${date}T${time}:00+07:00`;
}

function pickPhoto(photos: string[] | undefined, index: number): string {
  return photos?.[index] ?? '';
}

/**
 * Maps live form values onto the viewer content model, inventing nothing.
 *
 * What a couple has not answered comes back empty, and the invitation omits
 * whatever it would have said rather than printing somebody else's. There is no
 * Fallback here and there is not meant to be: this function's output is
 * serialised verbatim into the saved record by
 * `formValuesToInvitationPayload`, so anything substituted in here is not a
 * placeholder, it is a claim about a couple's family stored under their name.
 *
 * That is what it used to do. A save written before this change carried Elias,
 * Freya, Ferdinand Magellan and a hotel in Jakarta into an invitation where none
 * of them had been typed.
 *
 * A Prefill is the other thing and is not done here. It belongs in the form's
 * initial values, where the couple can see it, edit it and clear it, and where
 * it is theirs from the moment the field is drawn. See CONTEXT.md for both
 * terms.
 */
export function formValuesToContent(
  values: Partial<WeddingInvitationFormValues> | null | undefined
): WeddingTemplate1Content {
  const v = values ?? {};

  // One entry per chapter the design asks about, always, because the invitation
  // draws three and a couple cannot add a fourth or take one away. A chapter
  // they have not answered is empty rather than the sample's, and its title is
  // the design's rather than anything they typed.
  const milestones: WeddingMilestone[] = LOVE_STORY_CHAPTERS.map(
    (chapter, index) => {
      const answered = v.milestones?.[index];
      return {
        year: answered?.year?.trim() ?? '',
        title: chapter.title,
        body: answered?.body?.trim() ?? '',
      };
    }
  );

  return {
    groomName: v.groomName?.trim() ?? '',
    brideName: v.brideName?.trim() ?? '',
    groomFullName: v.groomFullName?.trim() ?? '',
    brideFullName: v.brideFullName?.trim() ?? '',
    groomFatherName: v.groomFatherName?.trim() ?? '',
    groomMotherName: v.groomMotherName?.trim() ?? '',
    brideFatherName: v.brideFatherName?.trim() ?? '',
    brideMotherName: v.brideMotherName?.trim() ?? '',
    heroPhotos: v.heroPhotos ?? [],
    bridePhoto: pickPhoto(v.bridePhoto, 0),
    groomPhoto: pickPhoto(v.groomPhoto, 0),
    weddingDateIso: weddingDateToIso(v.weddingDate, v.eventStartTime),
    backgroundMusicId: v.backgroundMusic ?? '',
    verseText: v.verseText?.trim() ?? '',
    verseCitation: v.verseCitation?.trim() ?? '',
    loveStoryPhotos: v.loveStoryPhotos ?? [],
    milestones,
    polaroidPhoto: pickPhoto(v.polaroidPhoto, 0),
    // The map keepsake is the venue, so it is the first of the photos the
    // Venue Details Section already collects rather than a field of its own.
    mapPhoto: pickPhoto(v.eventPhotos, 0),
    loveStoryVideo: v.loveStoryVideo ?? '',
    eventPhotos: v.eventPhotos ?? [],
    eventStartTime: formatTime(v.eventStartTime),
    eventEndTime: formatTime(v.eventEndTime),
    venueName: v.venueName?.trim() ?? '',
    address: v.address?.trim() ?? '',
    mapsUrl: v.mapsUrl?.trim() ?? '',
    // The photo sharing block's card is product art rather than a couple's
    // choice, so the block draws it itself and it is no longer content. The
    // link under it has never been asked for: see `hbd-byb.22`.
    photoShareUrl: '',
    galleryPhotos: v.galleryPhotos ?? [],
    tokenMessage: v.tokenMessage?.trim() ?? '',
    tokenPhotos: v.tokenPhoto ?? [],
    accountHolder: v.accountHolder?.trim() ?? '',
    bankProvider: v.bankProvider ?? '',
    accountNumber: v.accountNumber?.trim() ?? '',
    memoRollEnabled: v.memoRollEnabled ?? false,
    digitalGiftEnabled: v.digitalGiftEnabled ?? false,
    songRequestEnabled: v.songRequestEnabled ?? false,
  };
}

/**
 * The title every invitation is created with.
 *
 * Fixed, because the Create Flow never asks a couple for one: the design draws
 * no such field, and the only publish check the backend documents is that the
 * title is not empty, so a title nobody types can never fail it. It is what a
 * couple would see naming this invitation in a list of their own things, so it
 * is written as a person would read it rather than as an identifier.
 */
export const WEDDING_INVITATION_TITLE = 'Wedding Invitation';

/**
 * What the backend is sent, built from what the couple has entered.
 *
 * The content is exactly what the Site Preview shows them - the same
 * `formValuesToContent`, serialised - so a couple never saves one invitation and
 * watches another. Anything they have not answered falls back to the sample
 * invitation, there as it does in the preview, which is what lets a half-filled
 * draft still render as a wedding.
 *
 * Three things the payload can carry are deliberately absent.
 *
 * `invitation_slug`, because the backend generates one when it is not given
 * a slug and there is no endpoint to ask whether a name is free, so a couple
 * choosing one could only be told it was taken after failing.
 *
 * `photo_storage_limit_mb`, because the side that counts bytes and refuses
 * uploads is the side that should hold the quota; putting a number here as well
 * means the wrong one can be believed. Deciding it is `hbd-ox7.2`.
 *
 * `caption`, because nothing asks a couple for one and nothing prints it.
 *
 * The flags are the couple's three switches, plus `rsvp_enabled`, which is
 * always on: replying is the only way a guest can leave a message, so turning it
 * off would silently empty the Guest Messages a couple watches being written.
 * See `docs/adr/0002-figma-is-literal-truth.md`.
 */
export function formValuesToInvitationPayload(
  values: Partial<WeddingInvitationFormValues> | null | undefined
): Omit<IWeddingInvitationPayload, 'template_id'> {
  const content = formValuesToContent(values);

  return {
    title: WEDDING_INVITATION_TITLE,
    detail_content_json_text: JSON.stringify(content),
    rsvp_enabled: true,
    digital_gift_enabled: content.digitalGiftEnabled,
    pov_guest_photo_enabled: content.memoRollEnabled,
    song_request_enabled: content.songRequestEnabled,
  };
}

/**
 * The content of a published invitation, read back out of what was stored.
 *
 * The counterpart of `formValuesToInvitationPayload`, which wrote it. The record
 * holds exactly a `WeddingTemplate1Content` and holds all of it, because
 * `formValuesToContent` answers every field before it is serialised, so this
 * hands the record to the template as it stands rather than merging it over the
 * sample invitation. Merging would be inventing content at the point of reading,
 * on a page a couple is sending to their families, for a record that already
 * said what it holds.
 *
 * That is a rule about this end only. It does not stop a couple's guests reading
 * the sample's names and faces, because the writing end already put them there:
 * `formValuesToContent` resolves every unanswered field to the sample before
 * serialising, and both portraits come from it whatever a couple answers. Which
 * fields a published invitation should be allowed to carry nothing for is
 * `hbd-a09.10` and `hbd-a09.20`, and it is settled where the record is written.
 *
 * Null when the record is not one of these at all - unparseable, or parsed into
 * something that is not an object, or carrying no Love Story. The last is
 * checked because it is the one field whose absence would throw rather than
 * render: every photograph is read through `pickPhoto`, which copes with there
 * being none, and every name lands in a text node, while the Love Story indexes
 * and slices its chapters. A guest is told the invitation could not be opened,
 * which is true, rather than handed the server's error page.
 */
export function weddingContentFrom(
  stored: string | null | undefined
): WeddingTemplate1Content | null {
  if (!stored) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;
  if (!Array.isArray((parsed as WeddingTemplate1Content).milestones)) {
    return null;
  }

  return parsed as WeddingTemplate1Content;
}

/**
 * Initial form values for the creator (prefills preview on first paint).
 *
 * Almost every field a couple types in is deliberately absent. The design draws
 * them empty, with its example written as grey placeholder text, and filling
 * them in would put the design's examples into a couple's invitation as if they
 * had chosen them. Nothing invents them later either: an unanswered field is
 * empty all the way through to the saved record and the invitation.
 *
 * The Holy Verse is the exception, and it is a Prefill rather than a Fallback.
 * Most couples using this template want Ar-Rum 21, so it is written into the
 * field where they can see it, change it and clear it - theirs from the first
 * paint, saved like anything they typed, and gone for good if they delete it.
 * That is the whole difference: a Prefill is an answer offered, a Fallback is an
 * answer assumed. See CONTEXT.md.
 *
 * The rest is the state a field cannot start without: an empty list for every
 * field that holds files, and the three switches, each of which starts on.
 *
 * On, because every one of them decides whether a block a couple has not looked
 * at yet appears, and the invitation the design draws has all three. A couple
 * who never touches them gets the invitation they were shown; turning something
 * off is the decision, and it is theirs to make.
 */
/**
 * The scripture the Holy Verse Section opens already holding.
 *
 * Written out here rather than read off the sample invitation. The two happen to
 * be the same words today and they are not the same thing: this is an answer
 * offered to a couple, and the sample's is one wedding's content. Tying them
 * together would mean editing the sample silently changed what every new couple
 * is offered.
 */
export const PREFILLED_VERSE_CITATION = 'Q.S Ar-Rum : 21';
export const PREFILLED_VERSE_TEXT =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan ' +
  'pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan ' +
  'merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan ' +
  'kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat ' +
  'tanda-tanda (kebesaran Allah) bagi kaum yang berpikir';

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
    verseCitation: PREFILLED_VERSE_CITATION,
    verseText: PREFILLED_VERSE_TEXT,
    memoRollEnabled: d.memoRollEnabled,
    digitalGiftEnabled: d.digitalGiftEnabled,
    songRequestEnabled: d.songRequestEnabled,
  };
}

export { pickPhoto };
