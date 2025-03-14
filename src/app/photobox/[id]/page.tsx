'use client';
import { useState } from 'react';
import PictureInFrame from '@/components/photobox/PictureFrame/PictureFrame';
import Cameragram from '@/components/photobox/Cameragram/Cameragram';
import { useParams, useRouter } from 'next/navigation';
import { FrameData, frameData } from '@/lib/frameData';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Spin } from 'antd';
import Image from 'next/image';
import NavigationBar from '@/components/ui/navbar';
export const base =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADSCAYAAADjYOp1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAO7SURBVHgB7dnNURxXGEDR7l4BK8gAZyBFYGcgZWA7AssRCDIgAysEKwMpApSByQBW/GwYv0agsiikpcXcOqeqq7tnHrvLq4/HPH3HZrPZv76+/mM8/jKuw/sL/lejw4t5nj+N+/tx/3t3d/fsW2vnpz68uro6HLe/ps8hw3PzblzHT4W9PP5g3ZHHb8LpJGaer9/GTn16eXn55vEXX+3QNzc3b29vb48m2B5HY6c+fnj5EvT9znwywZYZ3f65t7d31+5d0OvMvI4ZYxvfn2DLjG4vRr8v15n6YYZ+K2a21XoaN30+xJjm+xONfybYcjs7OwfLqPv1BAHrqccyRo1XEwQsy/LzukO/mKDhcJ2hNxNELBOECJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZOyBn02QcA8zxeCJmOz2Xxag/44QcAI+v18fn6+v7Ozcz7B9vtpOTg4uBgPHybYYsuyvNvd3T2b15erq6vDsV2fjqF6f4ItM9q9GO2+XIO+O7a7e1iW4wm20/Ha8Prw5Rx6zNEn6xcTbJHb29vjvb29k4f3+fGC6+vrN2PRW+MHz9k6ZozbVzGv5qcWrzP1iPpojCG/TvD8fBjX7w9jxn/N3/up+z8WX4/d+tW4v7Br84Oc3V8f19F4/Y/gtxb+C1dco/qqMhiPAAAAAElFTkSuQmCC';

const uploadImage = async (base64: string) => {
  const data = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64 }),
  });

  if (data.ok) {
    const dx = await data.json();
    return dx.data;
  } else {
    throw new Error('Error');
  }
};

export const initPhotos = [
  { x: 47, y: 120, width: 390, height: 516, src: base },
  { x: 518, y: 120, width: 390, height: 516, src: base },
  { x: 47, y: 732, width: 390, height: 516, src: base },
  { x: 518, y: 732, width: 390, height: 516, src: base },
];

const PhotoboxPage = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [base64Image, setBase64Image] = useState<string | null>(null); // Base64 image data
  const [loading, setLoading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<string>(null);
  const { id } = useParams();
  // const frameId = id ? (id as string).split('-')[0] : null;

  const router = useRouter();

  const dataFrame = selectedFrame
    ? frameData.find((dx) => dx.id === Number(selectedFrame))
    : null;

  const handleDownload = async () => {
    if (base64Image) {
      setLoading(true);
      const jumbotronURL = await uploadImage(base64Image);
      router.push(`/photobox/finish?url=${jumbotronURL}`);
      setLoading(false);
    }
  };

  // if (!dataFrame) {
  //   return <div>No data</div>;
  // }

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className="mt-[120px] ">
        <div className="px-[20px] mx-auto max-w-6xl 2xl:max-w-7xl mb-[20px] md:mb-0">
          <h1 className="text-[#1B1B1B] font-[600] text-[18px]">Photobox</h1>
          <p className="text-[#7B7B7B] text-[14px] font-[400]">
            Capture moments in style, with our homies Photobox
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center min-h-screen overflow-hidden px-[20px]">
          <Spin fullscreen spinning={loading} />

          <div className="w-[100%] md:w-[60%]  flex flex-col items-center justify-center ">
            <Cameragram
              setPhotos={setPhotos}
              photos={photos}
              handleDownload={handleDownload}
            />
            <div className="w-[400px] px-[20px] mt-[20px] ">
              <div
                style={{
                  position: 'relative',
                }}>
                <Carousel
                  additionalTransfrom={0}
                  arrows={true}
                  autoPlaySpeed={3000}
                  centerMode={false}
                  className=""
                  containerClass="container-padding-bottom"
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite={false}
                  itemClass="max-w-max"
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 1024,
                      },
                      items: 2,
                      partialVisibilityGutter: 10,
                    },
                    mobile: {
                      breakpoint: {
                        max: 768,
                        min: 0,
                      },
                      items: 1,
                      partialVisibilityGutter: 30,
                    },
                    tablet: {
                      breakpoint: {
                        max: 1024,
                        min: 768,
                      },
                      items: 2,
                      partialVisibilityGutter: 30,
                    },
                  }}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass="gap-[12px]"
                  slidesToSlide={1}
                  swipeable>
                  {frameData.map((dx: any, idx: any) => {
                    return (
                      <div
                        onClick={() => {
                          const id = dx!.id;
                          setSelectedFrame(id);
                        }}
                        className="w-full flex-1 cursor-pointer hover:bg-[#dca0a048]"
                        key={idx}>
                        <Image
                          src={dx.assets}
                          alt=""
                          key={idx}
                          className="!w-[60px]"
                          width={1181}
                          height={1772}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-1 lg:mr-[80px]">
            <PictureInFrame
              base64Image={base64Image as string}
              setBase64Image={setBase64Image}
              frameSrc={dataFrame?.assets}
              photos={photos}
              baseWidth={960}
              baseHeight={1440}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoboxPage;
