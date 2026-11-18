import JournalPage, {
  journalMetadata,
} from '@/components/journal-landing/journal-page';

/** The journal landing in Indonesian (lib/page-language.ts). */
export const metadata = journalMetadata('id');

/**
 * Rendered per request, like every page under the root layout (it reads the
 * session). Said outright so the build does not try the journal list first.
 */
export const dynamic = 'force-dynamic';

export default function IndonesianJournalPage() {
  return <JournalPage language="id" />;
}
