'use client';

import { Camera } from 'lucide-react';
import { projects } from '../graduationv1/page';

const heightClasses = ['h-[300px]', 'h-[700px]'];
const totalItems = projects.length || 0; // Get the total number of items
const midIndex = Math.ceil(totalItems / 2); // Calculate the middle index

export default function Graduationv2Page() {
  return (
    <main className="min-h-screen p-2 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar - Fixed on scroll */}
        <div className="md:fixed md:w-[300px] space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6" />
              <h1 className="text-xl font-medium">Memoify</h1>
            </div>
            <p className="text-sm text-gray-600">Galih Permana</p>
            <p className="text-sm text-gray-600">
              Universitas Brawijaya - Faculty of Computer and Science - Computer
              Engineering
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
                    randomHeightClass === 'h-[300px]'
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
  );
}
