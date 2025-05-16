'use client';

import dayjs from 'dayjs';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto border border-black">
        {/* Header Section */}
        <div className="border-b border-black p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-serif">SPECIAL EDITION</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-center">
              The 1975
            </h1>
            <div className="text-sm font-serif">DAILY REPORT</div>
          </div>
        </div>

        {/* Subheader */}
        <div className="border-b border-black p-2 flex justify-between items-center text-sm font-serif">
          <div>DIRTY HIT RECORDS</div>
          <div>BEING FUNNY IN FOREIGN LANGUAGE</div>
          <div>{dayjs().format('DD MMM YYYY')}</div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-center">
            ABOUT YOU
          </h2>

          {/* Image Section */}
          <div className="relative w-full h-[300px] md:h-[500px] mb-6">
            <Image
              src="https://res.cloudinary.com/dxuumohme/image/upload/v1735834469/tccbqffnucbsyeeioutb.jpg"
              alt="Black and white landscape view"
              fill
              className="object-cover object-center filter grayscale"
              priority
            />
          </div>

          {/* Quote */}
          <div className="text-xl md:text-2xl font-serif text-center mb-8">
            {`"DO YOU THINK I HAVE FORGOTTEN ABOUT YOU?"`}
          </div>

          {/* Text Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif text-sm leading-relaxed">
            <div>
              {`I know a place. It's where I go when I need to remember your face.
              We get married in our heads. Something to do while we try to
              recall how we met. Do you think I have forgotten? Do you think I
              have forgotten? Do you think I have forgotten about you? You and I
              (don't let go) were alive (don't let go). With nothing to do, I
              could lay and just look in your eyes. Wait, and pretend (don't let
              go).`}
            </div>
            <div>
              {`Hold on and hope that we'll find our way back in the end. Do you
              think I have forgotten? Do you think I have forgotten? Do you
              think I have forgotten, about you? Do you think I have forgotten?
              Do you think I have forgotten? Do you think I have forgotten,
              about you? There was something 'bout you that now I can't
              remember.`}
            </div>
            <div>
              {`It's the same damn thing that made my heart surrender. And I miss
              you on a train, I miss you in the morning. I never know what to
              think about. I think about you. About you (so don't let go). Do
              you think I have forgotten. About you? (Don't let go). About you.
              About you. Do you think I have forgotten, about you?`}
            </div>
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
