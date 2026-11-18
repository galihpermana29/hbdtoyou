import type { Metadata } from 'next';

import { languageVersions, type PageLanguage } from '@/lib/page-language';
import { languageAlternates, pageMeta } from '@/lib/seo';

/**
 * What search engines are told about the scrapbook landing, in each of its
 * two languages (`/scrapbook`, `/id/scrapbook`). Kept out of the landing's
 * own files, which run in the browser.
 */
const VERSIONS = languageVersions('/scrapbook')!;

const WORDS: Record<PageLanguage, { title: string; description: string }> = {
  en: {
    title: 'Digital Scrapbook Maker (Scrapbook Digital) | Memoify',
    description:
      'Add your photos, pick a style, and Memo-AI lays out a digital scrapbook you can share with one link. Bikin scrapbook digital otomatis dari foto kalian.',
  },
  id: {
    title: 'Scrapbook Digital: Buat Scrapbook Online dari Foto | Memoify',
    description:
      'Bikin scrapbook digital dari foto-fotomu. Pilih gaya, Memo-AI yang nyusun halamannya, lalu kirim lewat satu link. Cocok buat kado untuk pacar.',
  },
};

export function scrapbookMetadata(language: PageLanguage): Metadata {
  return pageMeta({
    path: VERSIONS[language],
    locale: language,
    ...WORDS[language],
    keywords: {
      en: ['digital scrapbook maker', 'online scrapbook', 'AI scrapbook'],
      id: [
        'scrapbook digital',
        'buat scrapbook online',
        'scrapbook untuk pacar',
        'album kenangan digital',
      ],
    },
    languages: languageAlternates(VERSIONS),
  });
}
