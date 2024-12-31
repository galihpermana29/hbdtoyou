'use client';

interface PlaylistRowProps {
  playlist: {
    title: string;
    subtitle: string;
    image: string;
  };
}

export default function PlaylistRow({ playlist }: { playlist?: string }) {
  return (
    <div className="flex-shrink-0 w-full md:w-[300px]">
      <iframe
        src={`https://open.spotify.com/embed/track/${
          playlist ? playlist : '4s5B70nF4StXSaCwP6C0AU'
        }`}
        height={80}
        className="w-full"></iframe>
      {/* <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-[#282828] transition group">
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
      </button> */}
    </div>
  );
}
