'use client';

import { Badge, Button } from 'antd';
import { Card } from './card';
import { FeatureItem } from './feature-item';
import { PriceDisplay } from './price-display';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  onClickButton?: () => void;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  popular,
  buttonText,
  buttonVariant = 'default',
  onClickButton = () => {},
}: PricingCardProps) => (
  <Card
    className={`p-6 sm:p-8 border-2 transition-all ${
      popular
        ? 'border-primary bg-card hover:border-primary/80'
        : 'hover:border-primary/50'
    }`}>
    <div className="relative">
      {popular && (
        <div className="absolute -top-4 right-0 sm:right-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 text-xs sm:text-sm rounded-full">
            Popular
          </span>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
          <div className="flex gap-[8px] items-center">
            <PriceDisplay amount={price} period=" " />
            {popular && (
              <span className="bg-red-500 text-primary-foreground px-3 py-1 text-xs sm:text-sm rounded-full">
                50% OFF
              </span>
            )}
          </div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 flex-1">
          {features.map((feature, index) => (
            <FeatureItem key={index} text={feature} />
          ))}
        </div>
        <div>
          <Button
            onClick={onClickButton}
            size="large"
            type="primary"
            className={` w-[100%] !rounded-[50px] mt-[20px] ${
              buttonVariant === 'outline'
                ? '!bg-white !border-[1px] !border-black !text-black'
                : '!bg-black'
            }`}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default PricingCard;
