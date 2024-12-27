import React, { useEffect, useRef, useState } from 'react';

type Photo = {
  src: string; // The source of the photo
  x: number; // X coordinate for placement
  y: number; // Y coordinate for placement
  width: number; // Width of the photo
  height: number; // Height of the photo
};

type PictureInFrameProps = {
  frameSrc: { src: string }; // The source of the frame image
  photos: Photo[]; // Array of photo objects
  baseWidth?: number; // Base width of the canvas (default: 480)
  baseHeight?: number; // Base height of the canvas (default: 720)
  scaleFactor?: number; // Scaling factor for resizing (default: 0.9)
  base64Image?: string; // Base64 image data
  setBase64Image?: React.Dispatch<React.SetStateAction<string | null>>; // Function to set the base64Image state
};

const PictureInFrame: React.FC<PictureInFrameProps> = ({
  frameSrc,
  photos,
  baseWidth = 500,
  baseHeight = 720,
  scaleFactor = 0.9,
  setBase64Image,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasSize, setCanvasSize] = useState({
    width: baseWidth * scaleFactor,
    height: baseHeight * scaleFactor,
  });

  useEffect(() => {
    const { width, height } = canvasSize;
    const canvas = canvasRef.current;

    if (!canvas) return; // Prevent null reference errors

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Prevent null reference if `getContext` fails

    // Set the canvas size according to the scaling factor
    canvas.width = width;
    canvas.height = height;

    // Scale images and frame based on the scaling factor
    const promises = photos.map(
      ({ src, x, y, width: imgWidth, height: imgHeight }) => {
        return new Promise<void>((resolve) => {
          const photoImg = new Image();
          photoImg.src = src;

          photoImg.onload = () => {
            const scaledX = x * scaleFactor;
            const scaledY = y * scaleFactor;
            const scaledWidth = imgWidth * scaleFactor;
            const scaledHeight = imgHeight * scaleFactor;

            ctx.drawImage(
              photoImg,
              scaledX,
              scaledY,
              scaledWidth,
              scaledHeight
            );
            resolve();
          };
        });
      }
    );
    Promise.all(promises).then(() => {
      const frameImg = new Image();
      frameImg.src = frameSrc.src;

      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, width, height);

        // Save the canvas as a Base64 string
        const base64 = canvas.toDataURL('image/png'); // Convert to Base64 (PNG format)
        setBase64Image!(base64); // Store Base64 in state
      };
    });
  }, [frameSrc, photos, canvasSize, scaleFactor]);

  return (
    <canvas className="block m-auto border-2 max-w-[480px]" ref={canvasRef} />
  );
};

export default PictureInFrame;
