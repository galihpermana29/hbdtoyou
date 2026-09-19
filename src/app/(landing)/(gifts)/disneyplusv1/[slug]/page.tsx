import { getDetailContent } from '@/action/user-api';
import LockScreen from '@/components/ui/lock-screen';
import DisneyExperience from '@/components/disney+/DisneyExperience';
import MusicPlayer from '@/components/ui/music-player/music-player';
import WatchModal from './component/WatchModal';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export default async function DynamicDisneyPage({ params }: { params: any }) {
  const { slug } = params;

  const data = await getDetailDataNew(slug);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  // Gate the viewer when the backend flags content as `locked`, OR when the
  // gift was created by a free-tier account (`user_type === 'free'`).
  const lockedContent =
    data.data.status === 'locked' || data.data.user_type === 'free';

  const content = (
    <DisneyExperience
      jumbotronImage={parsedData?.jumbotronImage}
      title={parsedData?.title}
      subTitle={parsedData?.subTitle}
      episodes={parsedData?.episodes}
      images={parsedData?.images}
      modalTrigger={<WatchModal content={parsedData?.modalContent} />}>
      <MusicPlayer />
    </DisneyExperience>
  );

  if (lockedContent) {
    return (
      <LockScreen
        contentId={slug}
        title="Content locked for free users"
        message="Unlock to preview this show. Upgrade your plan for full access without the lock screen."
        buttonText="Unlock content">
        {content}
      </LockScreen>
    );
  }

  return content;
}
