import Link from 'next/link';

const NavigationBar = () => {
  return (
    <div className="flex item justify-between border-b-[1px] py-[20px] px-[40px] bg-white">
      <Link href={'/'} className="font-bold">
        HBDTY
      </Link>
      <div className="flex items-center gap-[8px] md:gap-[24px] text-[14px]">
        <Link href={'/example'}>Example</Link>
        <Link href={'/create'}>Create</Link>
        <Link href={'/contact'}>Contact</Link>
      </div>
    </div>
  );
};

export default NavigationBar;
