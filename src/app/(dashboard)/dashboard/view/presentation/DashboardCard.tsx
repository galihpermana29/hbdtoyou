'use client';
import { IContent } from '@/action/interfaces';
import { useMemoifyProfile } from '@/app/session-provider';
import { templateNameToRoute } from '@/lib/utils';
import { Button, Tag } from 'antd';
import { SquarePen, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type ModalType = {
  type: string;
  open: boolean;
  title: string;
  data?: any;
};

const DashboardCard = ({
  content,
  setModalType,
}: {
  content: IContent;
  setModalType: (modalType: ModalType) => void;
}) => {
  const router = useRouter();
  const profile = useMemoifyProfile();
  const isJournal = content?.template_name?.includes('journal');

  if (isJournal) {
    return (
      <DashboardJournalCard
        content={content}
        setModalType={setModalType}
      />
    );
  }

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
                `/dashboard/edit/${content?.id
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

const DashboardJournalCard = ({
  content,
  setModalType,
}: {
  content: IContent;
  setModalType: (modalType: ModalType) => void;
}) => {
  const jsonEntry = useMemo(() => {
    try {
      return JSON.parse(content?.detail_content_json_text || '{}');
    } catch {
      return {};
    }
  }, [content?.detail_content_json_text]);

  return (
    <div className="min-w-[320px] max-w-[400px] w-full border-[1px] border-[#EAECF0] rounded-[6px] bg-white overflow-hidden shadow-sm">
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs text-gray-500 font-serif">
              {jsonEntry?.volume}
            </span>
            <span className="text-xs text-gray-500 font-serif">
              {jsonEntry?.date}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <Tag color="red" className="capitalize">
              Journal
            </Tag>
            <Tag
              color={jsonEntry?.isPublic === false ? 'default' : 'blue'}
              className="capitalize">
              {jsonEntry?.isPublic === false ? 'Private' : 'Public'}
            </Tag>
          </div>
          <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
            {jsonEntry?.title}
          </h3>
          <p
            className="text-sm text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: jsonEntry?.abstract }}
          />
          <p className="text-xs text-gray-500 italic line-clamp-1 mb-4">
            {jsonEntry?.author}
          </p>
        </div>
        <div className="flex justify-end gap-2">
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
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px]"
            type="primary"
            size="large">
            Detail
          </Button>
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
            className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[14px] !font-[600] !h-[38px]"
            type="primary"
            size="large">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
