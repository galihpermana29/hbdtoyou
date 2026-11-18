import type { PageLanguage } from '@/lib/page-language';

/**
 * Everything the scrapbook landing says, in English (`/scrapbook`) and in
 * Indonesian (`/id/scrapbook`), the way the home page does it
 * (components/home/copy.ts): the Indonesian is typed as the English's shape,
 * written casually ("kamu", "bikin"), and names stay names - Memo-AI and the
 * style names (Garden, Sweetheart, Case file...) are what the creator calls
 * them.
 *
 * Nothing verifies the Indonesian. It is for a person who reads both to
 * review.
 */

const EN = {
  hero: {
    pill: 'Scrapbooks, laid out by Memo-AI',
    /** Read out whole; the last words are set in the accent. */
    headingLead: 'Your photos, bound into',
    headingAccent: 'a scrapbook.',
    body: 'Add your photos and pick a style. Memo-AI lays out the pages, and you get one link to send.',
    make: 'Make a scrapbook',
    styles: 'See the styles',
    proof: 'Free to start · no design skills needed',
    badge: 'AI LAYOUT',
    hint: 'tap the book to turn the page',
  },

  book: {
    style: 'Style',
    turn: 'Turn the page',
    show: (name: string) => `Show the ${name} style`,
    /** Each style's spread, by the style's key in book.tsx. */
    alts: {
      garden: 'A scrapbook spread of photos among pressed flowers',
      sweet: 'A scrapbook spread with taped frames, a ribbon and a cassette',
      folder: 'A scrapbook spread made like a paper folder of notes',
      rose: 'A pink scrapbook spread with oval frames and a wax seal',
      retro: 'A red scrapbook spread with a cassette and ticket stubs',
      vintage: 'A scrapbook spread with a letter and a gilded frame',
    } as Record<string, string>,
  },

  occasions: {
    label: 'What people make scrapbooks of',
    items: [
      'Anniversaries',
      'Birthdays',
      'Trips',
      'Graduations',
      'Best friends',
      'First years',
      'Family',
    ],
  },

  styles: {
    eyebrow: 'Styles',
    title: 'Pick the one that looks like the two of you',
    body: 'Soft and floral, loud and retro, or filed like evidence. Start from any of them.',
    use: 'Use this style',
    make: (name: string) => `Make a scrapbook in the ${name} style`,
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Three steps. Memo-AI does the gluing.',
    body: 'No cutting, no arranging, no glue on the table.',
    photos: {
      title: 'Add your photos',
      body: 'Choose the ones that tell the story. They do not need to match.',
    },
    style: {
      title: 'Pick a style, say a few words',
      body: 'Choose how it should look and describe the moment. Memo-AI arranges every page from there.',
      prompt: 'Our first year together, mostly food and bad selfies',
      generate: 'Generate',
    },
    send: {
      title: 'Open it, send the link',
      body: 'Your scrapbook opens like a book on any phone. Share one link, no app needed.',
    },
  },

  closing: {
    title: 'Start the scrapbook they will keep.',
    body: 'A few photos and a few minutes. Memo-AI handles the rest.',
    action: 'Make a scrapbook',
    second: 'See what others made',
  },
};

export type ScrapbookCopy = typeof EN;

const ID: ScrapbookCopy = {
  hero: {
    pill: 'Scrapbook yang ditata Memo-AI',
    headingLead: 'Foto-fotomu, dijilid jadi',
    headingAccent: 'scrapbook.',
    body: 'Masukin foto dan pilih gaya. Memo-AI yang nyusun halamannya, kamu tinggal kirim satu link.',
    make: 'Bikin scrapbook',
    styles: 'Lihat gayanya',
    proof: 'Gratis untuk mulai · nggak perlu jago desain',
    badge: 'LAYOUT AI',
    hint: 'klik bukunya buat buka halaman berikutnya',
  },

  book: {
    style: 'Gaya',
    turn: 'Buka halaman berikutnya',
    show: (name: string) => `Lihat gaya ${name}`,
    alts: {
      garden: 'Halaman scrapbook berisi foto di antara bunga kering',
      sweet: 'Halaman scrapbook dengan bingkai berselotip, pita, dan kaset',
      folder: 'Halaman scrapbook yang dibuat kayak map berisi catatan',
      rose: 'Halaman scrapbook pink dengan bingkai oval dan segel lilin',
      retro: 'Halaman scrapbook merah dengan kaset dan sobekan tiket',
      vintage: 'Halaman scrapbook dengan surat dan bingkai keemasan',
    },
  },

  occasions: {
    label: 'Scrapbook buat momen apa aja',
    items: [
      'Anniversary',
      'Ulang tahun',
      'Liburan',
      'Wisuda',
      'Sahabat',
      'Tahun pertama',
      'Keluarga',
    ],
  },

  styles: {
    eyebrow: 'Gaya',
    title: 'Pilih yang paling mirip kalian berdua',
    body: 'Lembut dan penuh bunga, rame dan retro, atau rapi kayak berkas bukti. Mulai dari mana aja.',
    use: 'Pakai gaya ini',
    make: (name: string) => `Bikin scrapbook dengan gaya ${name}`,
  },

  steps: {
    eyebrow: 'Cara kerjanya',
    title: 'Tiga langkah. Memo-AI yang nempelin.',
    body: 'Nggak perlu gunting, nggak perlu nyusun, nggak ada lem berceceran.',
    photos: {
      title: 'Masukin foto-fotomu',
      body: 'Pilih yang paling bercerita. Nggak harus senada.',
    },
    style: {
      title: 'Pilih gaya, tulis sedikit cerita',
      body: 'Tentuin tampilannya dan ceritain momennya. Memo-AI yang nyusun tiap halamannya.',
      prompt: 'Tahun pertama kita, isinya kebanyakan makanan dan selfie jelek',
      generate: 'Generate',
    },
    send: {
      title: 'Buka, lalu kirim link-nya',
      body: 'Scrapbook-mu kebuka kayak buku di HP apa aja. Cukup kirim satu link, tanpa install aplikasi.',
    },
  },

  closing: {
    title: 'Mulai scrapbook yang bakal dia simpan.',
    body: 'Beberapa foto dan beberapa menit. Sisanya biar Memo-AI yang urus.',
    action: 'Bikin scrapbook',
    second: 'Lihat buatan orang lain',
  },
};

export const SCRAPBOOK_COPY: Record<PageLanguage, ScrapbookCopy> = {
  en: EN,
  id: ID,
};
