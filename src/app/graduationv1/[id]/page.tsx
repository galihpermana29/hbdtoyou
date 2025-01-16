import { getDetailContent } from '@/action/user-api';
import Image from 'next/image';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export default async function GraduationV1Page({ params }: { params: any }) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center p-4 md:p-6">
        <div className="flex space-x-4 md:space-x-6">
          {/* <a href="#works" className="hover:text-gray-300 text-sm md:text-base">
            xx STUDIO
          </a> */}
          <a
            target="_blank"
            href="https://memoify.live"
            className="hover:text-gray-300 text-sm md:text-base">
            MEMOIFY
          </a>
        </div>
        <button className="hover:text-gray-300 text-sm md:text-base"></button>
      </nav>

      <div className="px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-[14vw] leading-[0.9] font-bold tracking-tighter whitespace-nowrap overflow-hidden text-center uppercase">
          GRADUATION
        </h1>
        <div className="flex flex-col md:flex-row justify-between mt-4 text-xs md:text-sm space-y-2 md:space-y-0 text-center md:text-left uppercase">
          <p className="uppercase">
            {parsedData ? parsedData.university : ''}
            <br />
            {parsedData ? parsedData.faculty : ''}
          </p>
          <p className="md:text-right uppercase">
            {parsedData ? parsedData.major : ''}
            <br />
            CLASS OF {parsedData ? parsedData.yearOfGraduation : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-4 max-w-[90%] md:max-w-[97%] mx-auto">
        {parsedData?.images.map((uri: string) => (
          <div
            key={uri}
            className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg">
            <Image
              src={uri}
              alt={'images'}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="text-sm font-medium uppercase tracking-wider"></h3>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 md:px-6 py-12 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 uppercase">
          GRADUATION
          <br />
          IS JUST A START
        </h2>
        <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mt-8 overflow-hidden rounded-lg">
          <Image
            src="https://res.cloudinary.com/dxuumohme/image/upload/v1736878627/bubjbkztn7xfrxmusjtp.jpg"
            alt="Breathe life"
            fill
            className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
          />
        </div>
      </div>
    </main>
  );
}
