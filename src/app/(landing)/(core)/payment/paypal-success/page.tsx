'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from "@/components/ui/navbar";
import { Button, message } from "antd";
import { paymentPaypalCapture } from '@/action/user-api';

interface PaypalPaymentData {
  order_id: string;
  payment_id: string;
  price: string;
}

/**
 * PaymentPaypalSuccess component
 * Displays a success message after PayPal payment verification
 * and automatically redirects to dashboard after countdown
 */
const PaymentPaypalSuccess = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dashboardBtnRef = useRef<HTMLButtonElement>(null);
  const [isCapturing, setIsCapturing] = useState(true);

  // Capture the PayPal payment
  useEffect(() => {
    const capturePayment = async () => {
      try {
        // Get payment data from local storage
        const paypalPaymentData = localStorage.getItem('paypal_payment');

        if (!paypalPaymentData) {
          messageApi.error('Payment data not found');
          setIsCapturing(false);
          localStorage.removeItem('paypal_payment');
          return;
        }

        // Parse the payment data
        const paymentData: PaypalPaymentData = JSON.parse(paypalPaymentData);

        // Call the capture API
        const response = await paymentPaypalCapture({
          order_id: paymentData.order_id,
          payment_id: paymentData.payment_id
        });

        if (response.success) {
          messageApi.success('Payment successfully captured');
          // Clear the payment data from local storage
          localStorage.removeItem('paypal_payment');
        } else {
          messageApi.error(response.message);
          localStorage.removeItem('paypal_payment');
        }
      } catch (error) {
        messageApi.error('An error occurred while capturing payment');
      } finally {
        setIsCapturing(false);
      }
    };

    capturePayment();
  }, [messageApi]);

  // Handle redirect to dashboard with fallback
  const redirectToDashboard = useCallback(() => {
    try {
      setIsRedirecting(true);
      // Primary redirect method
      router.push('/dashboard');

      // Fallback redirect after a delay in case router.push fails silently
      const fallbackTimeout = setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

      // Clean up fallback timeout if component unmounts
      return () => clearTimeout(fallbackTimeout);
    } catch (error) {
      messageApi.error('Failed to redirect. Please click the button to go to dashboard.');
      setIsRedirecting(false);
      // Focus on the dashboard button if redirect fails
      if (dashboardBtnRef.current) {
        dashboardBtnRef.current.focus();
      }
    }
  }, [router, messageApi]);

  // Handle manual redirect button click
  const handleManualRedirect = () => {
    redirectToDashboard();
  };

  useEffect(() => {
    // Only start countdown after payment capture is complete
    if (!isCapturing) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          // When countdown reaches 0, clear interval and redirect
          if (prevCount <= 1) {
            clearInterval(timer);
            // Small delay to show the loading state before redirect
            setTimeout(() => {
              redirectToDashboard();
            }, 500);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      // Cleanup function to clear interval if component unmounts
      return () => clearInterval(timer);
    }
  }, [redirectToDashboard, isCapturing]); // Add isCapturing to dependency array

  return (
    <>
      {contextHolder}
      <NavigationBar />
      <div
        className="flex flex-col items-center justify-start min-h-screen py-[30px]"
        role="main"
        aria-labelledby="payment-success-title"
      >
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] flex-1 w-full">
          <div className="w-full md:max-w-[50%]">
            <h1 id="payment-success-title" className="text-[22px] md:text-[35px] font-bold">
              Payment Verified!
            </h1>

            <p className="mt-5">
              We are welcoming you to our premium member account. You can
              enjoy unlimited image storage, unlimited songs library,
              unlimited upload size, unlimited access to templates, unlimited
              photobox frames, and 6 credit to use templates.
            </p>

            {/* Countdown and redirect status */}
            <div className="mt-5">
              <p
                className="font-semibold text-[#E34013]"
                aria-live="polite"
              >
                {isRedirecting ? (
                  <span className="flex items-center">Redirecting to dashboard...
                  </span>
                ) : (
                  <>Redirecting to dashboard in <span>{countdown}</span> seconds...</>
                )}
              </p>
            </div>

            {/* Dashboard button */}
            <div className="mt-5">
              <Button
                ref={dashboardBtnRef}
                onClick={handleManualRedirect}
                type="primary"
                loading={isRedirecting}
                disabled={isRedirecting}
                aria-label="Go to Dashboard"
                className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] !w-[170px]"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPaypalSuccess;