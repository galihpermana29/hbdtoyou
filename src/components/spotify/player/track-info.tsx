'use client';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

export default function PlayerTrackInfo({ imageUri }: { imageUri?: string }) {
  return (
    <div className="flex items-center gap-2 md:gap-4 w-[30%] min-w-[120px]">
      <img
        src={
          imageUri
            ? imageUri
            : 'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/Classy_Spring_Workwear_2026_Light_Aesthetic_Business_Casual_Outfits_Women_wefqc5.jpg'
        }
        alt="Now playing"
        className="h-9 w-9 md:h-14 md:w-14 rounded object-cover"
      />
      <div className="xs:block">
        <h4 className="text-xs font-semibold text-white">Now Playing</h4>
        <p className="text-xs text-neutral-400">By Me</p>
      </div>
    </div>
  );
}

export const dataForm = {
  ourSongs: ['string1', 'string2', 'string3'],
  songsForYou: ['string1', 'string2', 'string3'],
  momentOfYou: [
    {
      imageUrl:
        'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/Classy_Spring_Workwear_2026_Light_Aesthetic_Business_Casual_Outfits_Women_wefqc5.jpg',
      location: 'At Jokopi, Malang, Indonesia',
    },
  ],
};
