'use client';
import { useState } from 'react';

function NetflixV2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero Section with Navigation */}
      <div className="relative h-screen">
        <img
          src="https://res.cloudinary.com/dxuumohme/image/upload/v1736878627/bubjbkztn7xfrxmusjtp.jpg"
          alt="Documentary Filming"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30">
          {/* Navigation */}
          <nav className="relative z-50 px-4 md:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {/* Mobile Menu Button */}
              <div className="md:hidden flex justify-between items-center">
                <h1 className="pt-serif-regular text-white hover:text-gray-300 text-xl font-bold">
                  American Documentary
                </h1>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMenuOpen
                          ? 'M6 18L18 6M6 6l12 12'
                          : 'M4 6h16M4 12h16M4 18h16'
                      }
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu */}
              <div
                className={`${
                  isMenuOpen ? 'block' : 'hidden'
                } md:hidden absolute top-full left-0 right-0 bg-black bg-opacity-90 text-white`}>
                <div className="px-4 py-2 space-y-2">
                  <a href="#" className="block py-2">
                    WATCH
                  </a>
                  <a href="#" className="block py-2">
                    ENGAGE
                  </a>
                  <a href="#" className="block py-2">
                    CREATE
                  </a>
                  <a href="#" className="block py-2">
                    DONATE
                  </a>
                  <div className="border-t border-gray-600 my-2"></div>
                  <a href="#" className="block py-2">
                    POV
                  </a>
                  <a href="#" className="block py-2">
                    AMERICA REFRAMED
                  </a>
                  <a href="#" className="block py-2">
                    INTERACTIVE
                  </a>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex justify-between items-center">
                <div className="flex space-x-8">
                  <a href="#" className="text-white hover:text-gray-300">
                    WATCH
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    ENGAGE
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    CREATE
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    DONATE
                  </a>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="pt-serif-regular text-white hover:text-gray-300 text-2xl font-bold">
                    American Documentary
                  </h1>
                </div>

                <div className="flex space-x-8 items-center">
                  <a href="#" className="text-white hover:text-gray-300">
                    POV
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    AMERICA REFRAMED
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    INTERACTIVE
                  </a>
                  {/* <MagnifyingGlassIcon className="h-5 w-5 text-white" /> */}
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="h-[calc(100vh-5rem)] flex flex-col justify-center">
              <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 leading-tight">
                WE ARE BOLD
                <br />
                DOCUMENTARIANS FOR
                <br />
                THE PUBLIC GOOD.
              </h1>
              <p className="text-white text-base md:text-lg mb-8 max-w-xl pt-serif-regular">
                A national nonprofit media arts organization, AmDoc strives to
                make essential documentaries accessible as a catalyst for public
                discourse. We collaborate with passionate filmmakers to nurture
                the nonfiction community.
              </p>
              <button className="bg-red-500 text-white px-6 py-3 inline-block w-fit hover:bg-red-600">
                ABOUT US →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Now Streaming Section */}
      <div className="bg-black text-white py-8 md:py-16 px-4 md:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-sm mb-2">NOW STREAMING</p>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-6 md:space-y-0">
              <h2 className="text-3xl md:text-4xl pt-serif-regular">
                The AmDoc
                <br />
                A-List
              </h2>
              <div className="max-w-xl">
                <p className="mb-4 pt-serif-regular">
                  Take a look at all of our films that received nominations for
                  the 39th Annual News and Documentary Emmy® Awards.
                </p>
                <p className="pt-serif-regular">
                  These filmmakers have put in countless hours of effort to
                  bring us passionate storytelling like never before. Lorem
                  ipsum dolor sit amet consectetur adipisicing elit. Similique
                  inventore voluptatem totam numquam commodi autem repellendus
                  aliquam nisi iste doloribus. Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Necessitatibus perferendis
                  obcaecati illum asperiores, amet, ex at, officiis iure nisi
                  facere ducimus voluptatum est architecto. Tempore ea pariatur
                  quisquam consequuntur quas!
                </p>
              </div>
              <button className="border border-red-500 text-red-500 px-6 py-3 hover:bg-red-500 hover:text-white w-fit">
                ENGAGE →
              </button>
            </div>
          </div>

          {/* Film Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Film Card 1 */}
            {[1, 2, 3, 4].map((dx) => (
              <div className="relative group" key={dx}>
                <img
                  src="https://res.cloudinary.com/dxuumohme/image/upload/v1736878627/bubjbkztn7xfrxmusjtp.jpg"
                  alt="Last Men In Aleppo"
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-red-500 text-white px-4 py-2 mr-2">
                    WATCH FILM
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-red-500 text-xl mb-2 pt-serif-regular">
                    Last Men In Aleppo
                  </h3>
                  <p className="text-sm pt-serif-regular">
                    After five years of war in Syria, the remaining citizens of
                    Aleppo are getting ready for a siege. Through the eyes of
                    volunteer rescue workers called the White Helmets, Last Men
                    In Aleppo allows...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetflixV2;
