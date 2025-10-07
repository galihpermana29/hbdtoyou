import { IContent } from '@/action/interfaces';
import { Button, Input, message, Space, Tag } from 'antd';
import { Copy } from 'lucide-react';
import Image from 'next/image';

const DetailContentModal = ({ content }: { content: IContent }) => {
  return (
    <div className="flex gap-4 p-[16px] items-center flex-col lg:flex-row h-[380px]">
      <div className="min-w-[320px] max-w-[400px] border-[1px] p-[15px] border-[#EAECF0] rounded-[6px] hidden lg:block">
        <div className="w-full h-[190px] overflow-hidden object-cover object-center">
          <Image
            width={1000}
            height={500}
            className="object-cover object-center"
            alt="image"
            src={
              typeof content?.jumbotronImage === 'string'
                ? content?.jumbotronImage
                : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg'
            }
          />
        </div>
        <div className="my-[24px] flex items-center justify-between">
          <Tag color="red" className="capitalize">
            {content?.template_name.split('-')[0]}
          </Tag>
          <Tag
            color={content?.status === 'draft' ? 'yellow' : 'blue'}
            className="capitalize">
            {content?.status}
          </Tag>
        </div>
        <h1 className="text-[#475467] font-[400] text-[16px] my-[24px]">
          {content?.title}
        </h1>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="text-[#1B1B1B] font-[600] text-[26px]">
            Your gift is ready!
          </h1>
          <p className="text-[#7B7B7B] font-[400] text-[16px] my-[5px]">
            You can share your own version of website with your friends or someone
            you love. Thank you for using Memoify.
            <br />
            <br />
            Feel free to tag and follow us
            on instagram @memoify.live
          </p>
        </div>
        <div>
          <Space.Compact style={{ width: '100%  ' }}>
            <Input size="large" defaultValue={content?.link} disabled />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  window?.location.origin + content.link
                );
                message.success('Copied!');
              }}
              size="large"
              type="default"
              icon={<Copy size={16} />}>
              Copy
            </Button>
          </Space.Compact>
          <Button
            onClick={() => {
              window.open(window?.location.origin + content.link, '_blank');
            }}
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] !w-full mt-[8px]">
            Open Gift
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DetailContentModal;
