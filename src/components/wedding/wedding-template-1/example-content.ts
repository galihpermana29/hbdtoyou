/**
 * Example Content: the named sets of content the Showcase renders the template
 * with, and nobody's invitation.
 *
 * The template was drawn against one wedding, the designer's, where every name
 * is short and every chapter is the length the designer chose. It has never
 * been seen with a real couple's answers, which is where it breaks. These three
 * sets are how that gets judged, by anybody, repeatably: the same template, the
 * same sections, three lengths of answer.
 *
 * Each set is a plain object of the shape the Create Flow produces, so wiring a
 * real invitation up later changes where the object comes from rather than what
 * it is.
 *
 * Two things are deliberately the same in all three sets, because varying them
 * would be varying something other than length. The photographs are the
 * designer's example wedding, which is the one place they are the right answer,
 * and they are the same fifteen in every set: a chapter that overruns its film
 * strip has to be the only thing that changed. And `mapsUrl` is empty
 * everywhere, because the Venue Details Section draws its View Location control
 * as a link when there is a URL and as plain artwork when there is not - a set
 * that filled it in would differ from the others in structure rather than in
 * length.
 */
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

/** Which of the three sets a caller means. */
export type ExampleContentName = 'flattering' | 'realistic' | 'hostile';

/** What the Showcase renders when nothing asks for anything else. */
const DEFAULT_EXAMPLE_CONTENT_NAME: ExampleContentName = 'flattering';

/** The query parameter the Showcase reads a set's name from. */
export const EXAMPLE_CONTENT_PARAM = 'content';

/**
 * Who a Showcase invitation is addressed to.
 *
 * Example Content like everything else on this route, and for the same reason:
 * the design draws a closed envelope with a name across the front of it, and a
 * Showcase that drew none would not be that frame. It is the frame's own name -
 * node 332:30838 writes "Galih & Keluarga" - so what is shown is what was
 * drawn rather than a name invented here.
 *
 * Nobody's invitation, which is the whole of why this is safe to write down. A
 * real guest's name is their own and comes from the token on their own link,
 * which the Invitation Viewer resolves; a real invitation with no token still
 * draws no addressee at all.
 */
export const EXAMPLE_ADDRESSEE = 'Galih & Keluarga';

/**
 * The designer's photographs, which every set shares.
 *
 * Read off the sample invitation rather than written out again, so the three
 * sets differ in exactly one thing - how long the words are - and a photograph
 * swapped in the sample reaches all three.
 *
 * The lists are copied rather than pointed at. A set is meant to be a complete
 * wedding of its own, and three sets holding one array between them would let
 * anything that sorted or appended to one silently rewrite the other two and
 * the sample with them.
 */
function exampleWeddingPhotographs() {
  const sample = DEFAULT_WEDDING_TEMPLATE_1_CONTENT;
  return {
    heroPhotos: [...sample.heroPhotos],
    bridePhoto: sample.bridePhoto,
    groomPhoto: sample.groomPhoto,
    loveStoryPhotos: [...sample.loveStoryPhotos],
    polaroidPhoto: sample.polaroidPhoto,
    mapPhoto: sample.mapPhoto,
    eventPhotos: [...sample.eventPhotos],
    galleryPhotos: [...sample.galleryPhotos],
    tokenPhotos: [...sample.tokenPhotos],
  };
}

/**
 * Awkward but plausible.
 *
 * A wedding nobody would call an edge case: Javanese names of the length most
 * Indonesian names actually run to, parents whose two names do not fit the one
 * line the invitation joins them onto, a verse a fifth longer than the design's,
 * and a venue that is a building rather than a hotel. Nothing here is chosen to
 * break anything. It is what the next couple to fill the form in will type.
 */
const REALISTIC: WeddingTemplate1Content = {
  groomName: 'Bagaskara',
  brideName: 'Prameswari',
  groomFullName: 'Bagaskara Adiwijaya Nugroho',
  brideFullName: 'Prameswari Ayu Kusumaningrum',
  groomFatherName: 'Raden Soeprapto Adiwijaya',
  groomMotherName: 'Sri Wahyuningsih Nugroho',
  brideFatherName: 'Bambang Kusumaningrat',
  brideMotherName: 'Endang Retno Sulistyowati',
  ...exampleWeddingPhotographs(),
  weddingDateIso: '2026-08-22T16:30:00+07:00',
  backgroundMusicId: 'raim-laode-komang',
  verseText:
    'Wahai manusia! Bertakwalah kepada Tuhanmu yang telah menciptakan kamu dari diri yang satu (Adam), dan (Allah) menciptakan pasangannya (Hawa) dari (diri)-nya; dan dari keduanya Allah memperkembangbiakkan laki-laki dan perempuan yang banyak. Bertakwalah kepada Allah yang dengan nama-Nya kamu saling meminta, dan (peliharalah) hubungan kekeluargaan. Sesungguhnya Allah selalu menjaga dan mengawasimu.',
  verseCitation: 'Q.S An-Nisa : 1',
  milestones: [
    {
      year: '2019',
      title: 'The meeting',
      body: 'Bagaskara and Prameswari met on the second day of a training programme neither of them had wanted to attend, seated together because the room was filled alphabetically. By the afternoon they had abandoned the exercise entirely and were arguing about coffee.',
    },
    {
      year: '2021',
      title: 'Getting serious',
      body: 'Two years of weekends between Jakarta and Bandung followed, and somewhere in them the question stopped being whether this was serious and became when. They learned each other slowly, in train stations and in kitchens, and never once rushed it.',
    },
    {
      year: '2024',
      title: 'On his one knee!',
      body: 'He asked in the garden of her parents’ house, after dinner, with both families pretending very badly not to be watching from the window. She had known for a week. She let him finish the speech anyway, because he had clearly worked on it.',
    },
  ],
  loveStoryVideo: '',
  eventStartTime: '16:30',
  eventEndTime: '21:30',
  venueName: 'Gedung Balai Kartini, Jakarta Selatan',
  address:
    'Jl. Jenderal Gatot Subroto Kav. 37, RT.1/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950',
  mapsUrl: '',
  photoShareUrl: '',
  tokenMessage:
    'Your presence at our celebration is the only gift we have asked anybody for, and we mean that. If you would still like to send something to mark the day, the details below are here for that, and no part of us will count who used them.',
  accountHolder: 'Prameswari Ayu Kusumaningrum',
  bankProvider: 'BCA',
  accountNumber: '8720 1145 9032',
  memoRollEnabled: true,
  digitalGiftEnabled: true,
  songRequestEnabled: true,
};

/**
 * Deliberately unkind.
 *
 * Every field the couple cannot be asked to shorten, at a length a real wedding
 * can reach: a partner with four given names before a family name, four parents
 * with titles, a venue of forty-five characters, two verses quoted where the
 * design drew one, and three chapters at exactly the 320 characters the Love
 * Story allows. Nothing is capped, because the fields that matter have no cap,
 * so this set is the judgement of what "too long" means rather than a limit.
 *
 * It is meant to fail. A chapter that overruns its film strip here is the point
 * of the set, not a mistake in it.
 *
 * One field is not the longest of the three here, and deliberately so. The
 * chapters are exactly 320 characters because 320 is the most a couple can type
 * into one, and the design's own example runs past that - two of the flattering
 * set's chapters are longer than anything this set can honestly contain. That
 * is the example copy disagreeing with the limit the design also set, which is
 * `hbd-a09.12`, not this set being soft.
 */
const HOSTILE: WeddingTemplate1Content = {
  groomName: 'Bhadrakumara',
  brideName: 'Kusumaningrum',
  groomFullName: 'Muhammad Bhadrakumara Adhiwangsa Prawiranegara Sastrowardoyo',
  brideFullName: 'Raden Ajeng Kusumaningrum Hapsari Widyaningtyas',
  groomFatherName: 'Raden Mas Sastrowardoyo Poerbonegoro',
  groomMotherName: 'Nyi Raden Ayu Siti Rahayuningtyas',
  brideFatherName: 'Kanjeng Raden Haryo Widyanto Notonegoro',
  brideMotherName: 'Retno Wulandari Hapsariningtyas',
  ...exampleWeddingPhotographs(),
  weddingDateIso: '2026-09-30T11:00:00+07:00',
  backgroundMusicId: 'nadhif-penjaga-hati',
  verseText:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. Dan Allah menjadikan bagimu pasangan (suami atau istri) dari jenis kamu sendiri dan menjadikan anak dan cucu bagimu dari pasanganmu, serta memberimu rezeki dari yang baik. Mengapa mereka beriman kepada yang batil dan mengingkari nikmat Allah?',
  verseCitation: 'Q.S Ar-Rum : 21 dan Q.S An-Nahl : 72',
  milestones: [
    {
      year: '2018',
      title: 'The meeting',
      body: 'They were introduced by a mutual friend at a crowded batik exhibition in Yogyakarta, and neither of them had expected the afternoon to matter at all. They argued for a solid hour about whether the indigo panels were older than the brown ones, discovered that they were both wrong, and stayed there until the hall closed.',
    },
    {
      year: '2021',
      title: 'Getting serious',
      body: 'Three years of long distance followed, split between Jakarta and Surabaya, and they learned to measure the relationship in train timetables rather than in grand gestures. They cooked the same recipe on the same evening in two kitchens, called it dinner together, and gradually stopped calling it a temporary arrangement.',
    },
    {
      year: '2025',
      title: 'On his one knee!',
      body: 'He proposed on the platform at Gambir station, an hour before her train, with a ring he had carried in his jacket for eleven weeks while waiting for a moment quiet enough. It was not quiet, an announcement drowned out half of what he said, and she said yes before he had finished asking. They missed that train together.',
    },
  ],
  loveStoryVideo: '',
  eventStartTime: '11:00',
  eventEndTime: '23:00',
  venueName: 'Grand Ballroom Hotel Borobudur, Jakarta Pusat',
  address:
    'Jl. Lapangan Banteng Selatan No. 1, RT.2/RW.3, Pasar Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10710, seberang Lapangan Banteng, pintu masuk melalui lobi utama',
  mapsUrl: '',
  photoShareUrl: '',
  tokenMessage:
    'Having you with us on the day is the whole of what we wanted, and we would not have asked for anything else. If you would nevertheless like to send a token of your love, whether that is on the day itself or long after everybody has gone home and the photographs have been printed, the account below belongs to us both and the details are here for that.',
  accountHolder: 'Muhammad Bhadrakumara Adhiwangsa Prawiranegara Sastrowardoyo',
  bankProvider: 'CIMB Niaga',
  accountNumber: '1234 5678 9012 3456 7890',
  memoRollEnabled: true,
  digitalGiftEnabled: true,
  songRequestEnabled: true,
};

/**
 * The three sets, by name.
 *
 * The flattering set is the design's own example wedding, which is the same
 * object the Create Flow falls back to for anything a couple has not answered
 * yet. It is one wedding rather than two copies of one on purpose: what the
 * Showcase flatters with and what an unfinished draft shows are the same
 * content, and a second copy would only be a copy to let drift.
 */
export const EXAMPLE_CONTENT: Record<
  ExampleContentName,
  WeddingTemplate1Content
> = {
  flattering: DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  realistic: REALISTIC,
  hostile: HOSTILE,
};

function isExampleContentName(value: string): value is ExampleContentName {
  return Object.prototype.hasOwnProperty.call(EXAMPLE_CONTENT, value);
}

/**
 * The set a query parameter asks for, or the flattering one.
 *
 * A visitor who asks for nothing, or for a set that does not exist, gets the
 * flattering set: the Showcase's job is to show a couple what the template
 * looks like, and a typed URL is never a reason to show them a wedding chosen
 * to look broken. A repeated parameter is read as the last one given, which is
 * what a person editing a URL by hand means by it.
 */
export function exampleContent(
  asked: string | string[] | undefined
): WeddingTemplate1Content {
  const last = Array.isArray(asked) ? asked[asked.length - 1] : asked;
  return EXAMPLE_CONTENT[
    last && isExampleContentName(last) ? last : DEFAULT_EXAMPLE_CONTENT_NAME
  ];
}
