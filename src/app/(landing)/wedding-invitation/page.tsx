import { Metadata } from 'next';
import WeddingInvitationPage from './wedding-invitation-clientside';

export const metadata: Metadata = {
  title: 'Digital Wedding Invitations | Memoify',
  description:
    'Create beautiful digital wedding invitations as unforgettable as your "I do!". Personalized guest greetings, RSVP collection, event schedules, photo galleries, background music, and shareable links — all in minutes.',
  keywords:
    'digital wedding invitation, online wedding invite, e-invitation, wedding website, RSVP collection, wedding rsvp online, save the date, undangan pernikahan digital, undangan online, wedding invitation template, Memoify',
  openGraph: {
    title: 'Digital Wedding Invitations | Memoify',
    description:
      'Create beautiful digital wedding invitations as unforgettable as your "I do!". Personalized greetings, RSVP, schedules, galleries and more — in minutes.',
    url: 'https://memoify.live/wedding-invitation',
    siteName: 'Memoify',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Wedding Invitations | Memoify',
    description:
      'Create beautiful digital wedding invitations as unforgettable as your "I do!". Personalized greetings, RSVP, schedules, galleries and more — in minutes.',
  },
};

const WeddingInvitationPageServer = () => {
  return <WeddingInvitationPage />;
};

export default WeddingInvitationPageServer;
