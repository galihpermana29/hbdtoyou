# Vercel Free Plan Optimization for GIF Export

## Problem
Vercel Free Plan has a **10-second function timeout**, but GIF generation takes 10-14 seconds.

## Current Performance
```
POST /api/export-video 200 in 11162ms  ← TIMEOUT RISK
POST /api/export-video 200 in 14316ms  ← TIMEOUT RISK
POST /api/export-video 200 in 13474ms  ← TIMEOUT RISK
POST /api/export-video 200 in 9251ms   ← OK
```

---

## Solutions

### **Option A: Optimize for 10s Limit** ✅ (Current Approach)

#### Optimizations Applied:
1. ✅ **5 FPS** - Minimal frames
2. ✅ **1200x800** - Reasonable resolution
3. ✅ **Temp files** - No disk I/O overhead
4. ✅ **Base64 response** - Direct transfer

#### Additional Optimizations Needed:
- [ ] Limit max pages (e.g., 8 pages max)
- [ ] Compress images before rendering
- [ ] Reduce resolution to 1000x667
- [ ] Use 4 FPS instead of 5

---

### **Option B: Upgrade to Pro Plan** 💰

**Vercel Pro Plan ($20/month):**
- ✅ **60-second timeout** (6x longer)
- ✅ **3008 MB memory** (3x more)
- ✅ **1 TB bandwidth**
- ✅ No invocation limits

**Cost-Benefit:**
- Handles complex scrapbooks easily
- No optimization needed
- Better user experience

---

### **Option C: Move to Background Job** 🔄 (Best for Scale)

**Architecture:**
```
User clicks "Export" 
  → Queue job (instant response)
  → Background worker renders GIF
  → Email/notification when ready
  → User downloads from link
```

**Options:**
1. **Vercel Cron + Queue** (requires Pro)
2. **External service** (Railway, Render, AWS Lambda)
3. **Cloudflare Workers** (longer timeout)

---

### **Option D: Client-Side Generation** 🖥️

**Use gif.js library:**
- Render GIF in browser
- No server timeout
- Free forever
- Slower for user

**Trade-offs:**
- ❌ Slower generation
- ❌ Blocks user's browser
- ❌ Limited by device power
- ✅ No server costs

---

## Recommended Approach

### **For Free Plan (Current):**

1. **Add page limit warning:**
```typescript
if (pages.length > 6) {
  return NextResponse.json({
    error: 'Too many pages. Max 6 pages for free tier.',
    suggestion: 'Remove some pages or upgrade to Pro'
  }, { status: 400 });
}
```

2. **Reduce resolution further:**
```typescript
width: 1000,  // Down from 1200
height: 667,  // Down from 800
fps: 4,       // Down from 5
```

3. **Add timeout handling:**
```typescript
export const maxDuration = 10; // Set to 10s max
```

4. **Show progress/warning to user:**
```typescript
"Generating GIF... This may take up to 10 seconds"
"For larger scrapbooks, consider upgrading to Pro"
```

---

### **For Production (Recommended):**

**Upgrade to Vercel Pro ($20/month)**
- Solves all timeout issues
- Better user experience
- Can handle 20+ page scrapbooks
- Worth it if you have paying users

---

## Cost Analysis

### **Free Plan:**
- **Cost**: $0
- **Limits**: 10s timeout, 6-8 pages max
- **User Experience**: ⭐⭐⭐ (OK)

### **Pro Plan:**
- **Cost**: $20/month
- **Limits**: 60s timeout, unlimited pages
- **User Experience**: ⭐⭐⭐⭐⭐ (Excellent)

### **Break-even:**
If you have 10+ users generating GIFs regularly, Pro plan is worth it.

---

## Implementation Priority

### **Immediate (Stay on Free):**
1. ✅ Add page limit (max 6 pages)
2. ✅ Reduce to 4 FPS
3. ✅ Add timeout warning to UI
4. ✅ Set `maxDuration = 10`

### **Short-term (If growing):**
1. Upgrade to Pro plan
2. Remove page limits
3. Improve quality

### **Long-term (If scaling):**
1. Move to background jobs
2. Use dedicated rendering service
3. Add queue system
