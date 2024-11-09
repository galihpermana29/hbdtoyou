import NavigationBar from '@/components/ui/navbar';
import jumbotronImage from '@/assets/homepage.png';
import Image from 'next/image';
import { Button } from 'antd';
import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      <div className="mt-[50px]">
        <div className="min-h-[50vh] flex items-center flex-col justify-center text-center">
          <h1 className="text-[25px] md:text-[40px] font-[600] md:max-w-[50%] px-[20px]">
            Create your own{' '}
            <span className="text-red-500 font-bold italic">Netflix</span>{' '}
            clone, to <span className="underline">celebrate anything</span> in
            your lifes
          </h1>
          <div className="mt-[12px] text-[14px] md:text-[16px] md:max-w-[40%] text-gray-600 px-[20px]">
            You can create your own version of Netflix, upload your own images,
            and share them with your friends or someone you love.
          </div>

          <div className="flex items-center gap-[12px] mt-[12px]">
            <Link href={'/create'} className="cursor-pointer">
              <Button size="large" type="primary" className="!bg-black">
                Create
              </Button>
            </Link>
            <Button size="large" className="!border-black">
              Support
            </Button>
          </div>
        </div>
        <div className="mx-auto flex items-center justify-center px-[20px]">
          <Image
            src={jumbotronImage}
            alt="jumbotron"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
