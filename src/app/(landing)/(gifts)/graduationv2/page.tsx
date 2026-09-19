'use client';

import { Dropdown } from 'antd';
import { Camera, Ellipsis } from 'lucide-react';
import Image from 'next/image';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

const heightClasses = ['h-[400px]', 'h-[700px]'];

const projects = [
  {
    id: '100100',
    title: '100100',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284276/placeholder/Business_Formal_Outfit_for_Women_kl6jkx.jpg',
  },
  {
    id: 'spyder23',
    title: 'SPYDER 23',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/Butter_Color_Dress__Elegant_Spring_Formal_Look_luzpa3.jpg',
  },
  {
    id: 'demoda',
    title: 'DEMODA',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284325/placeholder/Casual_Blazer_Outfits_for_Women___Chic_Everyday_Street_Style_Looks_bg1q3s.jpg',
  },
  {
    id: 'crisp',
    title: 'CRISP',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/City_tram_window_daydate_outfit_cwrxma.jpg',
  },
  {
    id: 'bacon',
    title: 'BACON & PEPPR',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/Classy_Spring_Workwear_2026_Light_Aesthetic_Business_Casual_Outfits_Women_wefqc5.jpg',
  },
  {
    id: 'office',
    title: 'OFFICE',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284279/placeholder/Minimalist_Black_Tee_Wide-Leg_Trousers_Outfit___Chic_Quiet_Luxury_Women_s_Fashion_2026_kiyext.jpg',
  },
  {
    id: 'chance',
    title: 'CHANCE',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/Monday_to_Friday_Business_Casual_Outfits__Your_Weekly_Wardrobe_hrpkgr.jpg',
  },
  {
    id: 'percent',
    title: '20 PERCENT',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/Polished_Spring_Workwear_2026_-_Light_Capsule_Wardrobe_Ideas_for_Modern_Women_ydbdxk.jpg',
  },
];

const totalItems = projects.length || 0; // Get the total number of items
const midIndex = Math.ceil(totalItems / 2); // Calculate the middle index

export default function Graduationv2Page() {
  async function downloadImage(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href); // Clean up memory
  }

  function getFilenameFromUrl(url: string) {
    return url.substring(url.lastIndexOf('/') + 1);
  }

  return (
    <div>
      <main className="min-h-screen p-2 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Fixed on scroll */}
          <div className="md:fixed md:w-[300px] space-y-8">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://memoify.live"
              className="hover:text-gray-300 text-sm md:text-base">
              <Image
                src={
                  'https://res.cloudinary.com/dfwrmapr4/image/upload/v1789303095/placeholder/69b085d3b98c04a8b06e3e58ecfa136e95641109_ynodbj.png'
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
                    } relative`}
                    key={project.id}>
                    <img
                      className={`${randomHeightClass} w-full object-cover rounded-lg`}
                      src={project.image}
                      alt=""
                    />
                    <div className="absolute top-[12px] right-[20px] z-[30]">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: 'Download',
                              onClick: () => {
                                downloadImage(
                                  project.image,
                                  getFilenameFromUrl(project.image)
                                );
                              },
                            },
                            {
                              key: '2',
                              label: 'Open in New Tab',
                              onClick: () => {
                                window.open(project.image, '_blank');
                              },
                            },
                          ],
                        }}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Ellipsis size={26} className="text-white" />
                        </a>
                      </Dropdown>
                    </div>
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
                    } relative`}
                    key={project.id}>
                    <img
                      className={`${randomHeightClass} w-full object-cover rounded-lg`}
                      src={project.image}
                      alt=""
                    />
                    <div className="absolute top-[12px] right-[20px] z-[30]">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: 'Download',
                              onClick: () => {
                                downloadImage(
                                  project.image,
                                  getFilenameFromUrl(project.image)
                                );
                              },
                            },
                            {
                              key: '2',
                              label: 'Open in New Tab',
                              onClick: () => {
                                window.open(project.image, '_blank');
                              },
                            },
                          ],
                        }}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Ellipsis size={26} className="text-white" />
                        </a>
                      </Dropdown>
                    </div>
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
