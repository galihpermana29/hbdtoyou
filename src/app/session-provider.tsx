'use client';

import { IProfileResponse } from '@/action/interfaces';
import { getSpotifyAccessToken } from '@/action/spotify-api';
import { getUserProfile } from '@/action/user-api';
import { Footer } from '@/components/ui/footer';
import { store } from '@/lib/store';
import { setSessionSpecific } from '@/store/get-set-session';
import { SessionData } from '@/store/iron-session';
import { Button, Image, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

// Define the context type
interface SessionContextType {
  parsedSession: SessionData;
  userProfile: IProfileResponse | null;
  sessionLoading: boolean;
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
  queryKey: string;
  setQueryKey: React.Dispatch<React.SetStateAction<string>>;
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

const premiumAds: AdContent[] = [
  {
    id: 1,
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '/career',
    image:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1775671149/au_ads_1_kxqtks.png',
    type: 'image',
  }
]

// Array of promotional content
const promotionalContent: AdContent[] = [
  {
    id: 1,
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '/career',
    image:
      'https://res.cloudinary.com/dztygf08a/image/upload/v1775671149/au_ads_1_kxqtks.png',
    type: 'image',
  },
  // {
  //   id: 3,
  //   title: '',
  //   description: '',
  //   ctaText: '',
  //   ctaLink: '/payment',
  //   image:
  //     'https://res.cloudinary.com/dztygf08a/image/upload/v1775229734/banner1_d8bvj0.png',
  //   type: 'image',
  // },
  // {
  //   id: 4,
  //   title: '',
  //   description: '',
  //   ctaText: '',
  //   ctaLink: '/payment',
  //   image:
  //     'https://res.cloudinary.com/dztygf08a/image/upload/v1775229725/banner4_givkxi.png',
  //   type: 'image',
  // },
  // {
  //   id: 5,
  //   title: '',
  //   description: '',
  //   ctaText: '',
  //   ctaLink: '/payment',
  //   image:
  //     'https://res.cloudinary.com/dztygf08a/image/upload/v1775229730/banner3_bivfgx.png',
  //   type: 'image',
  // },
  // {
  //   id: 6,
  //   title: '',
  //   description: '',
  //   ctaText: '',
  //   ctaLink: '/dashboard',
  //   image:
  //     'https://res.cloudinary.com/dztygf08a/image/upload/v1775229732/banner2_mgmbp5.png',
  //   type: 'image',
  // },
];

const SessionProvider = ({
  children,
  session,
  initialProfileData,
}: {
  children: React.ReactNode;
  session: string;
  initialProfileData: IProfileResponse | null;
}) => {
  const parsedSession: SessionData = session ? JSON.parse(session) : {};
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(
    initialProfileData
  );

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

  const [queryKey, setQueryKey] = useState('');

  const [loading, setLoading] = useState(true);

  const isPremium = userProfile?.type === 'premium';
  const isHideAds = ['/create', '/payment'].includes(pathname);

  const PREMIUM_ADS_KEY = 'memoify_premium_ads_count';
  const PREMIUM_ADS_LIMIT = 3;

  const getPremiumAdsCount = (): number => {
    try {
      return parseInt(localStorage.getItem(PREMIUM_ADS_KEY) || '0', 10);
    } catch {
      return 0;
    }
  };

  const incrementPremiumAdsCount = () => {
    try {
      const current = getPremiumAdsCount();
      localStorage.setItem(PREMIUM_ADS_KEY, String(current + 1));
    } catch { }
  };

  useEffect(() => {
    if (parsedSession.accessToken && queryKey && queryKey !== '') {
      const handleGetProfile = async () => {
        setLoading(true);
        const res = await getUserProfile();
        if (res.success) {
          setUserProfile(res.data);
        }
        setLoading(false);
      };

      setTimeout(() => {
        handleGetProfile();
      }, 1000);
    }
  }, [parsedSession.accessToken, queryKey]);

  useEffect(() => {
    if (parsedSession.accessToken) {
      const interval = setInterval(async () => {
        setLoading(true);
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
        setLoading(false);
      }, 1000 * 60 * 30);

      return () => {
        clearInterval(interval);
      };
    }
  }, [parsedSession.accessToken]);

  const selectRandomContent = () => {
    const pool = isPremium ? premiumAds : promotionalContent;
    // const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[0];
  };

  useEffect(() => {
    if (isHideAds) return;
    if (isPremium && getPremiumAdsCount() >= PREMIUM_ADS_LIMIT) return;

    const interval = setInterval(() => {
      if (isPremium) {
        if (getPremiumAdsCount() >= PREMIUM_ADS_LIMIT) {
          clearInterval(interval);
          return;
        }
        incrementPremiumAdsCount();
      }
      setCurrentAdContent(selectRandomContent());
      setAdsModalVisible(true);
    }, 1000 * 60 * 1);

    return () => {
      clearInterval(interval);
    };
  }, [isHideAds, isPremium]);

  return (
    <SessionContext.Provider
      value={{
        parsedSession,
        sessionLoading: loading,
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
        queryKey,
        setQueryKey,
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

      <Provider store={store}>
        {children}
        {/* {parsedSession.accessToken ? userProfile ? children : <></> : children} */}
      </Provider>
      {!['/spotify', '/magazinev1', 'journal'].includes(pathname) && <Footer />}
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
export const useRevalidateProfile = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.setQueryKey;
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
