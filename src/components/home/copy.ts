/**
 * Everything the home page says, in English and in Indonesian.
 *
 * `/` is the English page and `/id` the Indonesian one: two addresses, so a
 * search engine can index each language on its own, and the language is
 * settled on the server rather than by a switch after the page has loaded.
 * Every section is handed the language by the page and looks its words up
 * here, the way MemoRoll's landing does (`memoroll/landing/copy.tsx`).
 *
 * The Indonesian is typed as the English's own shape, so a string missing
 * from it is a type error rather than a silent fall back to English.
 *
 * The Indonesian is written the way a young Indonesian brand talks to its
 * people, not translated word for word: "kamu", "bikin", "nggak", and the
 * English words Indonesians already use for these things (template, link,
 * upload, scrapbook, playlist, inside jokes). Product names stay names:
 * Memoify, MemoRoll, Premium, Photobox.
 *
 * What the backend or the people who made something wrote is not here and
 * is not translated: plan names and features, the new template's own lines
 * (`lib/new-template.ts`), what people wrote in the feedback form, and the
 * gifts themselves.
 *
 * Nothing verifies the Indonesian. It is for a person who reads both to
 * review.
 */

export type HomeLanguage = 'en' | 'id';

/** Where each language version of the home page lives. */
export const HOME_PATH: Record<HomeLanguage, string> = { en: '/', id: '/id' };

const EN = {
  hero: {
    pill: 'Digital gifts, made personal',
    newTag: 'New',
    /** Read out whole, while the eye sees the last word changing. */
    headingSpoken: 'Turn your memories into a gift they can open',
    headingLead: 'Turn your memories into',
    body: "Pick a style, add your photos and a few words, and send one link. They open it on their phone, and it's all about them.",
    create: 'Create a gift',
    browse: 'Browse templates',
    proof: 'Free to start · 9,000+ people have made one',
    stylesBadge: 'STYLES',
    hint: 'tap a gift to flip to the next one',
  },

  deck: {
    label: 'Examples of gifts made with Memoify',
    next: 'Show the next gift',
    jump: (word: string) => `Show the gift made as ${word}`,
    /** What the memories become, as the headline's last word says it. */
    words: {
      series: 'a series',
      playlist: 'a playlist',
      magazine: 'a magazine',
      frontpage: 'front-page news',
      scrapbook: 'a scrapbook',
      game: 'a game',
    } as Record<string, string>,
    alts: {
      series: 'A gift made as the page of a streaming series',
      playlist: 'A gift made as a music playlist',
      magazine: 'A gift made as a magazine spread',
      frontpage: 'A gift made as a newspaper front page',
      scrapbook: 'A gift made as a scrapbook',
      game: 'A gift made as a claw-machine game',
    } as Record<string, string>,
  },

  occasions: {
    label: 'Occasions',
    items: [
      'Birthdays',
      'Anniversaries',
      'Graduations',
      'Long-distance',
      'Farewells',
      "Mother's Day",
      'Just because',
    ],
  },

  fresh: {
    section: (name: string) => `New: ${name}`,
    tag: 'Just dropped',
    make: 'Make one',
    sample: 'Open the sample',
    tryHere: 'Try it here',
    tryLabel: (name: string) => `Try ${name} here`,
    frame: (name: string) => `${name}, a sample you can play`,
    stop: 'Stop',
    plays: 'It plays right here, sound and all',
    still: (name: string) => `${name}, as it looks when opened`,
  },

  how: {
    eyebrow: 'How it works',
    title: 'Three steps. No design skills.',
    body: 'You bring the photos and the inside jokes. The template does the rest.',
    pick: {
      title: 'Pick a style',
      body: 'A series page, a playlist, a magazine, a scrapbook, a game. Start from the one that sounds like them.',
    },
    add: {
      title: 'Add your photos and words',
      body: 'Upload pictures, write the captions, drop in a song. A form, not a design tool.',
      greeting: 'Happy birthday, Sarah',
      memory: 'Remember that night in Bandung…',
    },
    send: {
      title: 'Send one link',
      body: 'Copy the link, share it, or print the QR code on a card. It opens on any phone, no app.',
      qr: 'A QR code that opens memoify.live',
      address: 'memoify.live/for-sarah',
      share: 'Share gift',
    },
  },

  products: {
    eyebrow: 'What you can make',
    title: 'One place for every kind of keepsake',
    body: 'A gift to open, a book to flip through, a letter to keep, a party to shoot.',
    newTag: 'New',
    website: {
      title: 'Website gifts',
      body: 'Their story as a series, a playlist, a magazine, a front page or a game. One link, opened on any phone.',
      alt: 'A website gift made as a streaming series page',
    },
    memoroll: {
      title: 'MemoRoll',
      body: 'A shared disposable camera for your party. Guests shoot, the photos develop when the night is over.',
    },
    scrapbook: {
      title: 'Scrapbooks',
      body: 'Upload your photos and let the AI lay out a book you can flip through.',
      alt: "Scrapbook pages made from a couple's photos",
    },
    journal: {
      title: 'Journals',
      body: 'A love letter written like a research paper: abstract, preamble and all.',
      alt: 'A letter laid out as an academic journal',
    },
    photobox: {
      title: 'Photobox',
      body: 'A photo booth in the browser, with frames worth printing.',
      alt: 'Photo-booth strips with playful frames',
    },
  },

  demo: {
    eyebrow: 'Try it here',
    title: "Don't take our word for it. Open one.",
    body: 'Click around inside. This is the real gift your person would get, not a video of it.',
    /** The tabs over the running gift (newlanding/HeroGiftPreview.tsx). */
    preview: {
      group: 'Gift preview',
      details: {
        memoflix: 'Netflix parody gift',
        claw: 'Playable arcade gift',
        scrapbook: 'Flip through pages',
      } as Record<string, string>,
      frame: (label: string) => `${label} gift preview`,
    },
  },

  inspiration: {
    label: 'Inspiration',
    eyebrow: 'Inspiration',
    title: 'Made by people like you',
    body: 'Real gifts their makers chose to share. Open one and borrow the idea.',
    wall: 'See the whole wall',
    tile: (label: string) => `A ${label} someone made. Opens in a new tab`,
  },

  stats: {
    label: 'Memoify in numbers',
    figures: [
      {
        value: '9,000+',
        label: 'people have joined',
        note: 'and made something for someone',
      },
      {
        value: '1,000+',
        label: 'went Premium',
        note: 'to make more, on every style',
      },
      {
        value: '15+',
        label: 'styles to start from',
        note: 'with new ones added often',
      },
    ],
  },

  testimonials: {
    label: 'What people say',
    eyebrow: 'In their words',
    title: 'What people told us after making one',
    body: 'Straight from our feedback form. Typos and caps lock included.',
    source: 'FEEDBACK FORM',
    /** The month a note was sent, as lib/testimonials.ts writes it. */
    month: (when: string) => when,
    more: (count: number) => `Read ${count} more`,
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Start free. Top up when you want more.',
    body: 'Make a free gift every day. Go Premium for every style and more room for photos.',
    couponBefore: 'Use code',
    couponAfter: (discount: string) =>
      ` for ${discount}. It is already applied at checkout.`,
    percentOff: (value: number) => `${value}% off`,
    amountOff: (amount: string) => `IDR ${amount} off`,
    featured: 'Most picked',
    was: 'Was',
    startFree: 'Start free',
    get: (plan: string) => `Get ${plan}`,
    signIn: 'Sign in with Google',
  },

  faq: {
    title: 'Good questions, short answers',
    languageGroup: 'Language',
    curious: 'Still curious?',
    write: 'Write to us. A person answers.',
  },

  closing: {
    title: 'Make something they will keep.',
    body: 'Your first gift is free, and takes less time than choosing a card.',
  },

  language: {
    label: 'Read this page in',
  },
};

export type HomeCopy = typeof EN;

const ID_MONTHS: Record<string, string> = {
  January: 'Januari',
  February: 'Februari',
  March: 'Maret',
  April: 'April',
  May: 'Mei',
  June: 'Juni',
  July: 'Juli',
  August: 'Agustus',
  September: 'September',
  October: 'Oktober',
  November: 'November',
  December: 'Desember',
};

const ID: HomeCopy = {
  hero: {
    pill: 'Kado digital yang personal banget',
    newTag: 'Baru',
    headingSpoken: 'Ubah kenanganmu jadi kado digital yang bisa dia buka',
    headingLead: 'Ubah kenanganmu jadi',
    body: 'Pilih gaya, masukin foto dan sedikit kata-kata, lalu kirim satu link. Dia buka di HP-nya, dan semuanya tentang dia.',
    create: 'Bikin kado',
    browse: 'Lihat template',
    proof: 'Gratis untuk mulai · 9.000+ orang udah bikin',
    stylesBadge: 'GAYA',
    hint: 'klik kadonya buat lihat yang berikutnya',
  },

  deck: {
    label: 'Contoh kado yang dibikin pakai Memoify',
    next: 'Lihat kado berikutnya',
    jump: (word: string) => `Lihat kado berbentuk ${word}`,
    words: {
      series: 'series',
      playlist: 'playlist',
      magazine: 'majalah',
      frontpage: 'berita utama',
      scrapbook: 'scrapbook',
      game: 'game',
    },
    alts: {
      series: 'Kado berbentuk halaman series streaming',
      playlist: 'Kado berbentuk playlist musik',
      magazine: 'Kado berbentuk halaman majalah',
      frontpage: 'Kado berbentuk halaman depan koran',
      scrapbook: 'Kado berbentuk scrapbook',
      game: 'Kado berbentuk game claw machine',
    },
  },

  occasions: {
    label: 'Momen',
    items: [
      'Ulang tahun',
      'Anniversary',
      'Wisuda',
      'LDR',
      'Perpisahan',
      'Hari Ibu',
      'Tanpa alasan khusus',
    ],
  },

  fresh: {
    section: (name: string) => `Baru: ${name}`,
    tag: 'Baru rilis',
    make: 'Bikin sekarang',
    sample: 'Buka contohnya',
    tryHere: 'Coba di sini',
    tryLabel: (name: string) => `Coba ${name} di sini`,
    frame: (name: string) => `${name}, contoh yang bisa kamu mainkan`,
    stop: 'Berhenti',
    plays: 'Main langsung di sini, lengkap dengan suara',
    still: (name: string) => `${name}, tampilannya saat dibuka`,
  },

  how: {
    eyebrow: 'Cara kerjanya',
    title: 'Tiga langkah. Nggak perlu jago desain.',
    body: 'Kamu siapin foto dan inside jokes kalian. Sisanya biar template yang urus.',
    pick: {
      title: 'Pilih gaya',
      body: 'Halaman series, playlist, majalah, scrapbook, atau game. Mulai dari yang paling “dia banget”.',
    },
    add: {
      title: 'Masukin foto dan kata-katamu',
      body: 'Upload foto, tulis caption, tambahin lagu. Cukup isi form, bukan aplikasi desain.',
      greeting: 'Selamat ulang tahun, Sarah',
      memory: 'Inget malam itu di Bandung…',
    },
    send: {
      title: 'Kirim satu link',
      body: 'Salin link-nya, share, atau cetak QR code-nya di kartu. Bisa dibuka di HP apa aja, tanpa install aplikasi.',
      qr: 'QR code yang membuka memoify.live',
      address: 'memoify.live/buat-sarah',
      share: 'Bagikan kado',
    },
  },

  products: {
    eyebrow: 'Yang bisa kamu bikin',
    title: 'Satu tempat untuk semua jenis kenang-kenangan',
    body: 'Kado buat dibuka, buku buat dibolak-balik, surat buat disimpan, pesta buat difoto.',
    newTag: 'Baru',
    website: {
      title: 'Kado website',
      body: 'Cerita kalian jadi series, playlist, majalah, halaman depan koran, atau game. Satu link, bisa dibuka di HP apa aja.',
      alt: 'Kado website berbentuk halaman series streaming',
    },
    memoroll: {
      title: 'MemoRoll',
      body: 'Kamera sekali pakai bareng-bareng buat acaramu. Tamu yang motret, fotonya baru “jadi” setelah acaranya selesai.',
    },
    scrapbook: {
      title: 'Scrapbook',
      body: 'Upload foto-fotomu, biar AI yang nyusun jadi buku yang bisa dibolak-balik.',
      alt: 'Halaman scrapbook dari foto-foto sepasang kekasih',
    },
    journal: {
      title: 'Jurnal',
      body: 'Surat cinta yang ditulis kayak paper penelitian, lengkap dengan abstrak dan pendahuluannya.',
      alt: 'Surat yang ditata seperti jurnal ilmiah',
    },
    photobox: {
      title: 'Photobox',
      body: 'Photo booth langsung di browser, dengan frame yang layak dicetak.',
      alt: 'Strip foto photo booth dengan frame yang seru',
    },
  },

  demo: {
    eyebrow: 'Coba di sini',
    title: 'Nggak usah percaya kata kami. Buka sendiri.',
    body: 'Klik-klik aja di dalamnya. Ini kado asli yang bakal diterima orang spesialmu, bukan videonya.',
    preview: {
      group: 'Pratinjau kado',
      details: {
        memoflix: 'Kado parodi Netflix',
        claw: 'Kado arcade yang bisa dimainin',
        scrapbook: 'Bisa dibolak-balik',
      },
      frame: (label: string) => `Pratinjau kado ${label}`,
    },
  },

  inspiration: {
    label: 'Inspirasi',
    eyebrow: 'Inspirasi',
    title: 'Dibikin sama orang-orang kayak kamu',
    body: 'Kado asli yang pembuatnya pilih untuk dibagikan. Buka satu, terus contek idenya.',
    wall: 'Lihat semuanya',
    tile: (label: string) => `${label} buatan seseorang. Terbuka di tab baru`,
  },

  stats: {
    label: 'Memoify dalam angka',
    figures: [
      {
        value: '9.000+',
        label: 'orang sudah bergabung',
        note: 'dan bikin sesuatu buat seseorang',
      },
      {
        value: '1.000+',
        label: 'pakai Premium',
        note: 'biar bisa bikin lebih banyak, di semua gaya',
      },
      {
        value: '15+',
        label: 'pilihan gaya',
        note: 'dan terus bertambah',
      },
    ],
  },

  testimonials: {
    label: 'Kata mereka',
    eyebrow: 'Kata mereka',
    title: 'Cerita mereka setelah bikin kado',
    body: 'Langsung dari form feedback kami. Typo dan caps lock-nya juga apa adanya.',
    source: 'FORM FEEDBACK',
    month: (when: string) =>
      when.replace(/^[A-Za-z]+/, (month) => ID_MONTHS[month] ?? month),
    more: (count: number) => `Baca ${count} lagi`,
  },

  pricing: {
    eyebrow: 'Harga',
    title: 'Mulai gratis. Top up kalau mau lebih.',
    body: 'Bikin satu kado gratis tiap hari. Pakai Premium buat buka semua gaya dan ruang foto yang lebih lega.',
    couponBefore: 'Pakai kode',
    couponAfter: (discount: string) =>
      ` buat ${discount}. Udah otomatis kepasang pas checkout.`,
    percentOff: (value: number) => `diskon ${value}%`,
    amountOff: (amount: string) => `potongan IDR ${amount}`,
    featured: 'Paling favorit',
    was: 'Sebelumnya',
    startFree: 'Mulai gratis',
    get: (plan: string) => `Ambil ${plan}`,
    signIn: 'Masuk dengan Google',
  },

  faq: {
    title: 'Pertanyaan bagus, jawaban singkat',
    languageGroup: 'Bahasa',
    curious: 'Masih penasaran?',
    write: 'Kirim email ke kami. Yang bales orang beneran, kok.',
  },

  closing: {
    title: 'Bikin kado yang bakal dia simpan.',
    body: 'Kado pertamamu gratis, dan bikinnya lebih cepat daripada milih kartu ucapan.',
  },

  language: {
    label: 'Baca halaman ini dalam',
  },
};

export const HOME_COPY: Record<HomeLanguage, HomeCopy> = { en: EN, id: ID };
