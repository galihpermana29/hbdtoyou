import { getAllTemplates } from '@/action/user-api';
import NewTemplates from '@/components/newlanding/NewTemplates';
import NavigationBar from '@/components/ui/navbar';
import Link from 'next/link';

const templates = [
  {
    id: 1,
    name: 'Netflix v1',
    label: 'free',
    thumbnail_uri:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735569040/db4lflw3rz2oou05a6gx.png',
  },
  {
    id: 2,
    name: 'Spotify v1',
    label: 'premium',
    thumbnail_uri:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735569034/iqfshzifagwsyggwgizh.png',
  },
  {
    id: 2,
    name: 'Disney+ v1',
    label: 'premium',
    thumbnail_uri:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735569034/yljqxtimvwbdasyp7ljn.png',
  },
];

const MoreTemplatesPage = async () => {
  const data = await getAllTemplates();
  return (
    <div className="">
      <NewTemplates data={data.success ? data.data : []} />
      {/* <NavigationBar />
      <div className="py-[30px] px-[13px] lg:px-[40px]">
        <h1 className="text-center font-bold text-[22px] lg:text-[30px] mb-[30px]">
          Try More Templates
        </h1>
        <div className="flex justify-center">
          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-[10px]  justify-items-center lg:max-w-[90%]">
            {data
              ? data.data?.map((show, idx) =>
                  show.label !== 'pending' ? (
                    <Link
                      key={idx}
                      // split netflix - netflixv1
                      href={`/${show.name.split('-')[1].split(' ')[1]}`}>
                      <div className="bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group max-w-[400px] ">
                        <div className="mb-4 relative">
                          <img
                            src={show.thumbnail_uri}
                            alt={show.name}
                            className="w-full aspect-video object-cover rounded-md"
                          />
                        </div>
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">
                          {show.name?.split('-')[0]}
                        </h3>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={idx}
                      // split netflix - netflixv1
                    >
                      <div className="bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group max-w-[400px] ">
                        <div className="mb-4 relative">
                          <img
                            src={show.thumbnail_uri}
                            alt={show.name}
                            className="w-full aspect-video object-cover rounded-md object-top"
                          />
                        </div>
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">
                          {show.name?.split('-')[0]}
                        </h3>
                      </div>
                    </div>
                  )
                )
              : 'No data'}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default MoreTemplatesPage;
