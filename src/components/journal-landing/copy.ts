import type { PageLanguage } from '@/lib/page-language';

import type { Paper } from './paper';

/**
 * Everything the journal landing says, in English (`/journal`) and in
 * Indonesian (`/id/journal`), the way the home page does it
 * (components/home/copy.ts): the Indonesian is typed as the English's shape,
 * written casually ("kamu", "bikin"), and Journal stays the product's name.
 *
 * The example papers are written for this page in each language, not
 * translated line by line: the joke is a love letter in the voice of a
 * paper, and it has to land in the language it is read in. The highlighted
 * middle of each abstract is kept short, because it is drawn on one line.
 *
 * The published journals are what people wrote, and are not translated.
 *
 * Nothing verifies the Indonesian. It is for a person who reads both to
 * review.
 */

const EN = {
  hero: {
    pill: 'Journals',
    /** Read out whole, while the eye sees the middle words changing. */
    headingSpoken:
      'Write a love letter, an apology or a birthday wish like a research paper',
    headingLead: 'Write',
    headingTail: 'like a research paper.',
    body: 'Say the simple thing in the most serious format there is: a title, an abstract, a conclusion. Publish it, and send them the link.',
    publish: 'Publish a journal',
    read: 'Read published ones',
    count: (count: number) =>
      `${count.toLocaleString('en-US')} journals published so far`,
    none: 'Published as a page you can share',
    hint: 'tap the paper for the next one',
  },

  paper: {
    label: 'An example of a letter written as a research paper',
    next: 'Show the next example',
    show: (word: string) => `Show ${word} as a paper`,
    journal: 'Journal of Heartfelt Communication',
    abstract: 'Abstract',
    keywords: 'Keywords:',
    accepted: 'ACCEPTED',
    reviewed: 'REVIEWED WITH LOVE',
    meant: 'WHAT YOU MEANT',
    papers: [
      {
        key: 'love',
        word: 'a love letter',
        meant: 'i love you, that’s it',
        title: 'On Loving You: A Five-Year Longitudinal Study',
        author: 'Raka A. · Department of Us',
        abstract: [
          'This paper examines why ordinary days improve when you are in them. ',
          'The effect is significant, consistent,',
          ' and shows no sign of wearing off.',
        ],
        keywords: 'love, home, you',
      },
      {
        key: 'apology',
        word: 'an apology',
        meant: 'sorry i forgot our anniversary',
        title: 'A Formal Review of My Mistake on the 14th',
        author: 'Dimas P. · Faculty of Knowing Better',
        abstract: [
          'The author forgot an important date. This study reviews what went wrong, ',
          'accepts full responsibility,',
          ' and proposes dinner as a first correction.',
        ],
        keywords: 'sorry, dinner, never again',
      },
      {
        key: 'birthday',
        word: 'a birthday wish',
        meant: 'happy birthday bestie!!',
        title: 'Twenty-Five Years of Dinda: A Review of the Evidence',
        author: 'Sasa K. · Institute of Best Friends',
        abstract: [
          'Across 25 years of data, the subject remains ',
          'the funniest person in every room.',
          ' This paper recommends cake, and many more years.',
        ],
        keywords: 'birthday, cake, bestie',
      },
    ] as Paper[],
  },

  occasions: {
    label: 'What people write',
    items: [
      'Love letters',
      'Apologies',
      'Birthday wishes',
      'Thank-yous',
      'Anniversaries',
      'Farewells',
      'Confessions',
    ],
  },

  features: {
    eyebrow: 'Features',
    title: 'Serious format. Unserious amount of feelings.',
    body: 'Everything a real paper has, pointed at one person.',
    abstract: {
      title: 'Abstract-level emotions',
      body: 'Open with an abstract: your deepest feelings in two or three lines that sound peer-reviewed.',
      heading: 'Abstract',
      before: 'Results show the author is ',
      marked: 'still in love',
      after: ', with a confidence interval of forever.',
    },
    thesis: {
      title: 'Structured like a thesis',
      body: 'From Preamble to Conclusion, every part of your letter follows a research paper’s format.',
      parts: ['Abstract', 'Preamble', 'Conclusion'],
    },
    print: {
      title: 'Print, publish, or present',
      body: 'Publish it online and send the link, or print it like a final submission.',
      address: 'memoify.live/journal/for-you',
      print: 'Print',
    },
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Three steps to published',
    body: 'You bring the feeling. The format is already done.',
    feeling: {
      title: 'Start from a feeling',
      body: 'Love, sorry, happy birthday, thank you. Decide who it is for and what you want to say.',
      feelings: ['I love you', 'I’m sorry', 'Happy birthday', 'Thank you'],
    },
    sections: {
      title: 'Fill in the sections',
      body: 'A title, an abstract and the body of your letter. The layout of a paper is applied for you.',
      fields: ['Title', 'Abstract', 'Conclusion'],
    },
    publish: {
      title: 'Publish and send the link',
      body: 'It opens as a page they can read on any phone. List it with the published journals, or keep it off the list.',
      paper: 'On Loving You',
      stamp: 'PUBLISHED',
    },
  },

  published: {
    eyebrow: 'Published',
    title: 'Read what people have published',
    body: 'Case studies in heartfelt communication, all public.',
    search: 'Search journals by name',
    placeholder: 'Search by name',
    noMatch: (query: string) => `No published journal matches “${query}”.`,
    empty: 'No journals published yet. Yours can be the first.',
    more: (left: number) => `Show more journals (${left} left)`,
    loading: 'Loading more journals…',
    searching: 'Searching the published journals…',
    failed: 'The journals did not load. Check your connection and try again.',
    retry: 'Try loading more again',
  },

  closing: {
    title: 'Submit your feelings for review.',
    body: 'It takes a few minutes to write, and it is the only paper they will read twice.',
    action: 'Publish a journal',
  },
};

export type JournalCopy = typeof EN;

const ID: JournalCopy = {
  hero: {
    pill: 'Journal',
    headingSpoken:
      'Tulis surat cinta, permintaan maaf, atau ucapan ulang tahun ala paper ilmiah',
    headingLead: 'Tulis',
    headingTail: 'ala paper ilmiah.',
    body: 'Sampaikan hal sederhana dalam format paling serius yang ada: judul, abstrak, kesimpulan. Terbitkan, lalu kirim link-nya ke dia.',
    publish: 'Bikin journal',
    read: 'Baca yang sudah terbit',
    count: (count: number) =>
      `${count.toLocaleString('id-ID')} journal sudah terbit`,
    none: 'Terbit jadi halaman yang bisa kamu bagikan',
    hint: 'klik kertasnya buat lihat contoh lain',
  },

  paper: {
    label: 'Contoh surat yang ditulis ala paper ilmiah',
    next: 'Lihat contoh berikutnya',
    show: (word: string) => `Lihat ${word} versi paper`,
    journal: 'Jurnal Komunikasi Sepenuh Hati',
    abstract: 'Abstrak',
    keywords: 'Kata kunci:',
    accepted: 'DITERIMA',
    reviewed: 'DITINJAU DENGAN CINTA',
    meant: 'MAKSUDNYA SIH',
    papers: [
      {
        key: 'love',
        word: 'surat cinta',
        meant: 'aku sayang kamu, udah itu aja',
        title: 'Tentang Mencintaimu: Studi Longitudinal Lima Tahun',
        author: 'Raka A. · Departemen Kita',
        abstract: [
          'Penelitian ini mengkaji kenapa hari-hari biasa jadi lebih baik saat ada kamu. ',
          'Efeknya signifikan, konsisten,',
          ' dan belum ada tanda-tanda memudar.',
        ],
        keywords: 'cinta, rumah, kamu',
      },
      {
        key: 'apology',
        word: 'permintaan maaf',
        meant: 'maaf aku lupa anniversary kita',
        title: 'Tinjauan Formal atas Kesalahanku di Tanggal 14',
        author: 'Dimas P. · Fakultas Harusnya Inget',
        abstract: [
          'Penulis lupa sebuah tanggal penting. Studi ini meninjau apa yang salah, ',
          'mengakui kesalahan sepenuhnya,',
          ' dan mengusulkan makan malam sebagai perbaikan pertama.',
        ],
        keywords: 'maaf, makan malam, nggak lagi-lagi',
      },
      {
        key: 'birthday',
        word: 'ucapan ultah',
        meant: 'hbd bestie!!',
        title: 'Dua Puluh Lima Tahun Dinda: Tinjauan atas Bukti-Bukti',
        author: 'Sasa K. · Institut Sahabat Terbaik',
        abstract: [
          'Dari data selama 25 tahun, subjek tetap ',
          'orang paling lucu di tiap ruangan.',
          ' Penelitian ini merekomendasikan kue, dan banyak tahun lagi.',
        ],
        keywords: 'ulang tahun, kue, bestie',
      },
    ],
  },

  occasions: {
    label: 'Yang biasa ditulis',
    items: [
      'Surat cinta',
      'Permintaan maaf',
      'Ucapan ultah',
      'Ucapan terima kasih',
      'Anniversary',
      'Perpisahan',
      'Pengakuan',
    ],
  },

  features: {
    eyebrow: 'Fitur',
    title: 'Formatnya serius. Perasaannya kebangetan.',
    body: 'Semua yang ada di paper beneran, ditujukan buat satu orang.',
    abstract: {
      title: 'Perasaan selevel abstrak',
      body: 'Buka dengan abstrak: perasaan terdalammu dalam dua atau tiga baris yang kedengarannya udah di-peer-review.',
      heading: 'Abstrak',
      before: 'Hasil menunjukkan penulis ',
      marked: 'masih jatuh cinta',
      after: ', dengan selang kepercayaan selamanya.',
    },
    thesis: {
      title: 'Tersusun kayak skripsi',
      body: 'Dari Pendahuluan sampai Kesimpulan, tiap bagian suratmu mengikuti format paper penelitian.',
      parts: ['Abstrak', 'Pendahuluan', 'Kesimpulan'],
    },
    print: {
      title: 'Cetak, terbitkan, atau presentasikan',
      body: 'Terbitkan online dan kirim link-nya, atau cetak kayak naskah final.',
      address: 'memoify.live/journal/buat-kamu',
      print: 'Cetak',
    },
  },

  steps: {
    eyebrow: 'Cara kerjanya',
    title: 'Tiga langkah sampai terbit',
    body: 'Kamu bawa perasaannya. Formatnya udah siap.',
    feeling: {
      title: 'Mulai dari perasaan',
      body: 'Cinta, maaf, selamat ulang tahun, terima kasih. Tentuin buat siapa dan apa yang mau kamu bilang.',
      feelings: ['Aku sayang kamu', 'Maafin aku', 'Selamat ultah', 'Makasih'],
    },
    sections: {
      title: 'Isi bagian-bagiannya',
      body: 'Judul, abstrak, dan isi suratmu. Tata letak paper-nya otomatis.',
      fields: ['Judul', 'Abstrak', 'Kesimpulan'],
    },
    publish: {
      title: 'Terbitkan dan kirim link-nya',
      body: 'Kebuka jadi halaman yang bisa dibaca di HP apa aja. Tampilkan bareng journal lain yang sudah terbit, atau sembunyikan dari daftar.',
      paper: 'Tentang Mencintaimu',
      stamp: 'TERBIT',
    },
  },

  published: {
    eyebrow: 'Sudah terbit',
    title: 'Baca yang sudah diterbitkan orang lain',
    body: 'Studi kasus komunikasi sepenuh hati, semuanya publik.',
    search: 'Cari journal berdasarkan nama',
    placeholder: 'Cari nama',
    noMatch: (query: string) =>
      `Nggak ada journal yang cocok dengan “${query}”.`,
    empty: 'Belum ada journal yang terbit. Punyamu bisa jadi yang pertama.',
    more: (left: number) => `Tampilkan journal lainnya (${left} lagi)`,
    loading: 'Lagi memuat journal lainnya…',
    searching: 'Lagi mencari di journal yang terbit…',
    failed: 'Journal-nya gagal dimuat. Cek koneksimu, lalu coba lagi.',
    retry: 'Coba muat lagi',
  },

  closing: {
    title: 'Ajukan perasaanmu untuk ditinjau.',
    body: 'Nulisnya cuma beberapa menit, dan ini satu-satunya paper yang bakal dia baca dua kali.',
    action: 'Bikin journal',
  },
};

export const JOURNAL_COPY: Record<PageLanguage, JournalCopy> = {
  en: EN,
  id: ID,
};
