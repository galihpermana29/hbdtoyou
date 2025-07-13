'use client';

import { Button } from 'antd';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type IconPosition = 'start' | 'end';

interface NetflixButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

/**
 * A reusable Netflix-styled button component
 * @param children - The button text or content
 * @param icon - Optional icon element
 * @param iconPosition - Position of the icon ('start' or 'end')
 * @param variant - Button style variant ('primary', 'secondary', or 'text')
 * @param onClick - Click handler function
 * @param className - Additional CSS classes
 * @param fullWidth - Whether the button should take full width
 */
const NetflixButton = ({
  children,
  icon,
  iconPosition = 'start',
  variant = 'primary',
  onClick,
  className = '',
  fullWidth = false,
}: NetflixButtonProps) => {
  // Base classes for all button variants
  const baseClasses = '!font-semibold !text-base !rounded-[6px]';

  // Variant-specific classes
  const variantClasses = {
    primary: '!bg-[#D22F26] !text-white !border-none',
    secondary: '!bg-white/10 !text-white !border-none',
    text: '!bg-black !border-none !p-0 !h-fit !text-white',
  };

  // Width classes
  const widthClasses = fullWidth ? '!w-full' : '';

  return (
    <Button
      onClick={onClick}
      icon={icon}
      iconPosition={iconPosition}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${className} geist-font flex items-center justify-center gap-x-2`}
    >
      {children}
    </Button>
  );
};

export default NetflixButton;