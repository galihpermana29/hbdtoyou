// dynamic version

import { getDetailContent } from '@/action/user-api';
import NetflixGraduation from './NetflixGraduation';
import 'react-photo-view/dist/react-photo-view.css';
import { Metadata } from 'next';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  try {
    const data = await getDetailDataNew(id);

    if (!data.data) {
      return {
        title: 'Graduation Album',
        description: 'Graduation celebration album',
      };
    }

    const parsedData = JSON.parse(data.data.detail_content_json_text);

    if (!parsedData) {
      return {
        title: 'Graduation Album',
        description: 'Graduation celebration album',
      };
    }

    const llmGenerated = parsedData.llm_generated;

    return {
      title: llmGenerated.name || 'Graduation Day',
      description:
        llmGenerated.storyDescription ||
        `${llmGenerated.subtitle} - Graduation celebration at ${llmGenerated.graduationPlace} on ${llmGenerated.graduationDate}`,
      openGraph: {
        title: llmGenerated.name || 'Graduation Day',
        description: llmGenerated.storyDescription || llmGenerated.subtitle,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: llmGenerated.name || 'Graduation Day',
        description: llmGenerated.storyDescription || llmGenerated.subtitle,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Graduation Album',
      description: 'Graduation celebration album',
    };
  }
}

const GraduationNetflixPage = async ({ params }: any) => {
  const { id } = params;

  const data = await getDetailDataNew(id);

  if (!data.data) {
    return <div>No data</div>;
  }

  return <NetflixGraduation dataContent={data.data} id={id} />;
};

export default GraduationNetflixPage;
