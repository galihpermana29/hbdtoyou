'use client';

import { IGetDetailPayment, IQRISPaymentResponse } from '@/action/interfaces';
import {
  generateQRIS,
  getDetailPayment,
  paymentByPaypal,
  getListPackages,
} from '@/action/user-api';
import NavigationBar from '@/components/ui/navbar';
import { Button, Select, Typography, message } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import qrisImage from '@/assets/qris-logo.png';
import CountdownTimer from '@/components/ui/countdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemoifySession } from '../../session-provider';
import emptyState from '@/assets/empty.png';
import { useQuery } from '@tanstack/react-query';

const { Title, Text } = Typography;

function isValidUUIDv4(uuid: string): boolean {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(uuid);
}

const NewClientPagePayment = () => {
  const session = useMemoifySession();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [qrisData, setQRISData] = useState<IQRISPaymentResponse | null>(null);
  const [paymentStats, setPaymentStatus] = useState<IGetDetailPayment | null>(
    null
  );
  const [loading, setLoading] = useState({
    qris: false,
    paypal: false,
  });

  const router = useRouter();
  const query = useSearchParams();
  const id = query.get('id');
  const type = query.get('type');
  const planId = query.get('plan_id');

  const { data: listPackages, isFetching } = useQuery({
    queryKey: [{ key: 'list-packages', planId }],
    queryFn: async () => {
      const data = await getListPackages();
      return data.data;
    },
    enabled: !!planId,
  });

  const detailPackages =
    listPackages?.find((item) => item.id === planId) || null;

  const handleGenerateQRIS = async () => {
    setLoading((prev) => ({
      ...prev,
      qris: true,
    }));
    const res = await generateQRIS({
      package_id: planId!,
      payment_method: 'qris',
    });
    if (res.success) {
      router.replace(
        `/payment?id=${res.data?.payment_id}&type=${type}&plan_id=${planId}`
      );
      setQRISData(res.data);
      setPaymentMethod('qris');
    } else {
      message.error(res.message);
    }
    setLoading((prev) => ({
      ...prev,
      qris: false,
    }));
  };

  const handlePaypal = async () => {
    setLoading((prev) => ({
      ...prev,
      paypal: true,
    }));
    const res = await paymentByPaypal();
    if (res.success) {
      window.open(
        `https://www.paypal.com/checkoutnow?token=${res.data.order_id}&type=${type}&plan_id=${planId}`,
        '_blank'
      );
      localStorage.setItem('paypal_payment', JSON.stringify(res.data));
      setPaymentMethod('paypal');
    } else {
      message.error(res.message || 'Failed to process PayPal payment');
    }
    setLoading((prev) => ({
      ...prev,
      paypal: false,
    }));
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
      router.replace(`/payment?id=null&type=${type}&plan_id=${planId}`);
    }
  }, [qrisData, router]);

  useEffect(() => {
    if (id && isValidUUIDv4(id)) {
      if (paymentStats?.status === 'done') return;
      const intervalId = setInterval(() => {
        handleGetPaymentStatus();
      }, 7000);

      return () => clearInterval(intervalId);
    }
  }, [id, paymentStats?.status]);

  // Countdown effect when payment is verified
  useEffect(() => {
    if (paymentStats?.status === 'done') {
      let countdown = 3;
      const countdownElement = document.getElementById('countdown');

      const timer = setInterval(() => {
        countdown -= 1;
        if (countdownElement) {
          countdownElement.textContent = countdown.toString();
        }

        if (countdown <= 0) {
          clearInterval(timer);
          // Use window.location.href for full page reload
          window.location.href = '/dashboard';
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStats?.status]);

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
    <>
      <NavigationBar />
      <div className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl overflow-hidden rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row bg-white rounded-2xl min-h-[600px]">
            {/* Left side - Card Images */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-[#E34013] to-[#ffffff] p-8 flex items-center justify-center">
              <div className="relative w-full h-64">
                {/* Card visuals */}
                <div className="absolute w-full h-full flex items-center justify-center">
                  <div className="relative w-full max-w-[300px]">
                    <div className="absolute top-0 left-0 w-full h-full transform rotate-[-8deg] translate-y-4 z-10">
                      <div className="w-full h-full bg-purple-600 rounded-xl shadow-lg flex flex-col justify-between p-5">
                        <div className="flex justify-between items-center">
                          <div className="text-white font-bold text-xl">
                            QRIS
                          </div>
                          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                        <div className="text-white opacity-80 tracking-widest mt-6">
                          4455-6349-6916-9164
                        </div>
                        <div className="text-white opacity-80 text-xs mt-1">
                          Card Holder
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full transform rotate-[-4deg] translate-y-2 z-20">
                      <div className="w-full h-full bg-blue-500 rounded-xl shadow-lg flex flex-col justify-between p-5">
                        <div className="flex justify-between items-center">
                          <div className="text-white font-bold text-xl">
                            QRIS
                          </div>
                        </div>
                        <div className="text-white opacity-80 tracking-widest mt-6">
                          4455-6349-6916-9164
                        </div>
                        <div className="text-white opacity-80 text-xs mt-1">
                          Card Holder
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-full rounded-xl shadow-lg flex flex-col justify-between p-5 bg-gradient-to-br from-blue-400 to-blue-600 z-30">
                      <div className="flex justify-between items-center">
                        <div className="text-white font-bold text-xl">QRIS</div>
                      </div>
                      <div className="text-white opacity-80 tracking-widest mt-6">
                        4455-6349-6916-9164
                      </div>
                      <div className="text-white opacity-80 text-xs mt-1">
                        Card Holder
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Payment Options */}
            <div className="w-full md:w-1/2 p-8">
              {(!paymentStats || paymentStats?.status === 'pending') && (
                <>
                  <div className="mb-6">
                    <Title level={4} className="m-0">
                      Payment details
                    </Title>
                    <p className="text-sm">
                      We are glad that you are interested in our services. To
                      upgrade your plan, please scan the QRIS code below with
                      your phone.
                    </p>
                  </div>

                  {/* Payment Method Options */}
                  {!qrisData ? (
                    <div className="h-[70%]">
                      <div className="flex space-x-4 mb-6">
                        <Button
                          onClick={() => {}}
                          type="default"
                          disabled={true}
                          className="flex items-center justify-center"
                          style={{ height: '48px', width: '33%' }}>
                          <span className="flex items-center">
                            <svg
                              className="hidden md:block"
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              xmlns="http://www.w3.org/2000/svg">
                              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path
                                  fill="#4285F4"
                                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                                />
                              </g>
                            </svg>
                            <span className="ml-2">Google Pay</span>
                          </span>
                        </Button>

                        <Button
                          onClick={() => {}}
                          type="default"
                          disabled={true}
                          className="flex items-center justify-center"
                          style={{ height: '48px', width: '33%' }}>
                          <span className="flex items-center">
                            <svg
                              className="hidden md:block"
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.6 13.8c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.3-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-.9 0-2.4-1.1-4-1-2 0-3.9 1.2-5 3-2.1 3.7-.5 9.1 1.5 12.1 1 1.5 2.2 3.1 3.8 3 1.5-.1 2.1-1 3.9-1s2.4.9 4 .9 2.7-1.5 3.7-2.9c1.2-1.7 1.6-3.3 1.7-3.4-.1-.1-3.2-1.3-3.2-4.8zm-3.1-8.9c.8-1 1.4-2.4 1.2-3.8-1.2 0-2.7.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.4.1 2.8-.7 3.6-1.7z" />
                            </svg>
                            <span className="ml-2">Apple Pay</span>
                          </span>
                        </Button>

                        <Button
                          onClick={handlePaypal}
                          loading={loading.paypal}
                          type={
                            paymentMethod === 'paypal' ? 'primary' : 'default'
                          }
                          className="flex items-center justify-center"
                          style={{ height: '48px', width: '33%' }}>
                          <span className="flex items-center">
                            <svg
                              className="hidden md:block"
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                fill="#003087"
                                d="M 7.076 21.337 L 7.515 18.773 L 6.715 18.758 L 3.483 18.758 C 3.284 18.758 3.111 18.624 3.074 18.429 L 1.212 6.471 C 1.186 6.339 1.241 6.206 1.348 6.119 C 1.455 6.032 1.597 5.991 1.734 6.008 L 8.894 6.008 C 10.248 6.008 11.399 6.264 12.212 6.78 C 12.576 6.995 12.861 7.255 13.074 7.555 C 13.293 7.866 13.443 8.222 13.521 8.618 C 13.602 9.023 13.612 9.493 13.549 10.022 C 13.542 10.069 13.534 10.116 13.526 10.164 C 13.349 11.233 12.987 12.109 12.448 12.775 C 11.939 13.406 11.298 13.888 10.545 14.211 C 9.819 14.523 8.993 14.72 8.093 14.798 C 7.773 14.828 7.437 14.844 7.089 14.844 L 6.737 14.844 C 6.395 14.844 6.069 14.95 5.813 15.147 C 5.557 15.344 5.387 15.622 5.329 15.935 L 5.309 16.035 L 4.709 19.764 L 4.694 19.84 C 4.687 19.88 4.677 19.9 4.662 19.915 C 4.648 19.93 4.629 19.938 4.608 19.938 L 4.587 19.938 L 4.587 19.938 Z"
                              />
                              <path
                                fill="#003087"
                                d="M 13.821 10.121 C 13.813 10.171 13.804 10.221 13.795 10.272 C 13.266 13.173 11.398 14.012 8.969 14.012 L 7.591 14.012 C 7.166 14.012 6.806 14.335 6.733 14.754 L 5.915 19.85 C 5.877 20.079 6.051 20.288 6.283 20.288 L 8.859 20.288 C 9.224 20.288 9.537 20.011 9.6 19.651 L 9.629 19.521 L 10.092 16.864 L 10.128 16.697 C 10.191 16.336 10.504 16.059 10.869 16.059 L 11.304 16.059 C 13.383 16.059 15.008 15.321 15.462 12.823 C 15.659 11.766 15.534 10.892 14.971 10.282 C 14.8 10.097 14.591 9.944 14.345 9.823 C 14.18 9.741 13.998 9.673 13.802 9.62 C 13.808 9.787 13.808 9.954 13.795 10.121 L 13.821 10.121 Z"
                              />
                            </svg>
                            <span className="ml-2">PayPal</span>
                          </span>
                        </Button>
                      </div>

                      <div className="flex justify-center items-center my-4">
                        <div className="border-t border-gray-200 w-1/3"></div>
                        <div className="mx-4 text-gray-500 text-sm">Or</div>
                        <div className="border-t border-gray-200 w-1/3"></div>
                      </div>

                      {/* QRIS Button */}
                      <Button
                        onClick={handleGenerateQRIS}
                        loading={loading.qris}
                        type="primary"
                        block
                        size="large"
                        className="!bg-[#E34013] hover:bg-purple-700 mt-4 flex items-center justify-center">
                        <Image
                          src={qrisImage}
                          alt="QRIS"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <span>Pay with QRIS</span>
                      </Button>
                      {!isFetching && (
                        <div className="h-[60%] flex flex-col justify-end mt-[20px]">
                          <div className="flex justify-between items-center">
                            <Text strong>Package:</Text>
                            <Select
                              options={listPackages?.map((dx) => ({
                                value: dx.id,
                                label: dx.name,
                              }))}
                              onChange={(value) => {
                                router.replace(
                                  `/payment?id=null&type=${type}&plan_id=${value}`
                                );
                              }}
                              value={detailPackages?.id}
                            />
                            {/* <Text strong className="text-purple-600 text-xl">
                            {detailPackages?.name}
                          </Text> */}
                          </div>
                          <div className="flex justify-between items-center">
                            <Text strong>Total Amount:</Text>
                            <Text strong className="text-purple-600 text-xl">
                              IDR {detailPackages?.price}
                            </Text>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-4">
                      <Image
                        src={qrisImage}
                        alt="qris"
                        width={100}
                        height={100}
                      />
                      <Image
                        alt="qris"
                        width={300}
                        height={300}
                        src={qrisData.qris_resp as string}
                      />
                      <CountdownTimer price={qrisData?.price} />
                    </div>
                  )}
                </>
              )}

              {paymentStats && paymentStats?.status === 'done' && (
                <div className="w-full p-4">
                  <Title level={4} className="text-green-600">
                    Payment Verified!
                  </Title>
                  <p className="mt-4">
                    We are welcoming you to our premium member account. You can
                    enjoy unlimited image storage, unlimited songs library,
                    unlimited upload size, unlimited access to templates,
                    unlimited photobox frames, and 6 credit to use templates.
                  </p>
                  <p className="mt-3 font-semibold text-[#E34013]">
                    Redirecting to dashboard in <span id="countdown">3</span>{' '}
                    seconds...
                  </p>
                  <Button
                    onClick={() => (window.location.href = '/dashboard')}
                    type="primary"
                    className="bg-[#E34013] mt-4 text-white rounded-lg h-10 w-full">
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NewClientPagePayment;
