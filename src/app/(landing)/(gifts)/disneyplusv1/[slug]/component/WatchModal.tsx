'use client';
import { addLineBreaksEveryThreeSentences } from '@/lib/utils';
import { Modal } from 'antd';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/disney+/ui/button';

const WatchModal = ({ content }: { content: string }) => {
  const [modalState, setModalState] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setModalState(true)}
        className="!flex !h-11 !items-center !gap-2 !rounded !border-0 !bg-white !px-6 !font-bold !text-black hover:!bg-white/80">
        <Play className="h-5 w-5 fill-black" />
        Start Watching
      </Button>
      <Modal
        centered
        title="A Story Made For You"
        footer={null}
        open={modalState}
        onCancel={() => setModalState(false)}
        styles={{
          content: { background: '#0b1020', color: 'white' },
          header: { background: '#0b1020' },
        }}>
        <div className="space-y-4 text-base leading-relaxed text-white/80">
          <p
            dangerouslySetInnerHTML={{
              __html: content
                ? addLineBreaksEveryThreeSentences(content)
                : 'Hi Widya, I`ve been thinking about what to write for your birthday, and there are a few things I want to share with you. Even though we`ve only known each other for a couple of weeks, it feels like much longer because we talk so much—every night, every day. The more we talk, the more I find myself getting deeply interested in you.',
            }}></p>
        </div>
      </Modal>
    </div>
  );
};

export default WatchModal;
