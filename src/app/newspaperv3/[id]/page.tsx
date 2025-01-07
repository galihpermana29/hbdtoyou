import { getDetailContent } from '@/action/user-api';
import { v3Songs } from '@/lib/songs';
import dayjs from 'dayjs';
import Image from 'next/image';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

function splitTextIntoColumns(text: string, numCols = 3) {
  const words = text.split(/\s+/); // Split text into words
  const totalLength = words.length;
  const colLength = Math.ceil(totalLength / numCols); // Approx. number of words per column
  const columns = [];

  for (let i = 0; i < numCols; i++) {
    const start = i * colLength;
    const end = start + colLength;
    columns.push(words.slice(start, end).join(' ')); // Join words back into a chunk
  }

  return columns;
}

export default async function Home({ params }: { params: any }) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  const selectedSongs = v3Songs.find((dx) => dx.id === parsedData.id);

  const contents = splitTextIntoColumns(parsedData.desc1);
  const defaultContents = splitTextIntoColumns(selectedSongs!.lyrics);
  console.log(contents, '?dddd');
  return (
    <main className="min-h-screen bg-white p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto border border-black">
        {/* Header Section */}
        <div className="border-b border-black p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-serif">SPECIAL EDITION</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-center">
              {selectedSongs?.singer}
            </h1>
            <div className="text-sm font-serif">DAILY REPORT</div>
          </div>
        </div>

        {/* Subheader */}
        <div className="border-b border-black p-2 flex justify-between items-center text-sm font-serif">
          <div>{selectedSongs?.label}</div>
          <div>{selectedSongs?.album}</div>
          <div>{dayjs().format('DD MMM YYYY')}</div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-center uppercase">
            {selectedSongs?.title}
          </h2>

          {/* Image Section */}
          <div className="relative w-full h-[300px] md:h-[500px] mb-6">
            <Image
              src={
                parsedData
                  ? parsedData?.jumbotronImage
                  : 'https://res.cloudinary.com/dxuumohme/image/upload/v1735834469/tccbqffnucbsyeeioutb.jpg'
              }
              alt="Black and white landscape view"
              fill
              className="object-cover object-center filter grayscale"
              priority
            />
          </div>

          {/* Quote */}
          <div className="text-xl md:text-2xl font-serif text-center mb-8 uppercase font-semibold">
            {`"${parsedData?.notableLyrics}"`}
          </div>

          {/* Text Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 !font-serif text-sm leading-relaxed">
            {parsedData?.desc1 ? (
              <div className="font-serif text-[15px]">{contents[0]}</div>
            ) : (
              <div className="font-serif text-[15px]">{defaultContents[0]}</div>
            )}
            {parsedData?.desc1 ? (
              <div className="font-serif text-[15px]">{contents[1]}</div>
            ) : (
              <div className="font-serif text-[15px]">{defaultContents[1]}</div>
            )}
            {parsedData?.desc1 ? (
              <div className="font-serif text-[15px]">{contents[2]}</div>
            ) : (
              <div className="font-serif text-[15px]">{defaultContents[2]}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-black p-4 flex justify-between items-center text-sm font-serif">
          <div>VOL. 1... NO. 1</div>
          <div>A916°</div>
          <div>{dayjs().format('DD MMM YYYY')}</div>
        </div>
      </div>
    </main>
  );
}
