import JournalPage, {
  journalMetadata,
} from '@/components/journal-landing/journal-page';

/** The journal landing in English. `/id/journal` is the same in Indonesian. */
export const metadata = journalMetadata('en');

export default function JournalLandingPage() {
  return <JournalPage language="en" />;
}
