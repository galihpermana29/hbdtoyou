import { Metadata } from 'next';

import WeddingInvitationCreateClientside from './wedding-invitation-create-clientside';

export const metadata: Metadata = {
  title: 'Create Wedding Invitation | Memoify',
  description:
    'Design your BNW wedding invitation with a live preview. Add photos, your love story, event details, and more.',
};

export default function WeddingInvitationCreatePage() {
  if (process.env.IS_MAINTENANCE === 'true') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Under Maintenance
          </h1>
          <p className="mt-4 max-w-[400px] text-gray-700">
            We are currently working on improving this feature. Please check back
            soon!
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

  return <WeddingInvitationCreateClientside />;
}
