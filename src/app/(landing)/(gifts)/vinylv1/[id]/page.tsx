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
  const lockedContent =
    data.data.status === 'locked' || data.data.user_type === 'free';

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
