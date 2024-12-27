'use client';
import { useState } from 'react';
import PictureInFrame from '@/components/photobox/PictureFrame/PictureFrame';
import Cameragram from '@/components/photobox/Cameragram/Cameragram';
import { useParams, useRouter } from 'next/navigation';
import { frameData } from '@/lib/frameData';

import { Spin } from 'antd';

const uploadImage = async (base64: string) => {
  const data = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64 }),
  });

  if (data.ok) {
    const dx = await data.json();
    return dx.data;
  } else {
    throw new Error('Error');
  }
};

const PhotoboxPage = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [base64Image, setBase64Image] = useState<string | null>(null); // Base64 image data
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const frameId = id ? (id as string).split('-')[0] : null;

  const router = useRouter();

  const dataFrame = frameId
    ? frameData.find((dx) => dx.id === Number(frameId))
    : null;

  const handleDownload = async () => {
    if (base64Image) {
      setLoading(true);
      const jumbotronURL = await uploadImage(base64Image);
      router.push(`/photobox/finish?url=${jumbotronURL}`);
      setLoading(false);
    }
  };

  if (!dataFrame) {
    return <div>No data</div>;
  }

  return (
    <div className="flex h-screen">
      <Spin fullscreen spinning={loading} />

      <div className="w-[60%] py-[50px] px-[20px]  flex flex-col items-center justify-center">
        <Cameragram
          setPhotos={setPhotos}
          photos={photos}
          handleDownload={handleDownload}
        />
      </div>
      <div className="flex justify-center items-center flex-1">
        <PictureInFrame
          base64Image={base64Image as string}
          setBase64Image={setBase64Image}
          frameSrc={dataFrame.assets}
          photos={photos}
          baseWidth={960}
          baseHeight={1440}
        />
      </div>
    </div>
  );
};

export default PhotoboxPage;
