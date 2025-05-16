import { getDetailContent } from '@/action/user-api';
import { Camera } from 'lucide-react';
import Image from 'next/image';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export default async function Graduationv2Page({ params }: { params: any }) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);

  const totalItems = parsedData?.images.length || 0; // Get the total number of items
  const midIndex = Math.ceil(totalItems / 2); // Calculate the middle index
  const heightClasses = ['h-[300px]', 'h-[500px]'];

  return (
    <div>
      <main className="min-h-screen p-2 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Fixed on scroll */}
          <div className="md:fixed md:w-[300px] space-y-8">
            <a
              target="_blank"
              href="https://memoify.live"
              className="hover:text-gray-300 text-sm md:text-base">
              <Image
                src={
                  'https://res.cloudinary.com/dxuumohme/image/upload/v1737048992/vz6tqrzgcht45fstloxc.png'
                }
                alt="asd"
                width={60}
                height={60}
                priority
              />
            </a>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Camera className="w-6 h-6" />
                <h1 className="text-lg font-medium">Memoify</h1>
              </div>
              <p className="text-sm text-gray-600">{parsedData?.name}</p>
              <p className="text-sm text-gray-600">
                {parsedData?.university} - {parsedData?.faculty} -{' '}
                {parsedData?.major} - Class of {parsedData?.yearOfGraduation}
              </p>
            </div>

            <footer className="mt-12 text-xs text-gray-400">
              © 2025 - Template by Memoify
            </footer>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4 md:col-start-2 col-start-1">
            <div className="grid gap-2 md:gap-4">
              {parsedData?.images
                ?.slice(0, midIndex)
                .map((uri: string, idx: number) => {
                  const randomHeightClass =
                    idx % 2 === 0 ? heightClasses[0] : heightClasses[1];
                  return (
                    <div
                      className={`${
                        randomHeightClass === heightClasses[0]
                          ? 'row-span-1'
                          : 'row-span-2'
                      }`}
                      key={idx}>
                      <img
                        className={`${randomHeightClass} w-full object-cover rounded-lg border-2`}
                        src={uri}
                        alt=""
                      />
                    </div>
                  );
                })}
            </div>
            <div className="grid gap-2 md:gap-4">
              {parsedData?.images
                ?.slice(midIndex)
                .map((uri: string, idx: number) => {
                  const randomHeightClass =
                    idx % 2 === 0 ? heightClasses[1] : heightClasses[0];
                  return (
                    <div
                      className={`${
                        randomHeightClass === heightClasses[1]
                          ? 'row-span-1'
                          : 'row-span-2'
                      } `}
                      key={idx}>
                      <img
                        className={`${randomHeightClass} w-full object-cover rounded-lg`}
                        src={uri}
                        alt=""
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
