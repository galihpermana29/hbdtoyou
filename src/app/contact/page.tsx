import NavigationBar from '@/components/ui/navbar';
import { Button } from 'antd';
import Link from 'next/link';

const ContactPage = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      <div className="mt-[100px] text-center">
        <div className="my-[12px]">
          <h1 className="text-[35px] font-bold ">Contact Me</h1>
          <p className="text-[14px] ">email: galihcbn123@gmail.com</p>
          <p className="text-[14px] ">instagram: @galjhpermana</p>
          <p className="text-[14px]">x/twitter: @kimsabuj2</p>
        </div>
        <Link
          href={'https://saweria.co/galihpermana29'}
          target="_blank"
          className="cursor-pointer mt-[12px]">
          <Button size="large" className="!border-black">
            Saweria
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
