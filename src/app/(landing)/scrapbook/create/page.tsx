'use client';
import FormGeneration from './FormGeneration';
import useCreateContent from '../../create/usecase/useCreateContent';
import ScrapbookResult1 from '../../scrapbook1/page';
import ScrapbookResult2 from '../../scrapbook2/page';
import { Suspense, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import Scrapbook3 from '../../scrapbook3/page';
import Scrapbook4 from '../../scrapbook4/page';
import { warmUpAIModel } from '@/action/user-api';
import Scrapbook5 from '../../scrapbook5/page';

const ScrapbookCreatePage = () => {
  const {
    loading,

    contextHolder,
    openNotification,

    setLoading,
  } = useCreateContent();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const query = useSearchParams();
  const templateName = query.get('route');

  const scrapbookPreview = {
    scrapbook1: (
      <Suspense>
        <Scrapbook3 />
      </Suspense>
    ),
    scrapbook3: (
      <Suspense>
        <ScrapbookResult2 />
      </Suspense>
    ),
    scrapbook2: (
      <Suspense>
        <ScrapbookResult1 />
      </Suspense>
    ),
    scrapbook4: (
      <Suspense>
        <Scrapbook4 />
      </Suspense>
    ),
    scrapbook5: (
      <Suspense>
        <Scrapbook5 />
      </Suspense>
    ),
  };

  useEffect(() => {
    if (templateName === 'scrapbook1') {
      console.log('warm up');
      warmUpAIModel();
    }
  }, [templateName]);

  return (
    <div className="mt-[80px]">
      {contextHolder}
      <Spin
        spinning={loading}
        fullscreen
        indicator={<LoadingOutlined spin />}
      />
      <div className="w-full overflow-x-hidden min-h-screen">
        <div className="flex flex-col items-center justify-start min-h-screen py-[30px] mb-[50px]">
          <div className="mx-auto max-w-6xl 2xl:max-w-[1400px] px-[20px] flex-1 w-full flex flex-col justify-center items-center lg:justify-normal lg:items-center lg:flex-row gap-[50px]">
            <div className="flex-[1] max-w-[400px]">
              <FormGeneration
                openNotification={openNotification}
                selectedTemplateId={selectedTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                setLoading={setLoading}
                loading={loading}
              />
            </div>

            <div className="flex-[1.5]">
              <div className="my-[40px] lg:my-[0px] px-[16px]">
                <h1 className="text-[#1B1B1B] font-[600] text-[18px] ">
                  Style Preview
                </h1>
                <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
                  Preview of the scrapbook
                </p>
              </div>
              {scrapbookPreview?.[templateName]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookCreatePage;
