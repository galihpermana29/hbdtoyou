import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

// Import gif.js dynamically to avoid SSR issues
const loadGifJs = () => {
  return new Promise<any>((resolve) => {
    if (typeof window !== 'undefined') {
      import('gif.js').then((GIF) => {
        resolve(GIF.default);
      });
    }
  });
};

interface UseGifExportProps {
  pages: string[];
  coverImage: string;
  backCoverImage: string;
}

export const useGifExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportToGif = useCallback(async ({ pages, coverImage, backCoverImage }: UseGifExportProps) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      // Load gif.js dynamically
      const GIF = await loadGifJs();
      
      // Create GIF instance with higher quality settings
      const gif = new GIF({
        workers: 2,
        quality: 5, // Lower number = higher quality (was 10, now 5)
        width: 1600, // 2x resolution (was 800)
        height: 1200, // 2x resolution (was 600)
        workerScript: '/gif.worker.js',
      });

      // Build spread structure: [cover solo], [page1, page2], [page3, page4], ...
      // This is the EXACT same concept as your Remotion version
      const spreads: (string | [string, string])[] = [];
      
      // First spread: Cover alone
      spreads.push(coverImage);
      
      // All remaining pages paired (including back cover)
      const allContentPages = [...pages, backCoverImage];
      for (let i = 0; i < allContentPages.length; i += 2) {
        if (i + 1 < allContentPages.length) {
          spreads.push([allContentPages[i], allContentPages[i + 1]]);
        } else {
          spreads.push(allContentPages[i]); // Single page if odd number
        }
      }

      // Process each spread with higher FPS (faster transitions)
      const delay = 750; // 0.75 seconds per spread (2x faster FPS)
      
      for (let i = 0; i < spreads.length; i++) {
        const spread = spreads[i];
        setExportProgress((i / spreads.length) * 100);

        // Create canvas for this spread
        const canvas = await createSpreadCanvas(spread);
        
        // Add frame to GIF (same concept as Remotion frames)
        gif.addFrame(canvas, { delay });
      }

      // Generate GIF
      return new Promise<Blob>((resolve, reject) => {
        gif.on('finished', (blob: Blob) => {
          setExportProgress(100);
          resolve(blob);
        });

        gif.on('progress', (progress: number) => {
          setExportProgress(50 + (progress * 50)); // 50% for canvas creation, 50% for GIF generation
        });

        gif.render();
      });

    } catch (error) {
      console.error('GIF export error:', error);
      setExportError(error instanceof Error ? error.message : 'Failed to export GIF');
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportToGif,
    isExporting,
    exportProgress,
    exportError,
  };
};

// Helper function to create canvas for each spread (higher resolution)
async function createSpreadCanvas(spread: string | [string, string]): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1600; // 2x resolution
  canvas.height = 1200; // 2x resolution
  const ctx = canvas.getContext('2d')!;

  // Clear canvas with transparent background and enable high-quality rendering
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Enable high-quality image rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const isSinglePage = typeof spread === 'string';
  
  if (isSinglePage) {
    // Single page layout (Cover or Back Cover) - same as Remotion
    const img = await loadImage(spread);
    const pageWidth = canvas.width / 2;
    
    // Center the single page (same as Remotion)
    const x = (canvas.width - pageWidth) / 2;
    ctx.drawImage(img, x, 0, pageWidth, canvas.height);
  } else {
    // Double page layout (Regular Spreads) - same as Remotion
    const [leftPage, rightPage] = spread;
    const pageWidth = canvas.width / 2;
    
    // Load both images
    const [leftImg, rightImg] = await Promise.all([
      loadImage(leftPage),
      loadImage(rightPage)
    ]);
    
    // Draw left page
    ctx.drawImage(leftImg, 0, 0, pageWidth, canvas.height);
    
    // Draw right page
    ctx.drawImage(rightImg, pageWidth, 0, pageWidth, canvas.height);
  }

  // Add watermark to center of canvas
  addWatermark(ctx, canvas.width, canvas.height);

  return canvas;
}

// Helper function to add watermark to canvas
function addWatermark(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  // Save current context state
  ctx.save();
  
  // Set watermark text properties
  const text = 'memoify.live/scrapbook';
  const fontSize = Math.max(24, canvasWidth * 0.02); // Responsive font size
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Semi-transparent black outline
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate center position
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  // Add subtle shadow for better visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Draw text outline first
  ctx.strokeText(text, centerX, centerY);
  
  // Draw filled text
  ctx.fillText(text, centerX, centerY);
  
  // Restore context state
  ctx.restore();
}

// Helper function to load image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
