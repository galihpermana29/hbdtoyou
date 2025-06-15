// Interfaces
export interface FramePosition {
  x: number;
  y: number;
  scale: number;
}

export interface FrameDimensions {
  [key: string]: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Function to create an image from a source URL
export const createImageFromSrc = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Function to draw an image in a frame with position and scale adjustments
export const drawImageInFrame = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  frame: { x: number; y: number; width: number; height: number },
  position: FramePosition,
  isActive: boolean = false
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

  // Save the current context state
  ctx.save();

  // Create a clipping path for the frame
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.width, frame.height);
  ctx.clip();

  // Draw the image
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

  // Draw a highlight border around the active frame
  if (isActive) {
    ctx.strokeStyle = '#3B82F6'; // Blue highlight
    ctx.lineWidth = 3;
    ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
  }

  // Restore the context state
  ctx.restore();
};

// Function to adjust zoom/scale for a frame position
export const adjustZoom = (
  position: FramePosition,
  delta: number
): FramePosition => {
  return {
    ...position,
    scale: Math.max(0.5, Math.min(3, position.scale + delta)),
  };
};

// Function to reset a frame position to default
export const resetFramePosition = (): FramePosition => {
  return { x: 0, y: 0, scale: 1 };
};

// Function to handle mouse down event for dragging
export const handleMouseDown = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  frames: FrameDimensions,
  images: (HTMLImageElement | null)[],
  setActiveDragFrame: (index: number) => void,
  setIsDragging: (isDragging: boolean) => void,
  setDragStartX: (x: number) => void,
  setDragStartY: (y: number) => void
) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  const frameKeys = Object.keys(frames);

  // Check which frame was clicked
  for (let i = 0; i < frameKeys.length; i++) {
    const frame = frames[frameKeys[i]];
    if (
      images[i] && // Only allow dragging if we have an image
      x >= frame.x &&
      x <= frame.x + frame.width &&
      y >= frame.y &&
      y <= frame.y + frame.height
    ) {
      setActiveDragFrame(i);
      setIsDragging(true);
      setDragStartX(x);
      setDragStartY(y);
      break;
    }
  }
};

// Function to handle mouse move event for dragging
export const handleMouseMove = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  isDragging: boolean,
  activeDragFrame: number,
  dragStartX: number,
  dragStartY: number,
  framePositions: FramePosition[],
  setDragStartX: (x: number) => void,
  setDragStartY: (y: number) => void,
  updateFramePosition: (index: number, position: FramePosition) => void
) => {
  if (!isDragging || activeDragFrame === -1) return;

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

// Function to handle file upload
export const handleFileUpload = async (
  file: File,
  updateImage: (index: number, img: HTMLImageElement) => void,
  updateFramePosition: (index: number, position: FramePosition) => void,
  frameIndex: number
) => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const img = await createImageFromSrc(event.target.result as string);
          updateImage(frameIndex, img);
          updateFramePosition(frameIndex, resetFramePosition());
          resolve();
        } catch (error) {
          console.error('Error loading image:', error);
          reject(error);
        }
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Function to download canvas as JPG image
export const downloadCanvasAsImage = (
  canvas: HTMLCanvasElement,
  fileName: string = 'scrapbook-page'
): void => {
  // Create a temporary link element
  const link = document.createElement('a');
  
  try {
    // Convert canvas to data URL as JPEG format with 0.9 quality
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Set link attributes
    link.download = `${fileName}.jpg`;
    link.href = dataUrl;
    
    // Append to body, click to trigger download, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
    alert('Failed to download image. Please try again.');
  }
};
