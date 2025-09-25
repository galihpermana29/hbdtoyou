'use client';
import { Button, Input, message, Space } from 'antd';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

const ClientResult = () => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Safely access window object only on client side
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      message.success('Copied!');
    }
  };

  return (
    <div className="max-w-[700px] w-full">
      <div className="mt-[20px]">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            className="!text-[#E34013]"
            size="large"
            value={currentUrl ? currentUrl.split('?')[0] : ''}
            disabled
          />
          <Button
            className="!text-[#E34013]"
            onClick={handleCopy}
            size="large"
            type="default"
            icon={<Copy size={16} />}>
            Copy
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};

export default ClientResult;
