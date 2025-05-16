'use client';

import { useMemoifyProfile } from '@/app/session-provider';
import { CreditCard } from 'lucide-react';

const CardClient = () => {
  const user = useMemoifyProfile();
  return (
    <div className="p-[20px] max-h-max  border-[1px] border-[#EAECF0] rounded-[12px]">
      <div className="flex items-center gap-[12px] mb-[20px]">
        <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
          <CreditCard />
        </div>
        <h1 className="text-[#1B1B1B] font-[600] text-[16px]">
          Credit remaining
        </h1>
      </div>
      <h1 className="text-[#1B1B1B] font-[600] text-[36px]">{user?.quota}</h1>
    </div>
  );
};

export default CardClient;
