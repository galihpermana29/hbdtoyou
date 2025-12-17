'use client';

import { unlockContent } from '@/action/user-api';
import { useMemoifyProfile } from '@/app/session-provider';
import { Button, notification } from 'antd';
import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type LockScreenProps = {
  children: ReactNode;
  title?: string;
  message?: string;
  buttonText?: string;
  initiallyLocked?: boolean;
  onUnlock?: () => void;
  contentId: string;
  type?: 'gift' | 'scrapbook';
};

const LockScreen = ({
  children,
  title = 'Content locked',
  message = 'This content is locked for your current plan. Unlock to continue.',
  buttonText = 'Unlock',
  initiallyLocked = true,
  onUnlock,
  contentId,
  type = 'gift',
}: LockScreenProps) => {
  const profile = useMemoifyProfile();
  const isFreeAccount =
    type === 'gift' ? profile?.quota < 1 : profile?.token_scrapbook < 1;
  const [isLocked, setIsLocked] = useState(initiallyLocked);
  const [lockedLoading, setLockedLoading] = useState(false);
  const router = useRouter();
  const handleUnlock = async () => {
    setLockedLoading(true);
    if (isFreeAccount) {
      notification.error({
        message: 'Free account cannot unlock content',
        description:
          'Please upgrade to a premium account to unlock this content',
      });
      setLockedLoading(false);
      return;
    }

    const res = await unlockContent(contentId);
    if (res.success) {
      setLockedLoading(false);
      setIsLocked(false);
      notification.success({
        message: 'Content unlocked',
        description: 'You can now view this content',
      });
      onUnlock?.();
    } else {
      setLockedLoading(false);
      notification.error({
        message: res.message,
        description: 'Please try again',
      });
    }
  };

  return (
    <div
      className={`relative isolate ${
        type === 'gift' ? 'min-h-screen max-h-screen overflow-hidden' : ''
      }`}>
      <div
        className={`transition duration-300 ${
          isLocked ? 'blur-[1.5px] pointer-events-none select-none' : ''
        }`}>
        {children}
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-sm px-6 overflow-hidden">
          <div className="max-w-md space-y-4 text-center text-white">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm text-gray-200">{message}</p>
            <div className="flex items-center justify-center gap-2">
              <Button
                loading={lockedLoading}
                onClick={handleUnlock}
                type="primary"
                size="middle"
                className="!bg-white !text-black">
                {buttonText}
              </Button>{' '}
              <Button
                onClick={() =>
                  router.push(
                    '/payment?plan_id=291eba3b-f13f-47db-a793-bde0683b10ca'
                  )
                }
                type="primary"
                size="middle">
                Buy Premium
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockScreen;
