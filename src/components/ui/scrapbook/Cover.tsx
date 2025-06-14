'use client';

import { useRef, useEffect, useState, MouseEvent } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageFrame from '@/assets/scrapbook/cover-fix.png';
import texture from '@/assets/scrapbook/texture.jpg';
import { downloadCanvasAsImage } from './utils/scrapbookUtils';

interface CoverBookProps {
  userImage?: string;
}

interface FramePosition {
  x: number;
  y: number;
  scale: number;
}

type FrameIndex = 0 | 1; // 0 = left, 1 = right

const CoverBook = ({ userImage }: CoverBookProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);

  // Track two separate images for each frame
  const [leftImage, setLeftImage] = useState<HTMLImageElement | null>(null);
  const [rightImage, setRightImage] = useState<HTMLImageElement | null>(null);

  // Track which frame is being edited
  const [activeFrame, setActiveFrame] = useState<FrameIndex | null>(null);

  // States for crop functionality
  const [cropMode, setCropMode] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  // Track which frame is being dragged (left=0, right=1, none=-1)
  const [activeDragFrame, setActiveDragFrame] = useState<number>(-1);

  // Store positions for left and right frames
  const [leftFramePos, setLeftFramePos] = useState<FramePosition>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [rightFramePos, setRightFramePos] = useState<FramePosition>({
    x: 0,
    y: 0,
    scale: 1,
  });

  // Track mouse position for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  // Reference to crop image
  const imgRef = useRef<HTMLImageElement>(null);

  // Load the frame image and texture
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(
    null
  );

  useEffect(() => {
    // Load frame image
    const frameImg = new Image();
    frameImg.src = imageFrame.src;
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

  // Function to create an image from a source
  const createImageFromSrc = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Define frame dimensions and positions
  const getFrameDimensions = (canvas: HTMLCanvasElement) => {
    return {
      left: {
        x: canvas.width * 0.1,
        y: canvas.height * 0.2,
        width: canvas.width * 0.35,
        height: canvas.height * 0.4,
      },
      right: {
        x: canvas.width * 0.55,
        y: canvas.height * 0.15,
        width: canvas.width * 0.35,
        height: canvas.height * 0.4,
      },
    };
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

    const frames = getFrameDimensions(canvas);

    // Layer 1: Draw texture as background if available
    if (textureImage) {
      // Apply padding of 20px inside the texture
      const padding = 0;

      // Draw texture to fill the entire canvas
      ctx.drawImage(textureImage, 0, 0, canvas.width, canvas.height);

      // Create a semi-transparent overlay for the padding area
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

      // Draw the padding as an inner border
      // Top padding
      ctx.fillRect(0, 0, canvas.width, padding);
      // Bottom padding
      ctx.fillRect(0, canvas.height - padding, canvas.width, padding);
      // Left padding
      ctx.fillRect(0, padding, padding, canvas.height - padding * 2);
      // Right padding
      ctx.fillRect(
        canvas.width - padding,
        padding,
        padding,
        canvas.height - padding * 2
      );
    } else {
      // Fallback to a solid color if texture isn't loaded
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Layer 2: Draw left image if available
    if (leftImage) {
      drawImageInFrame(ctx, leftImage, frames.left, leftFramePos);
    }

    // Layer 2: Draw right image if available
    if (rightImage) {
      drawImageInFrame(ctx, rightImage, frames.right, rightFramePos);
    }

    // Layer 3: Draw the frame image on top
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  }, [
    frameImage,
    textureImage,
    leftImage,
    rightImage,
    leftFramePos,
    rightFramePos,
  ]);

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (cropMode) return; // Don't allow dragging in crop mode

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only allow dragging if we have an image for the respective frame
    const hasLeftImage = leftImage !== null;
    const hasRightImage = rightImage !== null;

    if (!hasLeftImage && !hasRightImage) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const frames = getFrameDimensions(canvas);

    // Check if click is within left frame and we have a left image
    if (
      hasLeftImage &&
      x >= frames.left.x &&
      x <= frames.left.x + frames.left.width &&
      y >= frames.left.y &&
      y <= frames.left.y + frames.left.height
    ) {
      setActiveDragFrame(0);
      setIsDragging(true);
      setDragStartX(x);
      setDragStartY(y);
    }
    // Check if click is within right frame and we have a right image
    else if (
      hasRightImage &&
      x >= frames.right.x &&
      x <= frames.right.x + frames.right.width &&
      y >= frames.right.y &&
      y <= frames.right.y + frames.right.height
    ) {
      setActiveDragFrame(1);
      setIsDragging(true);
      setDragStartX(x);
      setDragStartY(y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || activeDragFrame === -1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only proceed if we have an image for the active frame
    if (
      (activeDragFrame === 0 && !leftImage) ||
      (activeDragFrame === 1 && !rightImage)
    )
      return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const deltaX = x - dragStartX;
    const deltaY = y - dragStartY;

    if (activeDragFrame === 0) {
      setLeftFramePos((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    } else {
      setRightFramePos((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    }

    setDragStartX(x);
    setDragStartY(y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveDragFrame(-1);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setActiveDragFrame(-1);
  };

  // Helper function to draw an image in a frame with position and scale adjustments
  const drawImageInFrame = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    frame: { x: number; y: number; width: number; height: number },
    position: FramePosition
  ) => {
    // Calculate aspect ratios
    const imgRatio = img.width / img.height;
    const frameRatio = frame.width / frame.height;

    let drawWidth, drawHeight, drawX, drawY;

    // Determine dimensions to maintain aspect ratio while fitting in frame
    if (imgRatio > frameRatio) {
      // Image is wider than frame (relative to height)
      drawHeight = frame.height * position.scale;
      drawWidth = drawHeight * imgRatio;
      drawX = frame.x - (drawWidth - frame.width) / 2 + position.x;
      drawY = frame.y + position.y;
    } else {
      // Image is taller than frame (relative to width)
      drawWidth = frame.width * position.scale;
      drawHeight = drawWidth / imgRatio;
      drawX = frame.x + position.x;
      drawY = frame.y - (drawHeight - frame.height) / 2 + position.y;
    }

    // Draw the image
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    // Draw a highlight border around the active frame
    if (
      (activeDragFrame === 0 &&
        frame === getFrameDimensions(ctx.canvas).left) ||
      (activeDragFrame === 1 && frame === getFrameDimensions(ctx.canvas).right)
    ) {
      ctx.strokeStyle = '#3B82F6'; // Blue highlight
      ctx.lineWidth = 3;
      ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
    }
  };

  // Function to handle cropping
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;

    const { width, height } = e.currentTarget;

    // Get the frame dimensions to match the aspect ratio
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frames = getFrameDimensions(canvas);
    const frameToUse = activeFrame === 0 ? frames.left : frames.right;
    const aspectRatio = frameToUse.width / frameToUse.height;

    // Create a crop with the correct aspect ratio
    const cropWidthPercent = 90; // Use more of the image

    // Make the crop match the frame aspect ratio
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: cropWidthPercent,
          // Set height based on the frame's aspect ratio
          height: cropWidthPercent / aspectRatio,
        },
        aspectRatio,
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
    if (!imgRef.current || !completedCrop || !imageToCrop) return;

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
      if (activeFrame === 0) {
        setLeftImage(croppedImage);
        // Reset position when adding a new image
        setLeftFramePos({ x: 0, y: 0, scale: 1 });
      } else {
        setRightImage(croppedImage);
        // Reset position when adding a new image
        setRightFramePos({ x: 0, y: 0, scale: 1 });
      }

      // Exit crop mode
      setCropMode(false);
      setImageToCrop(null);
      setCompletedCrop(null);
    } catch (error) {
      console.error('Error creating cropped image:', error);
    }
  };

  // Start crop mode for a specific frame
  const startCropMode = (frameIndex: FrameIndex) => {
    setActiveFrame(frameIndex);
    setCropMode(true);
  };

  // Handle file upload for each frame
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    frameIndex: FrameIndex
  ) => {
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

  // Function to change an already uploaded image
  const changeImage = (frameIndex: FrameIndex) => {
    // Create and trigger a file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      // Convert Event to React.ChangeEvent<HTMLInputElement>
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target?.result) {
            setActiveFrame(frameIndex);
            setImageToCrop(event.target.result as string);
            setCropMode(true);
          }
        };

        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // Handle image upload from file input
  const handleImageUpload =
    (frameIndex: FrameIndex) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(e, frameIndex);
    };

  // Function to adjust zoom/scale for a specific frame
  const adjustZoom = (frameIndex: number, delta: number) => {
    if (frameIndex === 0) {
      setLeftFramePos((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
      }));
    } else {
      setRightFramePos((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
      }));
    }
  };

  // Reset positions for a frame
  const resetFramePosition = (frameIndex: number) => {
    if (frameIndex === 0) {
      setLeftFramePos({ x: 0, y: 0, scale: 1 });
    } else {
      setRightFramePos({ x: 0, y: 0, scale: 1 });
    }
  };

  // Check if both images are uploaded
  const bothImagesUploaded = leftImage !== null && rightImage !== null;

  return (
    <div className="flex flex-col items-center">
      {/* Crop Mode UI */}
      {cropMode && imageToCrop ? (
        <div className="mb-6 w-full max-w-2xl">
          <h3 className="text-lg font-medium mb-2">
            Crop Image for {activeFrame === 0 ? 'Left' : 'Right'} Frame
          </h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden mb-3">
            {(() => {
              // Calculate aspect ratio based on frame dimensions
              let aspectRatio = 1; // Default
              if (canvasRef.current) {
                const frames = getFrameDimensions(canvasRef.current);
                aspectRatio =
                  activeFrame === 0
                    ? frames.left.width / frames.left.height
                    : frames.right.width / frames.right.height;
              }

              return (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  className="max-w-full">
                  <img
                    ref={imgRef}
                    src={imageToCrop}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-w-full"
                  />
                </ReactCrop>
              );
            })()}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setCropMode(false);
                setImageToCrop(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={applyCrop}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!completedCrop}>
              Apply Crop
            </button>
          </div>
        </div>
      ) : (
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto border border-gray-300 shadow-lg cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />

          {/* Frame Controls */}
          <div className="mt-4 grid grid-cols-2 gap-6">
            {/* Left Frame Controls */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Left Frame</h3>
              {leftImage ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Zoom:</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustZoom(0, -0.1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        -
                      </button>
                      <span className="text-sm w-12 text-center">
                        {Math.round(leftFramePos.scale * 100)}%
                      </span>
                      <button
                        onClick={() => adjustZoom(0, 0.1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => resetFramePosition(0)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs">
                      Reset Position
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startCropMode(0)}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">
                        Re-crop
                      </button>
                      <button
                        onClick={() => changeImage(0)}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">
                        Change Image
                      </button>
                    </div>
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
                      onChange={handleImageUpload(0)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Right Frame Controls */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Right Frame</h3>
              {rightImage ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Zoom:</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustZoom(1, -0.1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        -
                      </button>
                      <span className="text-sm w-12 text-center">
                        {Math.round(rightFramePos.scale * 100)}%
                      </span>
                      <button
                        onClick={() => adjustZoom(1, 0.1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => resetFramePosition(1)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs">
                      Reset Position
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startCropMode(1)}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">
                        Re-crop
                      </button>
                      <button
                        onClick={() => changeImage(1)}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">
                        Change Image
                      </button>
                    </div>
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
                      onChange={handleImageUpload(1)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download Button */}
      {(leftImage || rightImage) && !cropMode && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => canvasRef.current && downloadCanvasAsImage(canvasRef.current, 'scrapbook-cover')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download as JPG
          </button>
        </div>
      )}

      {/* Instructions */}
      {(leftImage || rightImage) && !cropMode && (
        <div className="mt-4 text-sm text-gray-600 max-w-md">
          <p className="font-medium">Instructions:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Click and drag inside a frame to adjust image position</li>
            <li>Use the + and - buttons to zoom in/out</li>
            <li>Click Reset Position to return to default position</li>
            <li>Click Re-crop to adjust the cropping of an image</li>
            <li>Click the Download button to save your scrapbook cover as a JPG image</li>
            {!bothImagesUploaded && (
              <li className="text-amber-600 font-medium">
                Please upload images for both frames
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoverBook;
