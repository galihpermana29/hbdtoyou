import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const maxDuration = 300; // 5 minutes max execution time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
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

    // Calculate duration based on number of pages
    // 1.5 seconds per page for smaller GIF
    const totalPages = pages.length + 2; // +2 for covers
    const durationInFrames = totalPages * 18; // 1.5 seconds * 12 fps (optimized for small file size)

    // Create a temporary directory for output
    const outputDir = path.join(process.cwd(), 'public', 'gifs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const gifId = uuidv4();
    const outputPath = path.join(outputDir, `${gifId}.gif`);

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
        fps: 12, // Lower FPS for smaller file size (2-3MB target)
        width: 640, // Landscape width
        height: 480, // Landscape height (4:3 ratio)
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

    // Return the GIF URL
    const gifUrl = `/gifs/${gifId}.gif`;

    return NextResponse.json({
      success: true,
      gifUrl,
      message: 'GIF generated successfully',
    });
  } catch (error) {
    console.error('Error generating GIF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate GIF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
