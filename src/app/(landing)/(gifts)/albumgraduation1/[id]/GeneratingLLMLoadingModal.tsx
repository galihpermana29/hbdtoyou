import React, { useState, useEffect } from 'react';
import { Modal, Typography } from 'antd';
import Image from 'next/image';

const { Text } = Typography;

interface GeneratingLLMLoadingModalProps {
  isOpen: boolean;
}

const thinkingSteps = [
  'Analyzing your request',
  'Processing information',
  'Generating content',
  'Crafting the perfect response',
  'Almost there',
];

const GeneratingLLMLoadingModal: React.FC<GeneratingLLMLoadingModalProps> = ({ isOpen }) => {
  const [dots, setDots] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setDots('');
      setCurrentStep(0);
      return;
    }

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Cycle through thinking steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % thinkingSteps.length);
    }, 2500);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, [isOpen]);

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
        <Text className="mt-6 !text-xl !font-medium">
          Generating{dots}
        </Text>
        <div className="h-6 flex items-center justify-center">
          <Text className="!text-sm !text-gray-500 animate-pulse">
            {thinkingSteps[currentStep]}
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default GeneratingLLMLoadingModal;