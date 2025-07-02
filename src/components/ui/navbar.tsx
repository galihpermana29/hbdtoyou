'use client';

import { Google } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Button,
  Cascader,
  Divider,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Tag,
  Tooltip,
} from 'antd';
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
import {
  BadgeDollarSign,
  Book,
  BookA,
  House,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import dynamic from 'next/dynamic';
// Lazy load the jumbotron image
const jumbotronImage = '/assets/fitur-1-image.png';

import './stlye.css';

const NavigationBar = () => {
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(null);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const session = useMemoifySession();
  const { setModalState: setModalUpgradePlan } = useMemoifyUpgradePlan();

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
      label: userProfile ? `${userProfile?.quota} Credit` : '0',
      icon: <BadgeDollarSign size={18} className="text-[#667085]" />,
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

  const options = [
    {
      value: 'gift',
      label: (
        <div
          className="flex items-start gap-2"
          onClick={() => router.push('/templates')}>
          <Book size={18} className="text-[#E34013] mt-[10px]" />
          <div>
            <h1 className="text-[16px] font-[600] text-[#101828] text-ellipsis">
              Website Gift
            </h1>
            <p className="text-[14px] font-[400] text-[#7B7B7B] mt-[5px]">
              Create custom websites inspired <br /> by your favorite platforms
              like Netflix, Spotify
            </p>
          </div>
        </div>
      ),

      children: [
        {
          value: '',
          label: (
            <div className="min-h-[400px]">
              <Image
                className="max-w-[240px]"
                src={jumbotronImage}
                alt="jumbotron"
                width={240}
                height={136}
              />
              <div className="mt-[20px]">
                <h1 className="text-[16px] font-[600] text-[#101828] text-ellipsis">
                  We`ve just released an update!
                </h1>
                <p className="text-[14px] font-[400] text-[#7B7B7B] mt-[5px]">
                  Check out the our new template <br /> called “Formula 1 Sites”
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      value: 'photobox',
      label: (
        <div
          className="flex items-start gap-2"
          onClick={() => router.push('/photobox')}>
          <Sparkles size={18} className="text-[#E34013] mt-[10px]" />
          <div>
            <h1 className="text-[16px] font-[600] text-[#101828] text-ellipsis">
              Photobox
            </h1>
            <p className="text-[14px] font-[400] text-[#7B7B7B] mt-[5px]">
              Make every picture a keepsake <br /> with Memoify`s Photobox!
            </p>
          </div>
        </div>
      ),
    },
    {
      value: 'journal',
      label: (
        <div
          className="flex items-start gap-2"
          onClick={() => router.push('/journal')}>
          <BookA size={18} className="text-[#E34013] mt-[10px]" />
          <div>
            <h1 className="text-[16px] font-[600] text-[#101828] text-ellipsis">
              Personal Journal
            </h1>
            <p className="text-[14px] font-[400] text-[#7B7B7B] mt-[5px]">
              Create your personal journal <br /> to capture your life`s moments
            </p>
          </div>
        </div>
      ),
    },
  ];

  const options2 = [
    {
      value: 'gift',
      label: (
        <div
          className="flex items-start gap-2"
          onClick={() => router.push('/templates')}>
          <Book size={18} className="text-[#E34013] mt-[10px]" />
          <div>
            <h1 className="text-[14px] font-[600] text-[#101828] text-ellipsis">
              Website Gift
            </h1>
            <p className="text-[12px] font-[400] text-[#7B7B7B] mt-[2px]">
              Create custom websites <br /> inspired by your favorite <br />{' '}
              platforms like Netflix, Spotify
            </p>
          </div>
        </div>
      ),
    },
    {
      value: 'photobox',
      label: (
        <div
          className="flex items-start gap-2"
          onClick={() => router.push('/photobox')}>
          <Sparkles size={18} className="text-[#E34013] mt-[10px]" />
          <div>
            <h1 className="text-[14px] font-[600] text-[#101828] text-ellipsis">
              Photobox
            </h1>
            <p className="text-[12px] font-[400] text-[#7B7B7B] mt-[2px]">
              Make every picture a keepsake <br /> with Memoify`s Photobox!
            </p>
          </div>
        </div>
      ),
    },
    {
      value: 'journal',
      label: (
        <div
          className="flex items-start gap-2"
          onClick={() => router.push('/journal')}>
          <BookA size={18} className="text-[#E34013] mt-[10px]" />
          <div>
            <h1 className="text-[14px] font-[600] text-[#101828] text-ellipsis">
              Personal Journal
            </h1>
            <p className="text-[12px] font-[400] text-[#7B7B7B] mt-[5px]">
              Create your personal journal <br /> to capture your life`s moments
            </p>
          </div>
        </div>
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
          <Link
            href={'/'}
            className="hidden md:block text-[16px] text-[#7B7B7B] font-[500]">
            Home
          </Link>

          <Link
            href={'/inspiration'}
            className="hidden md:block text-[16px] text-[#7B7B7B] font-[500]">
            Inspiration
          </Link>
          <Link
            href={'/payment'}
            className={`hidden md:block text-[16px] text-[#7B7B7B] font-[500]`}>
            Upgrade Plan
          </Link>
          <Cascader
            className="custom-cascader"
            expandTrigger="hover"
            options={options}>
            <a className="hidden md:block text-[16px] text-[#7B7B7B] font-[500] cursor-pointer">
              Features
            </a>
          </Cascader>
          <Link
            href={'/contact'}
            className={`hidden md:block text-[16px] text-[#7B7B7B] font-[500]`}>
            Contact
          </Link>

          {sidebar && (
            <div className="fixed z-[9999] left-[55%] bottom-0 top-[83px] right-0 bg-white shadow-lg">
              <div className="flex flex-col h-full justify-start gap-[20px] items-start py-[20px] px-[20px]">
                {userProfile?.type !== 'pending' && (
                  <div
                    className="md:block text-[16px] text-[#7B7B7B] font-[500] cursor-pointer"
                    onClick={() => {
                      if (session?.accessToken) {
                        router.push('/payment');
                      } else {
                        signIn('google');
                      }
                    }}>
                    Upgrade
                  </div>
                )}
                <Link
                  href={'/'}
                  className="md:block text-[16px] text-[#7B7B7B] font-[500]">
                  Home
                </Link>

                <Link
                  href={'/inspiration'}
                  className="md:block text-[16px] text-[#7B7B7B] font-[500]">
                  Inspiration
                </Link>
                <Link
                  href={'/payment'}
                  className={`md:block text-[16px] text-[#7B7B7B] font-[500]`}>
                  Upgrade Plan
                </Link>
                <Cascader
                  placement="topRight"
                  expandTrigger="hover"
                  options={options2}>
                  <a className="md:block text-[16px] text-[#7B7B7B] font-[500] cursor-pointer">
                    Features
                  </a>
                </Cascader>
                <Link
                  href={'/contact'}
                  className={`md:block text-[16px] text-[#7B7B7B] font-[500]`}>
                  Contact
                </Link>
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
              <Avatar size={40}>{userProfile?.fullname.charAt(0)}</Avatar>
            </Dropdown>
          )}

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
