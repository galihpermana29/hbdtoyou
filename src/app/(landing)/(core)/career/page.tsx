'use client';

import NavigationBar from '@/components/ui/navbar';
import { motion } from 'framer-motion';
import {
  Users,
  Sparkles,
  Star,
  Send,
  MessageCircleQuestion,
  CheckCircle2,
  ArrowRight,
  Mail,
} from 'lucide-react';

const steps = [
  {
    num: '1',
    title: 'Submit Your Portfolio',
    desc: 'Send an email to memoify@gmail.com with links to your Twitter/TikTok AU works.',
  },
  {
    num: '2',
    title: 'Review Process',
    desc: 'Our team will review your content, engagement, and how Memoify fits into your storytelling.',
  },
  {
    num: '3',
    title: 'Onboarding',
    desc: 'Once selected, you\u2019ll receive a personal confirmation and your unique access level (Discount or Free Access) based on your traffic.',
  },
  {
    num: '4',
    title: 'Create & Share',
    desc: 'Use Memoify in your AU, share the magic with your readers, and enjoy ongoing support.',
  },
];

const faqs = [
  {
    q: 'How do you determine the reward tier?',
    a: 'Rewards (discounts vs. free access) are evaluated based on your consistent audience traffic and how naturally Memoify is integrated into your story\u2019s narrative.',
  },
  {
    q: 'Can I request custom features?',
    a: 'Selected authors in the program can suggest template ideas or features that would specifically benefit the AU community.',
  },
];

const ProgramPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E34013]/5 via-transparent to-orange-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-[#E34013]/10 text-[#E34013] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles size={14} />
              Memoify AU Program
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your Stories with the{' '}
              <span className="text-[#E34013]">Memoify AU Program</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              We believe every great story deserves a special touch. Join an
              exclusive circle of AU authors and get full support from the
              Memoify team to bring your fictional worlds to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is the AU Program */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-[#E34013]" />
            <h2 className="text-2xl font-bold text-gray-900">
              What is the AU Program?
            </h2>
          </div>
          <p className="text-gray-600 text-[16px] leading-relaxed">
            The <strong>Memoify AU Program</strong> is a dedicated initiative
            designed to support digital storytellers (AU Authors) on Twitter/X
            and TikTok. If you frequently use digital gifting or
            &ldquo;memory boxes&rdquo; as plot devices in your stories, we
            want to help you make them more immersive for your readers.
          </p>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8">
            <Star size={24} className="text-[#E34013]" />
            <h2 className="text-2xl font-bold text-gray-900">
              Exclusive Benefits for Selected Authors
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            As a member of the AU Program, you aren&rsquo;t just a user —
            you&rsquo;re a partner. Selected authors receive:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#E34013]/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 size={20} className="text-[#E34013]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Direct Team Support
              </h3>
              <p className="text-sm text-gray-600">
                Priority assistance from the Memoify team to help you set up
                specific gifts or templates for your AU chapters.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#E34013]/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-[#E34013]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Tiered Rewards
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Access to special pricing and benefits based on your audience
                reach:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#E34013]" />
                  <span>
                    <strong>Rising Creator:</strong> Significant discount
                    vouchers for your audience and personal use.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#E34013]" />
                  <span>
                    <strong>Elite Storyteller:</strong> Up to 100% Free Access
                    to all Memoify premium features and products.
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#E34013]/10 rounded-lg flex items-center justify-center mb-4">
                <Star size={20} className="text-[#E34013]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Feature Spotlights
              </h3>
              <p className="text-sm text-gray-600">
                Potential to have your AU featured on our official landing page
                or social media, driving more traffic to your threads.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8">
            <Send size={24} className="text-[#E34013]" />
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <p className="text-gray-600 mb-8">
            We&rsquo;ve made the partnership simple so you can focus on writing:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-xl border border-gray-200 p-6 flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#E34013] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#E34013] to-[#ff6a3d] rounded-2xl p-8 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Join the Universe?
          </h2>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            Don&rsquo;t let your characters settle for ordinary gifts. Make your
            AU unforgettable.
          </p>
          <a
            href="mailto:memoify@gmail.com?subject=AU%20Program%20Application%20-%20[Your%20Username]"
            className="inline-flex items-center gap-2 bg-white text-[#E34013] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            <Mail size={18} />
            memoify@gmail.com
          </a>
          <p className="text-white/70 text-sm mt-3">
            Subject: AU Program Application - [Your Username]
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8">
            <MessageCircleQuestion size={24} className="text-[#E34013]" />
            <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ProgramPage;
