'use client';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';

export function ErrorBoundaryCustom() {
  const router = useRouter();
  return (
    <div className="h-[80vh] w-full  flex flex-col items-center justify-center">
      <p className="text-[#475467] font-[400] text-[16px]">
        Looks like something went wrong, i hope you don't mind. Please try again
        or contact our support.
      </p>
      <Button
        onClick={() => {
          router.push('/create');
        }}
        iconPosition="end"
        icon={<SquarePen size={16} />}
        className="!bg-[#E34013] !text-white !rounded-[8px] !text-[14px] !font-[600] !h-[38px] mt-[24px]"
        type="primary"
        size="large">
        Create
      </Button>
    </div>
  );
}
