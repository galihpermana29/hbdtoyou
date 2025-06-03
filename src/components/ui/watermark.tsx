import Image from 'next/image';
import watermarkImage from '@/assets/watermark.png';
const Watermark = () => {
  return (
    <div>
      <Image src={watermarkImage} alt="Watermark" />
    </div>
  );
};

export default Watermark;
