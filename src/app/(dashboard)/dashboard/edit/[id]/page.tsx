'use client';

import { getDetailContent } from '@/action/user-api';
import useCreateContent from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import AlbumGraduationv1 from '@/components/forms/albumgraduationv1-form';

import NewGraduation1Form from '@/components/forms/new/new-graduation1-form';
import NewDisneyForm from '@/components/forms/new/new-disney-form';
import NewMagazineV1Form from '@/components/forms/new/new-magazine1-form';
import NewNetflixForm from '@/components/forms/new/new-netflix-form';
import NewNewspaper1Form from '@/components/forms/new/new-newspaper1-form';
import NewNewspaper3Form from '@/components/forms/new/new-newspaper3-form';
import NewSpotifyForm from '@/components/forms/new/new-spotify-form';
import DashboardNavbar from '@/components/ui/dashboard-navbar';
import NavigationBar from '@/components/ui/navbar';
import { Button, message } from 'antd';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewGraduation2Form from '@/components/forms/new/new-graduation2-form';

const EditContentDashboardPage = () => {
  const {
    loading,
    selectedTemplate,
    modalState,
    setModalState,
    contextHolder,
    openNotification,
    handleCompleteCreation,
    setLoading,
    setSelectedTemplate,
    setCurrent,
  } = useCreateContent();

  const [detailContent, setDetailContent] = useState<any>(null);

  //get id
  const { id } = useParams();
  const templateName = useSearchParams().get('templateName');
  const templateId = useSearchParams().get('templateId');

  const getDetailContentById = async (id: string) => {
    setLoading(true);
    const res = await getDetailContent(id);
    if (res.success) {
      setDetailContent(res.data);
    } else {
      message.error(res.message);
    }
    setLoading(false);
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
    albumgraduationv1: AlbumGraduationv1,
  };

  useEffect(() => {
    if (templateId && templateName) {
      setSelectedTemplate({
        id: templateId as string,
        route: templateName,
      });
      setCurrent(1);
    }
  }, [templateId, templateName]);

  useEffect(() => {
    if (selectedTemplate && id) {
      getDetailContentById(id as string);
    }
  }, [selectedTemplate, id]);
  return (
    <div>
      {contextHolder}
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
        <DashboardNavbar />
      </div>
      <div className="flex flex-col items-center justify-start min-h-screen py-[30px] mb-[50px] !pt-[180px]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] flex-1 w-full">
          {selectedTemplate ? (
            <div className="w-full">
              {(() => {
                const TemplateComponent =
                  templateComponents[selectedTemplate.route];

                if (TemplateComponent) {
                  return (
                    <TemplateComponent
                      editData={detailContent}
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
            modalState?.data && (
              <div className="flex flex-col md:flex-row items-center gap-[20px]">
                <div className="shadow-lg w-full rounded-md">
                  <iframe
                    src={window?.location.origin + '/' + modalState?.data}
                    className="aspect-video object-cover rounded-md w-full"
                  />
                </div>
                <div className="w-full md:w-[70%]">
                  <div className="max-w-[400px]">
                    <h1 className="text-[#1B1B1B] font-[600] text-[30px] md:text-[36px]">
                      Your site is ready!
                    </h1>
                    <p className="text-[#7B7B7B] text-[14px] md:text-[18px] font-[400]">
                      You can share your own version of website with your
                      friends or someone you love. Thank you for using Memoify.
                      Feel free to tag and follow us on instagram @memoify.live
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EditContentDashboardPage;
