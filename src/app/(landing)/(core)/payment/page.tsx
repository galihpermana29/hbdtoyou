import { Metadata } from 'next';
import NewClientPagePayment from './new-client-page';

export const metadata: Metadata = {
  title: 'Premium Digital Gifts, Scrapbooks & Albums | Memoify',
  description:
    'Upgrade to our premium plan and unlock unlimited features for your digital gifts, digital scrapbooks, and digital albums. Enjoy unlimited image storage, songs library, upload size, templates access, and more.',
  keywords:
    'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, premium plan, upgrade, QRIS payment, custom websites, unlimited features, Memoify',
  openGraph: {
    title: 'Premium Digital Gifts, Scrapbooks & Albums | Memoify',
    description:
      'Upgrade to our premium plan and unlock unlimited features for your digital gifts, digital scrapbooks, and digital albums. Enjoy unlimited image storage, songs library, upload size, templates access, and more.',
    url: 'https://memoify.live/payment',
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
    title: 'Premium Digital Gifts, Scrapbooks & Albums | Memoify',
    description:
      'Upgrade to our premium plan and unlock unlimited features for your digital gifts, digital scrapbooks, and digital albums. Enjoy unlimited image storage, songs library, upload size, templates access, and more.',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300022/e757a9b4-ab3a-458c-8a53-90d367d3d9a6.png',
    ],
  },
};

const ServerSidePaymentQRIS = () => {
  // return <PaymentQRIS />;
  return <NewClientPagePayment />;
};

export default ServerSidePaymentQRIS;
