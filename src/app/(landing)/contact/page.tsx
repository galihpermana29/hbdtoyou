import ContactPage from './contact-clientside';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Memoify',
  description:
    "Get in touch with our team for support, feedback, or business inquiries. We're here to help with all your questions about our custom website templates inspired by popular platforms.",
  keywords:
    'contact, support, feedback, help, business inquiries, Memoify, custom websites',
  openGraph: {
    title: 'Contact Us | Memoify',
    description:
      "Get in touch with our team for support, feedback, or business inquiries. We're here to help with all your questions about our custom website templates inspired by popular platforms.",
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
    title: 'Contact Us | Memoify',
    description:
      "Get in touch with our team for support, feedback, or business inquiries. We're here to help with all your questions about our custom website templates inspired by popular platforms.",
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300369/5a13cbf6-312a-4c2a-a927-05c19a3eeda5.png',
    ],
  },
};

const ContactPageServer = () => {
  return <ContactPage />;
};

export default ContactPageServer;
