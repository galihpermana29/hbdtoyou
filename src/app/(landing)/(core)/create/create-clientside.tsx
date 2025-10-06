'use client';
import NavigationBar from '@/components/ui/navbar';
import { Button, message, Segmented, Spin, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import {
  getGraduationTemplates,
  getOriginalTemplates,
  getPopularTemplates,
} from '@/action/user-api';
import { IAllTemplateResponse } from '@/action/interfaces';
import { signIn } from 'next-auth/react';

import { ArrowLeft } from 'lucide-react';
import useCreateContent from './usecase/useCreateContent';
import { templateNameToRoute } from '@/lib/utils';
import { TemplateGridSection } from './view/presentation/CreateTemplateSection';
import { useRouter } from 'next/navigation';
import AlbumGraduationv1 from '@/components/forms/albumgraduationv1-form';
import NewNetflixForm from '@/components/forms/new/new-netflix-form';
import NewDisneyForm from '@/components/forms/new/new-disney-form';
import NewSpotifyForm from '@/components/forms/new/new-spotify-form';
import NewMagazineV1Form from '@/components/forms/new/new-magazine1-form';
import NewNewspaper1Form from '@/components/forms/new/new-newspaper1-form';
import NewNewspaper3Form from '@/components/forms/new/new-newspaper3-form';
import NewGraduation1Form from '@/components/forms/new/new-graduation1-form';
import NewGraduation2Form from '@/components/forms/new/new-graduation2-form';

const StepsCustom = [
  {
    title: (
      <h1 className="text-[#101828] font-[600] text-[16px] max-w-[530px]">
        Choose a template
      </h1>
    ),
    description: (
      <p className="text-[#475467] font-[400] text-[13px]">
        Select a template that suits your needs
      </p>
    ),
  },
  {
    title: (
      <h1 className="text-[#101828] font-[600] text-[16px] max-w-[530px]">
        Fill the form
      </h1>
    ),
    description: (
      <p className="text-[#475467] font-[400] text-[13px]">
        Upload a picture, write a letter and caption
      </p>
    ),
  },
  {
    title: (
      <h1 className="text-[#101828] font-[600] text-[16px] max-w-[530px]">
        Share
      </h1>
    ),
    description: (
      <p className="text-[#475467] font-[400] text-[13px]">
        Share your creation with your special people
      </p>
    ),
  },
];

const CreatePage = () => {
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
  const isFreeAccount = profile?.quota < 1;

  const [templateFilter, setTemplateFilter] = useState('All');

  const [templates, setTemplates] = useState<IAllTemplateResponse[] | null>(
    null
  );

  const router = useRouter();

  const [popularTemplates, setPopularTemplates] = useState<
    IAllTemplateResponse[] | null
  >(null);

  const [graduationTemplates, setGraduationTemplates] = useState<
    IAllTemplateResponse[] | null
  >(null);

  const handleGetTemplates = async () => {
    const data = await getOriginalTemplates();
    if (data.success) {
      setTemplates(data.data);
      const dx = await getPopularTemplates();
      if (dx.success) {
        setPopularTemplates(dx.data);
      } else {
        message.error(dx.message);
      }
      const gx = await getGraduationTemplates();
      if (gx.success) {
        setGraduationTemplates(gx.data);
      } else {
        message.error(gx.message);
      }
    } else {
      message.error(data.message);
    }
  };

  const handleTemplateClick = (template: any) => {
    if (!session?.accessToken) return signIn('google');

    if (template.label === 'pending') {
      return message.error('Coming Soon!');
    }

    if (template.name.includes('journal')) {
      return router.push('/journal');
    }

    if (template.name.includes('scrapbook')) {
      return router.push(`/scrapbook/create`);
    }

    if (template.label === 'premium' && isFreeAccount) {
      return message.info('Premium plan required');
    }

    const routePath = templateNameToRoute(template.name);

    setSelectedTemplate({ id: template.id, route: routePath });
    setCurrent(1);
  };

  const templateComponents = {
    netflixv1: NewNetflixForm,
    spotifyv1: NewSpotifyForm,
    disneyplusv1: NewDisneyForm,
    newspaperv1: NewNewspaper1Form,
    newspaperv3: NewNewspaper3Form,
    graduationv1: NewGraduation1Form,
    graduationv2: NewGraduation2Form,
    magazinev1: NewMagazineV1Form,
    albumgraduation1: AlbumGraduationv1,
  };

  useEffect(() => {
    handleGetTemplates();
  }, []);

  return (
    <div>
      <NavigationBar />

      {contextHolder}
      <Spin
        spinning={loading}
        fullscreen
        indicator={<LoadingOutlined spin />}
      />

      <div className="flex flex-col items-center justify-start min-h-screen py-[30px] mb-[50px]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] flex-1 w-full">
          <div className="mb-[34px]">
            <div className="flex items-start gap-[12px]">
              {selectedTemplate && (
                <ArrowLeft
                  size={20}
                  className="mt-[12px] cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(null);
                  }}
                />
              )}
              <div className="mb-[40px]">
                <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
                  Create your website gift
                </h1>
                <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
                  Create custom websites inspired by your favorite platforms
                  like Netflix, Spotify, or YouTube.
                </p>
              </div>
            </div>
            <Steps
              // progressDot
              // className="custom-steps"
              current={current}
              items={StepsCustom}
            />
          </div>
          {selectedTemplate ? (
            <div className="w-full">
              {(() => {
                const TemplateComponent =
                  templateComponents[selectedTemplate.route];

                if (TemplateComponent) {
                  return (
                    <TemplateComponent
                      handleCompleteCreation={handleCompleteCreation}
                      openNotification={openNotification}
                      selectedTemplate={selectedTemplate}
                      loading={loading}
                      setLoading={setLoading}
                      modalState={modalState}
                      setModalState={setModalState}
                    />
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <>
              {modalState?.data ? (
                <div className="flex flex-col md:flex-row items-center gap-[20px]">
                  <div className="shadow-lg w-full rounded-md">
                    <iframe
                      src={window?.location.origin + '/' + modalState?.data}
                      className="aspect-video object-cover rounded-md w-full"
                    />
                  </div>
                  <div className="w-[70%]">
                    <div className="max-w-[400px]">
                      <h1 className="text-[#1B1B1B] font-[600] text-[30px] md:text-[36px]">
                        Your site is ready!
                      </h1>
                      <p className="text-[#7B7B7B] text-[14px] md:text-[18px] font-[400]">
                        You can share your own version of website with your
                        friends or someone you love. Thank you for using
                        Memoify. Feel free to tag and follow us on instagram
                        @memoify.live
                      </p>
                    </div>
                    <div className="flex mt-[20px] gap-4">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            window?.location.origin + '/' + modalState.data
                          );
                          message.success('Copied!');
                        }}
                        className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[48px] !w-[170px]"
                        type="primary"
                        size="large">
                        Copy link
                      </Button>
                      <Link
                        target="_blank"
                        href={`/${modalState.data}`}
                        className="cursor-pointer">
                        {' '}
                        <Button
                          className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[48px] !w-[170px]"
                          type="primary"
                          size="large">
                          Open in new tab
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-start w-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-6 gap-4">
                    <p className="font-semibold text-2xl text-[#1B1B1B]">
                      Select Your Template
                    </p>
                    <Segmented
                      options={[
                        'All',
                        'Popular Template',
                        // 'Graduation Template',
                        'Original Template',
                      ]}
                      value={templateFilter}
                      onChange={(value) => setTemplateFilter(value)}
                      className="bg-gray-100 p-1 rounded-full"
                    />
                  </div>
                  <div className="w-full">
                    {(templateFilter === 'All' ||
                      templateFilter === 'Popular Template') && (
                        <TemplateGridSection
                          title="Popular Template"
                          templates={popularTemplates}
                          onTemplateClick={handleTemplateClick}
                        />
                      )}
                    {(templateFilter === 'All' ||
                      templateFilter === 'Original Template') && (
                        <TemplateGridSection
                          title="Original Template"
                          templates={templates}
                          onTemplateClick={handleTemplateClick}
                        />
                      )}
                    {(templateFilter === 'All' ||
                      templateFilter === 'Graduation Template') && (
                        <TemplateGridSection
                          title="Graduation Template"
                          templates={graduationTemplates}
                          onTemplateClick={handleTemplateClick}
                        />
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
