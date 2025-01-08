'use client';
import { useMemoifyUpgradePlan } from '@/app/session-provider';
import PricingCard from './pricing-card';

const PricingWrapper = () => {
  const { setModalState: setModalUpgradePlan } = useMemoifyUpgradePlan();

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
            title="Free"
            price="IDR 0K"
            description="Perfect for getting started with basic features"
            features={[
              'Limited image storage',
              'Limited songs library',
              'Basic image upload size',
            ]}
            buttonText="Get Started"
            buttonVariant="outline"
          />

          <PricingCard
            onClickButton={() => {
              setModalUpgradePlan({ visible: true, data: '' });
            }}
            title="Premium"
            price="IDR 10K"
            description="All the features you need for professional use"
            features={[
              'Unlimited image storage',
              'Unlimited songs library',
              'Unlimited upload size',
              'Unlimited access to templates',
              'Unlimited photobox frames',
              '6 premium feature quotas',
            ]}
            popular={true}
            buttonText="Upgrade to Premium"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingWrapper;
