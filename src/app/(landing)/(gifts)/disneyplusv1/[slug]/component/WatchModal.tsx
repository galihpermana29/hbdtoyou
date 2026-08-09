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
        className="bg-white text-black hover:bg-gray-200 gap-2">
        <Play className="h-5 w-5" />
        Click Me
        <span className="text-sm ml-2">S1 E1</span>
      </Button>
      <Modal
        title="About You"
        footer={null}
        open={modalState}
        onCancel={() => setModalState(false)}>
        <div className="text-base space-y-4">
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
