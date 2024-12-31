'use client';

import { Check } from 'lucide-react';

interface FeatureItemProps {
  text: string;
}

export const FeatureItem = ({ text }: FeatureItemProps) => (
  <div className="flex items-center">
    <Check className="h-5 w-5 text-primary shrink-0" />
    <span className="ml-3 text-sm sm:text-base">{text}</span>
  </div>
);
