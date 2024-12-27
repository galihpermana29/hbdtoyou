import Webcam from 'react-webcam';
import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';

const videoConstraints = {
  facingMode: 'user',
};

const cropBase64 = (
  base64: string,
  cropWidth: number,
  cropHeight: number,
  scaleFactor: number = 1 // Default is 1 (no scaling)
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      if (!tempCtx) return;

      const imgWidth = img.width;
      const imgHeight = img.height;
      // Scale up the crop width/height proportionally using the scale factor
      const scaledCropWidth = cropWidth * scaleFactor;
      const scaledCropHeight = cropHeight * scaleFactor;

      // Calculate crop region (center crop)
      const cropX = Math.max(0, (imgWidth - scaledCropWidth) / 2); // Ensure we stay within image bounds
      const cropY = Math.max(0, (imgHeight - scaledCropHeight) / 2);

      // Set the canvas size to the crop dimensions
      tempCanvas.width = scaledCropWidth;
      tempCanvas.height = scaledCropHeight;

      // Draw the cropped portion of the image onto the canvas
      tempCtx.drawImage(
        img,
        cropX,
        cropY,
        scaledCropWidth,
        scaledCropHeight, // Source crop region
        0,
        0,
        scaledCropWidth,
        scaledCropHeight // Destination canvas
      );

      // Convert the cropped canvas back to Base64
      resolve(tempCanvas.toDataURL('image/jpeg'));
    };
  });
};

const Cameragram = ({
  setPhotos,
  photos,
  handleDownload,
}: {
  setPhotos: any;
  photos: any[];
  handleDownload: () => void;
}) => {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const capture = useCallback(
    async (action: 'retake' | 'capture') => {
      if (webcamRef.current) {
        const imageSrc = (webcamRef.current as any).getScreenshot({
          // width: 1386,
          // height: 1038,
          width: 2772,
          height: 2076,
        });

        if (imageSrc) {
          const imgw = 1170;
          const imgh = 1548;
          // Crop the captured Base64 image (center crop to 195x258)
          const croppedImage = await cropBase64(imageSrc, imgw, imgh, 1.3);

          if (action === 'retake' && photos.length > 0) {
            // Replace the last photo with the new cropped image
            const updatedPhotos = [...photos];
            updatedPhotos[photos.length - 1] = {
              ...updatedPhotos[photos.length - 1],
              src: croppedImage,
            };
            setPhotos(updatedPhotos);
          } else if (action === 'capture') {
            // Add the cropped image to the photos array
            const positions = [
              { x: 47, y: 120, width: 390, height: 516 },
              { x: 518, y: 120, width: 390, height: 516 },
              { x: 47, y: 732, width: 390, height: 516 },
              { x: 518, y: 732, width: 390, height: 516 },
            ];

            if (photos.length < positions.length) {
              setPhotos([
                ...photos,
                { src: croppedImage, ...positions[photos.length] },
              ]);
            }
          }
        }
      }
    },
    [webcamRef, photos, setPhotos]
  );

  const handleCaptureClick = (action: 'retake' | 'capture') => {
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);

        capture(action); // Capture the image after the countdown ends
      }
    }, 1000);
  };

  return (
    <>
      <Webcam
        audio={false}
        width={'100%'}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      {/* Countdown Overlay */}
      <div className="absolute">
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-5xl font-bold">
            {countdown}
          </div>
        )}
      </div>
      <div className="flex gap-[12px]">
        {photos.length === 4 && (
          <Button
            size="large"
            onClick={() => handleDownload()}
            className="mt-[20px]">
            Save
          </Button>
        )}
        {photos?.length < 4 && (
          <Button
            onClick={() => handleCaptureClick('capture')}
            size="large"
            className="mt-[20px] !bg-red-600 !text-white">
            Capture
          </Button>
        )}
        {photos?.length > 0 && (
          <Button
            size="large"
            onClick={() => handleCaptureClick('retake')}
            className="mt-[20px] !bg-yellow-500">
            Retake
          </Button>
        )}
      </div>
    </>
  );
};

export default Cameragram;
