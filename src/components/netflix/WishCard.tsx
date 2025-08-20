'use client';

import { ReactNode } from 'react';

interface WishCardProps {
  name: string;
  message: string;
  profileIcon: ReactNode;
}

/**
 * A reusable component for displaying user wishes/comments in a Netflix-styled UI
 * @param name - The name of the person who left the wish
 * @param message - The wish/comment message
 * @param profileIcon - The profile icon component to display
 */
const WishCard = ({ name, message, profileIcon }: WishCardProps) => {
  return (
    <div className="flex items-start gap-x-3 p-4 bg-[#18181B] rounded-sm w-full">
      {/* Profile icon */}
      {profileIcon}

      {/* Name and message */}
      <div className="flex flex-col gap-y-1 items-start">
        <p className="geist-font font-semibold text-lg text-white">{name}</p>
        <p className="geist-font text-base text-[#D1D5DB]">{message}</p>
      </div>
    </div>
  );
};

export default WishCard;