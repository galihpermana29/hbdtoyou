'use client';

interface PlaylistRowProps {
  playlist: {
    title: string;
    subtitle: string;
    image: string;
  };
}

export default function PlaylistRow({ playlist }: PlaylistRowProps) {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[400px]">
      <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-[#282828] transition group">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="h-12 w-12 rounded"
        />
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-white line-clamp-1">
            {playlist.title}
          </h3>
          <p className="text-sm text-neutral-400">{playlist.subtitle}</p>
        </div>
      </button>
    </div>
  );
}
