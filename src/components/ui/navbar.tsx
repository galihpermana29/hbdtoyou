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
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

const NavigationBar = () => {
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(null);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const session = useMemoifySession();
  const { setModalState: setModalUpgradePlan } = useMemoifyUpgradePlan();

  const router = useRouter();
  const items = [
    {
      key: '1',
      label: userProfile ? userProfile.fullname : 'Account',
    },
    userProfile?.type !== 'pending'
      ? {
          key: '4',
          label: (
            <p
              onClick={() => router.push('/payment-qris')}
              // onClick={() => setModalUpgradePlan({ visible: true, data: '' })}
            >
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
      label: userProfile ? `Credit: ${userProfile?.quota}` : '0',
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
    <div className="border-b-[1px] bg-white">
      <div
        suppressHydrationWarning
        className="flex item justify-between  py-[20px] max-w-6xl 2xl:max-w-7xl px-[20px] mx-auto  ">
        <div className="flex items-center gap-[8px] md:gap-[24px] text-[14px]">
          <Link href={'/'} className="font-bold">
            <Image
              src={
                'https://res.cloudinary.com/dxuumohme/image/upload/v1737048992/vz6tqrzgcht45fstloxc.png'
              }
              alt="asd"
              width={40}
              height={40}
              priority
            />
          </Link>
          <Link href={'/photobox'} className="hidden md:block">
            Photobox
          </Link>

          {userProfile?.type !== 'pending' && (
            <div
              className="hidden md:block hover:underline cursor-pointer"
              onClick={() => {
                if (session?.accessToken) {
                  router.push('/payment-qris');
                } else {
                  signIn('google');
                }
              }}>
              Upgrade
            </div>
          )}
          <Link href={'/create'} className="hidden md:block">
            Create
          </Link>
          <Link href={'/inspiration'} className="hidden md:block">
            Inspiration
          </Link>
          <Link href={'/templates'} className={`hidden md:block`}>
            See Templates
          </Link>

          {session.accessToken && (
            <Dropdown menu={{ items }}>
              <Avatar>{userProfile?.fullname.charAt(0)}</Avatar>
            </Dropdown>
          )}
          {sidebar && (
            <div className="fixed z-[9999] left-[55%] bottom-0 top-[83px] right-0 bg-white shadow-lg">
              <div className="flex flex-col h-full justify-start gap-[20px] items-start py-[20px] px-[20px]">
                <Link href={'/photobox'} className="block">
                  Photobox
                </Link>
                {userProfile?.type !== 'pending' && (
                  <div
                    className="md:block hover:underline cursor-pointer"
                    onClick={() => {
                      if (session?.accessToken) {
                        router.push('/payment-qris');
                      } else {
                        signIn('google');
                      }
                    }}>
                    Upgrade
                  </div>
                )}
                <Link href={'/create'}>Create</Link>
                <Link href={'/inspiration'}>Inspiration</Link>
                <Link href={'/templates'} className={`hidden md:block`}>
                  See Templates
                </Link>
                <Link href={'/templates'} className={`block md:hidden`}>
                  Templates
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {!session.accessToken && (
            <Button
              type="primary"
              size="large"
              className="!bg-[#E34013] !text-white !rounded-[8px]"
              onClick={() => signIn('google')}>
              <div className=" items-center gap-2 hidden md:flex">
                <p>Continue with</p>
                <Google />
              </div>
              <p className="block md:hidden">Login</p>
            </Button>
          )}
          <Menu
            className="cursor-pointer md:hidden"
            onClick={() => {
              setSidebar(!sidebar);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
