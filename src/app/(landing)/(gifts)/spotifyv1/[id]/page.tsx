import { getDetailContent } from '@/action/user-api';
import Header from '@/components/spotify/header';
import MainContent from '@/components/spotify/main-content';
import Player from '@/components/spotify/player';
import Sidebar from '@/components/spotify/sidebar';
import 'react-photo-view/dist/react-photo-view.css';
import MusicPlayer from '@/components/ui/music-player/music-player';
import LockScreen from '@/components/ui/lock-screen';
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
  // Gate the viewer when the backend flags content as `locked`, OR when a
  // free-tier account made a *premium* template. A free account on a free
  // template is capped per day by the backend at create time, surfaced there as
  // an error - it must not come back here as a lock on the finished gift.
  const lockedContent =
    data.data.status === 'locked' ||
    (data.data.user_type === 'free' && data.data.template_label === 'premium');
  const firstMoment = Array.isArray(parsedData?.momentOfYou)
    ? parsedData.momentOfYou[0]
    : parsedData?.momentOfYou;
  const coverImage =
    typeof firstMoment === 'object'
      ? firstMoment?.imageUrl || firstMoment?.image
      : firstMoment;

  const content = (
    <div className="h-[100svh] overflow-hidden bg-black">
      <div className="flex h-full gap-0 pb-[76px] md:pb-[88px]">
        <div className="hidden lg:block w-[320px]" />
        <Sidebar ourSongs={parsedData?.ourSongs} />
        <MusicPlayer />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Header imageUri={coverImage} />
          <MainContent
            momentOfYou={parsedData?.momentOfYou}
            songsForYou={parsedData?.songsForYou}
            title={data.data.title}
          />
        </main>
      </div>
      <Player imageUri={coverImage} modalContent={parsedData?.modalContent} />
    </div>
  );

  if (lockedContent) {
    return (
      <LockScreen
        contentId={id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock to view this Spotify-style playlist. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
}
