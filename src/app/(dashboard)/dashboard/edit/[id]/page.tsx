'use client';

import { getDetailContent } from '@/action/user-api';
import useCreateContent from '@/app/(landing)/create/usecase/useCreateContent';
import DisneyForm from '@/components/forms/disney-form';
import Formula1Form from '@/components/forms/f1historyv1-form';
import GraduationV1Form from '@/components/forms/graduationv1-form';
import GraduationV2Form from '@/components/forms/graduationv2-form';
import MagazineV1Form from '@/components/forms/magazinev1-form';
import NetflixForm from '@/components/forms/netflix-form';
import Newspaperv1Form from '@/components/forms/newspaperv1-form';
import Newspaperv3Form from '@/components/forms/newspaperv3-form';
import SpotifyForm from '@/components/forms/spotify-form';
import DashboardNavbar from '@/components/ui/dashboard-navbar';
import NavigationBar from '@/components/ui/navbar';
import { Button, message } from 'antd';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditContentDashboardPage = () => {
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

  const [detailContent, setDetailContent] = useState<any>(null);

  //get id
  const { id } = useParams();
  const templateName = useSearchParams().get('templateName');
  const templateId = useSearchParams().get('templateId');
  const getDetailContentById = async (id: string) => {
    const res = await getDetailContent(id);
    if (res.success) {
      setDetailContent(res.data);
    } else {
      message.error(res.message);
    }
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
          {selectedTemplate && (
            <div className="w-full">
              {selectedTemplate.route.includes('netflixv1') && (
                <NetflixForm
                  editData={detailContent}
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
                  editData={detailContent}
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
                  editData={detailContent}
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
                  editData={detailContent}
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
                  editData={detailContent}
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
                  editData={detailContent}
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
                  editData={detailContent}
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
                  editData={detailContent}
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
            </div>
          )}

          {modalState?.data && (
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
                    You can share your own version of website with your friends
                    or someone you love. Thank you for using Memoify. Feel free
                    to tag and follow us on instagram @memoify.live
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
          )}
        </div>
      </div>
    </div>
  );
};

export default EditContentDashboardPage;
