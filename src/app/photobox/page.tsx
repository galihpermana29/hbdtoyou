'use client';

import NavigationBar from '@/components/ui/navbar';
import { FrameData, frameData } from '@/lib/frameData';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMemoifyProfile, useMemoifyUpgradePlan } from '../session-provider';
import { signIn } from 'next-auth/react';

const Photobox = () => {
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(
    frameData[0]
  );

  const router = useRouter();
  const memoifyProfile = useMemoifyProfile();
  const { setModalState: setModalUpgradePlan } = useMemoifyUpgradePlan();

  const handleNextToCamera = () => {
    const id = selectedFrame!.id + '-' + uuidv4();
    router.push(`/photobox/${id}`);
  };
  return (
    <div>
      <NavigationBar />
      <div className="mt-[20px] bg-[#dfd2c4] p-[20px] m-[20px] block md:hidden">
        <div>
          <h1 className="font-bold mb-[12px]">
            Oh, snap! You need to access this page from a desktop/laptop device.
          </h1>
          <p>
            Please use a desktop/laptop device to access this page. If you are
            using a mobile device, please use a desktop/laptop device to access
            this page.
          </p>
        </div>
      </div>

      <div className="mt-[20px] bg-[#dfd2c4] p-[20px] m-[20px] rounded-[20px] hidden md:block">
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
                  {memoifyProfile ? (
                    memoifyProfile.quota > 0 ? (
                      <Button
                        onClick={() => handleNextToCamera()}
                        className="mt-[20px] w-full"
                        size="large"
                        type="primary">
                        {'Next'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          if (selectedFrame!.premium) {
                            setModalUpgradePlan({ visible: true, data: '' });
                          } else {
                            handleNextToCamera();
                          }
                        }}
                        className="mt-[20px] w-full"
                        size="large"
                        type="primary">
                        {selectedFrame!.premium ? 'Upragde to Premium' : 'Next'}
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={() => signIn('google')}
                      className="mt-[20px] w-full"
                      size="large"
                      type="primary">
                      {'Continue with Google'}
                    </Button>
                  )}
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
