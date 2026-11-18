import type { Metadata } from 'next';

import { getJournalListStart } from '@/action/journal-api';
import { languageVersions, type PageLanguage } from '@/lib/page-language';
import { languageAlternates, pageMeta } from '@/lib/seo';

import JournalLanding from './journal-landing';

/**
 * The journal landing as a page, in either language: `/journal` renders it
 * in English and `/id/journal` in Indonesian. Both list the same published
 * journals: the first page of cards and the count are read here on the
 * server, the rest when the visitor asks (published.tsx).
 */
const VERSIONS = languageVersions('/journal')!;

const WORDS: Record<PageLanguage, { title: string; description: string }> = {
  en: {
    title: 'Personal Journal as a Digital Gift (Jurnal Digital) | Memoify',
    description:
      'Write your story as a journal article laid out like an academic paper, shared with one link. Tulis cerita kalian jadi jurnal digital.',
  },
  id: {
    title: 'Jurnal Digital: Surat untuk Pacar ala Paper Ilmiah | Memoify',
    description:
      'Tulis surat cinta, permintaan maaf, atau ucapan ulang tahun jadi jurnal digital ala paper ilmiah. Publikasikan, lalu kirim ke dia lewat satu link.',
  },
};

export function journalMetadata(language: PageLanguage): Metadata {
  return pageMeta({
    path: VERSIONS[language],
    locale: language,
    ...WORDS[language],
    keywords: {
      en: ['personal journal', 'digital journal', 'journal gift'],
      id: [
        'jurnal digital',
        'buku harian digital',
        'jurnal untuk pacar',
        'surat untuk pacar',
        'surat cinta digital',
      ],
    },
    image: {
      url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300293/6ad37e37-d0f6-497c-b81f-56d68869b7a3.png',
      alt:
        language === 'id'
          ? 'Jurnal digital dari Memoify'
          : 'Memoify personal journal',
    },
    languages: languageAlternates(VERSIONS),
  });
}

export default async function JournalPage({
  language,
}: {
  language: PageLanguage;
}) {
  const { first, total } = await getJournalListStart();

  return <JournalLanding firstCards={first} total={total} lang={language} />;
}
