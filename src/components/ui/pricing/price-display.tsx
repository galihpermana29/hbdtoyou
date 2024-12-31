'use client';

interface PriceDisplayProps {
  amount: string;
  period?: string;
}

export const PriceDisplay = ({
  amount,
  period = '/month',
}: PriceDisplayProps) => (
  <div className="mt-4 flex items-baseline">
    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
      {amount}
    </span>
    <span className="ml-1 text-sm sm:text-base text-muted-foreground">
      {period}
    </span>
  </div>
);
