'use client';
import NavigationBar from '@/components/ui/navbar';
import ShareGift from '@/components/forms/share-gift';
import MemorollFormTheme from '@/components/forms/memoroll-form-theme';
import { FreeAllowance } from '@/components/forms/plan-count';
import { message, Segmented, Spin, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
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
import NewVinylForm from '@/components/forms/new/new-vinyl-form';
import NewTarotForm from '@/components/forms/new/new-tarot-form';
import NewArcadeClawForm from '@/components/forms/new/new-arcade-claw-form';
import NewBoardOfUsForm from '@/components/forms/new/new-board-of-us-form';
import NewRollOfUsForm from '@/components/forms/new/new-roll-of-us-form';
import { visibleTemplates } from '@/lib/template-catalog';
import { templateRoute } from '@/lib/template-thumbnail';

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

const CreatePage = ({ initialTemplateId }: { initialTemplateId?: string }) => {
  const {
    loading,
    current,
    selectedTemplate,
    modalState,
    setModalState,
    session,
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

  // The Popular and Original sections are not drawn until both lists have
  // answered. They used to be drawn empty ("No templates") and filled one at
  // a time, Original first, so Popular arriving above it pushed it down the
  // screen: a layout shift of 0.33 on a phone and 0.38 on a desktop (CLS,
  // 2026-11-18). Now they appear together, in space held open for them.
  // Graduation still arrives last; it is the bottom section, so it only
  // pushes what is below it.
  //
  // The requests stay one after another: they are server actions, which
  // Next runs one at a time anyway.
  const [listed, setListed] = useState(false);

  const handleGetTemplates = async () => {
    const data = await getOriginalTemplates();
    if (data.success) {
      const original = visibleTemplates(data.data);
      const dx = await getPopularTemplates();
      setTemplates(original);
      setListed(true);
      if (dx.success) {
        const popular = visibleTemplates(dx.data);
        setPopularTemplates(popular);
        // `?template=` names a template by its id, or by its route
        // (`netflixv1`), which is what a sample page's "Create this gift"
        // sends: the route is the same on every backend, the id is not.
        if (initialTemplateId) {
          const requestedTemplate = [...original, ...popular].find(
            (template) =>
              template.id === initialTemplateId ||
              templateRoute(template.name) === initialTemplateId
          );
          if (requestedTemplate) handleTemplateClick(requestedTemplate);
        }
      } else {
        message.error(dx.message);
      }
      const gx = await getGraduationTemplates();
      if (gx.success) {
        setGraduationTemplates(visibleTemplates(gx.data));
      } else {
        message.error(gx.message);
      }
    } else {
      setListed(true);
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

    if (template.type === 'wedding') {
      return router.push('/wedding-invitation');
    }

    if (template.type === 'photobox') {
      return router.push('/photobox');
    }

    // if (template.label === 'premium' && isFreeAccount) {
    //   return message.info('Premium plan required');
    // }

    const routePath = templateNameToRoute(template.name);

    setSelectedTemplate({
      id: template.id,
      route: routePath,
      label: template.label,
    });
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
    vinylv1: NewVinylForm,
    tarotv1: NewTarotForm,
    arcadeclawv1: NewArcadeClawForm,
    boardofusv1: NewBoardOfUsForm,
    rollofusv1: NewRollOfUsForm,
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

      <MemorollFormTheme>
        <div className="flex flex-col items-center justify-start min-h-screen py-[30px] pb-[80px]">
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
                  <h1 className="text-[#232323] font-[700] text-[20px] leading-[150%] tracking-[-0.011em]">
                    Create your website gift
                  </h1>
                  <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
                    Create custom websites inspired by your favorite platforms
                    like Netflix, Spotify, or YouTube.
                  </p>
                </div>
              </div>
              {/* antd turns Steps vertical below 576px, but only once it
                  has measured the window after hydration: the server's
                  horizontal row grew by 95px on a phone and pushed the page
                  down (CLS 0.06). Both forms are drawn by the server and
                  CSS shows the one for the screen, at antd's own
                  breakpoint, so the first paint is already the final one. */}
              <Steps
                size="small"
                current={current}
                items={StepsCustom}
                responsive={false}
                className="max-[575px]:!hidden"
              />
              <Steps
                size="small"
                direction="vertical"
                current={current}
                items={StepsCustom}
                responsive={false}
                className="min-[576px]:!hidden"
              />
              <div className="mt-[20px] max-w-[640px]">
                <FreeAllowance kind="gift" />
              </div>
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
                  <ShareGift path={modalState.data} />
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
                    {!listed ? (
                      // Held open below the fold, so the lists arriving
                      // move nothing that was on screen.
                      <div aria-busy="true" className="min-h-screen w-full" />
                    ) : null}
                    <div className={listed ? 'w-full' : 'hidden'}>
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
      </MemorollFormTheme>
    </div>
  );
};

export default CreatePage;
