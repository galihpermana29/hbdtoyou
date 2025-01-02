'use client';

import { Search } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="flex flex-wrap justify-center items-center space-x-4 py-4 border-t border-b">
      <a href="#" className="hover:text-gray-600">
        HOME
      </a>
      <a href="#" className="hover:text-gray-600">
        POLITICS
      </a>
      <a href="#" className="hover:text-gray-600">
        TECHNOLOGY
      </a>
      <a href="#" className="hover:text-gray-600">
        SPORTS
      </a>
      <a href="#" className="hover:text-gray-600">
        FASHION
      </a>

      <button className="hover:text-gray-600">
        <Search size={20} />
      </button>
    </nav>
  );
}
