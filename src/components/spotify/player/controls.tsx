'use client';

import { Play, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { Slider } from '../ui/slider';
import { ConfigProvider, Modal } from 'antd';
import { useState } from 'react';

export default function PlayerControls({
  modalContent,
}: {
  modalContent?: string;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="flex flex-col items-center max-w-[45%] w-full gap-2">
      <ConfigProvider
        theme={{
          token: { colorPrimary: '#121212' },
          components: {
            Modal: {
              contentBg: '#121212',
              headerBg: '#121212',
              colorText: '#fff',
              colorTextHeading: '#fff',
            },
          },
        }}>
        <Modal
          closable
          rootClassName="bg-black"
          title="Hi, there"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null} // Optional: Removes default footer buttons
        >
          {modalContent ? (
            modalContent
          ) : (
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem,
              ratione. Sed impedit aliquid eum deserunt laboriosam, amet quaerat
              quia architecto!
            </p>
          )}
        </Modal>
      </ConfigProvider>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="hidden sm:block text-neutral-400 hover:text-white transition">
          <Shuffle className="h-5 w-5" />
        </button>
        <button className="text-neutral-400 hover:text-white transition">
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          className="bg-white rounded-full p-2 hover:scale-105 transition"
          onClick={showModal}>
          <Play className="h-4 w-4 md:h-5 md:w-5 text-black" fill="black" />
        </button>
        <button className="text-neutral-400 hover:text-white transition">
          <SkipForward className="h-5 w-5" />
        </button>
        <button className="hidden sm:block text-neutral-400 hover:text-white transition">
          <Repeat className="h-5 w-5" />
        </button>
      </div>
      <div className="hidden sm:flex items-center gap-2 w-full">
        <span className="text-xs text-neutral-400">0:00</span>
        <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
        <span className="text-xs text-neutral-400">3:45</span>
      </div>
    </div>
  );
}
