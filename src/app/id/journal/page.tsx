import JournalPage, {
  journalMetadata,
} from '@/components/journal-landing/journal-page';

/** The journal landing in Indonesian (lib/page-language.ts). */
export const metadata = journalMetadata('id');

export default function IndonesianJournalPage() {
  return <JournalPage language="id" />;
}
