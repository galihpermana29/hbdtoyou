# MemoRoll film look - research report (hbd-15j, revision 3)

Research only; no application code has been changed.
This report studies the five reference photos, audits the shipped filter implementation, and ends with an implementation-ready algorithm plus candidate visual parameters for a single Wedding Film preset with two internal lighting variants.
Revision 3 (2026-08-16) incorporates the owner's review: canvas pixel processing is the export source of truth, CSS filters are an approximate preview only, "halation" is renamed highlight bloom, the grain model keeps shadow grain without repeating one texture across a gallery, the validation plan is region-based and pre-JPEG, media identifications are hedged, the first release uses an explicit lighting control instead of an unvalidated classifier, scope is narrowed to Wedding Film + None, and the analysis is reproducible via the companion script.

## 0. The headline finding: the shipped baked color filters do not run on iPhones

The entire baked-look pipeline in `camera.tsx` (`developShot`) leads with `ctx.filter = film.filter`.
`CanvasRenderingContext2D.filter` has never shipped enabled in Safari: iOS/macOS Safari through 17.x has no support, and 18.0+ has it behind a feature flag, disabled by default ([caniuse](https://caniuse.com/mdn-api_canvasrenderingcontext2d_filter); absent from the [Safari 18.0 release notes](https://webkit.org/blog/15443/webkit-features-in-safari-18-0/); the [context-filter-polyfill](https://github.com/davidenke/context-filter-polyfill) exists precisely because "only WebKit misses an implementation").
On unsupported browsers the assignment is silently ignored, so a guest on an iPhone sees the CSS-filtered viewfinder but their baked JPEG develops with no color work at all - only the grain, vignette, wash, stamp and watermark passes land.
Wedding guests skew iPhone, so the primary audience currently gets the artificial parts of the look without the color.
The replacement pipeline uses no `ctx.filter` anywhere, in any pass.

## 1. What the reference photos show

Numbers below come from the companion analysis script (see §8 for method); they are read directionally per image, never histogram-matched blindly.
Media identifications are inferences from visual character only - no EXIF or provenance exists for these files - so each is stated as "consistent with", not as fact.

### reference_1 - daylight, no flash (735×474)

Consistent with: consumer color negative in a compact camera, backlit low sun, veiling flare haze.
Tone: p5=21, p50=171, p95=236; only 0.245% of pixels reach white.
Highlight rolloff: gentle - sky and white shirts compress into the 230s instead of clipping.
Shadow color: darkest decile RGB [21,21,16] - near-neutral, blue slightly starved.
Skin: warm, forgiving, softened by flare.
Saturation: 0.24 measured (haze-suppressed); sky keeps cyan-blue character.
Grain: fine, visible in the sky.
Softness: motion blur on subjects plus mild lens softness.
Vignette: minimal.
Reproducible in post: shoulder, warm bias, grain, haze lift.
Not reproducible: authentic motion blur and true optical flare geometry - they come from real capture, and phones supply their own.

### reference_2 - direct flash in a dark room (735×487)

Consistent with: high-speed color negative under direct on-camera flash.
Lighting: flash is the only light; inverse-square falloff sends the background to black within metres ([guide-number physics](https://en.wikipedia.org/wiki/Guide_number); disposable flash range is specified as roughly 1–3.5 m - [Fujifilm QuickSnap specs](https://www.fujifilm.com/us/en/consumer/films/quicksnap/specifications), [Kodak FunSaver review](https://casualphotophile.com/2018/10/08/kodak-funsaver-disposable-camera-review-cheap-is-good/)).
Tone: strongly bimodal - p25=16, p50=31, p75=155; the frame is mostly near-black with bright subjects.
Critically, blacks are lifted, not crushed: 0.0% of pixels sit at ≤5, and the floor is ~15.
Highlight rolloff: zero clipped pixels; brightest decile [228,220,218] - warm white.
Shadow color: [15,16,1] - the blue channel is dead; shadows are warm yellow-green fog, and grain rides visibly in these dark regions.
Skin: bright, slightly hot, with specular shine from the frontal flash.
Saturation: 0.44 - flash-lit color pops.
Softness: sharp center, hard shadow outlines hugging subjects.
Vignette: none distinguishable from flash falloff.
Reproducible: tone curve, lifted warm shadows, saturation, shadow-visible grain, warm highlights, faint highlight bloom.
Not reproducible: see §5 - the falloff, hard shadow outlines and red-eye are physics of a real flash.

### reference_3 - flash party frame, square, heavy character (736×743)

Consistent with: cheap or expired high-speed negative behind a simple plastic lens, direct flash, square crop.
Tone: the most extreme fog - p5=43, p50=48; the whole shadow field floats at ~45.
Shadow color: [42,46,11] - blue ~35 points under green; a strong yellow-green base fog, with coarse grain plainly visible inside it.
Highlight rolloff: max ~218, 0.196% at white; a soft bloom halos the white shirts.
Skin: warm-to-orange.
Saturation: 0.54, the highest of the set.
Softness: soft everywhere; corner smear consistent with a single-element lens.
Vignette: real corner falloff, visible but secondary to the flash falloff.
Reproducible: fog lift with blue kill, bloom restricted to highlights, coarse shadow-visible grain, corner softness.
Not reproducible: the square format (a crop decision) and subject motion.

### reference_4 - soft interior daylight (736×488)

Consistent with: a fine-grained, skin-first color negative - a Portra-inspired rendering; the specific stock and scanner cannot be identified from pixels alone.
Tone: p95=187 - the entire highlight range is compressed into a creamy ceiling well below white.
Highlight rolloff: brightest decile [203,190,168] - warm cream, blue 35 under red; nothing approaches clipping.
Shadow color: [18,11,5] - warm.
Skin: natural and warm; Kodak positions Portra explicitly around "spectacular skin tones" ([pub. E-4050](https://kodakprofessional.com/sites/default/files/2025-07/e4050.pdf)), and this frame matches that ambition.
Saturation: 0.44 but gentle, never punchy.
Grain: essentially invisible at this size.
Softness: slight, pleasant.
Vignette: none.
Reproducible: nearly everything - this is the most curve-driven look of the set.

### reference_5 - overcast tent daylight (735×490)

Consistent with: consumer color negative in soft daylight, possibly with mild fill flash on the subjects.
Tone: balanced - p50=132, p95=238, 0.078% at white.
Highlight rolloff: warm - brightest decile [246,238,222].
Shadow color: [33,22,12] - warm, lifted.
Skin: natural-warm.
Saturation: 0.40 - the "bright, colorful" consumer-negative positioning ([Gold 200 pub. E-7022](https://business.kodakmoments.com/sites/default/files/files/resources/E7022_Gold_200.pdf)).
Grain: fine.
Softness: sharp center.
Vignette: minimal.
Reproducible: all tone and color behavior.

### The test inputs

`experiment_photo.jpeg` (700×1052) is a modern digital wedding photo and shows exactly what the film look must remove: 9.18% of pixels hard-clipped at neutral white [251,252,252], deep blacks, sharpness everywhere.
One honesty note that also constrains validation (§6): pixels already clipped in the input carry no detail, and no curve recovers it - the shoulder can only re-map that flat white to a flat, warmer, lower value.
`digi cam rehearsal.jpeg` (736×552) has the character of an early-2000s compact digital capture: cool highlights [195,205,222] (blue 27 above red - the opposite of film), saturation 0.23, flat curve, soft.
It is not a film target; it defines a separate aesthetic ([DPReview on digital nostalgia](https://www.dpreview.com/interviews/5683481585/sofi-lee-on-digital-nostalgia)) and serves here as a robustness input only.

### The cross-reference invariants

Despite five different scenes, every film reference agrees on four things.
Film highlights never clip and are always warm (blue 10–35 under red in the brightest decile) while the digital input clips 9.2% dead-neutral.
Film shadows never reach black and are always blue-starved (warm), with floors between 15 and 48 on the flash-lit frames.
The dark background of party photos is bimodal flash falloff, not a radial vignette.
Grain is fine, spatially correlated, and clearly visible in shadows and mid-tones - including the deep-shadow fog of references 2 and 3 - while dense highlights stay smooth.

## 2. Why the current implementation looks artificial

Audit of `src/app/memoroll/demo/films.ts` and `src/app/memoroll/demo/screens/camera.tsx` (state as of commit `cd84da3`).

1. **Excessive sepia.**
`sepia()` is one fixed color matrix that folds all hues toward a single orange axis; four presets lead with it (Gold 0.25, Portra 0.12, 35mm 0.22, Disposable 0.18).
The references keep full hue separation (the orange, green and blue dresses in reference_4 stay distinct); film warmth lives in per-channel curve offsets, not in a global hue collapse.
2. **Uniform grain.**
We draw `Math.random()` white noise at quarter resolution and upscale 4×, producing blocky, spatially uncorrelated, luminance-independent noise at constant alpha.
Real color-negative grain is spatially correlated dye-cloud coverage rendered per layer; the IPOL grain paper explicitly rejects the additive white-noise model ([Newson et al. 2017](https://www.ipol.im/pub/art/2017/192/)).
Kodak's Print Grain Index ladder (Portra 400: 37, Gold 200: 44, UltraMax 400: 46, Portra 800: 48 - from the datasheets cited below) says stock-to-stock grain differences are a few just-noticeable-differences, not a texture slider.
3. **Bloom applied to the entire image.**
The Disposable preset screens a `blur(6px) brightness(1.5)` copy of the whole frame at 0.28 alpha, lifting every midtone into a milky veil.
Real highlight glow is confined to overexposed highlights; on standard C-41 stocks even that is faint, because an anti-halation layer suppresses the underlying reflection mechanism ([CineStill FAQ](https://cinestillfilm.com/pages/frequently-asked-questions) - the famous strong red glow exists on CineStill 800T only because that layer was removed).
The references show at most a soft, warm highlight bloom around whites (reference_3), never a CineStill-style red halo - which is why this report uses the term **highlight bloom**, not halation, for the reproducible effect.
4. **Flat color washes.**
Two presets paint one translucent `fillRect` over the frame, uniformly compressing contrast.
Real casts are curve-shaped: a fog look kills blue in the toe, a warm look biases channels near the top - mids keep their contrast.
5. **Overly strong vignettes.**
Presets carry radial black up to 0.55 alpha.
Compact-camera vignetting is mild, and the black party background is flash physics; a 0.5 black disc reads as an app, not a lens.
6. **Misleading film-stock names.**
Chips claim Kodak Gold 200, Portra 400, Superia 400, CineStill 800T; the recipes are invented CSS chains with no relation to the stocks' published curves, grain indices or positioning.
7. **Preview/export divergence.**
By design the CSS preview lacks grain, soft focus and bloom, and previews the light leak in a fixed corner while the export randomizes it.
By accident (finding 0) the export loses the entire color chain on Safari while the preview shows it - the worst possible divergence, in the majority browser.

## 3. Recommended rendering pipeline

**The canvas pixel pass is the single source of truth for the exported image.**
The live preview is an ordinary CSS `filter` chain chosen to resemble the pixel pass, and it is documented in-app and in-code as approximate: SVG filters (`feComponentTransfer`) could in principle express the exact curves, but applying SVG filters to live `<video>` is unreliable on iOS Safari, so no exact-preview mechanism is assumed.
No numeric preview-parity target is promised; §6 defines an optional on-device diagnostic instead, and a parity budget may be adopted only after it is measured on real iPhones.

Export (bake) path - pure canvas 2D, no `ctx.filter`:

1. Create the working 2D context with `getContext('2d', { willReadFrequently: true })`, draw the 480×640 stage into it, then call `getImageData` once; ~307k pixels keeps the LUT work O(n) ([WebKit on `willReadFrequently`](https://webkit.org/blog/15443/webkit-features-in-safari-18-0/)).
2. Apply three per-channel 256-entry `Uint8Array` LUTs (the variant's tone curves: toe lift, shoulder, per-channel warm offsets) - one indexed read per channel.
3. In the same loop: saturation adjust around luma, grain add (from a precomputed tile, weighted by the §4 curve), and vignette gain (from a precomputed radial map).
4. `putImageData`, then the highlight-bloom pass (low-light variant only): threshold luma ≥ 240 on a quarter-scale copy, blur by down/up-scaling, warm tint, `screen` at low alpha - highlights only, never the whole frame.
5. Stamp + watermark as today, then JPEG export.

Explicitly deferred: WebGL2 3D-LUT shading for future full-resolution exports ([GPU Gems 2 ch. 24](https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-24-using-lookup-tables-accelerate-color); [WebGL2 support](https://caniuse.com/webgl2); [iOS context-loss risk](https://bugs.webkit.org/show_bug.cgi?id=262628)); chromatic aberration and lens-softness passes, invisible at 480px.

## 4. Grain model

The revision replaces the earlier `4L(1−L)` parabola, which wrongly silenced grain in deep shadows.
The references contradict a parabola: references 2 and 3 carry their most visible grain inside the lifted shadow fog.
The mechanism agrees: in the negative, shadow regions are the *thinnest* (least-exposed) areas, and thin areas both carry higher relative granularity and get amplified when the scan lifts them - "thin, underexposed areas grain up more than dense, well-exposed ones" ([film-emulation colorist guide](https://pixeltoolspost.com/blogs/resolve/film-emulation-explained)); dense highlights on the negative print smooth.
The correct signal-dependent weight is therefore monotone-decreasing with displayed luminance, with a floor in shadows and a fade only near white:

`w(L) = 1 − 0.85 · smoothstep(0.45, 0.98, L)`

so shadows and mids get full grain (w = 1.0 up to L≈0.45), the rolloff starts in the upper mids, and pure whites keep a 0.15 residue rather than going sterile.
Applied on top of the §9 toe lift, deep shadows can never hide grain by being pure black, matching the fog texture of references 2 and 3.
Grain source: one 240×320 `Int8` tile per developed shot (values ±64 from a seeded PRNG, one wrapped 3×3 box-smoothing pass for spatial correlation - white per-pixel noise is explicitly rejected by [IPOL 2017](https://www.ipol.im/pub/art/2017/192/)), scaled to the frame with bilinear sampling and per-channel coordinate offsets to decorrelate the layers slightly.
The seed comes from `crypto.getRandomValues` when available, with a timestamp-plus-counter fallback; a tile is never reused for a second shot, so a gallery cannot reveal one repeating noise fingerprint.
After smoothing, normalize the tile back to the requested RMS amplitude before applying the luminance weight, so “5/255” and “8/255” describe output noise rather than the unsmoothed source.

## 5. What software cannot do (and the torch question)

Browser software cannot recreate physical direct-flash lighting: not the inverse-square falloff that blacks out the background, not the hard shadow outlines behind subjects, not specular skin shine, not red-eye.
Those exist in references 2 and 3 because a real flash fired in a real dark room.
The filter can only imitate the *resulting* color and tone (lifted warm toe, punch, warm highlights), the grain, and a faint highlight bloom; the low-light variant should therefore be understood as "develops a dark-scene photo the way flash film renders one", not as a flash simulator.
Torch investigation: `MediaStreamTrack.applyConstraints({ advanced: [{ torch: true }] })` can hold a phone's LED on continuously where supported, but support is effectively Chrome-on-Android ([MDN torch constraint](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#torch)); iOS Safari does not expose torch control to web pages, and a continuous LED is in any case constant video light - dimmer, warmer-handled by auto-exposure, and without the frozen-subject character of a synchronized xenon flash.
Recommendation: do not build on torch; if a scene is dark, the guest's own capture (with whatever light exists) is the input, and the low-light variant only develops it.

## 6. Validation plan

All pixel assertions run on `ImageData` buffers **before JPEG encoding**; JPEG output is checked only for being well-formed and within size bounds.
All preview comparisons run against the **color stage only** - after LUT + saturation, before grain, bloom, stamp, watermark and JPEG - since grain and bloom are export-only by design.
No global whole-image histogram assertion is used as a pass/fail gate, because a globally plausible histogram can hide locally wrong results; assertions are region-based.

1. **Region assertions on `experiment_photo.jpeg`** (regions fixed as fractional rectangles, chosen once by eye and recorded in the harness):
dress whites (clipped in the input): output flat but warm and unclipped - mean ≤ 245, R − B ≥ 10, and explicitly *no detail-recovery claim*: the region's internal stddev may stay near zero;
grass/foliage: hue stays green (G channel dominant before and after; hue rotation < 15°) - the anti-sepia gate;
skin patches (two faces): warmth increases moderately (ΔR−B between +5 and +25), luma within ±12% of input;
darkest-decile mask: floor ≥ 7/255, blue the lowest channel;
mid-tone spread inside a mixed region (p75 − p25) within ±15% of input - the anti-veil gate, scoped to a region, not the globe.
2. **Robustness on `digi cam rehearsal.jpeg`**: define separate fractional regions for its sky, foliage, pastel clothing and deep trees; assert that the sky does not turn orange, foliage remains green, clothing hues stay distinct, and shadow lifting does not flatten the tree canopy.
3. **None identity**: output `ImageData` bit-identical to input outside the watermark rectangle, asserted pre-encode.
4. **Contact sheet** (evidence, not gate): each variant beside references 1/4/5 and 2/3 for eyeball review - dress whites cream not grey, greens still green, hue separation preserved, grain visible at full view and unobtrusive at gallery-tile size, shadow grain present in a darkened crop.
5. **Preview diagnostic (optional, on-device)**: photograph of the CSS-previewed viewfinder vs the color-stage export of the same frame on at least one real iPhone and one Android; measure the per-channel mean difference and *record* it - a numeric parity budget is adopted only if this measurement supports one.
6. **Future lighting-classifier research, not a v1 gate**: collect balanced real captures through the demo camera across at least three phones and four scene types (outdoor day, indoor bright, dim restaurant, dark party with phone light), then derive a classifier from those labeled captures.
Report a confusion matrix and per-class recall rather than one aggregate accuracy number, and include an uncertain band that leaves the user's explicit choice unchanged.
The earlier candidate `medianLuma < 0.25 && p75−p50 > 0.35` is rejected: it classifies reference_3 as daylight because `(85−48)/255 = 0.145`.

## 7. Scope of the first implementation

The first implementation ships exactly two chips and one lighting control:

- **Wedding Film** - one preset with Daylight and Party processing selected by an explicit two-position control, defaulting to Daylight;
- **None** - as shot, watermark only.

B&W, CineStill-style, Polaroid-style, digicam and the seven Dazz-style device looks are all removed rather than rebuilt: the five references justify one consumer-negative-inspired look and nothing else, and each of those other aesthetics needs its own dedicated reference set before it can be built honestly.
This supersedes the 15-chip roster of hbd-xs7 and needs the owner's sign-off as a product decision (this report is that request).

**Integration decision (2026-08-16, owner)**: Daylight is provisionally approved and integrated into the camera; Party remains experimental because no representative low-light phone input exists yet.
Party is therefore exposed only where `NEXT_PUBLIC_APP_ENV` is not `production` - a staging-only Daylight/Party control labeled "Party · testing" - so it can be exercised on real phones in bright and dark scenes, and it must not appear in production until explicitly approved.
Legacy film ids persisted by hbd-xs7 map to Wedding Film Daylight on load ('none' stays None); previously developed shots stay valid because their pixels are baked (ADR 0006) and `Shot.film` is only a label.
Automatic lighting selection is deferred until the separately labeled capture set in §6 exists; no heuristic silently changes a guest's chosen rendering in v1.
The develop-at-capture contract of ADR 0006 is unchanged: baked pixels, no negative, stamp and watermark as shipped.

## 8. Reproducibility

Everything measured in §1 is reproducible from the companion script `docs/research/memoroll-film-look.stats.mjs`.

- **Runner**: Playwright-driven headless Chromium (`node docs/research/memoroll-film-look.stats.mjs`), reading every file in `src/assets/filter-camera/` and printing one JSON stats line per image.
- **Decode & color space**: images are decoded by the browser and drawn to an sRGB 2D canvas; no ICC handling beyond the browser's own conversion, 8-bit per channel.
Display-P3 sources are therefore measured after the browser's mapping to sRGB - a known, acceptable approximation, and the same mapping the production pipeline will see.
- **Resize**: each image is drawn at width 300 (height proportional) with the canvas default bilinear-style resampling before measurement, to keep JPEG micro-noise from dominating statistics.
- **Luma formula**: Rec. 709 weights, `L = 0.2126·R + 0.7152·G + 0.0722·B`, on gamma-encoded values (a deliberate simplification; all comparisons use the same formula).
- **Statistics**: mean RGB; luminance percentiles p5/p25/p50/p75/p95 (sorted luma array); shadow/highlight casts as mean RGB of the darkest/brightest luminance deciles; clip fractions as % of pixels with luma ≥ 250 and ≤ 5; mean saturation as `(max−min)/max` over pixels with max > 25.
- **Curve derivation**: no untreated originals exist for the five references, so an input-to-output film transform cannot be measured from this set.
  The §9 control points are hand-authored candidate curves constrained by the references' output distributions: the daylight candidate targets references 1, 4 and 5, while the low-light candidate assumes an already-dark capture and targets references 2 and 3.
  They are hypotheses to tune through the contact sheet, not recovered stock sensitometry.
  Interpolation between control points is monotone cubic (Fritsch–Carlson), so the candidate curves cannot overshoot or oscillate.
- **Comparison output**: the contact-sheet harness (scratchpad `filter-proof.html` pattern from hbd-xs7) renders inputs through candidate recipes side by side; the implementation ticket should commit its final version next to this report.

## 9. Implementation-ready candidate specification: Wedding Film v1

The algorithm below is exact and self-contained; its visual parameters remain candidates until the contact sheet is approved.
Curves are `(input, output)` pairs normalized 0–1, interpolated monotone-cubic (Fritsch–Carlson), and baked to 256-entry per-channel `Uint8Array` LUTs at preset load.
For each LUT index `i`, let `x = i/255` and `m = master(x)`; construct `R = clamp01(m + redOffset(x))`, `G = clamp01(m)`, and `B = clamp01(m + blueOffset(x))`, then round each channel to 0–255.
After the LUT lookup, normalize RGB to 0–1 and compute `L = 0.2126R + 0.7152G + 0.0722B` and `s = max(R,G,B) − min(R,G,B)`.
For coefficient `k`, compute `sTarget = clamp01(s + k·s·(1−s))`, `factor = s > 0 ? sTarget/s : 1`, then replace each channel `C` with `clamp01(L + (C−L)·factor)`.
Compute grain weight from this post-saturation luma, add grain, clamp, multiply by the vignette gain, and clamp again before writing bytes.
Pipeline order per shot: LUT + saturation + grain + vignette in one pixel pass → highlight bloom (low-light only) → date stamp → watermark → JPEG (`quality 0.78`).

**Variant selection**:
a two-position Daylight/Party control on the camera picks the variant and defaults to Daylight.
There is no automatic classifier in v1.

**Wedding Film · Daylight** (grounded in references 1, 4, 5):
master curve: (0, 0.031) (0.06, 0.075) (0.25, 0.26) (0.50, 0.54) (0.75, 0.78) (0.92, 0.885) (1.0, 0.93);
red offset: +0.02, ramping in above input 0.75;
blue offset: −0.055 at 0.0 → −0.02 at 0.5 → −0.04 at 1.0 (warm shadows, warm highlights, mids nearly neutral);
saturation: `s' = s + 0.15·s·(1−s)` around Rec. 709 luma;
grain: amplitude 5/255, tile at 2× scale, weight `w(L) = 1 − 0.85·smoothstep(0.45, 0.98, L)`;
vignette: cos⁴-shaped radial gain, minimum 0.90 at the corners;
highlight bloom: none.

**Wedding Film · Low-light** (grounded in references 2, 3):
master curve: (0, 0.055) (0.08, 0.10) (0.30, 0.32) (0.55, 0.62) (0.80, 0.82) (1.0, 0.92);
red offset: +0.02 above input 0.7;
blue offset: −0.10 in the toe, easing to −0.03 by the highlights as `−0.10 + 0.07·smoothstep(0.2, 0.7, x)` (revised after the first contact sheet: the original −0.05-at-1.0 easing held too much blue kill in the mid-tones and pushed skin warmth to ΔR−B ≈ +38, past §6's +5..+25 band; the fog belongs to the shadows, as in references 2/3);
saturation coefficient: 0.22;
grain: amplitude 8/255, tile at 1.5× scale (coarser), same `w(L)`;
vignette: minimum gain 0.84 at the corners;
highlight bloom: threshold luma ≥ 240 on a quarter-scale copy of the ORIGINAL pre-LUT frame (the Party shoulder caps processed whites near 235, so masking the processed image would starve the bloom), blur via one down/up-scale cycle (≈6px at 480 width), tint `rgb(255, 140, 90)`, composite `screen` at alpha 0.15 over the processed image.

**Grain tile** (per shot): 240×320 `Int8`, initialized from a per-shot seed, smoothed once with a wrapped 3×3 box pass so opposite edges remain continuous, normalized to unit RMS, and bilinearly sampled with different wrapped coordinate offsets per channel.
For spatial scale `q`, sample source coordinate `(x/q, y/q)` modulo the tile dimensions; Daylight uses `q=2`, and Party uses `q=1.5`.
Add the sampled value as `channel += noise · amplitude · w(L)` inside the pixel pass, where normalized `noise` has zero mean and unit RMS.

**None**: identity pixels; watermark only; stamp none (unchanged semantics from hbd-xs7).

**Preview** (approximate by declaration):
Daylight: CSS `filter: saturate(1.1) contrast(1.05) brightness(1.02) sepia(0.08)` on the viewfinder (sepia at 0.08 is acceptable *here* because the preview is declared approximate; it never touches pixels);
Low-light: CSS `filter: saturate(1.15) contrast(1.1) brightness(1.03)` plus the existing vignette overlay at the variant's strength;
grain and bloom are not previewed;
the viewfinder carries a small permanent "preview approximates the developed look" hint, and the §6.5 on-device diagnostic decides whether a tighter preview is ever promised.

**Performance target to measure, not assume**: capture-to-developed-preview should remain below 100 ms on a 2020-class phone; record pixel-pass, bloom and JPEG timings separately during the on-device check.
LUTs and the vignette map are computed once per variant; the grain tile is generated once per shot.
**Compatibility invariants**: no `ctx.filter`; no SVG filter on `<video>`; blurs only via scale-down/up draws; `toDataURL` today, `toBlob` when the upload service lands.

## Sources

Kodak Portra 400 datasheet, pub. E-4050 - https://kodakprofessional.com/sites/default/files/2025-07/e4050.pdf.
Kodak Gold 200 datasheet, pub. E-7022 - https://business.kodakmoments.com/sites/default/files/files/resources/E7022_Gold_200.pdf.
Kodak UltraMax 400 datasheet, pub. E-7023 - https://125px.com/docs/film/kodak/E7023-Ultra_Max_400.pdf.
Kodak Portra 800 datasheet, pub. E-4040 - https://business.kodakmoments.com/sites/default/files/files/products/e4040_portra_800.pdf.
Characteristic curves explainer - https://www.35mmc.com/07/02/2022/contrast-and-tonality-part-3-characteristic-curves-for-film-and-paper-by-sroyon/.
Color print film basics - https://james.li/2023/color-print-film-basics.html.
Portra 400 latitude test - https://petapixel.com/2018/02/05/test-reveals-exposure-limits-kodak-portra-400-film/.
Film emulation for colorists - https://pixeltoolspost.com/blogs/resolve/film-emulation-explained.
CineStill halation FAQ - https://cinestillfilm.com/pages/frequently-asked-questions.
Realistic film grain rendering (IPOL 2017) - https://www.ipol.im/pub/art/2017/192/.
Noritsu vs Frontier scans - https://richardphotolab.com/blogs/post/its-back-noritsu-vs-frontier and https://www.thegingerlab.com/frontier-vs-noritsu.
Olympus mju-II review - https://casualphotophile.com/2018/09/27/olympus-mju-ii-film-camera-review/.
Yashica T4 review - https://casualphotophile.com/2019/05/06/yashica-t4-camera-review/ and https://www.35mmc.com/30/08/2019/yashica-t4-review/.
Kodak FunSaver review and specs - https://casualphotophile.com/2018/10/08/kodak-funsaver-disposable-camera-review-cheap-is-good/ and https://filmphotography.eu/en/kodak-funsaver/.
Fujifilm QuickSnap specifications - https://www.fujifilm.com/us/en/consumer/films/quicksnap/specifications.
Guide number / flash falloff - https://en.wikipedia.org/wiki/Guide_number.
Red-eye effect - https://en.wikipedia.org/wiki/Red-eye_effect.
Flash vs tungsten balance - https://en.wikipedia.org/wiki/Tungsten_film and https://digital-photography-school.com/balancing-color-for-flash-and-ambient-light-using-gels/.
Small-CCD highlight clipping and fringing - https://www.dpreview.com/forums/threads/cyan-skies-and-purple-fringing.1384714/.
Digital nostalgia interview - https://www.dpreview.com/interviews/5683481585/sofi-lee-on-digital-nostalgia.
MediaTrackConstraints torch - https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#torch.
Canvas 2D filter support - https://caniuse.com/mdn-api_canvasrenderingcontext2d_filter and https://github.com/davidenke/context-filter-polyfill.
WebKit Safari 18.0 features - https://webkit.org/blog/15443/webkit-features-in-safari-18-0/.
feComponentTransfer - https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feComponentTransfer.
3D LUTs on GPU - https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-24-using-lookup-tables-accelerate-color.
WebGL2 support - https://caniuse.com/webgl2.
iOS WebGL context loss - https://bugs.webkit.org/show_bug.cgi?id=262628.
OffscreenCanvas support - https://caniuse.com/offscreencanvas.
Vignetting (cos⁴ law) - https://en.wikipedia.org/wiki/Vignetting.
GLSL film grain - https://github.com/mattdesl/glsl-film-grain.
toDataURL - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL.
