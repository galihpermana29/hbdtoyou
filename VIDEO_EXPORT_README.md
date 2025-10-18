# Scrapbook Video Export Feature

## Overview
This feature allows users to export their scrapbooks as video files with automatic page-flipping animations using Remotion.

## How It Works

### User Flow
1. User views their scrapbook
2. Clicks "Export to Video" button
3. Server renders video with page-flip animations
4. Video automatically downloads when ready

### Technical Implementation

#### Components Created:
1. **`/src/remotion/ScrapbookComposition.tsx`** - Remotion video composition with 3D flip animations
2. **`/src/remotion/Root.tsx`** - Remotion root configuration
3. **`/src/app/api/export-video/route.ts`** - API endpoint for server-side rendering
4. **Updated `PageFlipScrapbook.tsx`** - Added export button and loading states

#### Video Specifications:
- **Resolution**: 1920x1080 (Full HD)
- **FPS**: 30
- **Duration**: 3 seconds per page
- **Format**: MP4 (H.264)
- **Animation**: 3D page flip with 1-second transition

## Usage

### In Your Scrapbook Pages:
```tsx
<PageFlipScrapbook
  pages={structuredPages}
  coverImage={coverImage}
  backCoverImage={backCoverImage}
  enableVideoExport={true} // Enable video export button
/>
```

### API Endpoint:
```typescript
POST /api/export-video
Body: {
  pages: string[],
  coverImage: string,
  backCoverImage: string
}
```

## Development

### Preview Remotion Composition:
```bash
npm run remotion:preview
```

### Manual Render:
```bash
npm run remotion:render
```

## Important Notes

### Performance:
- Video rendering happens server-side
- Rendering time: ~30-60 seconds for 10-page scrapbook
- Videos are saved to `/public/videos/` directory

### Limitations:
- Max execution time: 5 minutes (Next.js API route limit)
- For longer scrapbooks, consider using Remotion Lambda

### Future Improvements:
1. Add progress bar during rendering
2. Implement Remotion Lambda for faster rendering
3. Add video quality options (720p, 1080p, 4K)
4. Custom animation styles
5. Background music support
6. Watermark/branding options

## Troubleshooting

### Video not downloading:
- Check browser console for errors
- Verify `/public/videos/` directory exists
- Check server logs for rendering errors

### Slow rendering:
- Reduce image sizes before export
- Consider using Remotion Lambda for production
- Optimize video settings in `remotion.config.ts`

### Memory issues:
- Limit scrapbook to max 20 pages
- Compress images before rendering
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
