import { getDetailContent } from '@/action/user-api';
import dayjs from 'dayjs';
import Image from 'next/image';
const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};
export default async function Home({ params }: { params: any }) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  console.log(parsedData, '?');
  return (
    <main className="min-h-screen bg-white p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto border border-black">
        {/* Header Section */}
        <div className="border-b border-black p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-serif">SPECIAL EDITION</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-center">
              NIKI
            </h1>
            <div className="text-sm font-serif">DAILY REPORT</div>
          </div>
        </div>

        {/* Subheader */}
        <div className="border-b border-black p-2 flex justify-between items-center text-sm font-serif">
          <div>88 RISING MUSIC</div>
          <div>NICOLE</div>
          <div>{dayjs().format('DD MMM YYYY')}</div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-center">
            TAKE A CHANCE WITH ME
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
          <div className="text-xl md:text-2xl font-serif text-center mb-8">
            {` "WHY CAN'T WE FOR ONCE, SAY WHAT WE WANT, SAY WHAT WE FEEL?"`}
          </div>

          {/* Text Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif text-sm leading-relaxed">
            {parsedData?.desc1 ? (
              parsedData.desc1
            ) : (
              <div>
                {` His laugh you'd die for, his laugh you'd die for The kind that
                colors the sky Heart intangible, slips away faster than
                Dandelion fluff in the sunlight And he's got swirls of passion
                in his eyes Uncoverin' the dreams, he dreams at night As much
                and hard as he tries to hide I can see right through, see right
                through His voice you'd melt for, he says my name like I'd fade
                away somehow if he's too loud What I would give for me to get my
                feet Back on the ground, head off the clouds I laugh at how
                we're polar opposites I read him like a book, and he's a
                clueless little kid Doesn't know that I'd stop time and space
                Just to make him smile, make him smile Oh, why can't we for once
                Say what we want, say what we feel? Oh,`}
              </div>
            )}
            {parsedData?.desc2 ? (
              parsedData.desc2
            ) : (
              <div>
                {`why can't you for once Disregard the world, and run to what you
                know is real? Take a chance with me, take a chance with me
                Ooh-ooh, ooh-ooh Ooh-ooh, ooh-ooh His kiss you'd kill for, just
                one and you're done for Electricity surgin' in the air He drives
                me crazy, it's so beyond me How he'd look me dead in the eye and
                stay unaware That I'm hopelessly captivated By a boy who thinks
                love's overrated How did I get myself in this arrangement? It
                baffles me, too, baffles me, too Oh, why can't we for once Say
                what we want, say what we feel? Oh, why can't you for once
                Disregard the world, and run to what you know is real?`}
              </div>
            )}
            {parsedData?.desc3 ? (
              parsedData.desc3
            ) : (
              <div>
                {`In the end we only regret the chances we didn't take I'll be
                your safety net, so why not raise the stakes? And I can hear
                your heart from across the room Pulsin' through my veins, I know
                you need this too Lie to me all you please, I can see right
                through See right through Oh, why can't we for once Say what we
                want, say what we feel? Oh, why can't you for once Disregard the
                world, and run to what you know is real? Oh, why can't we for
                once Say what we want, say what we feel? Oh, why can't you for
                once Disregard the world, and run to what you know is real? Take
                a chance with me, take a chance with me Ooh-ah, oh-oh, oh`}
              </div>
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
