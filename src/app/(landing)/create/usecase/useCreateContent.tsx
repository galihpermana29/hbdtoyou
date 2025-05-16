import { useMemoifyProfile, useMemoifySession } from '@/app/session-provider';
import { reset } from '@/lib/uploadSlice';
import { notification, Progress } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const useCreateContent = () => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    route: string;
  } | null>(null);

  const [modalState, setModalState] = useState<{
    visible: boolean;
    data: any;
    type?: any;
  }>({
    visible: false,
    data: '',
    type: '',
  });

  const dispatch = useDispatch();

  const session = useMemoifySession();
  const profile = useMemoifyProfile();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (progress: number = 0, key: any) => {
    api.open({
      message: (
        <p className="text-[14px] text-black font-[600]">
          {progress < 100 ? `Uploading ${progress}%` : 'Uploading completed'}
        </p>
      ),
      description: (
        <div>
          <Progress percent={progress} />
        </div>
      ),
      duration: 2000,
      key: key,
    });
  };

  const handleCompleteCreation = () => {
    setSelectedTemplate(null);
    setCurrent(2);

    //rest
    dispatch(reset());
  };

  return {
    loading,
    current,
    selectedTemplate,
    modalState,
    setModalState,
    session,
    profile,
    api,
    contextHolder,
    openNotification,
    handleCompleteCreation,
    setLoading,
    setSelectedTemplate,
    setCurrent,
  };
};

export default useCreateContent;
