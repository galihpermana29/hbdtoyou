/**
 * What the navbar and the site footer say, in English and in Indonesian.
 *
 * Every page is English and gets the English. The Indonesian home page
 * (`/id`) asks for the Indonesian, so the whole page, bar and footer
 * included, reads in one language. Same rules as the home page's own words
 * (components/home/copy.ts): the Indonesian is typed as the English's shape,
 * written the way a young Indonesian brand talks ("kamu", "bikin"), and
 * product names stay names (Scrapbook, Journal, MemoRoll, Photobox, Premium).
 *
 * Nothing verifies the Indonesian. It is for a person who reads both to
 * review.
 */

export type SiteLanguage = 'en' | 'id';

const EN = {
  nav: {
    primary: 'Primary navigation',
    home: 'Memoify home',
    products: 'Products',
    /** Each product's name and line, by its key in navbar.tsx. */
    product: {
      'website-gift': {
        name: 'Website gifts',
        says: 'A page styled like a series, a playlist or a magazine',
      },
      scrapbook: {
        name: 'Scrapbook',
        says: 'Your photos, laid out by Memo-AI',
      },
      journal: {
        name: 'Journal',
        says: 'A letter written like a research paper',
      },
      memoroll: {
        name: 'MemoRoll',
        says: 'A camera for every guest at your event',
      },
      photobox: {
        name: 'Photobox',
        says: 'A photobooth shot on a newspaper front page',
      },
      wedding: {
        name: 'Wedding invitation',
        says: 'An invitation your guests open on their phone',
      },
    } as Record<string, { name: string; says: string }>,
    newBadge: 'NEW',
    inspiration: 'Inspiration',
    upgrade: 'Upgrade',
    upgradePlan: 'Upgrade plan',
    signIn: 'Sign in',
    signInGoogle: 'Sign in with Google',
    create: 'Create a gift',
    account: 'Account',
    accountMenu: (name: string) => `Open account menu for ${name}`,
    dashboard: 'Dashboard',
    logOut: 'Log out',
    getMore: 'Get more',
    credits: (count: string): string => (count === '1' ? 'credit' : 'credits'),
    tokens: (count: string): string => (count === '1' ? 'token' : 'tokens'),
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    closeNavigation: 'Close navigation',
    mobile: 'Mobile navigation',
    make: 'Make',
    explore: 'Explore',
    language: 'Language',
  },

  footer: {
    tagline: 'Add personal touches and let your memories feel like YOU!',
    pricing: 'See our pricing',
    contact: 'CONTACT',
    products: 'PRODUCTS',
    follow: 'FOLLOW',
    invitations: 'Digital Invitations',
    gift: 'Digital Gift',
    rights: 'ALL RIGHTS RESERVED.',
    madeIn: 'MADE IN INDONESIA WITH LOVE ♡',
  },
};

export type SiteCopy = typeof EN;

const ID: SiteCopy = {
  nav: {
    primary: 'Navigasi utama',
    home: 'Beranda Memoify',
    products: 'Produk',
    product: {
      'website-gift': {
        name: 'Kado website',
        says: 'Halaman ala series, playlist, atau majalah',
      },
      scrapbook: {
        name: 'Scrapbook',
        says: 'Foto-fotomu, ditata sama Memo-AI',
      },
      journal: {
        name: 'Journal',
        says: 'Surat yang ditulis kayak paper penelitian',
      },
      memoroll: {
        name: 'MemoRoll',
        says: 'Kamera buat setiap tamu di acaramu',
      },
      photobox: {
        name: 'Photobox',
        says: 'Photobooth ala halaman depan koran',
      },
      wedding: {
        name: 'Undangan pernikahan',
        says: 'Undangan yang dibuka tamu langsung di HP',
      },
    },
    newBadge: 'NEW',
    inspiration: 'Inspirasi',
    upgrade: 'Upgrade',
    upgradePlan: 'Upgrade paket',
    signIn: 'Masuk',
    signInGoogle: 'Masuk dengan Google',
    create: 'Bikin kado',
    account: 'Akun',
    accountMenu: (name: string) => `Buka menu akun ${name}`,
    dashboard: 'Dashboard',
    logOut: 'Keluar',
    getMore: 'Tambah',
    credits: () => 'kredit',
    tokens: () => 'token',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    closeNavigation: 'Tutup navigasi',
    mobile: 'Navigasi',
    make: 'Bikin',
    explore: 'Jelajahi',
    language: 'Bahasa',
  },

  footer: {
    tagline: 'Kasih sentuhan personal, biar kenanganmu terasa KAMU banget!',
    pricing: 'Lihat harga',
    contact: 'KONTAK',
    products: 'PRODUK',
    follow: 'IKUTI',
    invitations: 'Undangan Digital',
    gift: 'Kado Digital',
    rights: 'HAK CIPTA DILINDUNGI.',
    madeIn: 'DIBUAT DI INDONESIA DENGAN CINTA ♡',
  },
};

export const SITE_COPY: Record<SiteLanguage, SiteCopy> = { en: EN, id: ID };

/** The home page in each language: where the language switch goes. */
export const HOME_PATHS: Record<SiteLanguage, string> = { en: '/', id: '/id' };
