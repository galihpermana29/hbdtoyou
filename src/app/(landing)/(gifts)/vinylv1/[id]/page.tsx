import { getDetailContent } from '@/action/user-api';
import LockScreen from '@/components/ui/lock-screen';
import VinylDynamic from '../VinylDynamic';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export default async function VinylDynamicPage({ params }: any) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  // Gate the viewer when the backend flags content as `locked`, OR when a
  // free-tier account made a *premium* template. A free account on a free
  // template is capped per day by the backend at create time, surfaced there as
  // an error - it must not come back here as a lock on the finished gift.
  const lockedContent =
    data.data.status === 'locked' ||
    (data.data.user_type === 'free' && data.data.template_label === 'premium');

  const content = (
    <VinylDynamic
      recipientName={parsedData?.recipientName ?? 'You'}
      songUrl={parsedData?.songUrl ?? ''}
      songTitle={parsedData?.songTitle ?? 'Unknown'}
      songArtist={parsedData?.songArtist ?? 'Unknown'}
      letter={parsedData?.letter ?? ''}
      voiceNoteUrl={parsedData?.voiceNoteUrl ?? ''}
      voiceNoteQuote={parsedData?.voiceNoteQuote ?? ''}
      videoUrl={parsedData?.videoUrl ?? ''}
      memories={parsedData?.memories ?? []}
    />
  );

  if (lockedContent) {
    return (
      <LockScreen
        contentId={id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock to view this vinyl gift. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
}
