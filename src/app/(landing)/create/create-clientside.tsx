'use client';
import NavigationBar from '@/components/ui/navbar';
import {
  Button,
  message,
  Modal,
  notification,
  Progress,
  Segmented,
  Spin,
  Steps,
} from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import NetflixForm from '@/components/forms/netflix-form';
import {
  getAllTemplates,
  getGraduationTemplates,
  getOriginalTemplates,
  getPopularTemplates,
} from '@/action/user-api';
import { IAllTemplateResponse } from '@/action/interfaces';
import SpotifyForm from '@/components/forms/spotify-form';
import { useMemoifyProfile, useMemoifySession } from '../../session-provider';
import { signIn } from 'next-auth/react';
import DisneyForm from '@/components/forms/disney-form';
import Newspaperv1Form from '@/components/forms/newspaperv1-form';
import Newspaperv3Form from '@/components/forms/newspaperv3-form';
import GraduationV1Form from '@/components/forms/graduationv1-form';
import GraduationV2Form from '@/components/forms/graduationv2-form';
import MagazineV1Form from '@/components/forms/magazinev1-form';
import Formula1Form from '@/components/forms/f1historyv1-form';
import CardTemplate from '@/components/newlanding/card-template/CardTemplate';
import { ArrowLeft } from 'lucide-react';
import useCreateContent from './usecase/useCreateContent';
import { templateNameToRoute } from '@/lib/utils';
import { TemplateGridSection } from './view/presentation/CreateTemplateSection';
import { useRouter } from 'next/navigation';
import AlbumGraduationv1 from '@/components/forms/albumgraduationv1-form';

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

    if (template.name.includes('scrapbookv1')) {
      const routePath = templateNameToRoute(template.name);
      return router.push(
        `/create/scrapbook?templateId=${template.id}&route=${routePath}`
      );
    }

    if (template.name.includes('scrapbookvintage')) {
      const routePath = templateNameToRoute(template.name);
      return router.push(
        `/create/scrapbook-vintage?templateId=${template.id}&route=${routePath}`
      );
    }
    const routePath = templateNameToRoute(template.name);

    if (template.label === 'premium') {
      if (!['pending', 'premium'].includes(profile?.type as any)) {
        return message.info('Premium plan required');
      }
    }

    setSelectedTemplate({ id: template.id, route: routePath });
    setCurrent(1);
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
              {selectedTemplate.route.includes('netflixv1') && (
                <NetflixForm
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('spotifyv1') && (
                <SpotifyForm
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('disneyplusv1') && (
                <DisneyForm
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('newspaperv1') && (
                <Newspaperv1Form
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('newspaperv3') && (
                <Newspaperv3Form
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('graduationv1') && (
                <GraduationV1Form
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('graduationv2') && (
                <GraduationV2Form
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('magazinev1') && (
                <MagazineV1Form
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate!}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('f1historyv1') && (
                <Formula1Form
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate!}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('albumgraduation1') && (
                <AlbumGraduationv1
                  handleCompleteCreation={handleCompleteCreation}
                  openNotification={openNotification}
                  selectedTemplate={selectedTemplate!}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}
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
                  <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-6 gap-4'>
                    <p className='font-semibold text-2xl text-[#1B1B1B]'>Select Your Template</p>
                    <Segmented
                      options={['All', 'Famous Template', 'Graduation Template', 'Memoify Template']}
                      value={templateFilter}
                      onChange={(value) => setTemplateFilter(value)}
                      className="bg-gray-100 p-1 rounded-full"
                    />
                  </div>
                  <div className="w-full">
                    {(templateFilter === 'All' || templateFilter === 'Famous Template') && (
                      <TemplateGridSection
                        title="Popular Template"
                        templates={popularTemplates}
                        onTemplateClick={handleTemplateClick}
                      />
                    )}
                    {(templateFilter === 'All' || templateFilter === 'Memoify Template') && (
                      <TemplateGridSection
                        title="Original Template"
                        templates={templates}
                        onTemplateClick={handleTemplateClick}
                      />
                    )}
                    {(templateFilter === 'All' || templateFilter === 'Graduation Template') && (
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
