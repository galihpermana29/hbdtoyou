import { getDetailContent } from '@/action/user-api';
import NetflixExperience from '@/components/netflix/netflix-experience';
import MusicPlayer from '@/components/ui/music-player/music-player';
import LockScreen from '@/components/ui/lock-screen';
import 'react-photo-view/dist/react-photo-view.css';

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

  // Gate the viewer when the backend flags content as `locked`, OR when the
  // gift was created by a free-tier account (`user_type === 'free'`).
  const lockedContent =
    data.data.status === 'locked' || data.data.user_type === 'free';

  const content = (
    <NetflixExperience
      jumbotronImage={parsedData?.jumbotronImage}
      title={parsedData?.title}
      subTitle={parsedData?.subTitle}
      modalContent={parsedData?.modalContent}
      images={parsedData?.images}>
      <MusicPlayer />
    </NetflixExperience>
  );

  if (lockedContent) {
    return (
      <LockScreen
        contentId={id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock to view this Netflix-style album. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
};

export default RootUserPage;
