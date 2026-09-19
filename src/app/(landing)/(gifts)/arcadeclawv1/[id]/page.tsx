import { getDetailContent } from '@/action/user-api';
import LockScreen from '@/components/ui/lock-screen';
import ClawOfUs, { type ArcadeClawData } from '../claw-of-us';

export default async function ArcadeClawGiftPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getDetailContent(params.id);
  if (!response.data) {
    return <div className="min-h-screen">No data</div>;
  }

  let parsedData: ArcadeClawData;
  try {
    parsedData = JSON.parse(response.data.detail_content_json_text);
  } catch {
    return <div className="min-h-screen">No data</div>;
  }

  if (
    !parsedData?.title ||
    !parsedData?.recipientName ||
    !parsedData?.finalMessage ||
    !Array.isArray(parsedData?.memories) ||
    parsedData.memories.length < 3
  ) {
    return <div className="min-h-screen">No data</div>;
  }

  const content = (
    <ClawOfUs
      data={{
        ...parsedData,
        memories: parsedData.memories.slice(0, 6),
      }}
    />
  );
  const lockedContent =
    response.data.status === 'locked' || response.data.user_type === 'free';

  if (lockedContent) {
    return (
      <LockScreen
        contentId={params.id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock this Claw of Us gift. Upgrade your plan for full access."
      >
        {content}
      </LockScreen>
    );
  }

  return content;
}
