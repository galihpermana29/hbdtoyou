'use client';

import { IProfileResponse } from '@/action/interfaces';
import { getUserProfile } from '@/action/user-api';
import { SessionData } from '@/store/iron-session';
import { PlusOneOutlined } from '@mui/icons-material';
import { Button, Form, Modal, Upload, Typography, Space, Image } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Footer } from '@/components/ui/footer';
import { usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import { getSpotifyAccessToken } from '@/action/spotify-api';
import { setSessionSpecific } from '@/store/get-set-session';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

// Define the context type
interface SessionContextType {
  parsedSession: SessionData;
  userProfile: IProfileResponse | null;
  upgradeModal: {
    modalState: {
      visible: boolean;
      data: string;
    };
    setModalState: React.Dispatch<React.SetStateAction<any>>;
  };
  uploadStateLoading: {
    setUploadStateLoading: React.Dispatch<React.SetStateAction<boolean>>;
    uploadStateLoading: boolean;
  };
  adsModal: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentAdContent: AdContent | null;
  };
}

// Create a default empty context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Create the SessionProvider component
// Define the ad content type
interface AdContent {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image?: string;
}

// Array of promotional content
const promotionalContent: AdContent[] = [
  {
    id: 1,
    title: 'Dashboard Features for Premium Users',
    description:
      'Memoify has released a new dashboard feature where premium users can edit or delete their content with ease. Upgrade to premium to access these powerful management tools!',
    ctaText: 'Check My Dashboard',
    ctaLink: '/dashboard',
    image: '/dashboard-feature.png', // Optional: you can add images if you have them
  },
  {
    id: 2,
    title: 'Scheduled Email Gifts',
    description:
      'Memoify now offers auto-send gift via email! Set up a scheduled gift which will be sent to any email address at your chosen date and time. Perfect for birthdays and special occasions.',
    ctaText: 'Try It Now',
    ctaLink: '/create',
    image: '/email-gift.png', // Optional: you can add images if you have them
  },
];

const SessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: string;
}) => {
  const parsedSession: SessionData = session ? JSON.parse(session) : {};
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(null);
  const [modalState, setModalState] = useState({
    visible: false,
    data: '',
  });
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const [uploadStateLoading, setUploadStateLoading] = useState(false);

  // Ads modal state
  const [adsModalVisible, setAdsModalVisible] = useState(false);
  const [currentAdContent, setCurrentAdContent] = useState<AdContent | null>(
    null
  );

  useEffect(() => {
    if (parsedSession.accessToken) {
      const handleGetProfile = async () => {
        const res = await getUserProfile();
        if (res.success) {
          setUserProfile(res.data);
        }
      };

      handleGetProfile();
    }
  }, []);

  useEffect(() => {
    if (parsedSession.accessToken) {
      const interval = setInterval(async () => {
        const spotifySession = await getSpotifyAccessToken();
        const newSession = {
          spotify: {
            accessToken: spotifySession.data.access_token,
            refreshToken: '',
            expiresIn: dayjs()
              .add(spotifySession.data.expires_in, 'seconds')
              .format('YYYY-MM-DD HH:mm:ss'),
          },
        };

        await setSessionSpecific(newSession.spotify, 'spotify');
      }, 1000 * 60 * 30);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  // Function to randomly select promotional content
  const selectRandomContent = () => {
    const randomIndex = Math.floor(Math.random() * promotionalContent.length);
    return promotionalContent[randomIndex];
  };

  // Show ads modal every 2 minutes
  useEffect(() => {
    // Show first ad after page load
    const initialTimeout = setTimeout(() => {
      setCurrentAdContent(selectRandomContent());
      setAdsModalVisible(true);
    }, 5000); // Show first ad after 5 seconds

    // Set up interval for subsequent ads
    const interval = setInterval(() => {
      setCurrentAdContent(selectRandomContent());
      setAdsModalVisible(true);
    }, 1000 * 60 * 2); // show ads every 2 mins

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        parsedSession,
        userProfile,
        upgradeModal: {
          modalState,
          setModalState,
        },
        uploadStateLoading: {
          setUploadStateLoading,
          uploadStateLoading,
        },
        adsModal: {
          visible: adsModalVisible,
          setVisible: setAdsModalVisible,
          currentAdContent,
        },
      }}>
      {/* Promotional Ads Modal */}
      <Modal
        open={adsModalVisible}
        onCancel={() => setAdsModalVisible(false)}
        footer={null}
        width={500}
        centered
        title={currentAdContent?.title}
        bodyStyle={{ padding: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {currentAdContent?.image && (
            <div style={{ textAlign: 'center' }}>
              {/* <Image
                src={currentAdContent.image}
                alt={currentAdContent.title}
                preview={false}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                fallback="data:image/png;base64,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"
              /> */}
            </div>
          )}
          <p className="text-[16px] text-center">
            {currentAdContent?.description}
          </p>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            {userProfile?.email && (
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  window.location.href = currentAdContent?.ctaLink || '/';
                  setAdsModalVisible(false);
                }}
                style={{
                  backgroundColor: '#E34013',
                  borderColor: '#E34013',
                  borderRadius: '8px',
                  height: '40px',
                  fontWeight: 600,
                }}>
                {currentAdContent?.ctaText}
              </Button>
            )}
          </div>
        </Space>
      </Modal>

      <Provider store={store}>{children}</Provider>

      {!pathname.includes('/spotify') && !pathname.includes('/magazinev1') && (
        <Footer />
      )}
    </SessionContext.Provider>
  );
};

// Create a custom hook to access the context
export const useMemoifySession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.parsedSession;
};

// Create a custom hook to access the context
export const useMemoifyProfile = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.userProfile;
};

// Create a custom hook to access the context
export const useMemoifyUpgradePlan = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.upgradeModal;
};

export const useMemoifyUploadLoading = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.uploadStateLoading;
};

export default SessionProvider;
