import { Carousel } from 'antd';
import Image from 'next/image';

export function CoupleImage() {
  return (
    <Carousel
      autoplay
      autoplaySpeed={2000}
      className="h-[400px] md:h-[500px] w-[85vw] md:w-full">
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src="https://res.cloudinary.com/dxuumohme/image/upload/v1735836362/kummal6q19zucg2m9oil.jpg"
          alt="Happy Couple"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src="https://res.cloudinary.com/dxuumohme/image/upload/v1735836362/kummal6q19zucg2m9oil.jpg"
          alt="Happy Couple"
          fill
          className="object-cover"
          priority
        />
      </div>
    </Carousel>
  );
}
