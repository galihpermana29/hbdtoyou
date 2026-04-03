# Scrapbook GIF Export Feature

## Overview
Export your scrapbooks as animated GIFs with automatic page-flipping animations. GIFs are lightweight, shareable, and work everywhere!

## Features

### Why GIF?
- ✅ **Small file size** - Much smaller than video files
- ✅ **Universal compatibility** - Works on all platforms and social media
- ✅ **No codec issues** - Plays everywhere without special players
- ✅ **Easy sharing** - Perfect for messaging apps and social media
- ✅ **Auto-loop** - Plays continuously without user interaction

### GIF Specifications:
- **Resolution**: 800x1067 (optimized for file size)
- **FPS**: 15 (smooth but efficient)
- **Duration**: 2 seconds per page
- **Flip animation**: 0.5 seconds
- **Format**: Animated GIF
- **File size**: ~2-5MB for typical 10-page scrapbook

## How It Works

### User Flow:
1. User views their scrapbook
2. Clicks **"Export to GIF"** button
3. Server generates animated GIF with page flips
4. GIF automatically downloads when ready

### Technical Details:

#### Components:
- **API**: `/api/export-video/route.ts` - Generates GIF server-side
- **Composition**: `/src/remotion/ScrapbookComposition.tsx` - 3D flip animations
- **UI**: `PageFlipScrapbook.tsx` - Export button with loading state

#### Optimization Settings:
```typescript
{
  fps: 15,              // Lower FPS = smaller file
  width: 800,           // Reduced resolution
  height: 1067,         // Maintains aspect ratio
  pageDuration: 2s,     // Quick page display
  flipDuration: 0.5s    // Fast transitions
}
```

## Usage

### In Your Component:
```tsx
<PageFlipScrapbook
  pages={structuredPages}
  coverImage={coverImage}
  backCoverImage={backCoverImage}
  enableVideoExport={true} // Shows "Export to GIF" button
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

Response: {
  success: true,
  gifUrl: "/gifs/[uuid].gif"
}
```

## File Size Optimization

### Current Settings:
- 10-page scrapbook ≈ 3-4MB
- 20-page scrapbook ≈ 6-8MB

### Further Optimization Options:
1. **Reduce resolution**: Change width to 600px
2. **Lower FPS**: Use 10 FPS instead of 15
3. **Shorter duration**: 1.5 seconds per page
4. **Dithering**: Add dithering for better compression
5. **Color reduction**: Limit color palette

### Example Ultra-Small Config:
```typescript
{
  fps: 10,
  width: 600,
  height: 800,
  pageDuration: 1.5s
}
// Result: ~1-2MB for 10 pages
```

## Development

### Test Locally:
```bash
npm run dev
# Navigate to any scrapbook
# Click "Export to GIF"
```

### Preview in Remotion Studio:
```bash
npm run remotion:preview
```

## Performance

### Generation Time:
- **5 pages**: ~15-20 seconds
- **10 pages**: ~30-40 seconds
- **20 pages**: ~60-90 seconds

### Server Requirements:
- Memory: ~500MB per render
- CPU: 1-2 cores recommended
- Storage: GIFs saved to `/public/gifs/`

## Sharing

### Perfect For:
- 📱 WhatsApp, Telegram, Discord
- 🐦 Twitter/X (under 15MB limit)
- 📘 Facebook, Instagram Stories
- 💬 Slack, Teams
- 📧 Email attachments

### Social Media Limits:
- Twitter: 15MB max ✅
- Discord: 8MB (free), 50MB (Nitro) ✅
- WhatsApp: 16MB ✅
- Instagram: 100MB ✅

## Troubleshooting

### GIF too large:
- Reduce page count
- Lower resolution in API route
- Decrease FPS to 10
- Compress images before rendering

### Slow generation:
- Normal for 10+ pages
- Consider progress indicator
- Use Remotion Lambda for production

### Quality issues:
- Increase resolution (but larger file)
- Add dithering in Remotion config
- Use higher FPS (but larger file)

## Future Enhancements

- [ ] Progress bar during generation
- [ ] Quality presets (small/medium/large)
- [ ] Custom animation speeds
- [ ] Background music (convert to video)
- [ ] Watermark/branding
- [ ] Batch export multiple scrapbooks
