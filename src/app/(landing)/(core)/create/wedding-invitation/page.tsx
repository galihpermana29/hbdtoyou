import { Metadata } from 'next';

import WeddingInvitationCreateClientside from './wedding-invitation-create-clientside';
import { FlowLanguageProvider } from '@/components/forms/wedding/flow-language';
import {
  slugFrom,
  SLUG_PARAM,
} from '@/components/forms/wedding/guest-invites-types';

export const metadata: Metadata = {
  title: 'Create Wedding Invitation | Memoify',
  description:
    'Design your BNW wedding invitation with a live preview. Add photos, your love story, event details, and more.',
};

export interface WeddingInvitationCreatePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function WeddingInvitationCreatePage({
  searchParams,
}: WeddingInvitationCreatePageProps) {
  if (process.env.IS_MAINTENANCE === 'true') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Under Maintenance
          </h1>
          <p className="mt-4 max-w-[400px] text-gray-700">
            We are currently working on improving this feature. Please check
            back soon!
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Read here rather than in the flow, so the address is settled before the
  // first paint and there is no moment where the field says one thing and then
  // another. See `SLUG_PARAM` for why a query supplies it at all.
  // The language wraps the whole flow rather than the step being read, because
  // a couple who chooses Indonesian on the details step has chosen it for the
  // guest invites step too, and a provider that only covered one of them would
  // hand them a form that changed language when they pressed Next.
  return (
    <FlowLanguageProvider>
      <WeddingInvitationCreateClientside
        slug={slugFrom(searchParams[SLUG_PARAM])}
      />
    </FlowLanguageProvider>
  );
}
