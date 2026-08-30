/**
 * Everything the Create Flow says to a couple, in both languages.
 *
 * One dictionary rather than an i18n library. The repository has none, and
 * adding one would set a precedent for the marketing pages, the dashboard and
 * eight other gift templates that nobody has agreed to; the libraries in
 * question bring routing, locale detection, message formatting and lazy loading,
 * and none of that is wanted here. What is wanted is that a form written in
 * English can be read in Indonesian, which is a lookup.
 *
 * Both languages live under one key on purpose. A missing Indonesian string is
 * then a type error rather than a silent fall back to English, and a translator
 * reads the two side by side instead of diffing two files that drifted.
 *
 * Scope is the Create Flow. The invitation itself is not translated in either
 * direction: what a couple's guests read is what the couple wrote, and a control
 * that quietly rewrote it would be editing their words.
 *
 * Names stay names. Where a placeholder is an example value rather than a
 * sentence - "Freya", "MANDARIN HOTEL, JAKARTA", "3331 0908 1766" - it is the
 * same in both, because translating a person's name is not translation.
 */

export type FlowLanguage = 'id' | 'en';

/** One thing the flow says, said both ways. */
interface Phrase {
  id: string;
  en: string;
}

export const FLOW_COPY = {
  // The language control itself, which has to be readable before a choice is
  // made and so says the same thing in both.
  languageLabel: { en: 'Language', id: 'Bahasa' },
  languageIndonesian: { en: 'Indonesia', id: 'Indonesia' },
  languageEnglish: { en: 'English', id: 'English' },

  // Steps.
  stepChooseTemplate: {
    en: 'Choose your template',
    id: 'Pilih template kamu',
  },
  stepDetailsAndStory: {
    en: 'Fill in the details & story',
    id: 'Isi detail & cerita',
  },
  stepGuestInvites: {
    en: 'Guest invites details',
    id: 'Detail undangan tamu',
  },
  stepShareWithGuests: {
    en: 'Share with guests',
    id: 'Bagikan ke tamu',
  },

  // Actions.
  actionPreviousStep: { en: 'Previous step', id: 'Langkah sebelumnya' },
  actionNext: { en: 'Next', id: 'Lanjut' },
  actionSaveAsDraft: { en: 'Save as draft', id: 'Simpan sebagai draf' },
  actionConfirmCreate: { en: 'Confirm Create', id: 'Konfirmasi & Buat' },
  // Not on any designed screen: it replaces Confirm Create when the invitation
  // being edited is already published, where there is nothing left to create
  // and nothing left to confirm - only a change that goes live.
  actionSaveChanges: { en: 'Save changes', id: 'Simpan perubahan' },

  // Cover Header.
  coverHeaderName: { en: 'Cover Header', id: 'Cover Header' },
  coverHeaderDescription: {
    en: 'The general details about the event and what your guests will see when opening the invitation',
    id: 'Informasi umum pada section awal bagi tamu, dan tujuan undangan diberikan',
  },
  couplesPhotos: { en: 'Couples Photos', id: 'Photo Berdua' },
  brideNickname: {
    en: 'Bride Nickname',
    id: 'Nama Panggilan Mempelai Wanita',
  },
  groomNickname: { en: 'Groom Nickname', id: 'Nama Panggilan Mempelai Pria' },
  weddingPlaceName: { en: 'Wedding Place Name', id: 'Nama Tempat Pernikahan' },
  weddingDate: { en: 'Wedding Date', id: 'Tanggal Pernikahan' },
  backgroundTrack: { en: 'Background Track', id: 'Lagu Latar' },
  backgroundTrackPlaceholder: {
    en: 'Search artist or song name',
    id: 'Cari nama artis atau judul lagu',
  },

  // Holy Verse.
  holyVerseName: { en: 'Holy Verse', id: 'Ayat Suci' },
  holyVerseDescription: {
    en: 'Verses or prayers you and your partner love',
    id: 'Ayat atau doa yang kamu dan pasanganmu sukai',
  },
  verseName: { en: 'Verse Name', id: 'Nama Ayat' },
  verseBody: { en: 'Verse', id: 'Isi Ayat' },

  // Bride & Groom's Introduction.
  introductionName: {
    en: 'Bride & Groom’s Introduction',
    id: 'Perkenalan Kedua Mempelai',
  },
  introductionDescription: {
    en: 'Introduction to the Bride & Groom’s family and/or education background',
    id: 'Perkenalan keluarga dan/atau latar belakang pendidikan kedua mempelai',
  },
  bridePhoto: { en: 'Bride Photo', id: 'Foto Mempelai Wanita' },
  brideName: { en: 'Bride Name', id: 'Nama Mempelai Wanita' },
  brideFather: { en: 'Bride’s Father', id: 'Ayah Mempelai Wanita' },
  brideMother: { en: 'Bride’s Mother', id: 'Ibu Mempelai Wanita' },
  groomPhoto: { en: 'Groom Photo', id: 'Foto Mempelai Pria' },
  groomName: { en: 'Groom Name', id: 'Nama Mempelai Pria' },
  groomFather: { en: 'Groom’s Father', id: 'Ayah Mempelai Pria' },
  groomMother: { en: 'Groom’s Mother', id: 'Ibu Mempelai Pria' },

  // Love Story.
  loveStoryName: { en: 'Love Story', id: 'Kisah Cinta' },
  loveStoryDescription: {
    en: 'Tell the world how you & your partner’s met and what leads your both to this lifetime commitment (in short, ofc)',
    id: 'Ceritakan bagaimana kamu dan pasanganmu bertemu dan apa yang membawa kalian pada komitmen seumur hidup ini (singkat saja, tentu)',
  },
  polaroidPhotos: { en: 'Polaroid Photos', id: 'Foto Polaroid' },
  // The three chapters, each a year and a story. These were left in English by
  // hbd-9h3.2 because they live in a constants array rather than in a Section,
  // and the error message under each one has to name it.
  chapterMetYear: {
    en: 'The year when you first met',
    id: 'Tahun kalian pertama bertemu',
  },
  chapterMetStory: {
    en: 'How you first met?',
    id: 'Bagaimana kalian bertemu?',
  },
  chapterCloserYear: {
    en: 'The year you both getting closer',
    id: 'Tahun kalian semakin dekat',
  },
  chapterCloserStory: {
    en: 'How you both getting closer?',
    id: 'Bagaimana kalian semakin dekat?',
  },
  chapterProposalYear: {
    en: 'The year they asked the BIG question!',
    id: 'Tahun pertanyaan BESAR itu diajukan!',
  },
  chapterProposalStory: {
    en: 'Finally, the happy ending',
    id: 'Akhirnya, akhir yang bahagia',
  },
  proposalPhoto: { en: 'Proposal Photo', id: 'Foto Lamaran' },
  weddingTeaserVideo: {
    en: 'Wedding Teaser Video',
    id: 'Video Teaser Pernikahan',
  },

  // Venue Details.
  venueDetailsName: { en: 'Venue Details', id: 'Detail Lokasi' },
  venueDetailsDescription: {
    en: 'Details on the wedding venue location & reception time',
    id: 'Detail lokasi pernikahan dan waktu resepsi',
  },
  venuePhotos: { en: 'Venue Photos', id: 'Foto Lokasi' },
  receptionTime: { en: 'Wedding Reception Time', id: 'Waktu Resepsi' },
  receptionStart: { en: 'Start', id: 'Mulai' },
  receptionEnd: { en: 'End', id: 'Selesai' },
  weddingAddress: { en: 'Wedding Address', id: 'Alamat Pernikahan' },
  weddingLocation: { en: 'Wedding Location', id: 'Lokasi Pernikahan' },
  // What to paste, and where to find it. The menu names are Google Maps' own
  // and are worth checking against the real application before this ships:
  // wrong menu names in an instruction are worse than English ones.
  locationHint: {
    en: 'Open Google Maps, find your venue, then choose Share, Embed a map, Copy HTML. Paste it here. What you paste starts with <iframe.',
    id: 'Buka Google Maps, cari lokasi acara, lalu pilih Bagikan, Sematkan peta, Salin HTML. Tempel di sini. Yang kamu tempel diawali dengan <iframe.',
  },
  locationPlaceholder: {
    en: 'Paste the embed code from Google Maps',
    id: 'Tempel kode sematan dari Google Maps',
  },
  locationProblem: {
    en: 'That is not a Google Maps embed. Use Share, Embed a map, Copy HTML, and paste the whole thing.',
    id: 'Itu bukan kode sematan Google Maps. Gunakan Bagikan, Sematkan peta, Salin HTML, lalu tempel semuanya.',
  },
  saveLocation: { en: 'Save Location', id: 'Simpan Lokasi' },
  viewLocation: { en: 'View Location', id: 'Lihat Lokasi' },

  // Gift Registry.
  giftRegistryName: { en: 'Gift Registry', id: 'Daftar Hadiah' },
  giftRegistryDescription: {
    en: 'Include Bank Account/e-Wallet Information for gift collection',
    id: 'Sertakan informasi rekening bank/e-wallet untuk menerima hadiah',
  },
  giftSectionPhoto: { en: 'Gift Section Photo', id: 'Foto Bagian Hadiah' },
  giftHeadline: { en: 'Gift Headline', id: 'Judul Hadiah' },
  bankProvider: {
    en: 'Bank/e-Wallet Provider',
    id: 'Bank/Penyedia e-Wallet',
  },
  accountNumber: { en: 'Account Number', id: 'Nomor Rekening' },
  accountHolderName: {
    en: 'Account Holder Name',
    id: 'Nama Pemilik Rekening',
  },

  // Photo Collection.
  photoCollectionName: { en: 'Photo Collection', id: 'Koleksi Foto' },
  photoCollectionDescription: {
    en: 'Showcase all your pre-wedding photos',
    id: 'Tampilkan semua foto pre-wedding kamu',
  },
  photoGallery: { en: 'Photo Gallery', id: 'Galeri Foto' },

  // MemoRoll.
  memoRollName: { en: 'MemoRoll', id: 'MemoRoll' },
  memoRollEnable: { en: 'Enable MemoRoll?', id: 'Aktifkan MemoRoll?' },
  memoRollDescription: {
    en: "Create a collective photo experience for the wedding. Capture your wedding through every guest's lens.",
    id: 'Buat pengalaman foto bersama untuk pernikahanmu. Abadikan harimu dari sudut pandang setiap tamu.',
  },

  // What an uploader says it wants, built from the number it enforces.
  //
  // Never written by hand beside a field. The design's own guidance said "more
  // than 2 images" over a field that takes one and "more than 3" over a field
  // that takes three, and once the counts moved in hbd-9h3.6 four of the six
  // were telling couples the opposite of what the field would accept. A number
  // a person types next to another number will drift from it; a number derived
  // from it cannot.
  photoGuidanceOne: {
    en: 'One photograph, in the ratio of {ratio}',
    id: 'Satu foto, dengan rasio {ratio}',
  },
  photoGuidanceMany: {
    en: 'Exactly {count} photographs, in the ratio of {ratio}',
    id: 'Tepat {count} foto, dengan rasio {ratio}',
  },
  photoGuidanceUpTo: {
    en: 'Up to {most} photographs, in the ratio of {ratio}',
    id: 'Maksimal {most} foto, dengan rasio {ratio}',
  },
  photoGuidanceBetween: {
    en: 'Between {count} and {most} photographs, in the ratio of {ratio}',
    id: 'Antara {count} sampai {most} foto, dengan rasio {ratio}',
  },
  // The ratios themselves, because "4:3 or 16:9" put an English "or" in the
  // middle of an Indonesian sentence.
  ratioStandard: { en: '4:3', id: '4:3' },
  ratioWide: { en: '4:3 or 16:9', id: '4:3 atau 16:9' },

  tooManyPhotos: {
    en: '{file} is more than the {limit} this field takes',
    id: '{file} melebihi {limit} yang diterima kolom ini',
  },

  // Uploaders.
  uploadPrompt: {
    en: 'Drop file here or click to upload',
    id: 'Letakkan berkas di sini atau klik untuk mengunggah',
  },

  // What an unanswered field says, underneath itself.
  //
  // Named rather than generic - "This field is required" under a field whose
  // label is right above it says nothing the couple cannot see, and the same
  // sentence under nineteen fields reads as noise rather than as an answer to
  // give. `{field}` is replaced with the field's own label.
  requiredField: {
    en: '{field} is required',
    id: '{field} wajib diisi',
  },
  // Counting fields say the number. A couple who added two polaroids has
  // answered the field and still cannot continue, and "required" would be a
  // lie to them.
  requiredPhotos: {
    en: 'Add at least {count} photographs',
    id: 'Tambahkan minimal {count} foto',
  },

  // Site Preview.
  sitePreview: { en: 'Site Preview', id: 'Pratinjau Situs' },
  playPreview: { en: 'Play Preview', id: 'Putar Pratinjau' },

  // Step descriptions, as the stepper draws them under each title.
  stepChooseTemplateDescription: {
    en: 'Pick a template design that calls to your dream wedding',
    id: 'Pilih desain template yang paling sesuai dengan pernikahan impianmu',
  },
  stepDetailsAndStoryDescription: {
    en: 'Add photos, music, and story details.',
    id: 'Tambahkan foto, musik, dan detail cerita.',
  },
  // The English reproduces the design's own wording, typo and all, per
  // `docs/adr/0002-figma-is-literal-truth.md`. The Indonesian does not copy the
  // mistake: a typo is not a thing to translate.
  stepGuestInvitesDescription: {
    en: 'Config guest details on your the invites',
    id: 'Atur detail tamu pada undanganmu',
  },
  stepShareWithGuestsDescription: {
    en: 'Easily share your invitation to invited guests.',
    id: 'Bagikan undanganmu dengan mudah kepada para tamu.',
  },

  // The photo drop zone.
  uploadAddPhotos: { en: 'Add More Photos', id: 'Tambah Foto' },
  uploadInProgress: { en: 'Adding Your Photos', id: 'Menambahkan Fotomu' },
  // `{limit}` is replaced with the number of photographs the field takes.
  uploadDragPrompt: {
    en: 'Drag & drop up to {limit} images from your gallery',
    id: 'Seret & lepas hingga {limit} gambar dari galerimu',
  },

  // Guest invites details.
  customiseInvitation: {
    en: 'Customize your invitation',
    id: 'Sesuaikan undanganmu',
  },
  customDomain: {
    en: 'Custom Your Web Domain',
    id: 'Atur Alamat Web Undangan',
  },
  // The address a couple may choose, and what the backend says about the one
  // they chose. "Available" and "taken" are said about the address rather than
  // about them: a name somebody else got to first is not a mistake they made.
  slugRuleHint: {
    en: 'Letters, numbers and hyphens only, 3 to 63 characters, starting and ending with a letter or a number',
    id: 'Hanya huruf, angka dan tanda hubung, 3 sampai 63 karakter, diawali dan diakhiri huruf atau angka',
  },
  slugChecking: { en: 'Checking…', id: 'Mengecek…' },
  slugAvailable: {
    en: 'This address is available',
    id: 'Alamat ini tersedia',
  },
  slugTaken: {
    en: 'Already taken, try another',
    id: 'Sudah dipakai, coba yang lain',
  },
  greetingMessage: {
    en: 'Invitation Greeting Message',
    id: 'Pesan Sambutan Undangan',
  },
  addGuestList: { en: 'Add Guest List', id: 'Tambah Daftar Tamu' },
  guestList: { en: 'Guest List', id: 'Daftar Tamu' },
  uploadCsvFormat: {
    en: 'Upload in format .CSV',
    id: 'Unggah dalam format .CSV',
  },
} satisfies Record<string, Phrase>;

export type FlowCopyKey = keyof typeof FLOW_COPY;

/** Everything the flow says, said in one language. */
export function copyIn(language: FlowLanguage): Record<FlowCopyKey, string> {
  const resolved = {} as Record<FlowCopyKey, string>;
  for (const key of Object.keys(FLOW_COPY) as FlowCopyKey[]) {
    resolved[key] = FLOW_COPY[key][language];
  }
  return resolved;
}
