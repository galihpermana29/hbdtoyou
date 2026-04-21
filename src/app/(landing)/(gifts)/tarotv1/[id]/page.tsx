import { getDetailContent } from '@/action/user-api';
import TarotReader from '@/components/celestialtarot/TarotReader';
import { TarotData } from '@/components/celestialtarot/types';
import LockScreen from '@/components/ui/lock-screen';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const RootUserPage = async ({ params }: any) => {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);

  const tarotData: TarotData = {
    sayings: parsedData?.sayings || ['', '', ''],
    specialSaying: parsedData?.specialSaying || '',
    recipient: {
      name: parsedData?.recipientName || '',
      age: parsedData?.recipientAge || '',
      wish: parsedData?.recipientWish || '',
    },
  };

  const lockedContent =
    data.data.status === 'locked' || data.data.user_type === 'free';

  const content = <TarotReader data={tarotData} />;

  if (lockedContent) {
    return (
      <LockScreen
        contentId={id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock to reveal your celestial tarot reading. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
};

export default RootUserPage;
