'use client';

import { Button, Modal, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NavigationBar = () => {
  const [modalState, setModalState] = useState({
    visible: false,
    data: '',
  });

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
      className="flex item justify-between border-b-[1px] py-[20px] px-[40px] bg-white">
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
        <Link href={'/example'} className="hidden md:block">
          Example
        </Link>
        <Link href={'/browse'}>Browse</Link>
        <Link href={'/create'}>Create</Link>
        <Tooltip placement="topLeft" title={'Premium'}>
          <div className="cursor-pointer">More Templates</div>
        </Tooltip>
        {/* <Link href={'/contact'}>Contact</Link> */}
      </div>
    </div>
  );
};

export default NavigationBar;
