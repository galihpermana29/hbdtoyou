import type { ReactNode } from 'react';

import type { LandingLanguage } from './language';

/**
 * Everything the MemoRoll landing says, in English and in Indonesian.
 *
 * One dictionary rather than an i18n library, for the reasons the wedding
 * Create Flow gives in `forms/wedding/copy.ts`: what is wanted is that a page
 * written in English can be read in Indonesian, which is a lookup.
 *
 * The Indonesian is typed as the English's own shape, so a string missing
 * from it is a type error rather than a silent fall back to English.
 *
 * The Indonesian is written the way people talk about a party, not the way a
 * form addresses them: "kamu", "nggak", "udah", "HP", and the English words
 * Indonesians already use for these things (scan, retake, first dance, host).
 *
 * The product's own terms stay names in both: MemoRoll, Roll, Shot, Reveal and
 * the Wedding Plan are what the guest screens and the plans page call them, and
 * a landing that called them something else would be describing a different
 * product. Names stay names too: "Elias & Freya" are the same couple in both.
 *
 * Nothing verifies the Indonesian. The design was drawn in English only, so
 * the translations are for a person who reads both to review.
 *
 * Every claim about the product is one the product makes good on: the Shot
 * counts are the creator flow's own bounds (`creator/draft.ts`), the venue
 * gate is the creator's switch, and saving a photo is the guest gallery's
 * Download. The proof points (the counts in the hero and the stats, the
 * rating, the reviews) are placeholders the design drew, and are marked where
 * they stand until real numbers and real hosts replace them.
 */

/** The accent the design sets the key phrase of a statement in. */
export function Hi({ children }: { children: ReactNode }) {
  return <span className="text-[#ff3e09]">{children}</span>;
}

const EN = {
  metaDescription:
    'Give every guest a camera on their phone. Their Shots stay blurred until the Reveal you set, then everyone sees the whole night at once.',

  language: {
    // Readable before a choice is made, so it says the same in both.
    group: 'Language / Bahasa',
    english: 'English',
    indonesian: 'Bahasa Indonesia',
  },

  strip: {
    long: 'NEW - MEMOROLL IS NOW INCLUDED FREE WITH THE WEDDING PLAN',
    short: 'NEW - MEMOROLL FREE WITH THE WEDDING PLAN',
  },

  hero: {
    timerLabel: 'REVEAL IN',
    photosBadge: 'PHOTOS',
    heading: 'Some days deserve more than one perspective.',
    body: 'Give every guest a camera on their phone, then see the moments you couldn’t be there for when the roll opens.',
    create: 'Create your MemoRoll',
    howItWorks: 'See how it works',
    // Placeholder proof from the design: replace with the real count.
    proof: '1,000+ rolls developed',
    proofWhere: 'at weddings, birthdays & reunions',
    /** What a guest wrote under each of the arc's photographs, in turn. */
    captions: [
      'Elias & Freya ♡',
      'first dance!!',
      'the send-off',
      'the kiss, finally',
      "grandpa's dessert",
      'the speeches, 9:12pm',
    ],
    /** What the undeveloped prints say about themselves, in turn. */
    exposures: [
      'EXP 21/27',
      'EXP 19/27',
      'EXP 16/27 · ALMOST',
      'EXP 16/27',
      'EXP 12/27',
      'EXP 24/27',
      'EXP 08/27',
    ],
    developing: 'developing…',
  },

  idea: {
    eyebrow: 'The Idea!',
    heading: 'Everyone gets a camera. Nobody sees the roll. Then, the Reveal.',
    body: 'Each guest gets a handful of Shots and every one is final, so phones come out for the good moments and go back in the pocket for the rest of the party.',
    rules: [
      {
        title: 'No peeking',
        body: 'Your own Shots are sharp the second you take them. Everyone else’s stay blurred until the Reveal.',
      },
      {
        title: 'No retakes',
        body: 'You set 10 to 15 Shots per guest. When a Roll is spent it’s spent, so nobody wastes one on the ceiling.',
      },
      {
        title: 'One shared reveal',
        body: 'At the time you pick, every guest’s Shots open in one gallery, each print signed by whoever took it.',
      },
    ],
    galleryLabel:
      "The MemoRoll gallery for Elias & Freya's Wedding: 615 photos from 100 participants, with a countdown to the reveal",
    gallery: 'Gallery',
    endsIn: 'Ends in',
    event: 'Elias & Freya’s Wedding',
    photos: '615 Photos',
    participants: '100 Participants',
    live: '100 guests shooting right now',
  },

  how: {
    eyebrow: 'How it works',
    heading: (frames: number) =>
      `From first flash to final reveal, in ${frames === 3 ? 'three' : 'four'} frames.`,
    tabsLabel: 'How it works for',
    guestTab: "I'm a guest",
    hostTab: "I'm hosting",
    step: (n: number) => `Step ${n}`,
    guest: [
      {
        title: 'Scan',
        heading: 'Join the roll',
        body: 'Scan the QR code at the venue and the camera opens in your phone’s browser. There’s nothing to install.',
      },
      {
        title: 'Shoot',
        heading: 'Make them count',
        body: 'You get a set number of Shots and six film looks to shoot them in. Each Shot is final, so pick your moments.',
      },
      {
        title: 'Reveal',
        heading: 'One roll, every angle',
        body: 'When the Reveal comes, everyone’s Shots open together in one shared gallery.',
      },
      {
        title: 'Relive',
        heading: 'See what you missed',
        body: 'Swipe through the night as everyone else saw it, find out who took each print, and save your favourites.',
      },
    ],
    host: [
      {
        title: 'Activate',
        heading: 'Set the scene',
        body: 'Name your event, pick a cover, choose how many Shots each guest gets, and set the time of the Reveal.',
      },
      {
        title: 'Invite',
        heading: 'Pass the roll around',
        body: 'Put your event QR code on the tables or the screen. Each guest who scans it gets a Roll of their own.',
      },
      {
        title: 'Enjoy',
        heading: 'Be there for the moment',
        body: 'Keep your phone in your pocket. Your guests have the room covered, and you’ll see all of it at the Reveal.',
      },
    ],
  },

  why: {
    label: 'Why would I want this?',
    slides: [
      <>
        Why would I want this <Hi>MemoRoll</Hi>?
      </>,
      <>
        You <Hi>can&apos;t be everywhere</Hi> at once...
      </>,
      <>
        The <Hi>unscripted joy</Hi> happening around the room
      </>,
      <>
        <Hi>Your friends</Hi> are taking over the dance floor.
      </>,
      <>
        Your <Hi>parents are having a moment</Hi> in the corner.
      </>,
      <>
        You won&apos;t see all of it while it&apos;s happening.{' '}
        <Hi>But someone will.</Hi>
      </>,
      <>
        <Hi>MemoRoll brings those moments back</Hi> to you, captured by the
        people who were actually there.
      </>,
    ] as ReactNode[],
  },

  occasions: {
    eyebrow: 'For any Occasions',
    heading: 'Weddings, birthdays, and every night out in between',
    cards: [
      {
        title: 'Birthdays',
        body: 'Your day, through everyone else’s eyes. Catch the candles, the chaos, and the little moments you were too busy celebrating to see.',
      },
      {
        title: 'Weddings',
        body: 'A hundred guests, a hundred angles. From the first look to the last dance, see what was happening behind you at the altar.',
      },
      {
        title: 'Friends & Gatherings',
        body: 'The nights you wish lasted longer. Everyone shoots their own corner of it, and the group chat gets the whole story at the Reveal.',
      },
    ],
  },

  testimonials: {
    eyebrow: 'Stories from the roll',
    heading: 'Told by the people who were there.',
    // Placeholder proof from the design, the reviews below included: replace
    // with real hosts' words and real figures before launch.
    rating: '4.9',
    ratingFrom: 'from all MemoRoll hosts',
    stars: '5 out of 5 stars',
    featured: {
      quote:
        'We got 600 photos back the morning after our wedding, and half of them were moments we never saw. My grandma dancing. Our friends crying during the vows. It felt like reliving the whole night.',
      meta: 'Wedding · 100 guests · 615 photos',
      photoAlt: 'Elias and Freya with their wedding guests',
      caption: 'the whole gang ♡',
    },
    reviews: [
      {
        quote:
          'The best part of my 30th (Dirty Thirty Baby!) was the next morning. Opening the roll felt like Christmas.',
        meta: 'Birthday Party · 32 guests',
      },
      {
        quote:
          'Zero setup. Everyone scanned the card on the table and started shooting. Our class group chat still talks about the reveal.',
        meta: 'Class of ‘18 Gathering · 58 guests',
      },
    ],
    stats: [
      { value: '1,000+', label: 'rolls developed' },
      { value: '2.3k', label: 'photos revealed' },
      { value: '96%', label: 'of hosts would roll again' },
      { value: '0', label: 'apps to download' },
    ],
  },

  faq: {
    heading: 'Questions, developed.',
    body: 'Everything you need to know before handing out the cameras.',
    curious: 'Still curious?',
    replies: 'Write to us and a person from our team will answer.',
    items: [
      {
        q: 'Do guests need to download an app?',
        a: 'No. Guests scan your event QR code and the camera opens in their phone’s browser. They sign in once, so their Roll follows them if they switch phones.',
      },
      {
        q: 'How many photos can each guest take?',
        a: 'You choose, from 10 to 15 Shots per guest. There are no retakes, and the counter on the camera shows how many are left.',
      },
      {
        q: 'When do the photos get revealed?',
        a: 'Guests see their own Shots as they take them. Everyone else’s stay blurred until the Reveal, the time you set. Shooting ends then too, and every guest opens the whole roll.',
      },
      {
        q: 'Can people who aren’t at the event join in?',
        a: 'Only if you let them. You can lock the camera to phones within 500m of your venue, so the roll is shot by the people in the room.',
      },
      {
        q: 'Who can see the gallery?',
        a: 'Anyone with your event’s QR code or link. Share it with the people you want there.',
      },
      {
        q: 'Can we keep the photos?',
        a: 'Yes. Any guest can open a photo in the gallery and save it to their phone.',
      },
      {
        q: 'How much does a MemoRoll cost?',
        a: 'MemoRoll is included with the Wedding Plan at no extra cost. See the plan for details.',
      },
    ],
  },

  plan: {
    pill: 'Included in the Wedding Plan',
    heading: 'MemoRoll is on the house with your Wedding Plan.',
    body: 'Book the Wedding Plan and MemoRoll comes with it for Rp0. Every guest gets a camera, and the whole roll opens together at the Reveal you choose.',
    cta: 'Get the Wedding Plan',
    details: 'See what’s in the plan',
    cardBrand: 'Memoify · Wedding Plan',
    cardTitle: 'What’s in your plan',
    planName: 'Wedding Plan',
    planBody: 'Everything for your big day',
    memorollBody: 'A camera for every guest',
    addOn: 'Add-on',
    free: 'Free',
    extraCost: 'Extra cost for MemoRoll',
  },
};

export type LandingCopy = typeof EN;

const ID: LandingCopy = {
  metaDescription:
    'Kasih kamera ke semua tamu, langsung di HP mereka. Fotonya baru kebuka pas Reveal, jadi semua orang lihat keseruannya bareng-bareng.',

  language: EN.language,

  strip: {
    long: 'BARU - MEMOROLL SEKARANG GRATIS DI WEDDING PLAN',
    short: 'BARU - MEMOROLL GRATIS DI WEDDING PLAN',
  },

  hero: {
    timerLabel: 'REVEAL DALAM',
    photosBadge: 'FOTO',
    heading: 'Satu momen, banyak sudut pandang.',
    body: 'Kasih kamera ke semua tamu langsung di HP mereka, terus lihat momen yang kamu lewatin pas roll-nya dibuka.',
    create: 'Bikin MemoRoll kamu',
    howItWorks: 'Lihat cara kerjanya',
    proof: '1.000+ roll udah dicetak',
    proofWhere: 'dari nikahan, ultah, sampai reunian',
    captions: [
      'Elias & Freya ♡',
      'first dance!!',
      'pas pamitan',
      'akhirnya ciuman jugaa',
      'dessert-nya kakek',
      'sambutan, 21.12',
    ],
    exposures: [
      'EXP 21/27',
      'EXP 19/27',
      'EXP 16/27 · DIKIT LAGI',
      'EXP 16/27',
      'EXP 12/27',
      'EXP 24/27',
      'EXP 08/27',
    ],
    developing: 'lagi dicetak…',
  },

  idea: {
    eyebrow: 'Idenya!',
    heading:
      'Semua pegang kamera. Nggak ada yang bisa lihat hasilnya. Sampai Reveal.',
    body: 'Jatah Shot tiap tamu terbatas dan nggak bisa diulang, jadi HP cuma keluar buat momen yang bagus, terus balik lagi ke kantong.',
    rules: [
      {
        title: 'Nggak boleh ngintip',
        body: 'Foto kamu langsung kelihatan jelas. Foto tamu lain tetap blur sampai Reveal.',
      },
      {
        title: 'Nggak ada retake',
        body: 'Kamu yang atur, 10 sampai 15 Shot per tamu. Kalau udah habis ya habis, jadi nggak ada yang buang jatah buat motret plafon.',
      },
      {
        title: 'Satu Reveal, bareng-bareng',
        body: 'Di jam yang kamu pilih, foto semua tamu kebuka di satu galeri, lengkap sama nama yang motret.',
      },
    ],
    galleryLabel:
      'Galeri MemoRoll Pernikahan Elias & Freya: 615 foto dari 100 tamu, dengan hitung mundur ke Reveal',
    gallery: 'Galeri',
    endsIn: 'Selesai dalam',
    event: 'Pernikahan Elias & Freya',
    photos: '615 Foto',
    participants: '100 Tamu',
    live: '100 tamu lagi motret',
  },

  how: {
    eyebrow: 'Cara kerjanya',
    heading: (frames: number) =>
      `Dari jepretan pertama sampai Reveal, cukup ${frames === 3 ? 'tiga' : 'empat'} frame.`,
    tabsLabel: 'Cara kerjanya buat',
    guestTab: 'Aku tamu',
    hostTab: 'Aku host',
    step: (n: number) => `Langkah ${n}`,
    guest: [
      {
        title: 'Scan',
        heading: 'Gabung ke roll',
        body: 'Scan QR di venue, kamera langsung kebuka di browser HP kamu. Nggak perlu install apa-apa.',
      },
      {
        title: 'Jepret',
        heading: 'Bikin tiap jepretan berarti',
        body: 'Jatah Shot kamu terbatas, dan ada enam pilihan look film. Tiap Shot nggak bisa diulang, jadi pilih momennya baik-baik.',
      },
      {
        title: 'Reveal',
        heading: 'Satu roll, semua sudut',
        body: 'Pas Reveal tiba, foto semua tamu kebuka bareng di satu galeri.',
      },
      {
        title: 'Kenang',
        heading: 'Lihat yang kamu lewatin',
        body: 'Lihat acaranya dari mata semua orang, cek siapa yang motret, terus simpan yang kamu suka.',
      },
    ],
    host: [
      {
        title: 'Siapkan',
        heading: 'Atur acaranya',
        body: 'Kasih nama acara, pilih cover, tentuin jatah Shot tiap tamu, terus atur jam Reveal-nya.',
      },
      {
        title: 'Undang',
        heading: 'Sebar roll-nya',
        body: 'Taruh QR acaramu di meja atau di layar. Tiap tamu yang scan langsung dapat Roll sendiri.',
      },
      {
        title: 'Nikmati',
        heading: 'Fokus ke momennya',
        body: 'Simpan HP kamu. Tamu-tamu udah motret seisi ruangan, dan kamu bakal lihat semuanya pas Reveal.',
      },
    ],
  },

  why: {
    label: 'Kenapa harus pakai MemoRoll?',
    slides: [
      <>
        Kenapa harus pakai <Hi>MemoRoll</Hi>?
      </>,
      <>
        Kamu <Hi>nggak bisa ada di mana-mana</Hi> sekaligus...
      </>,
      <>
        <Hi>Keseruan dadakan</Hi> di setiap sudut ruangan
      </>,
      <>
        <Hi>Teman-temanmu</Hi> lagi nguasain lantai dansa.
      </>,
      <>
        <Hi>Orang tuamu lagi sweet-sweetnya</Hi> di pojokan.
      </>,
      <>
        Kamu nggak bakal lihat semuanya pas lagi kejadian.{' '}
        <Hi>Tapi orang lain lihat.</Hi>
      </>,
      <>
        <Hi>MemoRoll ngumpulin semua momen itu</Hi> buat kamu, langsung dari
        kamera orang-orang yang beneran ada di sana.
      </>,
    ],
  },

  occasions: {
    eyebrow: 'Buat Acara Apa Aja',
    heading: 'Nikahan, ulang tahun, sampai nongkrong bareng teman',
    cards: [
      {
        title: 'Ulang Tahun',
        body: 'Harimu, dari mata semua orang. Ada tiup lilin, keseruan, dan momen kecil yang kelewat karena kamu sibuk dirayain.',
      },
      {
        title: 'Pernikahan',
        body: 'Seratus tamu, seratus sudut. Dari first look sampai dansa terakhir, lihat apa aja yang terjadi di belakang pelaminan.',
      },
      {
        title: 'Teman & Nongkrong',
        body: 'Malam yang rasanya kecepetan selesai. Semua motret dari sudutnya masing-masing, dan grup chat dapat cerita lengkapnya pas Reveal.',
      },
    ],
  },

  testimonials: {
    eyebrow: 'Cerita dari roll',
    heading: 'Kata mereka yang ada di sana.',
    rating: '4,9',
    ratingFrom: 'dari semua host MemoRoll',
    stars: '5 dari 5 bintang',
    featured: {
      quote:
        'Besok paginya kami dapat 600 foto, dan setengahnya momen yang sama sekali nggak kami lihat. Nenek joget. Teman-teman nangis pas janji nikah. Rasanya kayak ngulang malam itu lagi.',
      meta: 'Pernikahan · 100 tamu · 615 foto',
      photoAlt: 'Elias dan Freya bareng tamu-tamu pernikahan mereka',
      caption: 'geng lengkap ♡',
    },
    reviews: [
      {
        quote:
          'Bagian terbaik ultah ke-30 aku (Dirty Thirty Baby!) justru besok paginya. Buka roll-nya berasa kayak buka kado.',
        meta: 'Ultah · 32 tamu',
      },
      {
        quote:
          'Nggak ribet sama sekali. Tamu tinggal scan kartu di meja, terus langsung motret. Grup angkatan kami sampai sekarang masih bahas Reveal-nya.',
        meta: 'Reuni Angkatan ‘18 · 58 tamu',
      },
    ],
    stats: [
      { value: '1.000+', label: 'roll udah dicetak' },
      { value: '2,3rb', label: 'foto udah kebuka' },
      { value: '96%', label: 'host mau pakai lagi' },
      { value: '0', label: 'aplikasi yang perlu diunduh' },
    ],
  },

  faq: {
    heading: 'Pertanyaan, udah dicetak.',
    body: 'Semua yang perlu kamu tahu sebelum bagi-bagi kamera.',
    curious: 'Masih penasaran?',
    replies: 'Email kami aja, nanti tim kami yang jawab langsung.',
    items: [
      {
        q: 'Tamu harus download aplikasi?',
        a: 'Nggak. Tamu tinggal scan QR acaramu, kamera langsung kebuka di browser HP. Cukup login sekali, Roll-nya tetap ikut walaupun ganti HP.',
      },
      {
        q: 'Tiap tamu bisa foto berapa kali?',
        a: 'Kamu yang tentuin, 10 sampai 15 Shot per tamu. Nggak ada retake, dan sisa jatahnya kelihatan di kamera.',
      },
      {
        q: 'Kapan fotonya bisa dilihat?',
        a: 'Foto sendiri langsung bisa dilihat. Foto tamu lain tetap blur sampai Reveal, di jam yang kamu atur. Motretnya juga selesai di situ, terus semua tamu bisa buka satu roll penuh.',
      },
      {
        q: 'Orang yang nggak datang bisa ikut motret?',
        a: 'Cuma kalau kamu bolehin. Kamera bisa dikunci buat HP dalam radius 500m dari venue aja, jadi isinya dari orang-orang yang beneran datang.',
      },
      {
        q: 'Siapa aja yang bisa lihat galerinya?',
        a: 'Siapa pun yang punya QR atau link acaramu. Bagiin aja ke orang-orang yang kamu mau.',
      },
      {
        q: 'Fotonya bisa disimpan?',
        a: 'Bisa. Tamu tinggal buka foto di galeri, terus simpan ke HP.',
      },
      {
        q: 'Berapa harga MemoRoll?',
        a: 'Gratis kalau kamu ambil Wedding Plan. Cek detail paketnya, ya.',
      },
    ],
  },

  plan: {
    pill: 'Udah termasuk di Wedding Plan',
    heading: 'MemoRoll gratis buat kamu yang ambil Wedding Plan.',
    body: 'Ambil Wedding Plan, MemoRoll langsung ikut dengan harga Rp0. Semua tamu dapat kamera, dan satu roll penuh kebuka bareng pas Reveal yang kamu pilih.',
    cta: 'Ambil Wedding Plan',
    details: 'Lihat isi paketnya',
    cardBrand: 'Memoify · Wedding Plan',
    cardTitle: 'Isi paketmu',
    planName: 'Wedding Plan',
    planBody: 'Semua buat hari besarmu',
    memorollBody: 'Kamera buat semua tamu',
    addOn: 'Add-on',
    free: 'Gratis',
    extraCost: 'Biaya tambahan MemoRoll',
  },
};

export const LANDING_COPY: Record<LandingLanguage, LandingCopy> = {
  en: EN,
  id: ID,
};
