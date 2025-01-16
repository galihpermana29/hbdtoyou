import { Camera } from 'lucide-react';
import Image from 'next/image';

const heightClasses = ['h-[400px]', 'h-[700px]'];

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

const totalItems = projects.length || 0; // Get the total number of items
const midIndex = Math.ceil(totalItems / 2); // Calculate the middle index

export default function Graduationv2Page() {
  return (
    <div>
      <main className="min-h-screen p-2 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Fixed on scroll */}
          <div className="md:fixed md:w-[300px] space-y-8">
            <a
              target="_blank"
              href="https://memoify.live"
              className="hover:text-gray-300 text-sm md:text-base">
              <Image
                src={
                  'https://res.cloudinary.com/dxuumohme/image/upload/v1737048992/vz6tqrzgcht45fstloxc.png'
                }
                alt="asd"
                width={60}
                height={60}
                priority
              />
            </a>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Camera className="w-6 h-6" />
                <h1 className="text-lg font-medium">Memoify</h1>
              </div>
              <p className="text-sm text-gray-600">Galih Permana</p>
              <p className="text-sm text-gray-600">
                Universitas Brawijaya - Faculty of Computer and Science -
                Computer Engineering
              </p>
            </div>

            <footer className="mt-12 text-xs text-gray-400">
              © 2025 - Template by Memoify
            </footer>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4 md:col-start-2 col-start-1">
            <div className="grid gap-2 md:gap-4">
              {projects.slice(0, midIndex).map((project, idx) => {
                const randomHeightClass =
                  idx % 2 === 0 ? heightClasses[0] : heightClasses[1];
                return (
                  <div
                    className={`${
                      randomHeightClass === 'h-[400px]'
                        ? 'row-span-1'
                        : 'row-span-2'
                    }`}
                    key={project.id}>
                    <img
                      className={`${randomHeightClass} w-full object-cover rounded-lg`}
                      src={project.image}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
            <div className="grid gap-2 md:gap-4">
              {projects.slice(midIndex).map((project, idx) => {
                const randomHeightClass =
                  idx % 2 === 0 ? heightClasses[1] : heightClasses[0];
                return (
                  <div
                    className={`${
                      randomHeightClass === 'h-[700px]'
                        ? 'row-span-1'
                        : 'row-span-2'
                    }`}
                    key={project.id}>
                    <img
                      className={`${randomHeightClass} w-full object-cover rounded-lg`}
                      src={project.image}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
