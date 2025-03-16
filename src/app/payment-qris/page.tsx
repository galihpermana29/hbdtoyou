'use client';

import { IGetDetailPayment, IQRISPaymentResponse } from '@/action/interfaces';
import { generateQRIS, getDetailPayment } from '@/action/user-api';
import NavigationBar from '@/components/ui/navbar';
import { Button, message } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import qrisImage from '@/assets/qris-logo.png';
import CountdownTimer from '@/components/ui/countdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemoifySession } from '../session-provider';
import emptyState from '@/assets/empty.png';
function isValidUUIDv4(uuid: string): boolean {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(uuid);
}

const PaymentQRIS = () => {
  const session = useMemoifySession();

  const [qrisData, setQRISData] = useState<IQRISPaymentResponse | null>(null);
  const [paymentStats, setPaymentStatus] = useState<IGetDetailPayment | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const query = useSearchParams();
  const id = query.get('id');

  const handleGenerateQRIS = async () => {
    setLoading(true);
    const res = await generateQRIS();
    if (res.success) {
      router.replace(`/payment-qris?id=${res.data?.payment_id}`);
      setQRISData(res.data);
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };

  const handleGetPaymentStatus = async () => {
    const res = await getDetailPayment(id as string);
    if (res.success) {
      setPaymentStatus(res.data);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (!qrisData) {
      router.replace('/payment-qris?id=null');
    }
  }, [qrisData]);

  useEffect(() => {
    if (id && isValidUUIDv4(id)) {
      if (paymentStats?.status === 'done') return;
      setInterval(() => {
        handleGetPaymentStatus();
      }, 7000);
    }
  }, [id]);

  if (!session?.accessToken) {
    return (
      <div>
        <NavigationBar />
        <div className="flex flex-col items-center justify-start min-h-screen py-[30px]">
          <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] flex-1 w-full">
            <div className="">
              <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
                You need to login to access this page
              </h1>
              <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
                Please login to access this page
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center justify-start min-h-screen py-[30px]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] flex-1 w-full">
          {(!paymentStats || paymentStats?.status === 'pending') && (
            <>
              <div className="">
                <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
                  Upgrade to premium plan
                </h1>
                <p className="text-[#7B7B7B] text-[14px] font-[400] max-w-[400px]">
                  Unlock All the features you need create beautiful custom pages
                </p>
              </div>
              <div className="flex flex-col items-start md:flex-row md:items-center gap-[20px] mt-[40px]">
                <div className="w-full md:max-w-[50%]">
                  <p>
                    We are glad that you are interested in our services. To
                    upgrade your plan, please scan the QRIS code below with your
                    phone.
                  </p>
                  <p className="mt-5">
                    In premium plan, you can enjoy{' '}
                    <span className="font-bold">unlimited image storage</span>,{' '}
                    <span className="font-bold">unlimited songs library</span>,{' '}
                    <span className="font-bold">unlimited upload size</span>,{' '}
                    <span className="font-bold">
                      unlimited access to templates
                    </span>
                    ,
                    <span className="font-bold">unlimited photobox frames</span>
                    ,{' '}
                    <span className="font-bold">6 credit to use templates</span>{' '}
                    with only <span className="font-bold"> IDR 15.000</span>
                  </p>

                  {!qrisData && (
                    <Button
                      onClick={() => handleGenerateQRIS()}
                      loading={loading}
                      type="primary"
                      className="!bg-[#E34013] mt-[20px] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] !w-[170px]">
                      Pay with QRIS
                    </Button>
                  )}
                </div>
                {qrisData ? (
                  <div className="flex flex-col w-full justify-center items-center mt-[20px]">
                    <Image
                      src={qrisImage}
                      alt="qris"
                      width={100}
                      height={100}
                    />
                    <Image
                      alt="qris"
                      width={400}
                      height={400}
                      src={qrisData.qris_resp as string}
                    />
                    <CountdownTimer price={qrisData?.price} />
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <Image
                      src={emptyState}
                      alt="empty"
                      width={300}
                      height={200}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {paymentStats && paymentStats?.status === 'done' && (
            <div className="w-full md:max-w-[50%]">
              <h1 className="text-[22px] md:text-[35px] font-bold ">
                Payment Verified!
              </h1>
              <p className="mt-5">
                We are welcoming you to our premium member account. You can
                enjoy unlimited image storage, unlimited songs library,
                unlimited upload size, unlimited access to templates, unlimited
                photobox frames, and 6 credit to use templates.
              </p>
              <Button
                onClick={() => router.push('/')}
                loading={loading}
                type="primary"
                className="!bg-[#E34013] mt-[20px] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] !w-[170px]">
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentQRIS;
