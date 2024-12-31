'use client';

import { Button } from './button';
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
          <PriceDisplay amount={price} />
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 flex-1">
          {features.map((feature, index) => (
            <FeatureItem key={index} text={feature} />
          ))}
        </div>

        {/* <Button
          className="mt-6 sm:mt-8 w-full"
          variant={buttonVariant}
          onClick={onClickButton}>
          {buttonText}
        </Button> */}
      </div>
    </div>
  </Card>
);

export default PricingCard;
