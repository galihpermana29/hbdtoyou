import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// maxDuration only works on Vercel Pro plan
// Free plan has 10 second limit by default
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let outputPath = '';
  
  try {
    // Dynamic import to avoid build-time bundling issues
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } = await import('@remotion/renderer');

    const body = await request.json();
    const { pages, coverImage, backCoverImage } = body;

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json(
        { error: 'Invalid pages data' },
        { status: 400 }
      );
    }

    // Calculate duration based on spread structure:
    // 1 spread for cover (solo) + paired spreads for all remaining pages (including back cover)
    const allContentPages = pages.length + 1; // pages + back cover
    const pairedSpreads = Math.ceil(allContentPages / 2); // Pair up all content
    const totalSpreads = 1 + pairedSpreads; // cover + paired content
    const durationInFrames = totalSpreads * 6; // 1.5 seconds * 4 fps per spread

    // Use system temp directory instead of public folder
    const tempDir = os.tmpdir();
    const gifId = uuidv4();
    outputPath = path.join(tempDir, `scrapbook-${gifId}.gif`);

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), 'src', 'remotion', 'Root.tsx'),
      webpackOverride: (config) => config,
    });

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'ScrapbookVideo',
      inputProps: {
        pages,
        coverImage,
        backCoverImage,
      },
    });

    // Render as GIF
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps: 4, // Ultra low FPS for smallest file size and faster rendering
        width: 1200, // Landscape width for 2-page spread
        height: 800, // Taller height to prevent cropping (3:2 ratio)
      },
      serveUrl: bundleLocation,
      codec: 'gif',
      outputLocation: outputPath,
      inputProps: {
        pages,
        coverImage,
        backCoverImage,
      },
    });

    // Read the GIF file and return as base64
    const gifBuffer = fs.readFileSync(outputPath);
    const base64Gif = gifBuffer.toString('base64');
    
    // Clean up the temp file
    fs.unlinkSync(outputPath);

    return NextResponse.json({
      success: true,
      gif: base64Gif,
      message: 'GIF generated successfully',
    });
  } catch (error) {
    console.error('Error generating GIF:', error);
    
    // Clean up temp file if it exists
    if (outputPath && fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    
    return NextResponse.json(
      {
        error: 'Failed to generate GIF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
