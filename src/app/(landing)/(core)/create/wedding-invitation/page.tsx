import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import WeddingInvitationCreateClientside from './wedding-invitation-create-clientside';
import { FlowLanguageProvider } from '@/components/forms/wedding/flow-language';
import {
  slugFrom,
  SLUG_PARAM,
} from '@/components/forms/wedding/guest-invites-types';
import { getSession } from '@/store/get-set-session';

export const metadata: Metadata = {
  title: 'Create Wedding Invitation | Memoify',
  description:
    'Design your BNW wedding invitation with a live preview. Add photos, your love story, event details, and more.',
};

export interface WeddingInvitationCreatePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function WeddingInvitationCreatePage({
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

  // Nobody fills this flow in without an account. Saving needs an owner and
  // every photograph upload needs a bearer token, so a visitor with neither
  // could fill in the whole flow and keep none of it - the rest of the product
  // asks them to sign in before a form is ever shown, and this route is no
  // different. They are sent to the landing page rather than a sign-in screen,
  // because the landing is where the product explains itself and its own
  // control signs them in and brings them back here.
  //
  // The one exception is the check. It drives this flow signed out on a server
  // of its own, so the server it starts stands the gate down - see
  // `visual/dev-server.mjs`, which is the only place the variable is set. The
  // check's server is a dev server, so a production build ignores the variable
  // outright: one stray line in a deployment's environment must not reopen the
  // hole this gate closes.
  const gateStoodDown =
    process.env.WEDDING_FLOW_UNGATED === 'true' &&
    process.env.NODE_ENV !== 'production';
  if (!gateStoodDown) {
    const session = await getSession();
    if (!session?.accessToken) {
      redirect('/wedding-invitation');
    }
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
