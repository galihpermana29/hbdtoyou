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
    const { renderMedia, selectComposition } = await import(
      '@remotion/renderer'
    );

    const body = await request.json();
    const { pages, coverImage, backCoverImage } = body;

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json(
        { error: 'Invalid pages data' },
        { status: 400 }
      );
    }

    // Limit pages to avoid timeout on Vercel free plan (10s limit)
    if (pages.length > 6) {
      return NextResponse.json(
        { error: 'Too many pages. Maximum 6 pages allowed for GIF export.' },
        { status: 400 }
      );
    }

    // Calculate duration based on spread structure:
    // 1 spread for cover (solo) + paired spreads for all remaining pages (including back cover)
    const allContentPages = pages.length + 1; // pages + back cover
    const pairedSpreads = Math.ceil(allContentPages / 2); // Pair up all content
    const totalSpreads = 1 + pairedSpreads; // cover + paired content
    const durationInFrames = totalSpreads * 4; // ~1.3 seconds * 3 fps per spread (faster)

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
        fps: 3, // Minimal FPS for fastest rendering under 10s timeout
        width: 800, // Reduced width for faster rendering
        height: 600, // Reduced height for faster rendering
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
