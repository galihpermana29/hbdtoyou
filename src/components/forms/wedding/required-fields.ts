/**
 * What an invitation cannot go out without, and which Section holds it.
 *
 * One list rather than a rule written beside each field, because a failed Next
 * has to do three things with the same knowledge: refuse, name what is missing
 * in the language being read, and open the Sections holding it. Spread across
 * twenty files those three would drift apart, and the one that drifted would be
 * the one that opens Sections, which is the one a couple notices.
 *
 * Optional is the default and is not listed. The Holy Verse is optional because
 * it arrives Prefilled and a couple may not want a verse at all; every parent is
 * optional because plenty of couples cannot name four; the teaser video and the
 * Background Track are optional because nothing renders them yet, which is
 * `hbd-o3f`'s siblings rather than this ticket's business.
 */

import type { FlowCopyKey } from './copy';

/** A Section of the details-and-story step, named as the glossary names it. */
export type SectionKey =
  | 'coverHeader'
  | 'introduction'
  | 'loveStory'
  | 'venueDetails'
  | 'giftRegistry'
  | 'photoCollection';

export interface RequiredField {
  /** The form field this is about. */
  name: string;
  /** The Section holding it, so a failed Next knows what to open. */
  section: SectionKey;
  /** What to call it when saying it is missing. */
  label: FlowCopyKey;
  /**
   * Whether this is a list of files rather than a written answer.
   *
   * An empty list is falsy to nobody: `[]` passes a plain required rule, so a
   * couple who uploaded nothing would sail through. These get a rule that counts
   * instead.
   */
  isFileList?: boolean;
  /**
   * The fewest files this field accepts, where one is not enough.
   *
   * The Photo Collection is the only field like this: the invitation lays it
   * out in two columns that grow with the count, and a single photograph in a
   * two-column section is not a gallery, it is an accident.
   */
  atLeast?: number;
  /**
   * The switch that decides whether this field is asked for at all.
   *
   * A Section switched off asks for nothing, so its fields cannot block Next.
   * The Gift Registry is the only one of these today.
   */
  onlyWhen?: 'digitalGiftEnabled';
}

export const REQUIRED_FIELDS: RequiredField[] = [
  // Cover Header.
  {
    name: 'heroPhotos',
    section: 'coverHeader',
    label: 'couplesPhotos',
    isFileList: true,
  },
  { name: 'brideName', section: 'coverHeader', label: 'brideNickname' },
  { name: 'groomName', section: 'coverHeader', label: 'groomNickname' },
  { name: 'venueName', section: 'coverHeader', label: 'weddingPlaceName' },
  { name: 'weddingDate', section: 'coverHeader', label: 'weddingDate' },

  // Bride & Groom's Introduction. The parents are deliberately absent.
  {
    name: 'bridePhoto',
    section: 'introduction',
    label: 'bridePhoto',
    isFileList: true,
  },
  { name: 'brideFullName', section: 'introduction', label: 'brideName' },
  {
    name: 'groomPhoto',
    section: 'introduction',
    label: 'groomPhoto',
    isFileList: true,
  },
  { name: 'groomFullName', section: 'introduction', label: 'groomName' },

  // Love Story. The chapters themselves are checked separately: they are one
  // field holding three of everything, and a rule per chapter would say
  // "Love Story" three times without saying which one.
  {
    name: 'loveStoryPhotos',
    section: 'loveStory',
    label: 'polaroidPhotos',
    isFileList: true,
    // Three, because the film strip the invitation draws has three slots. Two
    // would leave one of them showing the film behind it.
    atLeast: 3,
  },
  {
    name: 'polaroidPhoto',
    section: 'loveStory',
    label: 'proposalPhoto',
    isFileList: true,
  },

  // Venue Details.
  {
    name: 'eventPhotos',
    section: 'venueDetails',
    label: 'venuePhotos',
    isFileList: true,
  },
  { name: 'eventStartTime', section: 'venueDetails', label: 'receptionStart' },
  { name: 'eventEndTime', section: 'venueDetails', label: 'receptionEnd' },
  { name: 'address', section: 'venueDetails', label: 'weddingAddress' },
  { name: 'mapsUrl', section: 'venueDetails', label: 'weddingLocation' },

  // Gift Registry, only while its switch is on.
  {
    name: 'tokenPhoto',
    section: 'giftRegistry',
    label: 'giftSectionPhoto',
    isFileList: true,
    // Three, because the block cross-fades between them.
    atLeast: 3,
    onlyWhen: 'digitalGiftEnabled',
  },
  {
    name: 'tokenMessage',
    section: 'giftRegistry',
    label: 'giftHeadline',
    onlyWhen: 'digitalGiftEnabled',
  },
  {
    name: 'bankProvider',
    section: 'giftRegistry',
    label: 'bankProvider',
    onlyWhen: 'digitalGiftEnabled',
  },
  {
    name: 'accountNumber',
    section: 'giftRegistry',
    label: 'accountNumber',
    onlyWhen: 'digitalGiftEnabled',
  },
  {
    name: 'accountHolder',
    section: 'giftRegistry',
    label: 'accountHolderName',
    onlyWhen: 'digitalGiftEnabled',
  },

  // Photo Collection.
  {
    name: 'galleryPhotos',
    section: 'photoCollection',
    label: 'photoGallery',
    isFileList: true,
    atLeast: 5,
  },
];

/** Every field a couple must answer, given which switches are on. */
export function requiredNow(switches: {
  digitalGiftEnabled?: boolean;
}): RequiredField[] {
  return REQUIRED_FIELDS.filter(
    (field) => !field.onlyWhen || switches[field.onlyWhen] === true
  );
}

/**
 * The rule a written answer carries.
 *
 * Named after its own field rather than saying "this field is required": the
 * label is directly above the box, so a generic sentence tells the couple
 * nothing they cannot already see, and the same sentence under nineteen fields
 * reads as noise instead of as an answer to give.
 *
 * `whitespace` because a field holding three spaces is not an answer, and
 * without it antd would take it for one.
 */
export function requiredText(
  copy: Record<FlowCopyKey, string>,
  label: FlowCopyKey
) {
  return [
    {
      required: true,
      whitespace: true,
      message: copy.requiredField.replace('{field}', copy[label]),
    },
  ];
}

/**
 * The rule an answer that is not text carries.
 *
 * The same message, without `whitespace`. That flag is defined for strings only,
 * and antd fails a value it cannot apply it to - so the Wedding Date, which is a
 * date object rather than a string, was refused after a couple had picked one.
 * They were told it was still required while looking at it in the box.
 */
export function requiredValue(
  copy: Record<FlowCopyKey, string>,
  label: FlowCopyKey
) {
  return [
    {
      required: true,
      message: copy.requiredField.replace('{field}', copy[label]),
    },
  ];
}

/**
 * The rule a photograph field carries, counting rather than merely existing.
 *
 * `type: 'array'` is what makes `required` mean anything here. A file field
 * hands back `[]` when a couple has chosen nothing, and an empty array is truthy
 * - a plain required rule would wave it through.
 */
export function requiredPhotos(
  copy: Record<FlowCopyKey, string>,
  label: FlowCopyKey,
  howMany: number
) {
  return [
    {
      required: true,
      type: 'array' as const,
      min: howMany,
      // A field that takes one photograph is not counting, it is asking, and
      // "add at least 1 photograph" reads like a machine that cannot conjugate.
      // It says what every other single answer says instead.
      message:
        howMany === 1
          ? copy.requiredField.replace('{field}', copy[label])
          : copy.requiredPhotos.replace('{count}', String(howMany)),
    },
  ];
}

/** Which Section holds a field, so a refused Next knows what to open. */
export function sectionHolding(name: string): SectionKey | null {
  if (name.startsWith('milestones')) return 'loveStory';
  return REQUIRED_FIELDS.find((field) => field.name === name)?.section ?? null;
}

/**
 * The rule the Wedding Location carries, which checks two things at once.
 *
 * The field means nothing unless it holds a Google Maps embed, so "you have not
 * answered" and "what you pasted is not an embed" are the same failure wearing
 * two faces. Kept as one rule so the field has exactly one error line, in the
 * place every other field puts its own - it used to keep a second message in
 * its own state, and a couple could see both at once.
 */
export function requiredMapEmbed(
  copy: Record<FlowCopyKey, string>,
  isEmbed: (pasted: string) => boolean
) {
  return [
    {
      required: true,
      whitespace: true,
      message: copy.requiredField.replace('{field}', copy.weddingLocation),
    },
    {
      validator: (_rule: unknown, value: string) =>
        !value || isEmbed(value)
          ? Promise.resolve()
          : Promise.reject(new Error(copy.locationProblem)),
    },
  ];
}
