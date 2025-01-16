import Image from 'next/image';

const projects = [
  {
    id: '100100',
    title: '100100',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736878627/bubjbkztn7xfrxmusjtp.jpg',
  },
  {
    id: 'spyder23',
    title: 'SPYDER 23',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880564/zm9qkwdjbbnugbohko9x.jpg',
  },
  {
    id: 'demoda',
    title: 'DEMODA',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880576/kdf19qhcabj6gnaoxx7s.jpg',
  },
  {
    id: 'crisp',
    title: 'CRISP',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880581/ajhrmyr1qz4n1u1fscha.jpg',
  },
  {
    id: 'bacon',
    title: 'BACON & PEPPR',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880586/mwnbkxb11oo2ew2squ1z.jpg',
  },
  {
    id: 'office',
    title: 'OFFICE',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880592/sc6uynh62vjcvquu1dur.jpg',
  },
  {
    id: 'chance',
    title: 'CHANCE',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880662/pm1dz6f6cq1ttk8b1vjh.jpg',
  },
  {
    id: 'percent',
    title: '20 PERCENT',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736880667/jzdtgs5klr20uyyngxae.jpg',
  },
];

export default function GraduationV1Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center p-4 md:p-6">
        <div className="flex space-x-4 md:space-x-6">
          <a href="#works" className="hover:text-gray-300 text-sm md:text-base">
            xx STUDIO
          </a>
          <a
            target="_blank"
            href="https://memoify.live"
            className="hover:text-gray-300 text-sm md:text-base">
            MEMOIFY
          </a>
        </div>
        <button className="hover:text-gray-300 text-sm md:text-base"></button>
      </nav>

      <div className="px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-[14vw] leading-[0.9] font-bold tracking-tighter whitespace-nowrap overflow-hidden text-center uppercase">
          GRADUATION
        </h1>
        <div className="flex flex-col md:flex-row justify-between mt-4 text-xs md:text-sm space-y-2 md:space-y-0 text-center md:text-left uppercase">
          <p className="uppercase">
            UNIVERSITAS BRAWIJAYA
            <br />
            FACULTY OF COMPUTER AND SCIENCE
          </p>
          <p className="md:text-right uppercase">
            COMPUTER ENGINEERING
            <br />
            CLASS OF 24
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-4 max-w-[90%] md:max-w-[97%] mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="text-sm font-medium uppercase tracking-wider">
                {project.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 md:px-6 py-12 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 uppercase">
          GRADUATION
          <br />
          IS JUST A START
        </h2>
        <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mt-8 overflow-hidden rounded-lg">
          <Image
            src="https://res.cloudinary.com/dxuumohme/image/upload/v1736878627/bubjbkztn7xfrxmusjtp.jpg"
            alt="Breathe life"
            fill
            className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
          />
        </div>
      </div>

      {/* <footer className="p-4 md:p-6 text-xs md:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          <div className="flex flex-col space-y-2">
            <span className="font-medium">SOCIALS</span>
            <div className="flex flex-col space-y-1">
              <a href="#" className="hover:text-gray-300">
                TWITTER
              </a>
              <a href="#" className="hover:text-gray-300">
                INSTAGRAM
              </a>
              <a href="#" className="hover:text-gray-300">
                VIMEO
              </a>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">WORK</span>
            <a href="#" className="hover:text-gray-300">
              ALL PROJECTS
            </a>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">LET'S TALK</span>
            <div className="flex flex-col space-y-1">
              <a href="#" className="hover:text-gray-300">
                EMAIL
              </a>
              <a href="#" className="hover:text-gray-300">
                PHONE
              </a>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">ABOUT</span>
            <a href="#" className="hover:text-gray-300">
              ABOUT US
            </a>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">MADE BY</span>
            <a href="#" className="hover:text-gray-300">
              DNA
            </a>
          </div>
        </div>
      </footer> */}
    </main>
  );
}
