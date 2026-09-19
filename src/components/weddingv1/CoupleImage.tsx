import { Carousel } from 'antd';
import Image from 'next/image';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

export function CoupleImage() {
  return (
    <Carousel
      autoplay
      autoplaySpeed={2000}
      className="h-[400px] md:h-[500px] w-[85vw] md:w-full">
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src="https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_3:2,g_auto/v1789284278/placeholder/City_tram_window_daydate_outfit_cwrxma.jpg"
          alt="Happy Couple"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src="https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_3:2,g_auto/v1789284278/placeholder/City_tram_window_daydate_outfit_cwrxma.jpg"
          alt="Happy Couple"
          fill
          className="object-cover"
          priority
        />
      </div>
    </Carousel>
  );
}
