import ContactPage from './contact-clientside';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us About Digital Gifts, Scrapbooks & Albums | Memoify',
  description:
    "Get in touch with our team for support, feedback, or business inquiries about our digital gifts, digital scrapbooks, and digital albums. We're here to help with all your questions about our custom website templates inspired by popular platforms.",
  keywords:
    'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, contact, support, feedback, help, business inquiries, Memoify, custom websites',
  openGraph: {
    title: 'Contact Us About Digital Gifts, Scrapbooks & Albums | Memoify',
    description:
      "Get in touch with our team for support, feedback, or business inquiries about our digital gifts, digital scrapbooks, and digital albums. We're here to help with all your questions about our custom website templates inspired by popular platforms.",
    url: 'https://memoify.live/contact',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300369/5a13cbf6-312a-4c2a-a927-05c19a3eeda5.png',
        width: 1200,
        height: 630,
        alt: 'Contact Memoify',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us About Digital Gifts, Scrapbooks & Albums | Memoify',
    description:
      "Get in touch with our team for support, feedback, or business inquiries about our digital gifts, digital scrapbooks, and digital albums. We're here to help with all your questions about our custom website templates inspired by popular platforms.",
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300369/5a13cbf6-312a-4c2a-a927-05c19a3eeda5.png',
    ],
  },
};

const ContactPageServer = () => {
  return <ContactPage />;
};

export default ContactPageServer;
