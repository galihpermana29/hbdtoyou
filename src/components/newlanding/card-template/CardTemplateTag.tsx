import { IAllTemplateResponse } from '@/action/interfaces';
import Link from 'next/link';
import netflixv1 from '@/assets/templates/netflixv1.png';
import disneyplusv1 from '@/assets/templates/disneyv1.png';
import spotifyv1 from '@/assets/templates/spotifyv1.png';
import newspaperv1 from '@/assets/templates/newspaperv1.png';
import newspaperv3 from '@/assets/templates/newspaperv3.png';
import magazine from '@/assets/templates/magazine.png';
import formula1 from '@/assets/templates/formula1.png';
import graduation from '@/assets/templates/graduation.png';
import journal from '@/assets/templates/scopus.png';
import scrapbookv1 from '@/assets/templates/scrapbookv1.jpg';
import clsx from 'clsx';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import checkIcon from '@/assets/check-icon.png';

export const DataToCardColor = {
  netflixv1: {
    color: 'bg-[#D9182133]',
    logo: netflixv1,
    text: 'text-[#D81F26]',
  },
  disneyplusv1: {
    color: 'bg-[#444CE733]',
    logo: disneyplusv1,
    text: 'text-[#01147C]',
  },
  spotifyv1: {
    color: 'bg-[#1ED76033]',
    logo: spotifyv1,
    text: 'text-[#1ED760]',
  },
  newspaperv1: {
    color: 'bg-[#e4e4e4]',
    logo: newspaperv1,
    text: 'text-[#505050]',
  },
  newspaperv3: {
    color: 'bg-[#000000d4]',
    logo: newspaperv3,
    text: 'text-[#000000]',
  },
  f1historyv1: {
    color: 'bg-[#BB1E1E33]',
    logo: formula1,
    text: 'text-[#BB1E1E]',
  },
  magazinev1: {
    color: 'bg-[#111111f2]',
    logo: magazine,
    text: 'text-[#f0dd2b]',
  },
  graduationv1: {
    color: 'bg-[#e7ff9db3]',
    logo: graduation,
    text: 'text-[#a2c048]',
  },
  graduationv2: {
    color: 'bg-[#E4E4E433]',
    logo: graduation,
    text: 'text-[#9a9a9a]',
  },
  journal: {
    color: 'bg-[#fff]',
    logo: journal,
    text: 'text-[#000]',
  },
  scrapbookv1: {
    color: 'bg-[#651B05cf]',
    logo: scrapbookv1,
    text: 'text-[#651B05]',
  },
  scrapbookvintage: {
    color: 'bg-[#651B05cf]',
    logo: scrapbookv1,
    text: 'text-[#651B05]',
  },
};

const CardTemplateTag = ({
  data,
  type = 'preview',
}: {
  data: IAllTemplateResponse;
  type?: 'creation' | 'preview';
}) => {
  return (
    <div>
      <div
        className={clsx(
          'p-[24px] transition cursor-pointer group min-h-[400px] flex flex-col justify-between bg-[#F9FAFB] rounded-[8px] border-[1px] border-[#EAECF0]',
          type === 'preview'
            ? 'w-[350px] md:w-[400px]'
            : 'w-full max-w-[350px] md:max-w-[400px]'
        )}>
        <div className="flex items-center justify-between h-[50px]">
          {DataToCardColor[data.name.split('-')[1]?.split(' ')[1]]?.logo && (
            <Image
              src={
                DataToCardColor[data.name.split('-')[1]?.split(' ')[1]]
                  ?.logo as string
              }
              alt={data.name}
              className="mr-2 max-w-[100px]"
            />
          )}
          <div className="flex items-center gap-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}>
              <Link
                target="_blank"
                // split netflix - netflixv1
                href={`/${data.name.split('-')[1]?.split(' ')[1]}`}>
                <h1
                  className={clsx(
                    'text-[18px] font-[600] hover:underline',
                    DataToCardColor[data.name.split('-')[1]?.split(' ')[1]]
                      ?.text
                  )}>
                  See Preview
                </h1>
              </Link>
            </div>

            <ArrowRight
              size={24}
              className={clsx(
                DataToCardColor[data.name.split('-')[1]?.split(' ')[1]]?.text
              )}
            />
          </div>
        </div>
        <div className="mt-[16px]">
          <img
            src={data.thumbnail_uri}
            alt={data.name}
            className="w-full aspect-video object-cover rounded-md"
          />
        </div>
        <div className="mt-[16px]">
          <h1 className="mb-[12px] text-[12px] font-semibold">
            Template specs:
          </h1>
          <div className="flex flex-col gap-2">
            {[data.label, ...(data?.tag || [])]?.map((dx) => {
              return (
                <div className="flex items-center gap-2" key={dx}>
                  <Image src={checkIcon} alt="check" />
                  <p className="text-[12px] font-normal capitalize">{dx}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplateTag;
