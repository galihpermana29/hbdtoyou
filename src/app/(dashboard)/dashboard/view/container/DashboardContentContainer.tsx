'use client';
import { IContent } from '@/action/interfaces';
import { deleteContentById } from '@/action/user-api';
import { templateNameToRoute } from '@/lib/utils';
import { Button, message, Modal, Tag } from 'antd';
import { SquarePen, Trash, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DashboardContentContainer = ({ data }: { data: IContent[] }) => {
  const [modalType, setModalType] = useState<{
    type: string;
    open: boolean;
    title: string;
    data?: any;
  }>({ type: '', open: false, title: '', data: null });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleDeleteContent = async (contentId: string) => {
    setLoading(true);
    const res = await deleteContentById(contentId);

    if (res.success) {
      message.success('Successfully deleted!');
      setModalType({
        type: 'delete',
        open: true,
        title: '',
        data: res.data,
      });
    } else {
      message.error(res.message);
    }

    setModalType({
      type: '',
      open: false,
      title: '',
      data: null,
    });
    setLoading(false);
  };

  const CustomCard = ({ content }: { content: IContent }) => {
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
            {content?.template_name.split('-')[0]}
          </Tag>
          <Tag color="blue" className="capitalize">
            {content?.status}
          </Tag>
        </div>
        <h1 className="text-[#475467] font-[400] text-[16px] my-[24px]">
          {content?.title}
        </h1>
        {content.status === 'draft' ? (
          <div className="flex justify-end gap-2 mt-[14px]">
            <Button
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
              icon={<SquarePen size={18} />}
              className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] "
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
              icon={<Trash size={18} />}
              className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[40px] "
              type="primary"
              size="large">
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2 mt-[14px]">
            <Button
              onClick={() => {}}
              iconPosition="end"
              icon={<SquarePen size={18} />}
              className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] "
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
              icon={<Trash size={18} />}
              className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[40px] "
              type="primary"
              size="large">
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  const ModalContent = {
    delete: (
      <div>
        <Trash2 className="text-[#E34013] text-[20px] font-[600] my-[10px]" />
        <h1 className="text-[#1B1B1B] font-[600] text-[18px]">Delete Gift</h1>
        <p className="text-[#7B7B7B] font-[400] text-[14px] mt-[4px]">
          Are you sure you want to delete this gift? This action cannot be
          undone.
        </p>

        <div className="flex gap-3 mt-[18px]">
          <Button
            onClick={() => {
              setModalType({
                type: '',
                open: false,
                title: '',
              });
            }}
            iconPosition="end"
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] !w-full"
            type="primary"
            size="large">
            Cancel
          </Button>{' '}
          <Button
            loading={loading}
            onClick={async () => {
              await handleDeleteContent(modalType?.data?.id);
            }}
            iconPosition="end"
            className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[40px] !w-full"
            type="primary"
            size="large">
            Delete
          </Button>
        </div>
      </div>
    ),
  };

  return (
    <div>
      <Modal
        width={modalType?.type === 'delete' ? 400 : 500}
        open={modalType.open}
        onCancel={() => setModalType({ type: '', open: false, title: '' })}
        title={modalType.title}
        footer={null}>
        {ModalContent[modalType?.type]}
      </Modal>
      <div className="md:mt-[30px] py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {data.map((dx, idx) => {
          return (
            <div key={idx} className="w-full flex justify-center">
              <CustomCard content={dx} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardContentContainer;
