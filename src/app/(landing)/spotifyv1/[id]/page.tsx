import { getDetailContent } from '@/action/user-api';
import Header from '@/components/spotify/header';
import MainContent from '@/components/spotify/main-content';
import Player from '@/components/spotify/player';
import Sidebar from '@/components/spotify/sidebar';

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
  );
}
