import Image from "next/image";
import NetflixButton from "@/components/netflix/NetflixButton";
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import dayjs from 'dayjs';

interface SecondTemplateProps {
  data?: any;
}

const SecondTemplate = ({ data }: SecondTemplateProps) => {
  return (
    <div className="w-[1080px] mx-auto h-[1920px] bg-black overflow-hidden relative">
      <div className="w-full relative">
        <div className="relative w-full">
          <Image src={data?.images?.[0] || '/instagram-template-example.svg'} width='0' className="w-full object-cover" height={1041} alt="Instagram Template Example" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="flex items-center justify-between p-6 absolute top-0 left-0 right-0">
          <div className="flex items-center gap-x-3">
            <Image src='/Nikahfix.svg' width={25} height={45} alt="Nikahfix Logo" className="mr-5" />
            <p className="text-white geist-font text-[32px] leading-5">DOCUMENTER</p>
          </div>
          <div className="flex items-center gap-x-[23px]">
            <Image src='/Screencast.svg' width={40} height={40} alt="Screencast" />
            <Image src='/MagnifyingGlass.svg' width={40} height={40} alt="Magnifying Glass" />
          </div>
        </div>
        <div className="flex items-center justify-between max-w-[713px] w-full absolute top-[132px] left-1/2 right-1/2 -translate-x-1/2">
          <p className="text-white geist-font text-[32px] leading-[120%] font-normal uppercase">Tv Shows</p>
          <p className="text-white geist-font text-[32px] leading-[120%] font-normal uppercase">Movies</p>
          <p className="text-white geist-font text-[32px] leading-[120%] font-normal uppercase">Categories</p>
        </div>
        <div className="flex flex-col justify-center w-full absolute gap-y-[35px] px-12 py-6 top-[794px]">
          <div className="flex flex-col items-center justify-center gap-y-5">
            <div className="flex flex-col gap-y-2 text-center">
              <p className="geist-font font-bold text-[64px] leading-[120%] text-white">{data?.llm_generated?.name}</p>
              <div className="flex items-center justify-center gap-x-1">
                <p className="geist-font font-normal text-[28px] leading-[18px] text-white">Thriller</p>
                <p className="geist-font font-normal text-[28px] leading-[18px] text-white">•</p>
                <p className="geist-font font-normal text-[28px] leading-[18px] text-white">Comedy</p>
                <p className="geist-font font-normal text-[28px] leading-[18px] text-white">•</p>
                <p className="geist-font font-normal text-[28px] leading-[18px] text-white">Action</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <NetflixButton
              variant="textBlack"
              className="!px-6 !py-3 !h-fit"
              icon={
                <div className="shrink-0 bg-black">
                  <Image
                    src="/CalendarIcon.svg"
                    width={20}
                    height={20}
                    alt="Calendar Icon"
                  />
                </div>
              }>
              {dayjs(data?.llm_generated?.graduationDate).format('D MMMM YYYY')}
            </NetflixButton>
            <NetflixButton
              variant="secondary"
              className="!px-6 !py-3 !h-fit"
              icon={
                <Image
                  src="/LocationIcon.svg"
                  width={20}
                  height={20}
                  alt="Location Icon"
                />
              }>
              {data?.university}
            </NetflixButton>
          </div>
          <div className="flex items-center justify-center gap-x-4">
            <p className="geist-font font-normal text-2xl text-[#A4A4A4]">Collaboration Photographer</p>
            <div className="flex items-center gap-x-2 p-0.5 rounded-md bg-[#525252] border-solid border border-[#838383] h-fit w-fit">
              <Image
                src="/memologonetflix.svg"
                width={72}
                height={72}
                alt="Memo Logo Netflix"
              />
              <span className="text-[32px] font-semibold text-white">&</span>
              <CameraEnhanceIcon
                sx={{ fontSize: 72, color: 'white' }}
              />
            </div>
            <p className="geist-font font-semibold text-2xl text-white">{data?.llm_generated?.photographer}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-8 absolute top-[1237px]">
        <p className="geist-font font-bold text-[32px] leading-[28.9px] tracking-[-0.36px] text-white px-12">Top 10 Gallery Today</p>
        <div className="flex items-center gap-x-[5.79px] pl-6 w-fit">
          {data?.images?.map((image: string, index: number) => (
            <div className="relative w-[245px] h-[230px] flex justify-end items-end" key={index}>
              {/* Number first in DOM order so it appears behind the image */}
              <span className="geist-font text-[196px] font-extrabold absolute bottom-0 leading-[159.2px] tracking-[-0.36px] left-3 text-transparent" style={{ WebkitTextStroke: '2px white' }}>{index + 1}</span>
              {/* Image after number in DOM order so it appears on top */}
              <div className="relative w-[160px] h-[230px] rounded-xl overflow-hidden">
                <Image src={image} width={160} height='0' alt="Gallery Image" className="object-cover rounded-xl h-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-y-8 absolute top-[1602px]">
        <p className="geist-font font-bold text-[32px] leading-[28.9px] tracking-[-0.36px] text-white px-12">Our Gallery</p>
        <div className="flex items-center gap-x-6 pl-12 w-fit">
          {data?.images?.map((image: string, index: number) => (
            <div className="w-[235px] h-[368px] relative bg-[#232323] overflow-hidden rounded-xl" key={`gallery-${index}`}>
              <div className="w-full h-full relative">
                <Image src={image} width={235} height={368} alt="Gallery Image" className="w-full h-full object-cover object-center" />
                <div className="absolute top-[17px] left-[17px]">
                  <Image src='/Nikahfix.svg' width={25} height={45} alt="Nikahfix Logo" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondTemplate;
