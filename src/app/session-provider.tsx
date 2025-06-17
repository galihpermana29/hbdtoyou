'use client';

import { IProfileResponse } from '@/action/interfaces';
import { getUserProfile } from '@/action/user-api';
import { SessionData } from '@/store/iron-session';
import { Button, Form, Modal, Space, Image } from 'antd';
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
  type: 'text' | 'image';
}

// Array of promotional content
const promotionalContent: AdContent[] = [
  {
    id: 3,
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '/payment-qris',
    image:
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1749574325/fojp7ewowrwy1ck5j14j.png',
    type: 'image',
  },
  {
    id: 4,
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '/payment-qris',
    image:
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1749574325/ylmpofrfxs25uczb8f4k.png',
    type: 'image',
  },
  {
    id: 5,
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '/payment-qris',
    image:
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003561/hszepxvaqvcf0qexoujo.png',
    type: 'image',
  },
  {
    id: 6,
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '/dashboard',
    image:
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003562/ytobvdbkbgtwjxzyusdk.png',
    type: 'image',
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

  const pathname = usePathname();

  const [uploadStateLoading, setUploadStateLoading] = useState(false);

  // Ads modal state
  const [adsModalVisible, setAdsModalVisible] = useState(false);
  const [currentAdContent, setCurrentAdContent] = useState<AdContent | null>(
    null
  );

  const isHideAds =
    ['/create', '/payment-qris'].includes(pathname) ||
    userProfile?.type === 'premium';

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
    // Set up interval for subsequent ads
    if (isHideAds) return;
    const interval = setInterval(() => {
      setCurrentAdContent(selectRandomContent());
      setAdsModalVisible(true);
    }, 1000 * 60 * 3);

    return () => {
      clearInterval(interval);
    };
  }, [isHideAds]);

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
        width={currentAdContent?.type === 'image' ? 650 : 500}
        centered
        title={
          currentAdContent?.type === 'image' ? null : currentAdContent?.title
        }
        className={currentAdContent?.type === 'image' ? 'image-ad' : 'text-ad'}
        closable={true}>
        {currentAdContent?.type === 'image' ? (
          // Image-only content (Spotify-like banner ad)
          <div
            className="cursor-pointer"
            onClick={() => {
              window.location.href = currentAdContent?.ctaLink || '/';
              setAdsModalVisible(false);
            }}>
            <Image
              src={currentAdContent?.image || ''}
              alt="Promotional Banner"
              preview={false}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        ) : (
          // Text content with description
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
        )}
      </Modal>

      <Provider store={store}>{children}</Provider>
      {['/spotify', '/magazinev1', 'journal'].includes(pathname) && <Footer />}
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
