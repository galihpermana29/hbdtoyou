'use client';

import { Avatar, Button, Dropdown, MenuProps, message } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useMemoifySession } from '@/app/session-provider';
import { IProfileResponse } from '@/action/interfaces';
import { removeSession } from '@/store/get-set-session';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BadgeDollarSign,
  ChevronDown,
  House,
  LogOut,
  Menu,
  Settings2,
  Zap,
} from 'lucide-react';
import { formatNumberWithComma } from '@/lib/utils';
import { getUserProfile } from '@/action/user-api';

// Each product gets its own top-level entry rather than hiding behind a
// grouped "Features" menu. Pricing points at the landing page section so
// buyers can compare plans without hitting the login-walled checkout URL.
const NAV_LINKS = [
  { label: 'Birthday gift', href: '/templates' },
  { label: 'Scrapbook', href: '/scrapbook' },
  { label: 'Journal', href: '/journal' },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Pricing', href: '/#pricing' },
];

const NavigationBar = () => {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const session = useMemoifySession();
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(null);
  const router = useRouter();
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex items-center gap-[8px]">
          <Avatar size={40}>{userProfile?.fullname.charAt(0)}</Avatar>
          <div>
            <h1 className="text-[14px] font-[600] text-[#344054] capitalize">
              {userProfile ? userProfile.fullname?.toLowerCase() : ''}
            </h1>
            <p className="text-[14px] font-[400] text-[#475467]">
              {userProfile ? userProfile.email : ''}
            </p>
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },

    {
      key: '10',
      label: (
        <div className="flex items-center gap-2">
          <h1 className="text-[14px] font-[500] text-[#344054] my-[5px]">
            Dashboard
          </h1>
        </div>
      ),
      icon: <House size={18} className="text-[#667085]" />,
      onClick: () => {
        router.push('/dashboard');
      },
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: <p onClick={() => router.push('/payment')}>Upgrade Plan</p>,
      icon: <Zap size={18} className="text-[#667085]" />,
    },
    {
      key: '6',
      label: userProfile
        ? `${formatNumberWithComma(userProfile?.quota || 0)} Credit`
        : '0 Credit',
      icon: <BadgeDollarSign size={18} className="text-[#667085]" />,
      style: {
        cursor: 'default',
      },
    },
    {
      key: '9',
      label: userProfile
        ? `${formatNumberWithComma(userProfile?.token_scrapbook || 0)} Token`
        : '0 Token',
      icon: <Settings2 size={18} className="text-[#667085]" />,
      style: {
        cursor: 'default',
      },
    },
    {
      type: 'divider',
    },
    {
      key: '5',
      label: (
        <p
          className="text-red-500 my-[5px]"
          onClick={async () => {
            await removeSession();
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }}>
          Logout
        </p>
      ),
      icon: <LogOut size={18} className="text-red-500" />,
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
                'https://res.cloudinary.com/dfwrmapr4/image/upload/v1789303095/placeholder/69b085d3b98c04a8b06e3e58ecfa136e95641109_ynodbj.png'
              }
              alt="Memoify"
              width={40}
              height={40}
              priority
            />
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hidden lg:block whitespace-nowrap text-[16px] text-[#7B7B7B] font-[500] hover:text-[#1B1B1B]">
              {link.label}
            </Link>
          ))}

          {sidebar && (
            <div className="fixed z-[9999] left-[55%] bottom-0 top-[83px] right-0 bg-white shadow-lg">
              <div className="flex flex-col h-full justify-start gap-[20px] items-start py-[20px] px-[20px]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setSidebar(false)}
                    className="md:block text-[16px] text-[#7B7B7B] font-[500]">
                    {link.label}
                  </Link>
                ))}
                {!session.accessToken && (
                  <div
                    className="text-[16px] text-[#7B7B7B] font-[500] cursor-pointer"
                    onClick={() => signIn('google')}>
                    Sign in
                  </div>
                )}
                {session.accessToken && userProfile?.type !== 'pending' && (
                  <div
                    className="text-[16px] text-[#7B7B7B] font-[500] cursor-pointer"
                    onClick={() => router.push('/payment')}>
                    Upgrade
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {session.accessToken && (
            <Button
              icon={<Zap size={18} className="text-[#E34013]" />}
              type="primary"
              size="large"
              className="!border-[#E34013] !text-[#E34013] !bg-white !font-[500] !text-[14px] !rounded-[8px] !hidden !md:block"
              onClick={() => router.push('/payment')}>
              <p>Upgrade to Premium</p>
            </Button>
          )}
          {session.accessToken && (
            <Dropdown menu={{ items }}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar size={40}>{userProfile?.fullname.charAt(0)}</Avatar>
                <div className='hidden md:block'>
                  <p className="font-bold text-[14px]">{userProfile?.fullname}</p>
                  <p className="text-[#7B7B7B] text-[12px]">{userProfile?.email}</p>
                </div>
                <ChevronDown size={16} className='hidden md:block' />
              </div>
            </Dropdown>
          )}

          {!session.accessToken && (
            <Button
              size="large"
              className="!hidden lg:!inline-flex !border-[#D0D5DD] !text-[#344054] !bg-white !font-[600] !text-[14px] !rounded-[8px]"
              onClick={() => signIn('google')}>
              Sign in
            </Button>
          )}
          <Link href={'/create'} prefetch={true}>
            <Button
              type="primary"
              size="large"
              className="!bg-[#E34013] !text-white !font-[600] !text-[14px] !rounded-[8px]">
              Create a gift
            </Button>
          </Link>
          <Menu
            className="cursor-pointer lg:hidden"
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
