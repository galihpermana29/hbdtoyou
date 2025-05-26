'use client';
import { IContent } from '@/action/interfaces';
import Image from 'next/image';
import { Button, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { useMemoifyProfile } from '@/app/session-provider';
import { templateNameToRoute } from '@/lib/utils';
import { SquarePen, Trash } from 'lucide-react';

const DashboardCard = ({
  content,
  setModalType,
}: {
  content: IContent;
  setModalType: (modalType: {
    type: string;
    open: boolean;
    title: string;
    data?: any;
  }) => void;
}) => {
  const router = useRouter();
  const profile = useMemoifyProfile();
  return (
    <div className="min-w-[320px] max-w-[400px] border-[1px] p-[15px] border-[#EAECF0] rounded-[6px]">
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
          {content?.template_name.split('-')[0].replace('v1', '')}
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
      {content.status === 'draft' ? (
        <div className="flex justify-end gap-2 mt-[14px]">
          <Button
            disabled={
              content?.template_name.split('-')[0] === 'formula1' ||
              profile?.type === 'free'
            }
            onClick={() => {
              router.push(
                `/dashboard/edit/${
                  content?.id
                }?templateName=${templateNameToRoute(
                  content?.template_name
                )}&templateId=${content?.template_id}`
              );
            }}
            iconPosition="end"
            icon={<SquarePen size={16} />}
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] "
            type="primary"
            size="large">
            Edit
          </Button>{' '}
          <Button
            onClick={() => {
              setModalType({
                type: 'delete',
                open: true,
                title: '',
                data: { id: content.id },
              });
            }}
            iconPosition="end"
            icon={<Trash size={16} />}
            className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[14px] !font-[600] !h-[38px] "
            type="primary"
            size="large">
            Delete
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-2 mt-[14px]">
          <Button
            onClick={() => {
              setModalType({
                type: 'detail',
                open: true,
                title: '',
                data: content,
              });
            }}
            iconPosition="end"
            icon={<SquarePen size={16} />}
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] "
            type="primary"
            size="large">
            Detail
          </Button>{' '}
          <Button
            onClick={() => {
              setModalType({
                type: 'delete',
                open: true,
                title: '',
                data: { id: content.id },
              });
            }}
            iconPosition="end"
            icon={<Trash size={16} />}
            className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[14px] !font-[600] !h-[38px] "
            type="primary"
            size="large">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
