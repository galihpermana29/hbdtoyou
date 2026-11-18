import ContactPage from './contact-clientside';
import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/contact',
  title: 'Contact Memoify (Hubungi Kami)',
  description:
    'Questions, feedback or business inquiries about Memoify digital gifts, scrapbooks and albums. Ada pertanyaan atau masukan? Hubungi tim Memoify.',
  keywords: { en: ['contact', 'support'], id: ['hubungi kami', 'bantuan'] },
  image: {
    url: 'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139312/Screenshot_2025-11-14_at_23.55.02_qlviw3.png',
    alt: 'Contact Memoify',
  },
});

const ContactPageServer = () => {
  return <ContactPage />;
};

export default ContactPageServer;
