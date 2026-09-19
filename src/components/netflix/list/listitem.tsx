import {
  PlayArrow,
  InfoOutlined,
} from '@mui/icons-material';
import Image from 'next/image';
import widya from '@/assets/widya/after/2.jpg';
import { PhotoView } from 'react-photo-view';

interface ListItemProps {
  index: number;
  data: string;
}

export default function ListItem({ index, data }: ListItemProps) {
  return (
    <article className="group relative aspect-video w-[74vw] max-w-[300px] cursor-pointer overflow-hidden rounded-md bg-neutral-900 shadow-lg transition duration-300 hover:z-10 hover:scale-[1.06] hover:shadow-2xl sm:w-[42vw] md:w-[25vw] lg:w-[19vw]">
      <PhotoView key={index} src={data ?? (widya as unknown as string)}>
        <Image
          fill
          sizes="(max-width: 640px) 74vw, (max-width: 1024px) 25vw, 19vw"
          src={data ?? widya}
          alt={`Memory ${index + 1}`}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </PhotoView>
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex w-full items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            <PlayArrow fontSize="small" />
          </span>
          <span className="text-xs font-semibold">Memory {index + 1}</span>
          <InfoOutlined className="ml-auto text-neutral-300" fontSize="small" />
        </div>
      </div>
    </article>
  );
}
