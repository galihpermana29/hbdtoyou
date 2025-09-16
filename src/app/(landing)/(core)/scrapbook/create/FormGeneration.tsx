'use client';
import { Button, Divider, Form, Input, message } from 'antd';
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
import { formatNumberWithComma } from '@/lib/utils';

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
  const isFreeAccount = profile?.token_scrapbook < 1;

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
      const res: any = await createContent(payload);

      if (res.success) {
        form.resetFields();
        window.location.href = `/${templateName}/${res.data}`;
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
      <div className="mb-[24px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[18px] lg:text-[24px]">
          Create your scrapbook in seconds
        </h1>
        <p className="text-[#666D80] text-[16px] font-[400] max-w-[400px]">
          Fill the form, upload photos, choose a style, then generate. Easy!
        </p>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}>
        <div className="flex gap-[12px]">
          <div className="mt-[10px] mb-[5px] flex-1">
            <h3 className="text-[14px] font-medium mb-[6px]">AI Models</h3>

            <Input value={'Memo AI 1.0 (Cropping & Layouting)'} readOnly />
          </div>
          <div className="mt-[10px] mb-[5px]">
            <h3 className="text-[14px] font-medium mb-[6px]">AI Token</h3>
            <Input
              className="!w-[120px]"
              value={
                formatNumberWithComma(profile?.token_scrapbook || 0) + ' Left'
              }
              readOnly
            />
          </div>
        </div>
        <Divider className="!my-[12px]" />
        <Form.Item
          rules={[
            { required: true, message: 'Please upload atleast 1 content' },
          ]}
          name={'images'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">
                Collection of images
              </h3>
            </div>
          }>
          <DraggerUpload
            // disabled={isFreeAccount}
            profileImageURL={images}
            form={form}
            formItemName={'images'}
            type={isFreeAccount ? AccountType.free : AccountType.premium}
            multiple={true}
            limit={isFreeAccount ? 2 : 15}
            openNotification={openNotification}
          />
        </Form.Item>
        <Divider className="!my-[12px]" />
        <Form.Item
          name="templateId"
          label={
            <div>
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
                    if (template.label === 'premium' && isFreeAccount) {
                      return message.info('Premium plan required');
                    }

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
        {isFreeAccount ? (
          <p className="text-[12px] text-gray-600 my-[12px]">
            You can use <span className="font-semibold">scrapbook 1</span> in
            free tier
          </p>
        ) : (
          <p className="text-[12px] text-gray-600 my-[12px]">
            <span className="font-semibold text-[#E34013]">1 token</span> per
            scrapbook. You can edit and regenerate later
          </p>
        )}
        <Button
          // disabled={isFreeAccount}
          type="primary"
          style={{
            height: '50px',
            width: '100%',
          }}
          className="!bg-[#E34013]"
          htmlType="submit"
          size="large">
          {'Generate Scrapbook'}
        </Button>
      </Form>
    </div>
  );
};

export default FormGeneration;
