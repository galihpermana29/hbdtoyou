import { Tag } from 'antd';
import { EllipsisVertical, Heart, Link2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TruncateText from './TruncateText';

export const InspirationCard = ({ data }: { data: any }) => {
  return (
    <div className=" md:px-[50px] lg:px-[100px]">
      <div className="flex items-start gap-[20px] flex-col md:flex-row">
        <div className="w-full md:w-[40%]">
          <Image
            className="aspect-video object-cover object-center rounded-md"
            src={data?.jumbotronImage}
            alt="jumbotron"
            width={700}
            height={300}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h1 className="text-[14px] text-[#475467] font-[400]">
              {data?.create_date}
            </h1>
            {/* <div>
              <EllipsisVertical size={20} />
            </div> */}
          </div>
          <div className="mb-[24px] mt-[16px]">
            <h1 className="text-[20px] text-[#1B1B1B] font-[600] capitalize">
              {data?.title}
            </h1>
            <p className="text-[#7B7B7B] font-[400] text-[14px]">
              By {data?.user_name}
            </p>
          </div>
          <div>
            <p className="text-[#7B7B7B] font-[400] text-[14px] mb-[20px]">
              <TruncateText text={data?.desc} maxLength={100} />
            </p>
            <div className="flex gap-3 items-center">
              <Link2 size={20} />
              <Link
                target="_blank"
                className="text-[14px] font-[400] text-[#E34013]"
                href={`https://memoify.live${data?.link}`}>
                <TruncateText
                  showSeeMore={false}
                  text={`https://memoify.live${data?.link}`}
                  maxLength={20}
                />
              </Link>
            </div>
          </div>
          <div className="flex gap-1 mt-[30px]">
            <Tag color="cyan">{data?.type}</Tag>
            <Tag color="blue" className="capitalize">
              {data?.template_label}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};
