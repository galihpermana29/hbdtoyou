import { useState } from 'react';
import { Modal, Radio, Space, Button, Typography } from 'antd';
import Image from 'next/image';

interface SelectStoryTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateType: string) => void;
  loadingModalVisible: boolean;
}

const { Title, Text } = Typography;

const SelectStoryTemplate = ({
  isOpen,
  onClose,
  onSelect,
  loadingModalVisible,
}: SelectStoryTemplateProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('first');

  const handleTemplateChange = (e: any) => {
    setSelectedTemplate(e.target.value);
  };

  const handleSelect = () => {
    onSelect(selectedTemplate);
  };

  return (
    <Modal
      title={<Title level={4}>Choose Instagram Story Template</Title>}
      open={isOpen}
      onCancel={onClose}
      width={500}
      centered
      styles={{
        header: {
          padding: '20px 20px 0 20px',
          marginBottom: '0px',
        },
        content: {
          padding: '0px',
          overflow: 'hidden',
        },
        body: {
          padding: '0px 20px',
          overflow: 'scroll',
          height: '400px',
        },
        mask: {
          overflow: 'hidden',
        },
        footer: {
          padding: '20px',
        },
      }}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loadingModalVisible}>
          Cancel
        </Button>,
        <Button
          loading={loadingModalVisible}
          key="select"
          type="primary"
          onClick={handleSelect}>
          Select Template
        </Button>,
      ]}>
      <div className="flex flex-col gap-y-6">
        <Text>Select a template for your Instagram story:</Text>

        <Radio.Group
          onChange={handleTemplateChange}
          value={selectedTemplate}
          className="w-full !pb-6">
          <Space
            className="flex md:flex-row flex-col gap-y-4 w-full"
            size="large">
            <Radio value="first" className="w-full">
              <div className="flex flex-col gap-y-2">
                <Text strong className="text-lg">
                  Template 1
                </Text>
                <div className="border border-gray-300 rounded-lg p-4 w-full">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src="https://res.cloudinary.com/braiwjaya-university/image/upload/v1763140620/Option_1_snt6ay.jpg"
                      width={150}
                      height={300}
                      alt="Template 1 Preview"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </Radio>

            <Radio value="second" className="w-full">
              <div className="flex flex-col gap-y-2">
                <Text strong className="text-lg">
                  Template 2
                </Text>
                <div className="border border-gray-300 rounded-lg p-4 w-full">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src="https://res.cloudinary.com/braiwjaya-university/image/upload/v1763140606/Option_2_vlakzs.jpg"
                      width={150}
                      height={300}
                      alt="Template 2 Preview"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default SelectStoryTemplate;
