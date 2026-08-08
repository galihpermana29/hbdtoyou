import { getDetailContent } from '@/action/user-api';
import LockScreen from '@/components/ui/lock-screen';
import ResultActions from './result-actions';

export default async function PhotoboxNewspaperViewer({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const data = await getDetailContent(id);

  if (!data?.data) {
    return <div className="p-10 text-center">No data</div>;
  }

  let parsed: { image?: string; template?: string } = {};
  try {
    parsed = JSON.parse(data.data.detail_content_json_text);
  } catch {
    parsed = {};
  }

  // Same gating logic as the digital gift viewers (e.g. newspaperv3):
  // locked by backend status, or created by a free-tier account.
  const lockedContent =
    data.data.status === 'locked' || data.data.user_type === 'free';

  const content = (
    <main className="min-h-screen bg-[#f4f1ea] flex flex-col items-center gap-8 py-12 px-4">
      {parsed.image ? (
        <img
          src={parsed.image}
          alt="Bestie of The Week newspaper"
          className="w-full max-w-4xl border border-[#1a1a1a] shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
        />
      ) : (
        <div className="p-10 text-center">Image unavailable</div>
      )}
      {parsed.image && <ResultActions url={parsed.image} />}
    </main>
  );

  if (lockedContent) {
    return (
      <LockScreen
        contentId={id}
        initiallyLocked
        lockVariant="subtle"
        title="Content locked for free users"
        message="Unlock to view and share this photobox newspaper. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
}
