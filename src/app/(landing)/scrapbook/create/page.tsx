'use client';
import NavigationBar from '@/components/ui/navbar';
import FormGeneration from './FormGeneration';
import useCreateContent from '../../create/usecase/useCreateContent';
import ScrapbookResult1 from '../../scrapbook1/page';
import ScrapbookResult2 from '../../scrapbook2/page';
import { useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import Scrapbook3 from '../../scrapbook3/page';
import Scrapbook4 from '../../scrapbook4/page';

const ScrapbookCreatePage = () => {
  const {
    loading,
    current,
    selectedTemplate,
    modalState,
    setModalState,
    session,
    profile,
    contextHolder,
    openNotification,
    handleCompleteCreation,
    setLoading,
    setSelectedTemplate,
    setCurrent,
  } = useCreateContent();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const query = useSearchParams();
  const templateName = query.get('route');

  const scrapbookPreview = {
    scrapbook1: <ScrapbookResult1 />,
    scrapbook2: <ScrapbookResult2 />,
    scrapbook3: <Scrapbook3 />,
    scrapbook4: <Scrapbook4 />,
  };

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
          <div className="mx-auto max-w-6xl 2xl:max-w-[1400px] px-[20px] flex-1 w-full flex">
            <div className="flex-[1] max-w-[400px]">
              <FormGeneration
                openNotification={openNotification}
                selectedTemplateId={selectedTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                setLoading={setLoading}
                loading={loading}
              />
            </div>
            <div className="flex-[1.5] px-[30px]">
              <div className="mb-[40px]">
                <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
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
