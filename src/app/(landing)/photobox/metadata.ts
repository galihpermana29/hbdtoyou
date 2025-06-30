import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photobox | Memoify',
  description: 'Capture and frame your special moments with our stylish Photobox feature. Create beautiful framed photos to add to your custom websites and digital memories.',
  keywords: 'photobox, photo frames, digital frames, photo capture, framed photos, Memoify',
  openGraph: {
    title: 'Photobox | Memoify',
    description: 'Capture and frame your special moments with our stylish Photobox feature. Create beautiful framed photos to add to your custom websites and digital memories.',
    url: 'https://memoify.live/photobox',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751298448/brave_screenshot_memoify.live_mhwzfs.png',
        width: 1200,
        height: 630,
        alt: 'Memoify Photobox Feature',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photobox | Memoify',
    description: 'Capture and frame your special moments with our stylish Photobox feature. Create beautiful framed photos to add to your custom websites and digital memories.',
    images: ['https://res.cloudinary.com/dqipjpy1w/image/upload/v1751298448/brave_screenshot_memoify.live_mhwzfs.png'],
  },
};
