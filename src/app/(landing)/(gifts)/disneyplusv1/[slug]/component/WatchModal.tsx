'use client';
import { addLineBreaksEveryThreeSentences } from '@/lib/utils';
import { WIDYA_FALLBACK_PARAGRAPH } from '@/lib/widya-fallback';
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
                : WIDYA_FALLBACK_PARAGRAPH,
            }}></p>
        </div>
      </Modal>
    </div>
  );
};

export default WatchModal;
