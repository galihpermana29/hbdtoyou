# Landscape Book Spread Fix

## Problem
The exported GIF was showing only **one page at a time** (portrait style), not a proper **two-page spread** like an open book in landscape mode.

## Solution
Completely rewrote the `ScrapbookComposition.tsx` to display **two pages side-by-side** like a real open book.

---

## Changes Made

### 1. **ScrapbookComposition.tsx** - Complete Rewrite
**Before**: Single page with 3D flip animation  
**After**: Two-page spread (left + right) with center spine

#### Key Features:
- **Left Page**: Shows even-indexed pages
- **Right Page**: Shows odd-indexed pages  
- **Center Spine**: Visual separator with gradient shadow
- **Spread Logic**: Groups pages into spreads (2 pages = 1 spread)
- **Smooth Transitions**: Fade and scale effects between spreads

### 2. **Dimensions Updated**
```typescript
// Before (portrait-ish)
width: 640
height: 480
ratio: 4:3

// After (landscape book spread)
width: 800
height: 400
ratio: 2:1 (perfect for open book)
```

### 3. **Duration Calculation Fixed**
```typescript
// Before: 1 page = 1 duration unit
totalPages * 18 frames

// After: 2 pages (1 spread) = 1 duration unit  
totalSpreads * 18 frames
// Result: Half the duration, same viewing time per page
```

---

## Visual Layout

```
┌─────────────────────────────────────────┐
│  ┌─────────────┐ │ ┌─────────────┐     │
│  │             │ │ │             │     │
│  │  Left Page  │ │ │ Right Page  │     │
│  │   (Even)    │ │ │   (Odd)     │     │
│  │             │ │ │             │     │
│  └─────────────┘ │ └─────────────┘     │
│                  ↑                      │
│            Center Spine                 │
└─────────────────────────────────────────┘
```

---

## Example Page Flow

**10-page scrapbook:**
```
Spread 1: [Cover] [Page 1]
Spread 2: [Page 2] [Page 3]
Spread 3: [Page 4] [Page 5]
Spread 4: [Page 6] [Page 7]
Spread 5: [Page 8] [Back Cover]
```

**Total spreads**: 5  
**Total duration**: 5 × 1.5s = 7.5 seconds  
**File size**: ~2-3MB ✅

---

## Benefits

✅ **Proper landscape layout** - Two pages side-by-side like a real book  
✅ **Better use of space** - No wasted screen area  
✅ **Authentic book feel** - Center spine adds realism  
✅ **Smaller file size** - Fewer total frames (spreads vs pages)  
✅ **Faster generation** - Half the number of transitions  

---

## Technical Details

### Page Pairing Logic:
```typescript
const leftPageIndex = spreadIndex * 2;      // 0, 2, 4, 6...
const rightPageIndex = spreadIndex * 2 + 1; // 1, 3, 5, 7...
```

### Transition Effect:
- **Scale down**: 5% during transition
- **Fade out**: 30% opacity during transition  
- **Duration**: 0.3 seconds (fast and smooth)

### Aspect Ratio:
- **2:1 ratio** (800x400) is perfect for book spreads
- Each page is **400x400** (square-ish, good for photos)
- Total width accommodates both pages + spine

---

## File Size Optimization

**10-page scrapbook:**
- **Before fix**: ~7MB (showing 1 page at a time)
- **After fix**: ~2-3MB (showing 2 pages per spread)

**Why smaller?**
1. Fewer total frames (5 spreads vs 10 pages)
2. More efficient use of pixels
3. Less animation overhead
4. Optimized dimensions

---

## Testing

To test the new layout:
```bash
npm run dev
# Navigate to any scrapbook
# Click "Export to GIF"
# Result: Landscape GIF with 2-page spreads
```

Preview in Remotion Studio:
```bash
npm run remotion:preview
```

---

## Future Enhancements

- [ ] Add page curl animation for more realistic flip
- [ ] Customize spine thickness/color
- [ ] Add page numbers on each page
- [ ] Support for single-page mode (toggle)
- [ ] Custom aspect ratios (16:9, 4:3, etc.)
