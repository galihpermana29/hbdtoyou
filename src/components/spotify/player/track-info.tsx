'use client';

export default function PlayerTrackInfo({ imageUri }: { imageUri?: string }) {
  return (
    <div className="flex items-center gap-2 md:gap-4 w-[30%] min-w-[120px]">
      <img
        src={
          imageUri
            ? imageUri
            : 'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg'
        }
        alt="Now playing"
        className="h-10 w-10 md:h-14 md:w-14 rounded object-cover"
      />
      <div className="xs:block">
        <h4 className="text-sm font-semibold text-white">Play this song</h4>
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
        'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
      location: 'At Jokopi, Malang, Indonesia',
    },
  ],
};
