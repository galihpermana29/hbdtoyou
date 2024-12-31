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
  const [modalState, setModalState] = useState({
    visible: false,
    data: '',
  });

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const modalState = localStorage.getItem('modalState');
      if (!modalState) {
        setTimeout(() => {
          setModalState({
            visible: true,
            data: '',
          });
        }, 1000);
      }
    }
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="flex item justify-between border-b-[1px] py-[20px] px-[12px] md:px-[40px] bg-white">
      <Modal
        onCancel={() => {
          setModalState({
            visible: false,
            data: '',
          });

          localStorage.setItem('modalState', 'close');
        }}
        title="Hello!"
        open={modalState.visible}
        footer={null}>
        <div>
          <h1 className="text-[20px] font-bold">Galih`s here!</h1>
          <p>
            Due to large traffic from you guys, I have to clear the databases
            temporarily so the server can be used by other people. Yuk, bantu
            ikutan bayar server supaya websitenya bisa terus dipakai sama kalian
            dalam waktu yang lama!
          </p>
          <br />
          <p>
            Support the creator by follow instagram{' '}
            <Link
              href={'https://www.instagram.com/galjhpermana/'}
              target="_blank">
              @galjhpermana
            </Link>{' '}
            or buy me a coffee on saweria
          </p>
          <div className="flex items-center gap-[12px] mt-[12px]">
            <Link
              href={`https://saweria.co/galihpermana29`}
              target="_blank"
              className="cursor-pointer">
              <Button
                size="large"
                type="primary"
                className="!bg-black !text-[14px]">
                Open now
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
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
        <Link href={'/templates'} className="hidden md:block">
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
