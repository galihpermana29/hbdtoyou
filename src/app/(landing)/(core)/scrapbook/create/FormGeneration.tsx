'use client';
import { Button, Form, message } from 'antd';
import { useMemoifyProfile } from '@/app/session-provider';
import { IAllTemplateResponse } from '@/action/interfaces';
import { useEffect, useState } from 'react';
import {
  createContent,
  getPopularTemplates,
  warmUpAIModel,
} from '@/action/user-api';
import CardTemplateTag from '@/components/newlanding/card-template/CardTemplateTag';
import { CheckIcon } from 'lucide-react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { useWatch } from 'antd/es/form/Form';

interface FormGenerationProps {
  openNotification: (progress: number, key: any, isError?: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const FormGeneration = ({
  openNotification,
  selectedTemplateId,
  setSelectedTemplateId,
  setLoading,
}: FormGenerationProps) => {
  const [form] = Form.useForm();
  const profile = useMemoifyProfile();

  const router = useRouter();
  const query = useSearchParams();
  const templateName = query.get('route');
  const images = useWatch('images', form);

  const [popularTemplates, setPopularTemplates] = useState<
    IAllTemplateResponse[] | null
  >(null);

  const handleGetTemplates = async () => {
    await warmUpAIModel();
    const dx = await getPopularTemplates();
    if (dx.success) {
      const filteredTemplates =
        dx.data?.filter((dx) => dx.name.includes('Scrapbook')) || [];
      setPopularTemplates(filteredTemplates);

      // Set the first template as selected by default if available
      if (filteredTemplates.length > 0) {
        const scrapbook1Data = filteredTemplates.find(
          (dx) => dx.name?.split('- ')[1] === 'scrapbook1'
        );
        setSelectedTemplateId(scrapbook1Data?.id || '');
        router.push(
          `/scrapbook/create?templateId=${scrapbook1Data?.id}&route=${
            scrapbook1Data?.name?.split('- ')[1]
          }`
        );
        form.setFieldValue('templateId', scrapbook1Data?.id);
      }
    } else {
      message.error(dx.message);
    }
  };

  const handleFinish = async (value: any) => {
    setLoading(true);
    const json_text = {
      title: 'Scrapbook AI',
      subTitle: 'Scrapbook AI',
      images: value.images || null,
      isPublic: true,
    };

    const payload = {
      template_id: selectedTemplateId,
      detail_content_json_text: JSON.stringify(json_text),
      title: 'Scrapbook AI',
      caption: 'Scrapbook AI',

      date_scheduled: null,
      dest_email: '',
      is_scheduled: false,
      status: 'published',
    };

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 40000)
      );

      const res: any = await Promise.race([
        createContent(payload),
        timeoutPromise,
      ]);

      if (res.success) {
        form.resetFields();
        router.push(`/${templateName}/${res.data}`);
        message.success('Successfully created!');
      } else {
        message.error(res.message);
      }
    } catch (error: any) {
      if (error.message === 'timeout') {
        message.error('Server is busy, try again later.');
      } else {
        message.error('Server is busy, try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTemplates();
  }, []);
  return (
    <div>
      <div className="mb-[40px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
          Scrapbook AI Form
        </h1>
        <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
          Fill the form and generate your scrapbook instantly within just in a
          second
        </p>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}>
        <div className="mt-[10px] mb-[5px]">
          <h3 className="text-[15px] font-semibold">AI Models</h3>

          <p className="text-[13px] text-gray-600 max-w-[400px]">
            Memo AI 1.0 (Cropping & Layouting)
          </p>
        </div>
        <div className="mt-[10px] mb-[5px]">
          <h3 className="text-[15px] font-semibold">AI Token</h3>

          <p className="text-[13px] text-gray-600 max-w-[400px]">
            You have {profile?.token_scrapbook} token, to generate scrapbook you
            need at least 1 token
          </p>
        </div>
        <Form.Item
          rules={[
            { required: true, message: 'Please upload atleast 1 content' },
          ]}
          name={'images'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Collection of images
              </h3>
            </div>
          }>
          <DraggerUpload
            disabled={profile?.token_scrapbook === 0}
            profileImageURL={images}
            form={form}
            formItemName={'images'}
            type={profile?.type as AccountType}
            multiple={true}
            limit={profile?.type === 'free' ? 5 : 20}
            openNotification={openNotification}
          />
        </Form.Item>

        <Form.Item
          name="templateId"
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">Scrapbook Style</h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Select a style for your scrapbook
              </p>
            </div>
          }
          rules={[
            { required: true, message: 'Please select a template style' },
          ]}>
          <div className="flex gap-[10px] overflow-x-auto max-w-[320px] md:max-w-[500px]">
            {popularTemplates?.length ? (
              popularTemplates.map((template, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'relative cursor-pointer rounded-lg transition-all',
                    selectedTemplateId === template.id ? '' : ''
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedTemplateId(template.id);
                    form.setFieldValue('templateId', template.id);
                    router.push(
                      `/scrapbook/create?templateId=${template.id}&route=${
                        template.name?.split('- ')[1]
                      }`
                    );
                  }}>
                  {selectedTemplateId === template.id && (
                    <div className="absolute top-2 right-2 z-10 bg-blue-500 rounded-full p-1">
                      <CheckIcon size={16} color="white" />
                    </div>
                  )}
                  <CardTemplateTag data={template} type="scrapbook" />
                </div>
              ))
            ) : (
              <p>No templates</p>
            )}
          </div>
        </Form.Item>

        <Button
          disabled={profile?.token_scrapbook < 1}
          type="primary"
          style={{
            height: '50px',
            width: '100%',
          }}
          htmlType="submit"
          size="large">
          {profile?.token_scrapbook < 1 ? 'Upgrade Plan' : 'Generate Scrapbook'}
        </Button>
      </Form>
    </div>
  );
};

export default FormGeneration;
