'use client';
import {
  useMemoifySession,
  useMemoifyUpgradePlan,
} from '@/app/session-provider';
import PricingCard from './pricing-card';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const PricingWrapper = () => {
  const { setModalState: setModalUpgradePlan } = useMemoifyUpgradePlan();
  const router = useRouter();
  const session = useMemoifySession();

  return (
    <section className="w-full py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Join with Memoify
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Choose the plan that is right for you
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <PricingCard
            onClickButton={() => {
              router.push('/templates');
            }}
            title="Free"
            price="IDR 0K"
            description="Perfect for getting started with basic features"
            features={[
              'Limited image storage',
              'Limited songs library',
              'Basic image upload size',
            ]}
            buttonText="Try Free Account"
            buttonVariant="outline"
          />

          <PricingCard
            onClickButton={() => {
              if (session?.accessToken) {
                router.push('/payment-qris');
              } else {
                signIn('google');
              }
            }}
            title="Premium"
            price="IDR 11K"
            description="All the features you need for professional use"
            features={[
              'Unlimited image storage',
              'Unlimited songs library',
              'Unlimited upload size',
              'Unlimited access to templates',
              'Unlimited photobox frames',
              '6 credit to use templates',
            ]}
            popular={true}
            buttonText="Get Premium"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingWrapper;
