import dayjs, { type Dayjs } from 'dayjs';

import type { IWeddingInvitationPayload } from '@/action/interfaces';
import type { FlowCopyKey } from './copy';
import {
  MENCINTAIMU,
  backgroundTrackByUrl,
  backgroundTrackFromLegacyId,
  type WeddingBackgroundTrack,
} from './background-track-catalog';

/** A single love-story timeline entry shown in the viewer. */
export interface WeddingMilestone {
  year: string;
  title: string;
  body: string;
}

/**
 * What a couple actually answers about one chapter.
 *
 * The title is not here, and that is the point. It is the design's - see
 * `LOVE_STORY_CHAPTERS` - so `formValuesToContent` writes it in on the way out
 * and `contentToFormValues` drops it on the way back. Leaving it off the type
 * makes that a compile-time fact rather than a convention: a form that held a
 * title would be a form asking a couple to confirm an answer they never gave.
 */
export type WeddingMilestoneAnswer = Pick<WeddingMilestone, 'year' | 'body'>;

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
  /**
   * The Background Track the couple picked, whole: title, artist and the url
   * the invitation plays.
   *
   * The whole track rather than a reference into the catalog, because a
   * published invitation is self-contained: it must keep playing the song the
   * couple chose whatever the catalog does after they chose it. Null is a
   * couple who picked nothing, and it means silence - no player, no record
   * drawn - rather than anything invented for them.
   *
   * Records saved before this carried the pick as `backgroundMusicId`, a slug
   * into a label-only list; `weddingContentFrom` reads those back through the
   * catalog's memory of what each slug meant.
   */
  backgroundTrack: WeddingBackgroundTrack | null;
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
   * Whether the invitation offers the couple's Background Track.
   *
   * Off means silence and no record drawn, whatever track is stored: the pick
   * is kept, the way the Gift Registry's answers are kept while its switch is
   * off, so turning the switch back on brings the same song back. It is the
   * answer the create payload has always carried as `song_request_enabled`.
   */
  songRequestEnabled: boolean;
  /**
   * The message the couple sends their guests, placeholders and all.
   *
   * Here rather than on each guest's row because it is one message per
   * invitation: the same words for everybody, with the two things that differ -
   * the guest's name and their personal link - resolved per guest when the
   * message goes out. On the row it would be the same paragraph stored two
   * hundred times, and editing it would be two hundred writes.
   *
   * Nothing in the invitation renders it. It is stored with the invitation
   * because that is where the couple's own words belong and there is nowhere
   * else for them, not because a guest ever reads this field.
   *
   * Optional because a record written before there was anywhere to put it does
   * not carry one, and because the Showcase's Example Content is nobody's
   * invitation and sends nobody a message. Every save this flow makes carries
   * one - see `formValuesToInvitationPayload`, which cannot be called without.
   */
  greetingMessage?: string;
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
  /** The picked Background Track's url, which is how the select names it. */
  backgroundTrack?: string;
  verseText?: string;
  verseCitation?: string;
  loveStoryPhotos?: string[];
  milestones?: WeddingMilestoneAnswer[];
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
  backgroundTrack: { ...MENCINTAIMU },
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
 * The couple, as the record names them, or empty when it does not name them.
 *
 * For the product's own screens rather than for the invitation: a couple's list
 * of their own invitations has to say which is which, and a record saved before
 * the title named the couple is titled `Wedding Invitation`. The nicknames on
 * the record are what tells those apart, so they are what every row reads.
 *
 * Empty rather than anything invented when neither nickname has been given, and
 * one name rather than a stranded ampersand when only one has - the same rule
 * `joinParents` follows, for the same reason. What a screen puts in place of an
 * empty answer is the screen's to decide and say.
 */
export function coupleNamedIn(
  content: Pick<WeddingTemplate1Content, 'brideName' | 'groomName'> | null | undefined
): string {
  return [content?.brideName, content?.groomName]
    .map((name) => name?.trim() ?? '')
    .filter((name) => name !== '')
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
  values: Partial<WeddingInvitationFormValues> | null | undefined,
  /**
   * The greeting message, for the callers that are about to save.
   *
   * Not one of the form's fields: it is written on the guest invites step, which
   * is not an antd form, so it arrives here separately rather than being fished
   * out of a store it was never put in.
   *
   * Left out by the two callers that render the invitation, because the
   * invitation does not render it and a key written as an empty string would be
   * a claim that the couple had cleared their message.
   */
  greetingMessage?: string
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
    backgroundTrack: backgroundTrackByUrl(v.backgroundTrack),
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
    ...(greetingMessage === undefined ? {} : { greetingMessage }),
  };
}

/**
 * What an invitation is titled while neither nickname has been given.
 *
 * The stand-in only, no longer every invitation's title: the title is the
 * couple, written `{Groom Nickname} & {Bride Nickname}` in that order, and
 * every save sends the current one, so the record tracks what they typed. This
 * fixed title stands only while that would say nothing - both nicknames empty,
 * which is only ever true of an early draft. It also keeps the backend's one
 * documented publish check, a title that is not empty, impossible to fail:
 * no invitation is ever titled nothing.
 */
export const WEDDING_INVITATION_TITLE = 'Wedding Invitation';

/**
 * Whether both nicknames have been given.
 *
 * The one question the name-derived address hangs on, answered in one place so
 * that every asker agrees: the create that spends the offer because the title
 * already named the couple, the update that makes it, and the flow opened on a
 * saved record deciding whether the moment has already passed. Existing is
 * having been typed - `invitationSlugFrom` may still spell nothing a URL can
 * carry, and that is a different question with a different answer.
 */
export function namesTheCouple(
  groomNickname: string | undefined,
  brideNickname: string | undefined
): boolean {
  return [groomNickname, brideNickname].every(
    (name) => (name?.trim() ?? '') !== ''
  );
}

/**
 * The Invitation Slug the couple's nicknames spell, or empty when they do not.
 *
 * Lowercase and hyphenated, groom first as the title writes them, each
 * nickname reduced to the letters and digits a URL can carry. Empty when
 * either nickname is missing, and empty when either of them survives that
 * reduction as nothing - a slug naming one partner would claim less than it
 * means, and a slug is minted for the couple or not at all.
 *
 * Empty is "offer nothing": the backend minted this invitation a slug at
 * create and that one stands. The only caller allowed to send this is the one
 * unpublished update described in `use-invitation.ts` - from the moment an
 * invitation is published its slug is frozen forever, because a shared link
 * must never die.
 */
export function invitationSlugFrom(
  groomNickname: string | undefined,
  brideNickname: string | undefined
): string {
  const names = [groomNickname, brideNickname].map((name) =>
    (name?.trim() ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
  if (names.some((name) => name === '')) return '';
  return names.join('-');
}

/**
 * What the backend is sent, built from what the couple has entered.
 *
 * The content is exactly what the Site Preview shows them - the same
 * `formValuesToContent`, serialised - so a couple never saves one invitation and
 * watches another. Anything they have not answered falls back to the sample
 * invitation, there as it does in the preview, which is what lets a half-filled
 * draft still render as a wedding.
 *
 * The title is the couple, `{Groom Nickname} & {Bride Nickname}`, or the one
 * of them that has been given, or the fixed stand-in while both are empty -
 * the same joining rule `joinParents` follows, so a lone name is never printed
 * beside a stranded ampersand. Every save sends the current one, so the record
 * tracks what the couple typed.
 *
 * Three things the payload can carry are deliberately absent.
 *
 * `invitation_slug`, because the backend generates one from the title when it
 * is not given a slug - and the title names the couple, so an invitation whose
 * nicknames exist by its first save is minted a named address with nothing
 * sent. The one save that does send a slug is the unpublished update where the
 * nicknames first exist, and that is `use-invitation.ts`'s
 * `offerANamedAddress`, not this function's: what this builds never carries
 * one.
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
 *
 * The greeting message is asked for rather than optional, because this is the
 * only function that writes to the backend and a save that forgot it would be a
 * couple publishing an invitation that does not carry the words their families
 * are going to read.
 *
 * The invitation's own identifier is written into the record for the reason set
 * out on `WEDDING_ID_KEY`, and is absent on the create that has not been given
 * one yet.
 */
export function formValuesToInvitationPayload(
  values: Partial<WeddingInvitationFormValues> | null | undefined,
  greetingMessage: string,
  weddingId?: string | null
): Omit<IWeddingInvitationPayload, 'template_id'> {
  const content = formValuesToContent(values, greetingMessage);
  const record: SavedWeddingRecord = weddingId
    ? { ...content, [WEDDING_ID_KEY]: weddingId }
    : content;

  const couple = [content.groomName, content.brideName]
    .filter((name) => name !== '')
    .join(' & ');

  return {
    title: couple || WEDDING_INVITATION_TITLE,
    detail_content_json_text: JSON.stringify(record),
    rsvp_enabled: true,
    digital_gift_enabled: content.digitalGiftEnabled,
    pov_guest_photo_enabled: content.memoRollEnabled,
    song_request_enabled: content.songRequestEnabled,
  };
}

/**
 * Where a saved record carries the identifier of the invitation holding it.
 *
 * A couple's own invitations cannot be listed from the wedding endpoints: there
 * is no collection there to ask, only `GET /wedding/{ref}`, which needs the
 * identifier a listing would be asking for. `GET /wedding` answers
 * `METHOD_NOT_ALLOWED`. What can be listed is the generic content table, which
 * carries one row per invitation and is already how the dashboard finds
 * everything else a person has made - but a content row's own id is the
 * content's, not the invitation's, and nothing on it names the invitation, its
 * address or its status.
 *
 * So the identifier is written into the one part of the row this product owns:
 * the content it stored there. That is the same reason the greeting message
 * lives there - see `WeddingTemplate1Content.greetingMessage` - and the same
 * shape: a key nothing in the invitation renders, kept because there is nowhere
 * else for it.
 *
 * It is denormalised, and it is written on every save, so a record cannot hold
 * a stale one for long. A record saved before this existed carries none, and a
 * listing says so rather than guessing: see
 * `docs/adr/0004-a-saved-invitation-carries-its-own-identifier.md`. This goes
 * away the day the backend can list a couple's invitations, which is `hbd-007`.
 */
export const WEDDING_ID_KEY = 'weddingId';

/**
 * The record as it is stored: the invitation's content, plus who it belongs to.
 *
 * Separate from `WeddingTemplate1Content` because the viewer renders that and
 * this is not part of what a guest sees. Nothing that draws an invitation reads
 * this type.
 */
export type SavedWeddingRecord = WeddingTemplate1Content & {
  [WEDDING_ID_KEY]?: string;
};

/**
 * Which invitation a stored record belongs to, or null when it does not say.
 *
 * Null is ordinary rather than broken: every invitation saved before the
 * identifier was written carries no such key, and so does anything that is not
 * one of these records at all. Both cases are a row a listing can show and
 * cannot open, which is what it says.
 */
export function weddingIdFrom(
  stored: string | null | undefined
): string | null {
  const content = weddingContentFrom(stored) as SavedWeddingRecord | null;
  const id = content?.[WEDDING_ID_KEY];
  return typeof id === 'string' && id.trim() !== '' ? id.trim() : null;
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
 *
 * The Background Track is the one field read rather than handed over as it
 * stands, because the record's word is not enough to hand an audio element: a
 * track without a url is not a track, and a record from before the track was
 * stored whole carries only the retired `backgroundMusicId` slug. Both read
 * back as what they are - the song the slug stood for where the catalog
 * remembers one, and no track at all otherwise.
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

  const record = parsed as StoredRecord;
  return { ...record, backgroundTrack: storedBackgroundTrack(record) };
}

/**
 * A record as it was actually stored, which may predate the Background Track
 * being stored whole and still carry the retired `backgroundMusicId` slug.
 */
type StoredRecord = WeddingTemplate1Content & { backgroundMusicId?: string };

/** The playable track a stored record carries, however old the record is. */
function storedBackgroundTrack(record: StoredRecord): WeddingBackgroundTrack | null {
  const track = record.backgroundTrack;
  if (
    track &&
    typeof track === 'object' &&
    typeof track.url === 'string' &&
    track.url.trim() !== ''
  ) {
    return {
      title: typeof track.title === 'string' ? track.title : '',
      artist: typeof track.artist === 'string' ? track.artist : '',
      url: track.url,
    };
  }
  return backgroundTrackFromLegacyId(record.backgroundMusicId);
}

/**
 * The day of the wedding, read back off the moment that was stored.
 *
 * By the ten characters at the front rather than by parsing the whole stamp.
 * `weddingDateToIso` writes the couple's day with a `+07:00` offset on it, and
 * handing that to Dayjs converts it into whatever zone the browser is in - so a
 * wedding stored as the third of May reads back as the second for a couple
 * sitting west of Jakarta, and the form would show them a date they never
 * picked. The date part is the answer they gave; the offset and the time are
 * this function's counterpart writing the reception's start onto it.
 *
 * Undefined when there is no day stored, which is a couple who never picked
 * one, and undefined rather than today: an invented date is an answer.
 */
function weddingDateFromIso(iso: string | undefined): Dayjs | undefined {
  const day = (iso ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return undefined;
  const parsed = dayjs(day);
  return parsed.isValid() ? parsed : undefined;
}

/**
 * A photograph a field holds as a one-item list, read back off the one string
 * the content model holds it as.
 *
 * An empty string is no photograph rather than a list holding an empty one,
 * which would draw an uploader with a broken image already in it.
 */
function photoList(photo: string | undefined): string[] {
  const one = photo?.trim() ?? '';
  return one === '' ? [] : [one];
}

/**
 * A saved invitation, back in the shape the Create Flow's form holds.
 *
 * The inverse of `formValuesToContent`, and it is not a spread of the record,
 * because that function transforms rather than copying: a Dayjs becomes a
 * stamp, four photographs become single strings or a renamed list, and the
 * chosen track is stored whole where the form holds only its url. Every one of
 * those is undone here.
 *
 * ## Two values are dropped rather than restored
 *
 * `mapPhoto` and each chapter's `title` are derived on the way out - the first
 * from the first of the Venue Details photographs, the second from the design's
 * own words for the chapter. Neither was ever answered, so neither comes back:
 * a couple opening their invitation would otherwise find the form holding
 * answers they never gave, and correcting them would be correcting the
 * template. `photoShareUrl` is dropped for the same reason - it is written as
 * an empty string by the writer and asked for nowhere.
 *
 * ## Every field is stated, including the empty ones
 *
 * The result is complete rather than sparse, and that is deliberate. The form's
 * own initial values carry the Holy Verse as a Prefill, and an absent key
 * leaves a Prefill standing - so a couple who deliberately cleared the
 * scripture would open their invitation to find it back, offered as though they
 * had chosen it. An answer they cleared is an answer, and it reads back empty.
 * See CONTEXT.md for Prefill against Fallback.
 *
 * The greeting message is not here. It is not one of the form's fields - it is
 * written on the guest invites step, which is not a form - so it is read off
 * the record separately by whoever is seeding the flow.
 */
export function contentToFormValues(
  content: WeddingTemplate1Content
): WeddingInvitationFormValues {
  return {
    heroPhotos: content.heroPhotos ?? [],
    groomName: content.groomName ?? '',
    brideName: content.brideName ?? '',
    groomFullName: content.groomFullName ?? '',
    brideFullName: content.brideFullName ?? '',
    groomFatherName: content.groomFatherName ?? '',
    groomMotherName: content.groomMotherName ?? '',
    brideFatherName: content.brideFatherName ?? '',
    brideMotherName: content.brideMotherName ?? '',
    bridePhoto: photoList(content.bridePhoto),
    groomPhoto: photoList(content.groomPhoto),
    weddingDate: weddingDateFromIso(content.weddingDateIso),
    backgroundTrack: content.backgroundTrack?.url || undefined,
    verseText: content.verseText ?? '',
    verseCitation: content.verseCitation ?? '',
    loveStoryPhotos: content.loveStoryPhotos ?? [],
    // One answer per chapter the design asks about, always, because that is what
    // the form draws. A record holding fewer than three - or none, which is a
    // record written before the Love Story was asked for - reads back as
    // unanswered chapters rather than as missing fields.
    milestones: LOVE_STORY_CHAPTERS.map((_chapter, index) => ({
      year: content.milestones?.[index]?.year ?? '',
      body: content.milestones?.[index]?.body ?? '',
    })),
    polaroidPhoto: photoList(content.polaroidPhoto),
    loveStoryVideo: content.loveStoryVideo ?? '',
    eventPhotos: content.eventPhotos ?? [],
    eventStartTime: content.eventStartTime ?? '',
    eventEndTime: content.eventEndTime ?? '',
    venueName: content.venueName ?? '',
    address: content.address ?? '',
    mapsUrl: content.mapsUrl ?? '',
    galleryPhotos: content.galleryPhotos ?? [],
    tokenPhoto: content.tokenPhotos ?? [],
    tokenMessage: content.tokenMessage ?? '',
    accountHolder: content.accountHolder ?? '',
    bankProvider: content.bankProvider ?? '',
    accountNumber: content.accountNumber ?? '',
    // The three switches, as they were answered. `?? false` and not `?? true`:
    // the form starts them on because a couple who has not looked at them gets
    // the invitation the design draws, but a record is somebody who has already
    // been through the flow, and a switch it does not carry is one that was off
    // when nothing was written for it.
    memoRollEnabled: content.memoRollEnabled ?? false,
    digitalGiftEnabled: content.digitalGiftEnabled ?? false,
    songRequestEnabled: content.songRequestEnabled ?? false,
  };
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
