'use client';

import InvitationFaq from '@/components/digital-invitation/faq';
import InvitationHero from '@/components/digital-invitation/hero';
import InvitationHowItWorks from '@/components/digital-invitation/how-it-works';
import InvitationPlan from '@/components/digital-invitation/plan';
import InvitationTemplates from '@/components/digital-invitation/templates';
import InvitationTestimonial from '@/components/digital-invitation/testimonial';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';

/**
 * The Digital invitation landing. Its type is the MemoRoll set (Plus Jakarta
 * Sans, Passion One, DM Mono, Caveat), loaded on this page's own element.
 */
export default function WeddingInvitationPage() {
  return (
    <div
      className={`${memorollFonts} ${landingFonts} bg-[#fbf4ec]`}
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <NavigationBar />
      <main className="overflow-x-clip">
        <InvitationHero />
        <InvitationTemplates />
        <InvitationHowItWorks />
        <InvitationTestimonial />
        <InvitationPlan />
        <InvitationFaq />
      </main>
    </div>
  );
}
