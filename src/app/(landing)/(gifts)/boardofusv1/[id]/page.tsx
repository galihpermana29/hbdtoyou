import { getDetailContent } from '@/action/user-api';
import LockScreen from '@/components/ui/lock-screen';
import BoardOfUs from '../board-of-us';
import { normalizeBoardOfUsData } from '../board-of-us-data';

export default async function BoardOfUsGiftPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getDetailContent(params.id);
  if (!response.data) {
    return <div className="min-h-screen">No data</div>;
  }

  let rawData: unknown;
  try {
    rawData = JSON.parse(response.data.detail_content_json_text);
  } catch {
    return <div className="min-h-screen">No data</div>;
  }

  const data = normalizeBoardOfUsData(rawData);
  if (!data) {
    return <div className="min-h-screen">No data</div>;
  }

  const content = <BoardOfUs data={data} />;
  const lockedContent =
    response.data.status === 'locked' || response.data.user_type === 'free';

  if (lockedContent) {
    return (
      <LockScreen
        contentId={params.id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock this Board of Us gift. Upgrade your plan for full access."
      >
        {content}
      </LockScreen>
    );
  }

  return content;
}
