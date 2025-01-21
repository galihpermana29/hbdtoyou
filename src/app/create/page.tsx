'use client';
import NavigationBar from '@/components/ui/navbar';
import { Button, message, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import NetflixForm from '@/components/forms/netflix-form';
import { getAllTemplates } from '@/action/user-api';
import { IAllTemplateResponse } from '@/action/interfaces';
import SpotifyForm from '@/components/forms/spotify-form';
import { useMemoifyProfile, useMemoifySession } from '../session-provider';
import { signIn } from 'next-auth/react';
import DisneyForm from '@/components/forms/disney-form';
import Newspaperv1Form from '@/components/forms/newspaperv1-form';
import Newspaperv3Form from '@/components/forms/newspaperv3-form';
import GraduationV1Form from '@/components/forms/graduationv1-form';
import GraduationV2Form from '@/components/forms/graduationv2-form';

const PREMIUM_TEMPLATES = ['newspaperv2', 'disneyplusv1'];
const EXCLUDE_TEMPLATES: string[] = [];

const CreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    route: string;
  } | null>(null);
  const [templates, setTemplates] = useState<IAllTemplateResponse[] | null>(
    null
  );

  const [modalState, setModalState] = useState({
    visible: false,
    data: '',
  });

  const session = useMemoifySession();
  const profile = useMemoifyProfile();

  const handleGetTemplates = async () => {
    const data = await getAllTemplates();
    if (data.success) {
      setTemplates(data.data);
    } else {
      message.error(data.message);
    }
  };

  useEffect(() => {
    handleGetTemplates();
  }, []);

  return (
    <div>
      <NavigationBar />
      <Modal
        onCancel={() =>
          setModalState({
            visible: false,
            data: '',
          })
        }
        title="Successfully created"
        open={modalState.visible}
        footer={null}>
        <div>
          <h1 className="text-[20px] font-bold">Your own website is ready!</h1>
          <p>
            You can share your own version of memoify with your friends or
            someone you love.
          </p>
          <div className="flex items-center gap-[12px] mt-[12px]">
            <Link href={`/${modalState.data}`} className="cursor-pointer">
              <Button
                size="large"
                type="primary"
                className="!bg-black !text-[14px]">
                Open now
              </Button>
            </Link>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + '/' + modalState.data
                );
                message.success('Copied!');
              }}
              size="large"
              type="primary"
              className="!bg-black !text-[14px]">
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>

      <Spin
        spinning={loading}
        fullscreen
        indicator={<LoadingOutlined spin />}
      />

      <div className="flex flex-col items-center justify-start min-h-screen py-[30px]">
        <div className="w-full max-w-[90%] md:max-w-[60%] lg:max-w-[50%]">
          {selectedTemplate ? (
            <>
              <h1 className="text-[35px] font-bold ">
                Fill the form and create yours
              </h1>
              {profile && (
                <p className="mb-[20px]">
                  Oh, you are in{' '}
                  <span className="font-bold">{profile?.type}</span> plan
                </p>
              )}
              {selectedTemplate.route.includes('netflixv1') && (
                <NetflixForm
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('spotifyv1') && (
                <SpotifyForm
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('disneyplusv1') && (
                <DisneyForm
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('newspaperv1') && (
                <Newspaperv1Form
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('newspaperv3') && (
                <Newspaperv3Form
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('graduationv1') && (
                <GraduationV1Form
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}

              {selectedTemplate.route.includes('graduationv2') && (
                <GraduationV2Form
                  selectedTemplate={selectedTemplate}
                  loading={loading}
                  setLoading={setLoading}
                  modalState={modalState}
                  setModalState={setModalState}
                />
              )}
            </>
          ) : (
            <>
              <h1 className="text-[35px] font-bold mb-[20px]">
                Select a template
              </h1>
              <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-[10px]  justify-items-center">
                {templates
                  ? templates?.map((show, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (session?.accessToken) {
                            if (show.label !== 'pending') {
                              const routePath = show.name
                                .split('-')[1]
                                .split(' ')[1];

                              if (show.label === 'premium') {
                                if (
                                  ['pending', 'premium'].includes(
                                    profile?.type as any
                                  )
                                ) {
                                  setSelectedTemplate({
                                    id: show.id,
                                    route: routePath,
                                  });
                                  return;
                                } else {
                                  return message.info('Premium plan required');
                                }
                              }
                              setSelectedTemplate({
                                id: show.id,
                                route: show.name.split('-')[1].split(' ')[1],
                              });
                            } else {
                              message.error('Coming Soon!');
                            }
                          } else {
                            signIn('google');
                          }
                        }}>
                        <div className="bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group max-w-[400px] ">
                          <div className="mb-4 relative">
                            <img
                              src={show.thumbnail_uri}
                              alt={show.name}
                              className="w-full aspect-video object-cover rounded-md"
                            />
                          </div>
                          <h3 className="font-semibold text-white mb-1 line-clamp-1">
                            {show.name?.split('-')[0]}
                          </h3>
                        </div>
                      </div>
                    ))
                  : 'No templates'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
