'use client';

import { useRef, useEffect, useState } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import page1Frame from '@/assets/scrapbook/page3.png';
import texture from '@/assets/scrapbook/texture.jpg';
import { downloadCanvasAsImage } from './utils/scrapbookUtils';

// Define our own interfaces for this component
interface FramePosition {
  x: number;
  y: number;
  scale: number;
}

interface PageOneProps {
  userImages?: string[];
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const PageThree = ({
  userImages,
  canvasRef: externalCanvasRef,
}: PageOneProps) => {
  // Use external ref if provided, otherwise create a local one
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || localCanvasRef;
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(
    null
  );

  // Track four separate images for each frame
  const [images, setImages] = useState<(HTMLImageElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Store positions for all frames
  const [framePositions, setFramePositions] = useState<FramePosition[]>([
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
  ]);

  // Track mouse position for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [activeDragFrame, setActiveDragFrame] = useState<number>(-1);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  // States for crop functionality
  const [cropMode, setCropMode] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [activeFrame, setActiveFrame] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Load the frame image and texture
  useEffect(() => {
    // Load frame image
    const frameImg = new Image();
    frameImg.src = page1Frame.src;
    frameImg.onload = () => {
      setFrameImage(frameImg);
    };

    // Load texture image
    const textureImg = new Image();
    textureImg.src = texture.src;
    textureImg.onload = () => {
      setTextureImage(textureImg);
    };
  }, []);

  // Update a specific frame position
  const updateFramePosition = (index: number, position: FramePosition) => {
    const newPositions = [...framePositions];
    newPositions[index] = position;
    setFramePositions(newPositions);
  };

  // Update a specific image
  const updateImage = (index: number, img: HTMLImageElement) => {
    const newImages = [...images];
    newImages[index] = img;
    setImages(newImages);
  };

  // Draw the canvas when images are loaded or positions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frameImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match frame image
    canvas.width = frameImage.width;
    canvas.height = frameImage.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Layer 1: Draw texture as background if available
    if (textureImage) {
      // Draw texture to fill the entire canvas
      ctx.drawImage(textureImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback to a solid color if texture isn't loaded
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Layer 2: Draw the images freely positioned on the canvas
    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        const img = images[i]!;
        const pos = framePositions[i];

        // Calculate the scaled dimensions
        const scaledWidth = img.width * pos.scale;
        const scaledHeight = img.height * pos.scale;

        // Calculate position (centered by default)
        const drawX = canvas.width / 2 - scaledWidth / 2 + pos.x;
        const drawY = canvas.height / 2 - scaledHeight / 2 + pos.y;

        // Draw the image
        ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

        // Draw highlight border if this is the active frame
        if (activeDragFrame === i) {
          ctx.strokeStyle = '#3B82F6'; // Blue highlight
          ctx.lineWidth = 3;
          ctx.strokeRect(drawX, drawY, scaledWidth, scaledHeight);
        }
      }
    }

    // Layer 3: Draw the frame image on top
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  }, [
    frameImage,
    textureImage,
    images,
    framePositions,
    activeDragFrame,
    isDragging,
  ]);

  // Helper function to create an image from a source URL
  const createImageFromSrc = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Initialize crop when an image is loaded for cropping
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    // Make a centered crop with a 16:9 aspect ratio
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
    // Also set the completed crop so the Apply button is enabled immediately
    setCompletedCrop({
      x: Math.round(width * (crop.x / 100)),
      y: Math.round(height * (crop.y / 100)),
      width: Math.round(width * (crop.width / 100)),
      height: Math.round(height * (crop.height / 100)),
      unit: 'px',
    });
  };

  // Apply crop and save the result
  const applyCrop = async () => {
    if (
      !imgRef.current ||
      !completedCrop ||
      !imageToCrop ||
      activeFrame === null
    )
      return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to the crop size
    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    // Scale the canvas context to ensure high quality output
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    // Draw the cropped image to the canvas
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    // Convert canvas to image
    const croppedImageUrl = canvas.toDataURL('image/png');

    // Create image from the cropped data
    try {
      const croppedImage = await createImageFromSrc(croppedImageUrl);

      // Update the appropriate frame image
      updateImage(activeFrame, croppedImage);
      // Reset position when adding a new image
      updateFramePosition(activeFrame, { x: 0, y: 0, scale: 1 });

      // Exit crop mode
      setCropMode(false);
      setImageToCrop(null);
      setCompletedCrop(null);
      setActiveFrame(null);
    } catch (error) {
      console.error('Error creating cropped image:', error);
    }
  };

  // Start crop mode for a specific frame
  const startCropMode = (frameIndex: number) => {
    setActiveFrame(frameIndex);
    setCropMode(true);
  };

  // Function to change an already uploaded image
  const changeImage = (frameIndex: number) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target?.result) {
            // Set the active frame for cropping
            setActiveFrame(frameIndex);
            // Set image to crop
            setImageToCrop(event.target.result as string);
            // Enable crop mode
            setCropMode(true);
          }
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // Handle file upload from file input
  const handleImageUpload = (frameIndex: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target?.result) {
            // Set the active frame for cropping
            setActiveFrame(frameIndex);
            // Set image to crop
            setImageToCrop(event.target.result as string);
            // Enable crop mode
            setCropMode(true);

            // Reset the file input value so the same file can be selected again
            e.target.value = '';
          }
        };

        reader.readAsDataURL(file);
      }
    };
  };

  // Mouse event handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Don't allow dragging in crop mode
    if (cropMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if we clicked on any image
    for (let i = 0; i < images.length; i++) {
      if (!images[i]) continue; // Skip if no image

      const img = images[i]!;
      const pos = framePositions[i];

      // Calculate the scaled dimensions
      const scaledWidth = img.width * pos.scale;
      const scaledHeight = img.height * pos.scale;

      // Calculate position (centered by default)
      const drawX = canvas.width / 2 - scaledWidth / 2 + pos.x;
      const drawY = canvas.height / 2 - scaledHeight / 2 + pos.y;

      // Check if click is within this image
      if (
        x >= drawX &&
        x <= drawX + scaledWidth &&
        y >= drawY &&
        y <= drawY + scaledHeight
      ) {
        setActiveDragFrame(i);
        setIsDragging(true);
        setDragStartX(x);
        setDragStartY(y);
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || activeDragFrame === -1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const deltaX = x - dragStartX;
    const deltaY = y - dragStartY;

    updateFramePosition(activeDragFrame, {
      ...framePositions[activeDragFrame],
      x: framePositions[activeDragFrame].x + deltaX,
      y: framePositions[activeDragFrame].y + deltaY,
    });

    setDragStartX(x);
    setDragStartY(y);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setActiveDragFrame(-1);
  };

  const handleCanvasMouseLeave = () => {
    setIsDragging(false);
    setActiveDragFrame(-1);
  };

  // Zoom controls
  const zoomIn = (frameIndex: number) => {
    const newScale = Math.min(framePositions[frameIndex].scale * 1.1, 3); // Max zoom 3x
    updateFramePosition(frameIndex, {
      ...framePositions[frameIndex],
      scale: newScale,
    });
  };

  const zoomOut = (frameIndex: number) => {
    const newScale = Math.max(framePositions[frameIndex].scale * 0.9, 0.5); // Min zoom 0.5x
    updateFramePosition(frameIndex, {
      ...framePositions[frameIndex],
      scale: newScale,
    });
  };

  const resetPosition = (frameIndex: number) => {
    updateFramePosition(frameIndex, { x: 0, y: 0, scale: 1 });
  };

  // Check if all images are uploaded
  const allImagesUploaded = images.every((img) => img !== null);

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Page Three</h2>
      <div className="flex flex-col items-center">
        {cropMode && imageToCrop ? (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-lg max-w-2xl">
            <h3 className="text-lg font-medium mb-2">Crop Your Image</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag to adjust the crop area, then click Apply to save.
            </p>
            <div className="mb-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full">
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setCropMode(false);
                  setImageToCrop(null);
                  setActiveFrame(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={applyCrop}
                disabled={!completedCrop}
                className={`px-4 py-2 rounded ${
                  !completedCrop
                    ? 'bg-blue-300 text-blue-800 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                Apply Crop
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border max-w-full border-gray-300 rounded-lg shadow-lg cursor-move"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseLeave}
            />
          </div>
        )}

        {/* Controls for each frame */}
        <div className="mt-6 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frame Controls - dynamically generate for all 4 frames */}
            {[0, 1, 2, 3].map((frameIndex) => (
              <div
                key={frameIndex}
                className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3">
                  Frame {frameIndex + 1} (
                  {
                    ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'][
                      frameIndex
                    ]
                  }
                  )
                </h3>
                {images[frameIndex] ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Zoom:</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => zoomOut(frameIndex)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                          -
                        </button>
                        <span className="text-sm w-12 text-center">
                          {Math.round(framePositions[frameIndex].scale * 100)}%
                        </span>
                        <button
                          onClick={() => zoomIn(frameIndex)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => resetPosition(frameIndex)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs">
                        Reset Position
                      </button>
                      <button
                        onClick={() => changeImage(frameIndex)}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">
                      No image uploaded
                    </p>
                    <label className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload(frameIndex)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        {images.some((img) => img !== null) && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                canvasRef.current &&
                downloadCanvasAsImage(canvasRef.current, 'scrapbook-page-one')
              }
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download as JPG
            </button>
          </div>
        )}

        {/* Instructions */}
        {images.some((img) => img !== null) && (
          <div className="mt-4 text-sm text-gray-600 max-w-md">
            <p className="font-medium">Instructions:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>
                Click and drag images to position them anywhere on the page
              </li>
              <li>Use the + and - buttons to zoom in/out</li>
              <li>Click Reset Position to return to default position</li>
              <li>
                Click the Download button to save your scrapbook page as a JPG
                image
              </li>
              {!allImagesUploaded && (
                <li className="text-amber-600 font-medium">
                  Please upload images for all frames
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageThree;
