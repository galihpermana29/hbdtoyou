'use client';

export default function PlayerTrackInfo() {
  return (
    <div className="flex items-center gap-2 md:gap-4 w-[30%] min-w-[120px]">
      <img
        src="https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg"
        alt="Now playing"
        className="h-10 w-10 md:h-14 md:w-14 rounded"
      />
      <div className="hidden xs:block">
        <h4 className="text-sm font-semibold text-white">Song Title</h4>
        <p className="text-xs text-neutral-400">Artist Name</p>
      </div>
    </div>
  );
}
