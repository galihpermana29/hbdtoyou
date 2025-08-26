'use client';

import { ArrowDropDown, Notifications, Search } from '@mui/icons-material';

import { useEffect, useState } from 'react';
import widya from '@/assets/widya/after/2.jpg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = ({ jumbotronImage }: { jumbotronImage?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    window.onscroll = () => {
      setIsScrolled(window.pageYOffset === 0 ? false : true);
      return () => (window.onscroll = null);
    };
  }, []);
  return (
    <div
      className={`fixed top-0 w-full z-50 text-white text-sm ${
        isScrolled
          ? 'bg-black'
          : 'bg-gradient-to-t from-transparent to-[rgba(0,0,0,0.3)]'
      }`}>
      <div className=" mx-auto flex items-center justify-between h-16 px-[20px] md:px-12">
        <div className="flex items-center space-x-5">
          <img
            onClick={() => router.push('/')}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
            className="h-6 mr-10 cursor-pointer"
          />
          <span className="cursor-pointer hidden lg:block">Homepage</span>
          <span className="cursor-pointer hidden lg:block">Series</span>
          <span className="cursor-pointer hidden lg:block">Movies</span>
          <span className="cursor-pointer hidden lg:block">
            New and Popular
          </span>
          <span className="cursor-pointer hidden lg:block">My List</span>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="cursor-pointer" />
          <span className="cursor-pointer hidden lg:block">ADULT</span>
          <Notifications className="cursor-pointer" />
          <Image
            width={32}
            height={32}
            src={jumbotronImage ?? ''}
            alt=""
            className="w-8 h-8 rounded-md object-cover cursor-pointer"
          />
          <div className="relative group">
            <ArrowDropDown className="cursor-pointer" />
            <div className="absolute right-0 mt-2 hidden bg-black text-white rounded-md group-hover:flex flex-col">
              <span className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                Settings
              </span>
              <span className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
