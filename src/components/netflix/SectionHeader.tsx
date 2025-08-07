'use client';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  className?: string;
}

/**
 * A reusable section header component for Netflix-styled UI sections
 * @param title - The main title of the section
 * @param subtitle - Optional subtitle text
 * @param rightElement - Optional element to display on the right side
 * @param className - Additional CSS classes
 */
const SectionHeader = ({ title, subtitle, rightElement, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`flex items-center justify-between w-full text-white ${className}`}>
      <h1 className="font-bold text-2xl geist-font">{title}</h1>
      {subtitle && <span className="text-xs geist-font">{subtitle}</span>}
      {rightElement && rightElement}
    </div>
  );
};

export default SectionHeader;