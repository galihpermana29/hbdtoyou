'use client';
import { PhotoView } from 'react-photo-view';
interface PlaylistCardProps {
  playlist: {
    title: string;
    description: string;
    image: string;
  };
  compact?: boolean;
}

export default function PlaylistCard({
  playlist,
  compact = false,
}: PlaylistCardProps) {
  if (compact) {
    return (
      <>
        <PhotoView src={playlist.image}>
          <img
            src={playlist.image}
            alt=""
            className="h-11 w-11 shrink-0 rounded object-cover shadow"
          />
        </PhotoView>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-white">
            {playlist.title}
          </h3>
          <p className="truncate text-xs text-white/45">
            {playlist.description || 'A moment worth replaying'}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="group cursor-pointer rounded-lg bg-[#181818] p-3 transition duration-300 hover:-translate-y-1 hover:bg-[#282828] md:p-4">
      <div className="mb-4 relative">
        <PhotoView src={playlist.image}>
          <img
            src={playlist.image}
            alt={playlist.title}
            className="aspect-square w-full rounded-md object-cover shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </PhotoView>
      </div>
      <h3 className="font-semibold text-white mb-1 line-clamp-1">
        {playlist.title}
      </h3>
      <p className="text-sm text-neutral-400 line-clamp-2">
        {playlist.description}
      </p>
    </div>
  );
}
