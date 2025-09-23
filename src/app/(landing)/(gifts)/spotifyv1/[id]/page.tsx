import { getDetailContent } from '@/action/user-api';
import Header from '@/components/spotify/header';
import MainContent from '@/components/spotify/main-content';
import Player from '@/components/spotify/player';
import Sidebar from '@/components/spotify/sidebar';
import { Watermark } from 'antd';
import 'react-photo-view/dist/react-photo-view.css';
const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};
export default async function HomePage({ params }: any) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);

  return (
    <Watermark
      zIndex={99}
      font={{ color: 'rgba(227, 64, 19, 0.19)', fontSize: 50 }}
      content={data.data.user_type === 'free' ? 'memoify.live' : ''}>
      <div className="h-screen bg-black">
        <div className="flex h-[calc(100%-96px)] gap-[20px]">
          <div className="hidden lg:block w-[320px]" />
          <Sidebar ourSongs={parsedData?.ourSongs} />
          <main className="flex-1 overflow-y-auto">
            <Header imageUri={parsedData?.momentOfYou[0]} />
            <MainContent
              momentOfYou={parsedData?.momentOfYou}
              songsForYou={parsedData?.songsForYou}
            />
          </main>
        </div>
        <Player
          imageUri={parsedData?.momentOfYou[0]}
          modalContent={parsedData?.modalContent}
        />
      </div>
    </Watermark>
  );
}
