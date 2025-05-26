'use client';
import { IContent } from '@/action/interfaces';
import { deleteContentById } from '@/action/user-api';
import { Button, message, Modal, Tag } from 'antd';
import { SquarePen, Trash, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DetailContentModal from './DetailContentModal';
import { useMemoifyProfile } from '@/app/session-provider';
import dynamic from 'next/dynamic';

// lazy import
const DashboardCard = dynamic(() => import('../presentation/DashboardCard'));
const initSliced = 10;
const DashboardContentContainer = ({ data }: { data: IContent[] }) => {
  // create load more state
  const [currentData, setCurrentData] = useState<IContent[]>([]);
  // state
  const [modalType, setModalType] = useState<{
    type: string;
    open: boolean;
    title: string;
    data?: any;
  }>({ type: '', open: false, title: '', data: null });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const profile = useMemoifyProfile();

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
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] !w-full"
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
            className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[14px] !font-[600] !h-[38px] !w-full"
            type="primary"
            size="large">
            Delete
          </Button>
        </div>
      </div>
    ),
    detail: <DetailContentModal content={modalType?.data} />,
  };

  useEffect(() => {
    if (data.length > 0) {
      setCurrentData(data.slice(0, initSliced));
    }
  }, [data]);

  return (
    <div>
      <Modal
        width={modalType?.type === 'delete' ? 400 : 700}
        open={modalType.open}
        onCancel={() => setModalType({ type: '', open: false, title: '' })}
        title={modalType.title}
        footer={null}>
        {ModalContent[modalType?.type]}
      </Modal>
      <div className="md:mt-[30px] py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        {currentData.length > 0 ? (
          <>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {currentData.map((dx, idx) => {
                return (
                  <div key={idx} className="w-full flex justify-center">
                    <DashboardCard content={dx} setModalType={setModalType} />
                  </div>
                );
              })}
            </div>

            {currentData.length < data.length && (
              <Button
                onClick={() => {
                  if (currentData.length >= data.length) return;
                  const newData = [
                    ...currentData,
                    ...data.slice(
                      currentData.length,
                      currentData.length + initSliced
                    ),
                  ];
                  setCurrentData(newData);
                }}
                iconPosition="end"
                className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] mt-[24px]"
                type="primary"
                size="large">
                Load More
              </Button>
            )}
          </>
        ) : (
          <div className="h-[80vh] w-full  flex flex-col items-center justify-center">
            <p className="text-[#475467] font-[400] text-[16px]">
              Ooops, you do not have any content yet.
            </p>
            <Button
              onClick={() => {
                router.push('/dashboard/create');
              }}
              iconPosition="end"
              icon={<SquarePen size={16} />}
              className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] mt-[24px]"
              type="primary"
              size="large">
              Create
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContentContainer;
