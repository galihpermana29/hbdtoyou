'use client';

import PricingSection from '@/components/newlanding/PricingSection';
import NavigationBar from '@/components/ui/navbar';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Image as ImageIcon,
  Link2,
  MailCheck,
  Music,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Shared fade-up reveal for sections as they scroll into view. Mirrors the
 * Framer Motion pattern used on the career landing page.
 */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

/**
 * Placeholder block standing in for an exported Figma asset. Replace each usage
 * with a real <Image /> once the art is exported.
 */
const ImagePlaceholder = ({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) => (
  <div
    className={`flex items-center justify-center bg-gradient-to-br from-[#f6e7df] to-[#efe3da] text-[#b08c7d] text-[12px] font-[500] tracking-wide ${className}`}>
    {label}
  </div>
);

/** Value-prop columns under the hero. */
const VALUE_PROPS: { title: string; description: string }[] = [
  {
    title: 'Personal to every guest',
    description:
      'Greet each guest by name and tailor the story they see — far warmer than a one-size-fits-all card.',
  },
  {
    title: 'Ready in minutes',
    description:
      'Pick a template, add your photos and details, and publish. No designers, no code, no website builders.',
  },
  {
    title: 'Everything in one link',
    description:
      'RSVP, schedule, maps, gallery and music — all living in a single shareable invitation link.',
  },
];

/** Tall preview cards for the signature-templates section. */
const SIGNATURE_TEMPLATES: { name: string; tone: string }[] = [
  { name: 'Charlie & James', tone: 'Olive Editorial' },
  { name: 'Nabila & Aqsha', tone: 'Royal Maroon' },
  { name: 'Sora & Devan', tone: 'Soft Botanical' },
];

/** Feature rows shown beside the product mockup. */
const FEATURES: { icon: typeof Heart; label: string }[] = [
  { icon: Heart, label: 'Personalized guest greeting' },
  { icon: MailCheck, label: 'RSVP collection' },
  { icon: CalendarDays, label: 'Event schedules & maps' },
  { icon: ImageIcon, label: 'Guest POV Photo Gallery' },
  { icon: Music, label: 'Background music' },
  { icon: Link2, label: 'Shareable custom links' },
];

/** Dummy testimonials for the social-proof marquees. */
const REVIEWS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      'Our guests kept telling us it was the most beautiful invitation they had ever opened.',
    name: 'Rara & Bagas',
    role: 'Married in Bali',
  },
  {
    quote:
      'Setting up RSVP took five minutes and we tracked every reply in one place.',
    name: 'Intan & Yoga',
    role: 'Married in Bandung',
  },
  {
    quote:
      'The personalized greeting made every guest feel like the invite was made just for them.',
    name: 'Maya & Reza',
    role: 'Married in Jakarta',
  },
  {
    quote:
      'We shared one link and that was it — no printing, no chasing addresses.',
    name: 'Sinta & Dimas',
    role: 'Married in Yogyakarta',
  },
  {
    quote:
      'The photo gallery let everyone relive the day from their own point of view.',
    name: 'Putri & Aldo',
    role: 'Married in Surabaya',
  },
  {
    quote:
      'It looked like we hired a designer, but we made the whole thing ourselves.',
    name: 'Nadia & Fauzan',
    role: 'Married in Bali',
  },
];

const ReviewCard = ({ review }: { review: (typeof REVIEWS)[number] }) => (
  <div className="mx-[12px] w-[320px] md:w-[380px] shrink-0 rounded-[16px] border border-[#f0e4dd] bg-white p-[24px]">
    <Heart size={20} className="text-[#E34013] mb-[12px]" fill="#E34013" />
    <p className="text-[#1B1B1B] text-[16px] font-[400] leading-[1.6] mb-[16px]">
      “{review.quote}”
    </p>
    <p className="text-[#1B1B1B] text-[14px] font-[700]">{review.name}</p>
    <p className="text-[#7b7b7b] text-[13px] font-[400]">{review.role}</p>
  </div>
);

export default function WeddingInvitationPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="bg-white">
      <div className="fixed top-0 left-0 w-full z-10">
        <NavigationBar />
      </div>

      {/* Hero section */}
      <section className="pt-[140px] pb-[60px] overflow-hidden">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] text-center">
          <h1 className="text-[#1B1B1B] font-[700] text-[36px] md:text-[56px] lg:text-[64px] leading-[1.1]">
            Digital Wedding Invitations as
            <br className="hidden md:block" /> Unforgettable as Your{' '}
            <span
              className="text-[#E34013] italic"
              style={{ fontFamily: '"Playfair Display", serif' }}>
              “I do!”
            </span>
          </h1>
          <p className="mt-[24px] mx-auto max-w-[768px] text-[#7b7b7b] text-[16px] md:text-[20px] font-[400]">
            Design beautiful wedding invitation websites filled with your story,
            photos, schedules, RSVP, and meaningful moments — all in minutes.
          </p>
        </div>

        {/* Auto-sliding invitation previews — six cards rendered twice for a
            seamless loop. TODO: swap placeholders for exported Figma cards. */}
        <div className="wedding-marquee mt-[56px]">
          <div className="wedding-marquee-track wedding-marquee-track--left">
            {Array.from({ length: 12 }).map((_, index) => (
              <ImagePlaceholder
                key={index}
                label="Invitation preview"
                className="mx-[12px] h-[420px] w-[280px] shrink-0 rounded-[20px]"
              />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] mt-[48px] flex flex-col sm:flex-row gap-[16px] justify-center items-center">
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 h-[60px] w-full sm:w-auto px-[40px] rounded-[8px] bg-[#E34013] text-white font-[600] text-[16px]">
            Start My Invitation <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            className="flex items-center justify-center h-[60px] w-full sm:w-auto px-[40px] rounded-[8px] border border-[#d0d5dd] text-[#1B1B1B] font-[600] text-[16px]">
            How It Works?
          </a>
        </div>
      </section>

      {/* Value props */}
      <section className="py-[80px] bg-[#fdf7f4]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center text-[#1B1B1B] font-[700] text-[28px] md:text-[36px] mb-[48px] max-w-[945px] mx-auto leading-[1.2]">
            More personal than a card. Easier than building a website.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {VALUE_PROPS.map((prop, index) => (
              <motion.div
                key={prop.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[16px] bg-white border border-[#f0e4dd] p-[28px]">
                <div className="w-[44px] h-[44px] rounded-full bg-[#fdece5] flex items-center justify-center mb-[16px]">
                  <Heart size={22} className="text-[#E34013]" />
                </div>
                <h3 className="text-[#1B1B1B] font-[700] text-[18px] mb-[8px]">
                  {prop.title}
                </h3>
                <p className="text-[#7b7b7b] text-[15px] font-[400] leading-[1.6]">
                  {prop.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature templates */}
      <section className="py-[90px]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-[20px] mb-[48px]">
            <div className="max-w-[768px]">
              <h2 className="text-[#1B1B1B] font-[700] text-[28px] md:text-[36px] leading-[1.2] mb-[16px]">
                Signature templates for your big day
              </h2>
              <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400]">
                Hand-crafted designs across every mood — editorial, classic,
                botanical and more. Make any of them yours in minutes.
              </p>
            </div>
            <Link
              href="/templates"
              className="shrink-0 flex items-center gap-2 h-[48px] px-[24px] rounded-[8px] bg-[#E34013] text-white font-[600] text-[16px]">
              Browse templates <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px]">
            {SIGNATURE_TEMPLATES.map((tpl) => (
              <motion.div
                key={tpl.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="relative h-[468px] rounded-[16px] overflow-hidden">
                {/* TODO: replace with exported Figma template artwork. */}
                <ImagePlaceholder
                  label={tpl.tone}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-[24px]">
                  <p
                    className="text-white text-[28px] leading-[1.2]"
                    style={{ fontFamily: '"Playfair Display", serif' }}>
                    {tpl.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-[90px] bg-[#fdf7f4]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
          <div className="max-w-[869px] mb-[48px]">
            <p className="text-[#E34013] font-[600] text-[16px] mb-[12px]">
              Unlike any wedding website you’ve ever seen
            </p>
            <h2 className="text-[#1B1B1B] font-[700] text-[28px] md:text-[36px] leading-[1.2] mb-[16px]">
              Everything your celebration needs, in one place
            </h2>
            <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400]">
              From the first hello to the last dance — thoughtful features that
              make your guests feel part of the moment.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-[40px] items-center">
            <div className="flex-1 w-full flex flex-col gap-[16px]">
              {FEATURES.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  className="flex items-center gap-[16px] rounded-[12px] bg-white border border-[#f0e4dd] p-[17px]">
                  <div className="w-[48px] h-[48px] rounded-[10px] bg-[#fdece5] flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-[#E34013]" />
                  </div>
                  <span className="text-[#1B1B1B] font-[600] text-[16px]">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
            {/* TODO: replace with exported Figma product mockup. */}
            <ImagePlaceholder
              label="Product mockup"
              className="flex-1 w-full h-[460px] rounded-[20px]"
            />
          </div>
        </div>
      </section>

      {/* Social proof — two marquee rows, opposite directions */}
      <section className="py-[90px] overflow-hidden">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] text-center mb-[48px]">
          <h2 className="text-[#1B1B1B] font-[700] text-[28px] md:text-[36px] leading-[1.2] mb-[16px]">
            Loved by couples everywhere
          </h2>
          <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] max-w-[768px] mx-auto">
            Thousands of celebrations have started with a Memoify invitation.
          </p>
        </div>

        <div className="wedding-marquee mb-[24px]">
          <div className="wedding-marquee-track wedding-marquee-track--left">
            {[...REVIEWS, ...REVIEWS].map((review, index) => (
              <ReviewCard key={`row1-${index}`} review={review} />
            ))}
          </div>
        </div>
        <div className="wedding-marquee">
          <div className="wedding-marquee-track wedding-marquee-track--right">
            {[...REVIEWS, ...REVIEWS].map((review, index) => (
              <ReviewCard key={`row2-${index}`} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — shared with the root landing page */}
      <PricingSection />

      {/* Final CTA / newsletter */}
      <section className="py-[90px] bg-[#fdf7f4]">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] text-center">
          <h2 className="text-[#1B1B1B] font-[700] text-[28px] md:text-[36px] leading-[1.2] mb-[16px] max-w-[768px] mx-auto">
            Be the first to know when new templates drop
          </h2>
          <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] max-w-[768px] mx-auto mb-[32px]">
            Join our list and get fresh wedding invitation designs straight to
            your inbox.
          </p>
          {/* TODO: wire email submission to the newsletter backend. */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto max-w-[480px] flex flex-col sm:flex-row gap-[12px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 h-[48px] rounded-[8px] border border-[#d0d5dd] px-[16px] text-[16px] outline-none focus:border-[#E34013]"
            />
            <button
              type="submit"
              className="h-[48px] px-[24px] rounded-[8px] bg-[#E34013] text-white font-[600] text-[16px]">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
