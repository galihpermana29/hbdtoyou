'use client';

import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { getListPackages, getPromotedCoupon } from '@/action/user-api';
import { useMemoifySession } from '@/app/session-provider';

import { Rise, SectionHead, press } from './ui';

/**
 * The plans, read from the backend like the shared PricingSection does (same
 * queries, same routes), drawn in the MemoRoll system. The middle plan is
 * the one most people want, so it is the one on ink.
 *
 * The cards arrive as one wave. Nothing else moves: prices are read, not
 * performed.
 */
export default function HomePricing() {
  const router = useRouter();
  const session = useMemoifySession();

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => (await getListPackages()).data,
  });
  const { data: coupon } = useQuery({
    queryKey: ['promoted-coupon'],
    queryFn: async () => (await getPromotedCoupon()).data ?? null,
  });

  const discount = coupon
    ? coupon.discount_type === 'percent'
      ? `${coupon.discount_value}% off`
      : `IDR ${coupon.discount_value.toLocaleString()} off`
    : null;

  const choose = (plan: { id: string; name: string }) => {
    if (!session?.accessToken) return signIn('google');
    if (plan.name === 'Free Plan') return router.push('/create');
    const type = plan.name === 'Advanced Plan' ? 'advanced' : 'premium';
    router.push(`/payment?type=${type}&plan_id=${plan.id}`);
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-[81px] bg-[#fbf4ec] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead
          eyebrow="Pricing"
          title="Start free. Top up when you want more."
          body="Make a free gift every day. Go Premium for every style and more room for photos."
        />

        {coupon ? (
          <p className="mx-auto mt-8 w-fit rounded-full border border-dashed border-[#ff3e09] bg-[#fff0e9] px-5 py-2 text-center text-[14px] text-[#7b4034]">
            Use code{' '}
            <span className="font-mono font-bold tracking-[0.06em] text-[#e34013]">
              {coupon.code}
            </span>{' '}
            at checkout for {discount}
          </p>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3">
          {(packages ?? []).map((plan, index) => {
            const featured = plan.name === 'Premium Plan';
            return (
              <Rise
                key={plan.id}
                delay={[0, 90, 150][index] ?? 150}
                distance={[20, 14, 10][index] ?? 10}>
                <div
                  className={`flex h-full flex-col rounded-[28px] p-7 ${
                    featured
                      ? 'bg-[#1b1b1b] text-[#fbf4ec]'
                      : 'border border-[#e8ded3] bg-[#fffdfa] text-[#1b1b1b]'
                  }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[18px] font-semibold">{plan.name}</p>
                    {featured ? (
                      <span className="rounded-full bg-[#ff3e09] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
                        Most picked
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-[40px] font-bold leading-none tracking-[-0.04em]">
                    <span className="mr-1 text-[16px] font-semibold tracking-normal opacity-70">
                      IDR
                    </span>
                    {plan.price}
                  </p>
                  <p
                    className={`mt-3 text-[15px] leading-[1.55] ${
                      featured ? 'text-[#cfc7bd]' : 'text-[#4a4642]'
                    }`}>
                    {plan.description}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {(plan.features ?? []).map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[15px] leading-[1.5]">
                        <span className="mt-[2px] flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ff3e09]">
                          <Check
                            aria-hidden
                            className="size-3 text-white"
                            strokeWidth={3}
                          />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => choose(plan)}
                    className={`mt-8 flex h-12 w-full items-center justify-center rounded-full text-[16px] font-semibold ${press} ${
                      featured
                        ? 'bg-[#ff3e09] text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)]'
                        : 'border border-[rgba(33,33,33,0.2)] bg-[#fbf4ec] text-[#1b1b1b]'
                    }`}>
                    {session?.accessToken
                      ? plan.name === 'Free Plan'
                        ? 'Start free'
                        : `Get ${plan.name.replace(' Plan', '')}`
                      : 'Sign in with Google'}
                  </button>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
