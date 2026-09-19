# Satualbum public event camera research

Research date: 2026-08-16.

Scope: inspection of Satualbum's public event page, its first-party JavaScript and CSS bundles, public LUT assets, and primary browser/API documentation.
The initial research was passive.
With the owner's later permission, one headless session joined the event as `MemoRoll Research`, creating one guest record.
No photo was opened or uploaded, no camera permission was requested, and the joined session ended before the gated camera module was loaded.

## Key findings

1. The event `KK0PhwooVhMmU5UL1cny` uses the `portra` preset.
   A passive render of the public event page exposed `event.preset: "portra"` in the page's React component props.
   The visible page identified the event as "Our Wedding Day" and the host as Galih Permana.
   Source: [public event page](https://www.satualbum.id/events/KK0PhwooVhMmU5UL1cny).

2. There is no public evidence that this Satualbum camera controls the phone's real flash or torch.
   The first-party bundles served to the public event page contain no `ImageCapture`, `takePhoto`, `getUserMedia`, `getCapabilities`, `applyConstraints`, `fillLightMode`, or `torch` camera-control calls.
   This absence is not proof that the gated camera module lacks them because an unauthenticated request to `/camera` redirects to the event landing page and does not serve that route's camera module.
   Under the no-join constraint, the correct conclusion is "not publicly verified," not "impossible."

3. Satualbum definitely implements a white-screen shutter animation.
   Its public CSS defines `cameraSnap` as a 380 ms overlay that starts black, turns white at 32%, fades to 35% white at 72%, and then disappears.
   That is visual UI feedback.
   It is not synchronized illumination from the rear LED and is too late to improve an already captured exposure unless deliberately shown before capture.
   Source: [public CSS bundle](https://www.satualbum.id/_next/static/chunks/0e2_6bwbl54cb.css?dpl=dpl_5Jgy8kWAC2yVaZQd5TuDLVk4SPsr).

4. Satualbum definitely applies film development in the browser before upload.
   The main path uses WebGL 2 shaders and a 33-cube 3D LUT.
   The fallback uses Canvas 2D pixel processing.
   The resulting WebP or JPEG, thumbnail, and optional preview are then uploaded directly to storage.
   The inspected upload path does not send an unfiltered original to a server-side filter endpoint.

5. The Portra look includes synthetic highlight glow.
   Portra's public parameters enable both warm halation and neutral bloom.
   These are post-processing around bright pixels and must not be described as a real camera flash.

## Four different meanings of "flash"

### Synchronized camera flash

This is the phone LED firing for the still exposure.
The standards path is `ImageCapture.takePhoto({ fillLightMode: "flash" })`, after confirming that `getPhotoCapabilities().fillLightMode` includes `flash`.
The W3C specification says `flash` always causes the fill light to fire for that `takePhoto()` exposure.
Source: [W3C MediaStream Image Capture, FillLightMode](https://w3c.github.io/mediacapture-image/#filllightmode-enum).

Satualbum use: not verified from the publicly served modules.

### Continuous hardware torch

This is the rear LED staying on while the video track is active.
It is a live `MediaStreamTrack` constraint, normally requested with `track.applyConstraints({ advanced: [{ torch: true }] })`.
The W3C capability reports `[true, false]` when script can control the torch.
This is not synchronized to a single frame and can change exposure, white balance, battery use, heat, and subject behavior before capture.
Source: [W3C MediaStream Image Capture, torch capability](https://w3c.github.io/mediacapture-image/#dom-mediatrackcapabilities-torch).

Satualbum use: not verified from the publicly served modules.

### White-screen shutter animation

This is Satualbum's `anim-camera-snap` CSS overlay.
It is present and publicly verifiable.
It provides a flash-like visual cue but does not establish any LED control.

### Post-processing bloom and halation

Satualbum extracts bright pixels in a shader, blurs them horizontally and vertically at quarter resolution, and composites the glow back over the graded image.
Warm tinted screen blending is called halation in the bundle.
Neutral additive glow is called bloom.
Both happen to pixels after the sensor produced an image.
Neither lights the scene, changes shadow geometry, creates real inverse-square flash falloff, or recovers detail the sensor did not record.

## Capture and filtering implementation

The following evidence comes from the deployment served on the research date.

### Primary WebGL 2 path

The film renderer requests a `webgl2` context with antialiasing off and preserved drawing output.
It uploads the source image or video frame as a texture and runs these stages:

- A grading pass converts sRGB to linear light, applies exposure and white-balance gains, applies a per-channel tone curve, then samples a 3D LUT with trilinear interpolation.
- Optional chromatic aberration offsets red and blue source samples near the edges.
- A bright-pass shader isolates highlights above the preset threshold.
- Two Gaussian blur passes create the glow buffer.
- A composite pass adds warm, screen-blended halation and neutral bloom.
- The same pass adds procedural grain, aspect-correct vignette, and an optional light leak.
- The canvas is encoded as WebP, with JPEG fallback.

Automatic exposure and white balance are estimated client-side from a 32 by 32 Canvas sample.
The renderer constrains auto exposure to each preset's maximum stop adjustment and white-balance gains to a bounded range.

Source: [public renderer and preset bundle](https://www.satualbum.id/_next/static/chunks/0sspv3etp4~zz.js?dpl=dpl_5Jgy8kWAC2yVaZQd5TuDLVk4SPsr).

### LUT assets

Each non-original preset has public `.bin` and `.cube` assets under `/luts/`.
The renderer tries the binary asset first and falls back to parsing the text cube.
Each `.bin` is 107,811 bytes, exactly `33 × 33 × 33 × 3`, confirming an RGB 33-cube LUT.

Portra sources:

- [portra.bin](https://www.satualbum.id/luts/portra.bin)
- [portra.cube](https://www.satualbum.id/luts/portra.cube)

### Canvas 2D fallback

If WebGL 2 is unavailable or initialization fails, the upload builder falls back to Canvas 2D.
It draws the decoded image, reads pixels with `getImageData()`, and manually applies brightness, contrast, saturation, grayscale, sepia, and hue rotation derived from each preset's legacy `cssFilter` string.
It then adds a repeated random grain texture, optional color overlay, and radial vignette before encoding.

This is not merely a CSS filter on an `<img>` or `<video>`.
The fallback bakes the result into output pixels.
Source: [public renderer and fallback bundle](https://www.satualbum.id/_next/static/chunks/0sspv3etp4~zz.js?dpl=dpl_5Jgy8kWAC2yVaZQd5TuDLVk4SPsr).

### Capture-time versus server-time processing

The public `buildUploadBlobs` path:

- decodes the input with `createImageBitmap(..., { imageOrientation: "from-image" })`;
- scales it on a canvas;
- calls the WebGL `renderToBlob`, or the Canvas 2D fallback;
- creates a 640 px thumbnail and a smaller preview;
- caps the developed photo at 2 MiB when needed;
- uploads the already-developed blobs to storage; and
- writes the chosen preset name as photo metadata.

This proves client-side development before upload for the inspected path.
No server filtering step appears in that path.
Source: [public upload bundle](https://www.satualbum.id/_next/static/chunks/0wpwwe1d6ipz9.js?dpl=dpl_5Jgy8kWAC2yVaZQd5TuDLVk4SPsr).

### Is the filter live in the viewfinder?

Not publicly verifiable under the no-join constraint.
The renderer can accept a live video element as a WebGL texture and exposes mirror, zoom, and reusable exposure values, so it is architecturally suitable for a live preview.
However, the served public event bundles only prove its use while building output blobs.
The actual camera route module was not served after the unauthenticated `/camera` request redirected to the landing page.

Therefore:

- client-side filtering at canvas development: confirmed;
- 3D LUT and WebGL use: confirmed;
- Canvas 2D pixel fallback: confirmed;
- server-side filter processing: no evidence in the inspected path;
- CSS-only baked filtering: disproved for the inspected path;
- live filtered viewfinder: unknown.

## This event's Portra preset

The WebGL preset parameters are:

- LUT: `portra`, strength `1.0`;
- auto exposure strength: `0.22`, limited to `0.4` stops;
- white-balance strength: `0.10`;
- contrast: `0.92`;
- lifted toe: `0.10`;
- highlight shoulder: `0.80`;
- warm halation: intensity `0.10`, threshold `0.85`, radius `0.012`, tint `[1.0, 0.72, 0.48]`;
- neutral bloom: intensity `0.05`, threshold `0.86`;
- grain: amount `0.18`, size `0.0012`, mono mix `0.95`;
- vignette: amount `0.25`, feather `0.65`;
- chromatic aberration and light leak: off.

Its Canvas fallback uses `saturate(0.9) contrast(0.88) brightness(1.1) sepia(0.1) hue-rotate(-8deg)`, plus grain, warm overlay, and vignette.
The preset's public description is "Legendary skin tones, soft pastels, and dreamy highlights."
Source: [public renderer and preset bundle](https://www.satualbum.id/_next/static/chunks/0sspv3etp4~zz.js?dpl=dpl_5Jgy8kWAC2yVaZQd5TuDLVk4SPsr).

## iOS Safari versus Android Chrome

### Android Chrome

Chrome's official documentation says Image Capture has been available on Android since Chrome 59.
It distinguishes two hardware-light controls:

- flash mode is a non-live photo setting supplied to `takePhoto()`;
- torch mode is a live `MediaStreamTrack` capability changed with `applyConstraints()`.

`takePhoto()` can use the camera's still-photo path and highest available photographic resolution.
`grabFrame()` or drawing a video frame to canvas is limited to the stream's video resolution.
Source: [Chrome for Developers, Take photos and control camera settings](https://developer.chrome.com/blog/imagecapture).

Support is still device and selected-camera dependent.
MemoRoll must inspect the selected rear track's capabilities rather than assume that every Android phone or lens exposes an LED.

### iOS Safari

Apple added the Image Capture API in Safari 18.4, released 2025-03-31 for iOS 18.4 and the other listed Apple platforms.
The same release fixed stale `getSettings()` values for `torch` and `whiteBalanceMode`.
Source: [Apple Safari 18.4 release notes](https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes).

WebKit's merged implementation shows:

- `ImageCapture.takePhoto()` is implemented through `AVVideoCaptureSource`;
- `fillLightMode` is mapped to `AVCaptureFlashMode`; and
- torch is exposed in `MediaTrackCapabilities`, `MediaTrackSettings`, and media constraints.

Sources:

- [WebKit ImageCapture.takePhoto implementation](https://github.com/WebKit/WebKit/pull/19544)
- [WebKit torch implementation](https://github.com/WebKit/WebKit/pull/18249)

Safari 26 subsequently added `ImageCapture.grabFrame()`.
Source: [WebKit features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/).

The practical compatibility boundary is:

- Android Chrome 59 and later has the Image Capture API path, subject to hardware capabilities.
- iOS Safari before 18.4 must not be assumed to have `ImageCapture.takePhoto()`.
- iOS Safari 18.4 and later has the API and WebKit hardware-control implementation, but capability checks remain mandatory.
- A browser recognizing the constraint is not enough.
  The selected track must report controllable torch values, and photo capabilities must report `flash`, before MemoRoll presents those controls as available.

No permission-free documentation check can prove behavior for a particular phone, rear lens, browser build, or WebView.

## Implications for MemoRoll

1. Use precise UI names.
   "Flash" should mean synchronized `takePhoto({ fillLightMode: "flash" })`.
   "Torch" should mean continuous LED illumination.
   "Shutter flash" should mean a screen animation.
   "Highlight bloom" should mean post-processing.

2. Feature-detect after obtaining the selected rear camera track.
   Show synchronized flash only when `ImageCapture` exists and photo capabilities include `flash`.
   Show torch only when the track capabilities report both `true` and `false`.
   Treat failures from `applyConstraints()` or `takePhoto()` as normal capability failures and fall back cleanly.

3. Do not use continuous torch as a silent substitute for synchronized flash.
   It changes the live scene and auto-exposure before capture, drains battery, produces heat, and has different photographic character.
   If offered as a fallback, label it "Torch" and require an explicit user action.

4. Keep visual shutter feedback separate from exposure behavior.
   A post-capture white overlay can make the UI feel responsive, but it should never imply that the rear LED fired.
   If MemoRoll uses a screen as front-camera fill, it must become bright before the exposure and remain a separately named feature.

5. Satualbum's strongest reusable idea is deterministic browser-side development.
   A 3D LUT supplies color identity while explicit tone, glow, grain, and vignette parameters remain inspectable and tunable.
   The developed file, thumbnail, and preview stay visually aligned because they originate from one client pipeline.

6. Preserve a non-WebGL fallback, but make parity measurable.
   Satualbum's fallback uses a different algorithm from its LUT shader, so exact output parity is not guaranteed.
   MemoRoll should either provide a portable pixel pipeline with matching math or define and test an acceptable visual tolerance.

7. Separate preview confidence from keeper confidence.
   Satualbum's public code proves developed output, not live-preview parity.
   MemoRoll should test the same source frame through preview and keeper paths, especially for exposure, crop, mirror, orientation, LUT interpolation, grain scale, and glow.

8. Do not expect bloom to reproduce direct-flash photography.
   Bloom can soften and spread recorded highlights.
   It cannot create the hard frontal shadows, short-range falloff, catchlights, red-eye, or foreground-to-background separation produced by real synchronized light.

## Limits and confidence

High confidence:

- event preset is Portra;
- white-screen shutter animation exists;
- WebGL 2, 33-cube LUTs, shader bloom/halation, grain, vignette, and Canvas fallback exist;
- filtering occurs client-side before upload in the inspected path;
- the public page's served modules contain no hardware flash or torch API calls.

Unresolved:

- whether the gated Satualbum camera module uses `ImageCapture`, a canvas video snapshot, or another acquisition path;
- whether Satualbum filters every viewfinder frame live;
- whether Satualbum attempts synchronized flash or continuous torch on any supported device;
- what a specific iPhone or Android phone reports after camera permission.

Joining alone was attempted with the owner's permission, but the short-lived headless session reached the gallery rather than loading the gated camera module.
Resolving the remaining acquisition questions requires retaining a joined session while opening the camera route and, for hardware behavior, granting camera permission on a real phone.
