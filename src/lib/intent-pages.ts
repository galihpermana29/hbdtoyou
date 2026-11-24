/**
 * Pages written for one thing people type into a search engine.
 *
 * The product landings say what Memoify is. Someone searching "kado ulang
 * tahun digital" is not asking that: they have an occasion and want an
 * answer to it. Each page here answers one such search, in the language it
 * is typed in, with the template previews that already exist as its
 * examples. They are Indonesian only (`/id/...`), so they have no language
 * switch.
 *
 * A page is its words and its examples; `intent-landing.tsx` draws any of
 * them. Every claim in the answers is one the site already makes in its FAQ
 * (lib/faqData.ts): free to start, a link to share, nothing to install,
 * editable from the dashboard.
 */

import { freeSlotHref } from '@/components/memoroll/landing/free-slot';

export interface IntentExample {
  /** The template's preview route, e.g. `/netflixv1`. */
  href: string;
  /** Its catalogue thumbnail, under /public. */
  image: string;
  name: string;
  line: string;
}

export interface IntentPage {
  /** Address under `/id/`. */
  slug: string;
  meta: { title: string; description: string; keywords: string[] };
  hero: { pill: string; title: string; body: string; note: string };
  examples: { eyebrow: string; title: string; body: string; see: string };
  templates: IntentExample[];
  steps: {
    eyebrow: string;
    title: string;
    body: string;
    items: { title: string; body: string }[];
  };
  reasons: {
    eyebrow: string;
    title: string;
    items: { title: string; body: string }[];
  };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  closing: { title: string; body: string; action: string; second: string };
  actions: { make: string; examples: string };
  /**
   * Where the page's buttons lead when it is not about making a gift: an
   * address to open instead of the gift creator, and where the closing
   * panel's second link goes. Left out, the page starts a gift.
   */
  start?: { href: string; secondHref: string };
  /** The place the page is about, when it is about one (a city). */
  area?: string;
}

export const BIRTHDAY: IntentPage = {
  slug: 'kado-ulang-tahun-digital',
  meta: {
    // Rewritten 2026-11-24 from what Search Console showed people typing to
    // reach this page: "kado digital gratis" (64 of its 109 impressions in a
    // week, position 8, no clicks), then "link kado ulang tahun" and its
    // cousins. The page already answered them; the title did not say so.
    title: 'Kado Digital Gratis untuk Ulang Tahun, Kirim Lewat Link | Memoify',
    description:
      'Bikin kado digital buat ulang tahun dari foto dan ucapanmu, gratis untuk mulai: ala Netflix, playlist, sampai koran. Kirimnya cukup satu link.',
    keywords: [
      'kado digital gratis',
      'kado digital',
      'link kado ulang tahun',
      'link hadiah ulang tahun',
      'kado ulang tahun digital',
      'hadiah ulang tahun digital',
      'kado ulang tahun online',
      'kado virtual ulang tahun',
      'website ucapan ulang tahun',
      'ucapan ulang tahun online',
      'kado ulang tahun untuk pacar',
      'kado ulang tahun LDR',
      'kado ulang tahun gratis',
      'kado ulang tahun unik',
    ],
  },
  hero: {
    pill: 'Kado ulang tahun digital',
    title: 'Kado ulang tahun digital yang dia buka dari HP-nya',
    body: 'Ubah foto dan ucapanmu jadi halaman khusus buat dia: series ala Netflix, playlist, halaman depan koran, sampai mesin capit. Jadi dalam beberapa menit, kirimnya cukup satu link.',
    note: 'Gratis untuk mulai · tanpa install aplikasi',
  },
  examples: {
    eyebrow: 'Contoh kado',
    title: 'Pilih bentuk kadonya',
    body: 'Semua ini bisa kamu buka dulu contohnya. Isinya nanti foto dan cerita kalian sendiri.',
    see: 'Lihat contohnya',
  },
  templates: [
    {
      href: '/netflixv1',
      image: '/thumbnails/netflixv1.jpg',
      name: 'Series ala Netflix',
      line: 'Dia jadi pemeran utama, kenangan kalian jadi episodenya.',
    },
    {
      href: '/spotifyv1',
      image: '/thumbnails/spotifyv1.jpg',
      name: 'Playlist ala Spotify',
      line: 'Lagu-lagu kalian, dengan foto dan pesan di tiap lagunya.',
    },
    {
      href: '/newspaperv3',
      image: '/thumbnails/newspaperv3.jpg',
      name: 'Halaman depan koran',
      line: 'Ulang tahunnya jadi berita utama hari ini.',
    },
    {
      href: '/magazinev1',
      image: '/thumbnails/magazinev1.jpg',
      name: 'Sampul majalah',
      line: 'Dia di sampul depan, lengkap dengan judul-judul tentang dia.',
    },
    {
      href: '/arcadeclawv1',
      image: '/thumbnails/arcadeclawv1.jpg',
      name: 'Mesin capit',
      line: 'Tiap kapsul yang kecapit membuka satu foto dan pesan.',
    },
    {
      href: '/rollofusv1',
      image: '/thumbnails/rollofusv1.jpg',
      name: 'Kamera analog',
      line: 'Dia putar filmnya, jepret, dan fotomu tercetak satu per satu.',
    },
    {
      href: '/boardofusv1',
      image: '/thumbnails/boardofusv1.jpg',
      name: 'Board game',
      line: 'Lempar dadu, tiap kotak adalah satu momen kalian.',
    },
    {
      href: '/id/scrapbook',
      image: '/thumbnails/scrapbook8.jpg',
      name: 'Scrapbook digital',
      line: 'Foto-fotomu disusun jadi buku kenangan oleh Memo-AI.',
    },
  ],
  steps: {
    eyebrow: 'Cara bikin',
    title: 'Cara bikin kado ulang tahun digital',
    body: 'Tiga langkah, bisa selesai sebelum jam 12 malam.',
    items: [
      {
        title: 'Pilih bentuk kadonya',
        body: 'Series, playlist, koran, majalah, atau game. Pilih yang paling cocok sama orangnya.',
      },
      {
        title: 'Isi foto dan ucapanmu',
        body: 'Masukin foto-foto kalian dan tulis ucapan ulang tahunnya. Tampilannya sudah diatur.',
      },
      {
        title: 'Kirim link-nya',
        body: 'Kamu dapat satu link. Kirim lewat chat, dan dia tinggal buka di HP-nya.',
      },
    ],
  },
  reasons: {
    eyebrow: 'Kenapa kado digital',
    title: 'Cocok buat yang jauh, yang mepet, dan yang pengen beda',
    items: [
      {
        title: 'Buat yang LDR',
        body: 'Nggak perlu ongkir dan nggak perlu nunggu paket. Link-nya sampai detik itu juga, di kota mana pun dia berada.',
      },
      {
        title: 'Buat yang waktunya mepet',
        body: 'Baru ingat malam ini? Kado digital jadi dalam beberapa menit dan bisa langsung dikirim pas jam 12.',
      },
      {
        title: 'Lebih personal dari kartu ucapan',
        body: 'Isinya foto kalian, cerita kalian, dan kata-katamu sendiri. Bukan template ucapan yang sama buat semua orang.',
      },
      {
        title: 'Bisa dibuka lagi kapan pun',
        body: 'Link-nya tetap bisa dibuka setelah hari ulang tahunnya lewat, jadi kenangannya nggak hilang di chat.',
      },
    ],
  },
  faq: {
    eyebrow: 'Pertanyaan',
    title: 'Yang sering ditanyain',
    items: [
      {
        q: 'Apa itu kado ulang tahun digital?',
        a: 'Kado ulang tahun digital adalah hadiah yang dikirim lewat link, bukan lewat paket. Di Memoify bentuknya halaman web yang kamu isi dengan foto dan ucapanmu sendiri, misalnya halaman ala Netflix, playlist, koran, atau game kecil yang bisa dia mainkan.',
      },
      {
        q: 'Apakah kado ulang tahun digital di Memoify gratis?',
        a: 'Kamu bisa mulai gratis dengan template yang gratis. Sebagian template dan fitur lain perlu paket Premium atau Advance.',
      },
      {
        q: 'Gimana cara ngirim kadonya?',
        a: 'Setelah kadonya jadi, kamu dapat satu link unik. Kirim link itu lewat WhatsApp, DM, atau chat apa pun. Penerimanya bisa membuka di perangkat apa saja tanpa perlu daftar atau install aplikasi.',
      },
      {
        q: 'Bisa diedit setelah dikirim?',
        a: 'Bisa. Semua kado tersimpan di Dashboard. Kamu bisa mengedit atau menghapusnya kapan saja, dan link yang sudah dikirim otomatis menampilkan versi terbarunya.',
      },
      {
        q: 'Cocok buat siapa aja?',
        a: 'Buat pacar, sahabat, orang tua, atau siapa pun yang punya foto dan cerita bareng kamu. Paling sering dipakai buat pacar yang LDR, karena kadonya sampai tanpa perlu dikirim paket.',
      },
      {
        q: 'Bayarnya pakai apa kalau mau Premium?',
        a: 'Pembayaran bisa lewat QRIS dan PayPal.',
      },
    ],
  },
  closing: {
    title: 'Ulang tahunnya sebentar lagi?',
    body: 'Bikin kadonya sekarang. Gratis untuk mulai, dan link-nya langsung bisa dikirim.',
    action: 'Bikin kado ulang tahun',
    second: 'Lihat kado orang lain',
  },
  actions: { make: 'Bikin kado', examples: 'Lihat contoh' },
};

/** The chat a free MemoRoll slot is asked for in (memoroll/landing/free-slot.ts). */
const MEMOROLL_SLOT = freeSlotHref('id');

/**
 * MemoRoll for a wedding in Batam.
 *
 * The owner wants MemoRoll found city by city, starting with Batam, where
 * he claims it as the first (2026-11-21). A city page earns its place only
 * by saying something the product page does not, so this one is short and
 * about the place: any venue in the city, guests who fly or ferry in, how
 * to ask for a slot. It sends the reader to the MemoRoll landing for the
 * product itself and does not repeat it.
 *
 * It claims nothing about events held or venues served; add those when
 * there are real ones to name.
 */
export const BATAM_CAMERA: IntentPage = {
  slug: 'kamera-digital-pernikahan-batam',
  area: 'Batam',
  start: { href: MEMOROLL_SLOT, secondHref: '/id/kamera-tamu-pernikahan' },
  meta: {
    title: 'Kamera Digital Pernikahan di Batam | MemoRoll by Memoify',
    description:
      'Kamera digital pernikahan pertama di Batam: tamu scan QR, motret dari HP, semua foto kebuka bareng pas Reveal. Gratis sampai akhir 2026, pesan lewat WhatsApp.',
    keywords: [
      'kamera digital pernikahan batam',
      'kamera digital pernikahan di batam',
      'kamera tamu pernikahan batam',
      'kamera sekali pakai pernikahan batam',
      'disposable camera wedding batam',
      'disposable camera batam',
      'foto tamu pernikahan batam',
      'photobooth pernikahan batam',
      'wedding batam',
    ],
  },
  hero: {
    pill: 'Kamera pernikahan di Batam',
    title: 'Kamera digital pernikahan pertama di Batam',
    body: 'Buat resepsi di Batam, di hotel, gedung, restoran, atau pinggir pantai: tiap tamu dapat kamera sekali pakai di HP-nya. Mereka scan QR, jepret, dan semua foto kebuka bareng pas Reveal.',
    note: 'Gratis sampai akhir 2026 · pesan lewat WhatsApp',
  },
  examples: {
    eyebrow: 'Lihat dulu',
    title: 'Coba sebelum hari-H',
    body: 'Lihat cara kerjanya, coba layar yang nanti dipakai tamu, atau langsung tanya ke kami.',
    see: 'Buka',
  },
  templates: [
    {
      href: '/id/kamera-tamu-pernikahan',
      image: '/memoroll-landing/arc-4.webp',
      name: 'Cara kerja MemoRoll',
      line: 'Penjelasan lengkapnya, dari QR di meja tamu sampai Reveal.',
    },
    {
      href: '/memoroll/demo',
      image: '/memoroll-landing/arc-2.webp',
      name: 'Demo kamera tamu',
      line: 'Coba sendiri layar yang nanti dipakai tamu-tamumu.',
    },
    {
      href: MEMOROLL_SLOT,
      image: '/memoroll-landing/arc-3.webp',
      name: 'Tanya lewat WhatsApp',
      line: 'Ceritain acaramu di Batam, kami bantu siapin slotnya.',
    },
  ],
  steps: {
    eyebrow: 'Cara pesan',
    title: 'Cara pakai MemoRoll di pernikahanmu di Batam',
    body: 'Tiga langkah, semuanya bisa diurus dari HP.',
    items: [
      {
        title: 'Ambil slot lewat WhatsApp',
        body: 'Chat kami dan sebutin tanggal acaramu. Slotnya gratis sampai akhir 2026.',
      },
      {
        title: 'Atur acaramu',
        body: 'Kasih nama pernikahannya, pilih cover, tentuin jatah Shot tiap tamu, dan atur jam Reveal.',
      },
      {
        title: 'Taruh QR di venue',
        body: 'Di meja tamu, pintu masuk, atau layar dekat pelaminan. Tamu scan, lalu langsung bisa motret.',
      },
    ],
  },
  reasons: {
    eyebrow: 'Kenapa cocok buat Batam',
    title: 'Dipakai di venue mana pun, oleh tamu dari mana pun',
    items: [
      {
        title: 'Jalan di venue mana pun',
        body: 'MemoRoll dibuka di browser HP tamu. Bisa dipakai di hotel, gedung, restoran, atau acara outdoor, selama ada sinyal internet.',
      },
      {
        title: 'Tamu dari luar kota langsung bisa ikut',
        body: 'Tamu yang datang dari luar Batam nggak perlu install apa-apa. Cukup scan QR di venue, kameranya langsung kebuka.',
      },
      {
        title: 'Nggak perlu sewa kamera per meja',
        body: 'Kameranya ada di HP tiap tamu. Nggak ada alat yang perlu dibawa, dijaga, atau dikembalikan setelah acara.',
      },
      {
        title: 'Cuma buat yang hadir',
        body: 'Kamera bisa dikunci untuk HP dalam radius 500m dari venue, jadi isinya dari orang-orang yang beneran datang.',
      },
    ],
  },
  faq: {
    eyebrow: 'Pertanyaan',
    title: 'Soal kamera pernikahan di Batam',
    items: [
      {
        q: 'Apa itu kamera digital pernikahan MemoRoll?',
        a: 'MemoRoll adalah kamera sekali pakai versi digital untuk tamu pernikahan. Tamu scan QR di venue, dapat jatah Shot terbatas di HP-nya, dan semua foto terkumpul di satu galeri yang kebuka bareng pas Reveal.',
      },
      {
        q: 'Bisa dipakai di venue mana saja di Batam?',
        a: 'Bisa. MemoRoll jalan di browser HP tamu, jadi bisa dipakai di hotel, gedung, restoran, atau acara outdoor di Batam selama ada sinyal internet.',
      },
      {
        q: 'Berapa biayanya?',
        a: 'Gratis sampai akhir 2026. Slotnya diambil lewat WhatsApp.',
      },
      {
        q: 'Gimana cara pesannya?',
        a: 'Chat kami di WhatsApp dan sebutin tanggal acaramu. Setelah slotnya siap, kamu atur sendiri nama acara, jatah Shot, dan jam Reveal.',
      },
      {
        q: 'Tamu harus download aplikasi?',
        a: 'Nggak. Tamu tinggal scan QR, kamera langsung kebuka di browser HP.',
      },
      {
        q: 'Cuma buat pernikahan?',
        a: 'Nggak. MemoRoll juga dipakai buat ulang tahun, gathering, dan acara lain di Batam.',
      },
    ],
  },
  closing: {
    title: 'Nikah di Batam?',
    body: 'Ambil slot MemoRoll-mu sekarang. Gratis sampai akhir 2026.',
    action: 'Ambil slot gratis di WhatsApp',
    second: 'Lihat cara kerja MemoRoll',
  },
  actions: { make: 'Ambil slot gratis', examples: 'Lihat dulu' },
};

/**
 * "Kado valentine digital": 13 and 14 February are among the busiest days of
 * the year, and the searches that day are for a couple, not a birthday.
 *
 * Its examples are the templates that read as a couple's story (a playlist,
 * a series, a magazine of your photos, a board game of your dates, a roll of
 * film, a claw machine, a front page, a scrapbook), and its words are its
 * own: it shares the birthday page's shape, not its sentences. Like every page here it names no price,
 * no cap and no plan: the owner moves templates between tiers on the backend.
 */
export const VALENTINE: IntentPage = {
  slug: 'kado-valentine-digital',
  meta: {
    title: 'Kado Valentine Digital untuk Pacar, Kirim Lewat Link | Memoify',
    description:
      'Kado valentine digital dari foto dan cerita kalian: playlist berdua, series ala Netflix, majalah, sampai board game kencan. Jadi dalam beberapa menit.',
    keywords: [
      'kado valentine digital',
      'kado valentine untuk pacar',
      'kado valentine online',
      'hadiah valentine digital',
      'kado valentine LDR',
      'kado valentine unik',
      'ucapan valentine untuk pacar',
      'website valentine untuk pacar',
      'ide kado valentine',
      'kado hari kasih sayang',
    ],
  },
  hero: {
    pill: 'Kado valentine digital',
    title: 'Kado valentine yang isinya cerita kalian berdua',
    body: 'Kumpulin foto-foto kalian, lagu yang kalian suka, dan kata-kata yang jarang kamu ucapin langsung. Memoify nyusun semuanya jadi satu halaman buat dia, dan kamu tinggal kirim link-nya tanggal 14.',
    note: 'Dibuka dari browser · nggak perlu install apa-apa',
  },
  examples: {
    eyebrow: 'Ide kado',
    title: 'Mau kadonya kayak apa?',
    body: 'Buka contohnya satu-satu. Nanti fotonya diganti foto kalian, tulisannya diganti tulisanmu.',
    see: 'Buka contoh',
  },
  templates: [
    {
      href: '/spotifyv1',
      image: '/thumbnails/spotifyv1.jpg',
      name: 'Playlist berdua',
      line: 'Lagu-lagu yang nemenin kalian dari awal, plus satu surat cinta.',
    },
    {
      href: '/netflixv1',
      image: '/thumbnails/netflixv1.jpg',
      name: 'Series kisah kalian',
      line: 'Pacarmu jadi bintangnya, momen pacaran kalian jadi episodenya.',
    },
    {
      href: '/magazinev1',
      image: '/thumbnails/magazinev1.jpg',
      name: 'Majalah edisi kalian',
      line: 'Foto kencan berserakan kayak cetakan polaroid, siap digeser-geser.',
    },
    {
      href: '/boardofusv1',
      image: '/thumbnails/boardofusv1.jpg',
      name: 'Board game kencan',
      line: 'Tiap kotak di papannya satu kenangan kencan kalian.',
    },
    {
      href: '/rollofusv1',
      image: '/thumbnails/rollofusv1.jpg',
      name: 'Rol film kalian',
      line: 'Foto-foto kalian keluar satu per satu dari kamera analog.',
    },
    {
      href: '/arcadeclawv1',
      image: '/thumbnails/arcadeclawv1.jpg',
      name: 'Mesin capit cinta',
      line: 'Dia main capit, hadiahnya foto dan pesan darimu.',
    },
    {
      href: '/newspaperv3',
      image: '/thumbnails/newspaperv3.jpg',
      name: 'Koran hari kasih sayang',
      line: 'Kalian berdua jadi headline edisi 14 Februari.',
    },
    {
      href: '/id/scrapbook',
      image: '/thumbnails/scrapbook7.jpg',
      name: 'Scrapbook pacaran',
      line: 'Album digital setahun bareng, disusun rapi sama Memo-AI.',
    },
  ],
  steps: {
    eyebrow: 'Langkahnya',
    title: 'Bikin kado valentine dalam tiga langkah',
    body: 'Masih sempat, bahkan kalau baru kepikiran tanggal 13 malam.',
    items: [
      {
        title: 'Pilih gayanya',
        body: 'Playlist, series, majalah, board game, atau rol film. Sesuaikan sama selera pacarmu.',
      },
      {
        title: 'Masukin kenangan kalian',
        body: 'Upload foto kencan, pilih lagu kalian, terus tulis surat valentine-nya.',
      },
      {
        title: 'Kirim pas hari-H',
        body: 'Salin link-nya dan kirim tanggal 14. Dia buka di HP, langsung jalan.',
      },
    ],
  },
  reasons: {
    eyebrow: 'Kenapa bukan cokelat aja',
    title: 'Cokelat habis dimakan, ini bisa dibuka lagi',
    items: [
      {
        title: 'Jarak bukan masalah',
        body: 'Lagi LDR beda kota atau beda negara? Kadonya nyampe dalam hitungan detik, nggak pakai kurir.',
      },
      {
        title: 'Isinya cuma tentang kalian',
        body: 'Bukan barang yang bisa dibeli siapa aja. Foto, lagu, dan kalimatnya cuma punya kalian berdua.',
      },
      {
        title: 'Bisa jadi kejutan tengah malam',
        body: 'Kirim tepat jam 00.00 tanggal 14, dan dia buka kadonya sebelum orang lain sempat ngucapin.',
      },
      {
        title: 'Disimpan, bukan dibuang',
        body: 'Bungkus kado biasanya berakhir di tempat sampah. Link ini tetap bisa dia buka tahun depan.',
      },
    ],
  },
  faq: {
    eyebrow: 'Tanya jawab',
    title: 'Pertanyaan soal kado valentine',
    items: [
      {
        q: 'Kado valentine digital itu bentuknya apa?',
        a: 'Halaman web yang kamu isi sendiri dengan foto, lagu, dan surat buat pacarmu. Bentuknya bisa playlist, series ala Netflix, majalah, atau game kecil, lalu dikirim lewat satu link.',
      },
      {
        q: 'Pacarku harus punya aplikasi atau akun?',
        a: 'Nggak. Dia cukup buka link-nya di browser HP atau laptop.',
      },
      {
        q: 'Bisa disiapin dari jauh-jauh hari?',
        a: 'Bisa. Bikin sekarang, simpan link-nya, lalu kirim pas tanggal 14. Kalau ada yang mau diubah, edit aja dari Dashboard dan link yang sama ikut berubah.',
      },
      {
        q: 'Butuh apa aja buat bikinnya?',
        a: 'Akun Google buat masuk, beberapa foto kalian, dan apa yang mau kamu sampaikan ke dia.',
      },
    ],
  },
  closing: {
    title: 'Tanggal 14 tinggal sebentar lagi',
    body: 'Mulai susun kado valentine kalian sekarang, dan kirim link-nya pas hari-H.',
    action: 'Bikin kado valentine',
    second: 'Lihat kado buatan orang lain',
  },
  actions: { make: 'Bikin kado valentine', examples: 'Lihat ide kado' },
};

export const INTENT_PAGES: IntentPage[] = [BIRTHDAY, BATAM_CAMERA, VALENTINE];

/**
 * Every page written for one search, as a link, for the Indonesian footer
 * and the sitemap. (MemoRoll's Indonesian landing is also named for a
 * search, but it is a product page with an English version, so it is listed
 * with those: lib/page-language.ts.)
 */
export const SEARCH_PAGE_LINKS: { href: string; label: string }[] =
  INTENT_PAGES.map((page) => ({
    href: `/id/${page.slug}`,
    label: page.hero.pill,
  }));
