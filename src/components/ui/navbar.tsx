'use client';

import { Google } from '@mui/icons-material';
import { Avatar, Button, Dropdown, message, Modal, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import {
  useMemoifySession,
  useMemoifyUpgradePlan,
} from '@/app/session-provider';
import { getUserProfile } from '@/action/user-api';
import { IProfileResponse } from '@/action/interfaces';
import { removeSession } from '@/store/get-set-session';

const NavigationBar = () => {
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(null);

  const session = useMemoifySession();
  const { setModalState: setModalUpgradePlan } = useMemoifyUpgradePlan();

  const items = [
    {
      key: '1',
      label: userProfile ? userProfile.fullname : 'Account',
    },
    userProfile?.type !== 'pending'
      ? {
          key: '4',
          label: (
            <p onClick={() => setModalUpgradePlan({ visible: true, data: '' })}>
              Upgrade Plan
            </p>
          ),
        }
      : null,
    {
      key: '3',
      label: (
        <p className="capitalize">
          {userProfile ? `Plan: ${userProfile?.type}` : 'Free'}
        </p>
      ),
    },
    {
      key: '6',
      label: userProfile ? `Quota: ${userProfile?.quota}` : '0',
    },
    {
      key: '5',
      label: (
        <p
          className="text-red-500"
          onClick={async () => {
            await removeSession();
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }}>
          Logout
        </p>
      ),
    },
  ];

  const handleGetProfile = async () => {
    const res = await getUserProfile();
    if (res.success) {
      setUserProfile(res.data);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (session.accessToken) {
      handleGetProfile();
    }
  }, [session]);

  return (
    <div
      suppressHydrationWarning
      className="flex item justify-between border-b-[1px] py-[20px] px-[12px] md:px-[40px] bg-white">
      <Link href={'/'} className="font-bold">
        <span className="young-serif-regular text-[22px]">Memoify</span>
      </Link>
      <div className="flex items-center gap-[8px] md:gap-[24px] text-[14px]">
        <Link href={'/photobox'} className="hidden md:block">
          Photobox
        </Link>
        {/* <Link href={'/browse'} className="hidden md:block">
          Browse
        </Link> */}
        {userProfile?.type !== 'pending' && (
          <div
            className="hidden md:block hover:underline cursor-pointer"
            onClick={() => {
              if (session?.accessToken) {
                setModalUpgradePlan({ visible: true, data: '' });
              } else {
                signIn('google');
              }
            }}>
            Upgrade Plan
          </div>
        )}
        <Link href={'/create'}>Create</Link>
        <Link
          href={'/templates'}
          className={`${session.accessToken ? 'block' : 'hidden md:block'} `}>
          See Templates
        </Link>

        {!session.accessToken && (
          <Button
            type="primary"
            size="large"
            className="!bg-black !text-white !rounded-[50px]"
            onClick={() => signIn('google')}>
            Continue with <Google />
          </Button>
        )}

        {session.accessToken && (
          <Dropdown menu={{ items }}>
            <Avatar>{userProfile?.fullname.charAt(0)}</Avatar>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
