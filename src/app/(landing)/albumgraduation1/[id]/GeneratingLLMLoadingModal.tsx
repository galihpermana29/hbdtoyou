import React from 'react';
import { Modal, Typography } from 'antd';
import Image from 'next/image';

const { Text } = Typography;

interface GeneratingLLMLoadingModalProps {
  isOpen: boolean;
}

const GeneratingLLMLoadingModal: React.FC<GeneratingLLMLoadingModalProps> = ({ isOpen }) => {
  return (
    <Modal
      open={isOpen}
      footer={null}
      closable={false}
      centered
      width={400}
      maskClosable={false}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-[200px] h-[200px] mb-4">
          <Image
            src="/ai-loading-modal.gif"
            alt="AI Loading"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <Text className="mt-6 !text-xl !font-medium">Generating LLM...</Text>
      </div>
    </Modal>
  );
};

export default GeneratingLLMLoadingModal;