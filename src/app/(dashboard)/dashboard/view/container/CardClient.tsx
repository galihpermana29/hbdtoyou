'use client';

import { useMemoifyProfile } from '@/app/session-provider';
import React from 'react';

const CardClient = ({
  icon,
  title,
  stats,
}: {
  icon: React.ReactNode;
  title: string;
  stats: number;
}) => {
  const profile = useMemoifyProfile();
  return (
    <div className="p-[20px] max-h-max  border-[1px] border-[#EAECF0] rounded-[12px]">
      <div className="flex items-center gap-[12px] mb-[20px]">
        <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
          {icon}
        </div>
        <h1 className="text-[#1B1B1B] font-[600] text-[16px]">{title}</h1>
      </div>
      {title === 'Credit Remaining' ? (
        <h1 className="text-[#1B1B1B] font-[600] text-[36px]">
          {profile?.quota}
        </h1>
      ) : (
        <h1 className="text-[#1B1B1B] font-[600] text-[36px]">{stats}</h1>
      )}
    </div>
  );
};

export default CardClient;
