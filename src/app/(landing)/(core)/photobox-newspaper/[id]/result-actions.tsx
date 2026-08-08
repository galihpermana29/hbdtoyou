'use client';

import { Button, message } from 'antd';
import { Download, Link2 } from 'lucide-react';

/** Download the composited newspaper image and copy the shareable link. */
export default function ResultActions({ url }: { url: string }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'memoify-photobox-newspaper.png';
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard');
    } catch {
      message.error('Could not copy the link');
    }
  };

  return (
    <div className="flex gap-[12px]">
      <Button
        onClick={handleDownload}
        type="primary"
        size="large"
        className="!bg-[#E34013] !text-white !font-[600] flex items-center gap-2">
        <Download size={18} />
        Download
      </Button>
      <Button
        onClick={handleCopy}
        size="large"
        className="!font-[600] flex items-center gap-2">
        <Link2 size={18} />
        Copy link
      </Button>
    </div>
  );
}
