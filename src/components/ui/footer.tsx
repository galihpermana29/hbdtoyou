'use client';

import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="young-serif-regular text-[22px]">Memoify</span>
          </div>
          <p className="text-gray-400">
            Add personal touches and let your memories shine!
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <a
                href="mailto:contact@company.com"
                className="hover:text-gray-300">
                memoify.live@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <a href="tel:+6289621490655" className="hover:text-gray-300">
                62895383233303
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>Batam, Kepulauan Riau</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/photobox" className="hover:text-gray-300">
                Photobox
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-gray-300">
                Browse Templates
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gray-300">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com/memoify.live"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
