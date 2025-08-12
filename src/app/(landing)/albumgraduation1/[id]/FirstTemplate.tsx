import Image from "next/image";
import NetflixButton from "@/components/netflix/NetflixButton";
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import dayjs from 'dayjs';

interface FirstTemplateProps {
  data?: any;
}

const FirstTemplate = ({ data }: FirstTemplateProps) => {
  return (
    <div id="first-template" className="w-[1080px] mx-auto h-[1920px] bg-black overflow-hidden relative">
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
        <div className="flex flex-col w-full absolute gap-y-[35px] px-12 py-6 top-[794px]">
          <div className="flex flex-col items-center justify-center gap-y-5">
            <div className="flex flex-col gap-y-2 text-center">
              <p className="geist-font font-bold text-[64px] leading-[120%] text-white">{data?.llm_generated?.name}</p>
              <p className="geist-font font-normal text-[24px] text-white">{data?.llm_generated?.subtitle}</p>
            </div>
            <div className="flex items-center gap-x-2 text-white">
              <span className="text-[#22C55E] font-medium max-md:text-sm md:text-base geist-font">
                100% match
              </span>
              <div className="w-[39px] h-[22px] px-[11px] py-[3px] bg-[#4B5563] rounded-full flex items-center justify-center font-semibold text-xs geist-font">
                SU
              </div>
              <span className="text-base max-md:text-sm md:text-base geist-font">
                2025
              </span>
              <span className="text-base max-md:text-sm md:text-base geist-font">
                16:00 WIB - Drop
              </span>
              <Image
                width={20}
                height={20}
                alt="4k full hd icon"
                src="/4KIcon.svg"
              />
              <Image
                width={20}
                height={20}
                alt="4k full hd icon"
                src="/HDIcon.svg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <NetflixButton
              variant="primary"
              className="!px-6 !py-3 !h-10"
              icon={
                <Image
                  src="/CalendarIcon.svg"
                  width={20}
                  height={20}
                  alt="Calendar Icon"
                />
              }>
              {dayjs(data?.llm_generated?.graduationDate).format('D MMMM YYYY')}
            </NetflixButton>
            <NetflixButton
              variant="secondary"
              className="!px-6 !py-3 !h-10"
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
        </div>
      </div>
      <p className="geist-font font-bold text-[40px] leading-8 text-white px-12 absolute top-[1186px]">Our Gallery</p>
      <div className="flex items-center gap-x-6 w-fit left-1/2 -translate-x-1/2 right-1/2 absolute top-[1262px]">
        {data?.images?.map((image: string, index: number) => (
          <div key={index} className="w-[235px] h-[368px] relative rounded-xl overflow-hidden bg-[#232323]">
            <div className="w-full h-full relative">
              <div
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%'
                }}
                role="img"
                aria-label="Gallery Image"
              />
              <div className="absolute top-[17px] left-[17px]">
                <Image src='/Nikahfix.svg' width={25} height={45} alt="Nikahfix Logo" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-4 text-center justify-center items-center absolute top-[1682px] left-1/2 -translate-x-1/2 right-1/2 w-full">
        <p className="geist-font font-normal text-2xl text-[#A4A4A4]">Collaboration Photographer</p>
        <div className="flex items-center gap-x-2 p-0.5 rounded-md bg-[#525252] border-solid border border-[#838383] h-fit w-fit">
          <Image
            src="/memologonetflix.svg"
            width={72}
            height={72}
            alt="Memo Logo Netflix"
          />
          <span className="text-base font-semibold text-white">&</span>
          <CameraEnhanceIcon
            sx={{ fontSize: 72, color: 'white' }}
          />
        </div>
        <p className="geist-font font-semibold text-2xl text-white">{data?.llm_generated?.photographer}</p>
      </div>
    </div>
  );
};

export default FirstTemplate;
