'use client';
import FormGeneration from './FormGeneration';
import useCreateContent from '../../create/usecase/useCreateContent';
import { Suspense, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrapbookResult1 from '@/app/(landing)/(scrapbooks)/scrapbook1/page';
import ScrapbookResult2 from '@/app/(landing)/(scrapbooks)/scrapbook2/page';
import Scrapbook3 from '@/app/(landing)/(scrapbooks)/scrapbook3/page';
import Scrapbook4 from '@/app/(landing)/(scrapbooks)/scrapbook4/page';
import Scrapbook5 from '@/app/(landing)/(scrapbooks)/scrapbook5/page';

import { warmUpAIModel } from '@/action/user-api';
import GeneratingLLMLoadingModal from '@/app/(landing)/albumgraduation1/[id]/GeneratingLLMLoadingModal';
import Scrapbook6 from '@/app/(landing)/(scrapbooks)/scrapbook6/page';
import Scrapbook7 from '@/app/(landing)/(scrapbooks)/scrapbook7/page';
import Scrapbook8 from '@/app/(landing)/(scrapbooks)/scrapbook8/page';

const ScrapbookCreatePage = () => {
  const {
    loading,

    contextHolder,
    openNotification,

    setLoading,
  } = useCreateContent();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

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
    scrapbook6: (
      <Suspense>
        <Scrapbook6 />
      </Suspense>
    ),
    scrapbook7: (
      <Suspense>
        <Scrapbook7 />
      </Suspense>
    ),
    scrapbook8: (
      <Suspense>
        <Scrapbook8 />
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
      <GeneratingLLMLoadingModal isOpen={loading} />
      <div className="w-full overflow-x-hidden min-h-screen">
        <div className="flex flex-col items-center justify-start min-h-screen py-[30px] mb-[50px] ">
          <div className="mx-auto px-[20px] flex-1 w-full flex flex-col justify-center items-stretch lg:justify-normal lg:items-stretch lg:flex-row gap-[20px] relative">
            {/* Toggle Button - Hidden on mobile */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-[10] bg-white border-[1px] border-[#EDEDED] rounded-full p-3 shadow-lg hover:shadow-xl hover:border-[#007AFF] transition-all duration-200 ${
                isSidebarCollapsed
                  ? 'left-[20px]'
                  : 'left-[calc(500px+20px-16px)]'
              }`}>
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>

            {/* Left Sidebar - FormGeneration */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isSidebarCollapsed
                  ? 'w-0 opacity-0 overflow-hidden lg:flex-[0] lg:max-w-0'
                  : 'flex-[1] max-w-[500px] lg:flex-[1] lg:max-w-[500px]'
              } border-[#EDEDED] border-[1px] rounded-[16px] flex flex-col ${
                isSidebarCollapsed ? 'p-0' : 'p-[24px]'
              }`}>
              <div className={isSidebarCollapsed ? 'hidden' : 'block'}>
                <FormGeneration
                  openNotification={openNotification}
                  selectedTemplateId={selectedTemplateId}
                  setSelectedTemplateId={setSelectedTemplateId}
                  setLoading={setLoading}
                  loading={loading}
                />
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isSidebarCollapsed
                  ? 'flex-1 lg:flex-1 w-full'
                  : 'flex-[1.5] lg:flex-[1.5]'
              } p-[24px] rounded-[16px] border-[#EDEDED] border-[1px] flex flex-col`}>
              <div className="my-[40px] lg:my-[0px] px-[16px]">
                <h1 className="text-[#1B1B1B] font-[600] text-[18px] ">
                  Style Preview
                </h1>
                <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
                  Preview of the scrapbook
                </p>
              </div>
              <div className="flex-1 justify-center items-center flex">
                {scrapbookPreview?.[templateName]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookCreatePage;
