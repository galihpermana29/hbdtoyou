import JournalPage, {
  journalMetadata,
} from '@/components/journal-landing/journal-page';

/** The journal landing in English. `/id/journal` is the same in Indonesian. */
export const metadata = journalMetadata('en');

/**
 * Rendered per request, like every page under the root layout (it reads the
 * session). Said outright so the build does not try the journal list first.
 */
export const dynamic = 'force-dynamic';

export default function JournalLandingPage() {
  return <JournalPage language="en" />;
}
