'use client';
import { PhotoView } from 'react-photo-view';
interface PlaylistCardProps {
  playlist: {
    title: string;
    description: string;
    image: string;
  };
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group">
      <div className="mb-4 relative">
        <PhotoView src={playlist.image}>
          <img
            src={playlist.image}
            alt={playlist.title}
            className="w-full aspect-square object-cover rounded-md"
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
