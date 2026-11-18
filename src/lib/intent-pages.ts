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

export const INTENT_PAGES: IntentPage[] = [BIRTHDAY];
