'use client';

import { ReactNode } from 'react';

interface LocationInfoProps {
  place: string;
  city: string;
  date: string;
  mapEmbedUrl: string;
  scheduleItems: ReactNode;
}

/**
 * A reusable component for displaying wedding location and schedule information in a Netflix-styled UI
 * @param place - The venue name and address
 * @param city - The city name
 * @param date - The event date
 * @param mapEmbedUrl - Google Maps embed URL
 * @param scheduleItems - React nodes for schedule items
 */
const LocationInfo = ({ place, city, date, mapEmbedUrl, scheduleItems }: LocationInfoProps) => {
  return (
    <div className="p-4 bg-[#27272A] rounded-md">
      {/* Map iframe */}
      <iframe 
        src={mapEmbedUrl} 
        width="376" 
        height="333" 
        style={{ paddingBottom: '8px' }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      
      {/* Location details */}
      <div className="flex flex-col items-start gap-y-4 text-white geist-font p-2">
        <div className="flex items-start gap-x-2">
          <span className="text-base text-[#9CA3AF] geist-font">Place:</span>
          <p className="text-base geist-font">
            {place}, <span className="text-base text-[#9CA3AF] geist-font">{city}</span>
          </p>
        </div>
        
        <div className="flex items-start gap-x-2">
          <span className="text-base text-[#9CA3AF] geist-font">Date:</span>
          <p className="text-base geist-font">{date}</p>
        </div>
        
        {/* Schedule section */}
        <div className="flex flex-col items-start gap-y-3 pt-3 text-white geist-font w-full">
          <h3 className="font-medium text-lg geist-font">Schedule</h3>
          <div className="flex flex-col gap-y-4 items-center w-full">
            {scheduleItems}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;