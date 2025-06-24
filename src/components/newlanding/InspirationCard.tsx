import { Tag } from 'antd';
import { Link2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

export const InspirationCard = ({ data }: { data: any }) => {
  // Generate a random aspect ratio for each card to create the masonry effect
  // This ensures the aspect ratio is consistent between renders
  const aspectRatio = useMemo(() => {
    // Use the data id or some unique property to generate a consistent random value
    const seed = data?.id || data?.title || Math.random().toString();

    // Create a hash from the seed string for more randomness
    const hash = seed
      .toString()
      .split('')
      .reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);

    // Use the absolute value of the hash
    const positiveHash = Math.abs(hash);

    // More diverse aspect ratio options - from tall to square to slightly wide
    const aspectRatioOptions = [
      '2/3', // Tall portrait
      '3/4', // Portrait
      '4/5', // Portrait
      '5/6', // Portrait
      '7/8', // Portrait
      '8/9', // Nearly square
      '1/1', // Square
      '9/10', // Nearly square
      '9/16', // Standard portrait video
    ];

    // Select an aspect ratio based on the hash
    const index = positiveHash % aspectRatioOptions.length;
    return aspectRatioOptions[index];
  }, [data?.id, data?.title]);
  return (
    <Link href={`https://memoify.live${data?.link}`} target="_blank">
      <div className="group relative overflow-hidden rounded-lg cursor-pointer">
        {/* Image */}
        <div className="w-full">
          <Image
            className="w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            style={{ aspectRatio }}
            src={
              typeof data?.jumbotronImage === 'string'
                ? data?.jumbotronImage
                : 'https://res.cloudinary.com/ddlus5qur/image/upload/v1746085724/phu2rbi6fqnp71hytjex.jpg'
            }
            alt={data?.title || 'Inspiration image'}
            width={700}
            height={900}
          />
        </div>

        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {/* Title and author */}
            <h1 className="text-[12px] text-white font-[600] mb-1">
              {data?.title}
            </h1>
            {/* <p className="text-white/80 font-[400] text-[14px] mb-2">
            By {data?.user_name}
          </p> */}

            {/* Tags */}
            {/* <div className="flex gap-1 mb-2">
              <Tag color="cyan">{data?.type}</Tag>
              <Tag color="blue" className="capitalize">
                {data?.template_label}
              </Tag>
            </div> */}

            {/* Link */}
            {/* <Link
              target="_blank"
              className="text-[14px] font-[500] text-white hover:text-[#E34013] flex items-center gap-2"
              href={`https://memoify.live${data?.link}`}>
              <Link2 size={16} />
              View
            </Link> */}
          </div>
        </div>
      </div>
    </Link>
  );
};
