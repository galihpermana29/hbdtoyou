'use client';

import NavigationBar from '@/components/ui/navbar';
import { FrameData, frameData } from '@/lib/frameData';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Photobox = () => {
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(
    frameData[0]
  );

  const router = useRouter();

  const handleNextToCamera = () => {
    const id = selectedFrame!.id + '-' + uuidv4();
    router.push(`/photobox/${id}`);
  };
  return (
    <div>
      <NavigationBar />

      <div className="mt-[20px] bg-[#dfd2c4] p-[20px] m-[20px] rounded-[20px]">
        <h1 className="text-[30px] mb-[20px] font-bold capitalize text-center">
          Select your photobox frame
        </h1>

        <div className="flex items-start gap-[10px] mt-[20px] h-[90vh]">
          <div className="flex flex-wrap justify-center items-center gap-[40px] flex-1 h-[85vh] overflow-y-auto">
            {frameData.map((dx: any, idx: any) => {
              return (
                <div
                  className="max-w-[300px] w-full cursor-pointer hover:bg-[#dca0a048]"
                  key={idx}
                  onClick={() => setSelectedFrame(dx)}>
                  <Image
                    src={dx.assets}
                    alt=""
                    key={idx}
                    className="w-full"
                    width={1181}
                    height={1772}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex-1 flex justify-center items-center">
            {selectedFrame && (
              <div className="w-[350px]">
                <Image
                  src={selectedFrame!.assets}
                  alt=""
                  width={1181}
                  height={1772}
                />
                <div>
                  <Button
                    onClick={() => handleNextToCamera()}
                    className="mt-[20px] w-full"
                    size="large"
                    type="primary">
                    {selectedFrame!.premium ? 'Pay 10k to Continue' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photobox;
