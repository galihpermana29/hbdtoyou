'use client';

import Image from 'next/image';

interface PersonCardProps {
  name: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * A reusable component for displaying person profiles (bride, groom, etc.) in a Netflix-styled UI
 * @param name - The person's name
 * @param description - Description text (e.g., "Putri dari Bapak X & Ibu Y")
 * @param imageSrc - Source URL for the person's image
 * @param imageAlt - Alt text for the person's image
 */
const PersonCard = ({ name, description, imageSrc, imageAlt = 'Person image' }: PersonCardProps) => {
  return (
    <div className="flex flex-col gap-y-3 w-[194px]">
      {/* Person image or placeholder */}
      <div className="w-full h-[242px] bg-yellow-300 rounded-md relative overflow-hidden">
        {imageSrc && (
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        )}
      </div>
      
      {/* Person details */}
      <div className="flex flex-col gap-y-2 items-start">
        <h2 className="font-bold text-xl text-white">{name}</h2>
        <p className="text-[#9CA3AF] text-base">{description}</p>
      </div>
    </div>
  );
};

export default PersonCard;