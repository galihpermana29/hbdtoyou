import {
  useMemoifyProfile,
  useMemoifySession,
  useRevalidateProfile,
} from '@/app/session-provider';
import { reset } from '@/lib/uploadSlice';
import { notification, Progress } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
// Define reusable types
interface Template {
  id: string;
  route: string;
}

type ModalType = 'finish' | 'draft' | 'preview' | string;

interface ModalState {
  visible: boolean;
  data: any;
  type?: ModalType;
}

type NotificationKey = string | number;

export type OpenNotificationFunction = (
  progress: number,
  key: NotificationKey,
  isError?: boolean
) => void;

export interface UseCreateContentReturn {
  loading: boolean;
  current: number;
  selectedTemplate: Template | null;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  session: any; // TODO: Add proper session type when available
  profile: any; // TODO: Add proper profile type when available
  api: NotificationInstance;
  contextHolder: React.ReactElement;
  openNotification: OpenNotificationFunction;
  handleCompleteCreation: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<Template | null>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

const useCreateContent = (): UseCreateContentReturn => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    data: '',
    type: '',
  });

  const dispatch = useDispatch();

  const session = useMemoifySession();
  const profile = useMemoifyProfile();
  const revalidateProfile = useRevalidateProfile();

  const [api, contextHolder] = notification.useNotification();

  const openNotification: OpenNotificationFunction = (
    progress: number = 0,
    key: NotificationKey,
    isError?: boolean
  ) => {
    if (isError) {
      api.error({
        message: (
          <p className="text-[14px] text-black font-[600]">
            Something went wrong!
          </p>
        ),
        duration: 20,
        key: key,
      });
    } else {
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
        key: key,
      });
    }
  };

  const handleCompleteCreation = () => {
    setSelectedTemplate(null);
    setCurrent(2);
    revalidateProfile(uuidv4());
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
