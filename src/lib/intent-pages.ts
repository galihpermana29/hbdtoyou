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
    title: 'Kado Ulang Tahun Digital, Kirim Lewat Satu Link | Memoify',
    description:
      'Bikin kado ulang tahun digital dari foto dan ucapanmu: halaman ala Netflix, playlist, koran, sampai mesin capit. Gratis untuk mulai, kirim lewat satu link.',
    keywords: [
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

export const INTENT_PAGES: IntentPage[] = [BIRTHDAY, BATAM_CAMERA];

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
