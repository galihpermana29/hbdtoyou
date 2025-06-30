import PaymentQRIS from './client-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Upgrade | Memoify',
  description:
    'Upgrade to our premium plan and unlock unlimited features. Enjoy unlimited image storage, songs library, upload size, templates access, and more for your custom websites.',
  keywords:
    'premium plan, upgrade, QRIS payment, custom websites, unlimited features, Memoify',
  openGraph: {
    title: 'Premium Upgrade | Memoify',
    description:
      'Upgrade to our premium plan and unlock unlimited features. Enjoy unlimited image storage, songs library, upload size, templates access, and more for your custom websites.',
    url: 'https://memoify.live/payment-qris',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300022/e757a9b4-ab3a-458c-8a53-90d367d3d9a6.png',
        width: 1200,
        height: 630,
        alt: 'Memoify Premium Upgrade',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Upgrade | Memoify',
    description:
      'Upgrade to our premium plan and unlock unlimited features. Enjoy unlimited image storage, songs library, upload size, templates access, and more for your custom websites.',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300022/e757a9b4-ab3a-458c-8a53-90d367d3d9a6.png',
    ],
  },
};

const ServerSidePaymentQRIS = () => {
  return <PaymentQRIS />;
};

export default ServerSidePaymentQRIS;
