'use client';
import NavigationBar from '@/components/ui/navbar';
import FormGeneration from './FormGeneration';
import useCreateContent from '../../create/usecase/useCreateContent';
import ScrapbookResult1 from '../../scrapbookv1/page';
import ScrapbookResult2 from '../../scrapbookvintage/page';
import { useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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

  const scrapbookPreview = {
    '518886f6-65b6-48cd-beb9-9a9ffc621251': <ScrapbookResult1 />,
    '44d0e72e-bf4f-4d5c-8323-c0135b910f3c': <ScrapbookResult2 />,
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
              {scrapbookPreview?.[selectedTemplateId]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookCreatePage;
