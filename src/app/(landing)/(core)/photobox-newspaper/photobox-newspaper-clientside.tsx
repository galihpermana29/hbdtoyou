'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { message, notification, Progress, Spin, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Download, RotateCcw, Newspaper, Contrast, LogIn } from 'lucide-react';

import NavigationBar from '@/components/ui/navbar';
import { useMemoifySession } from '@/app/session-provider';
import { uploadImageClientSide } from '@/lib/upload';
import { createContent, getAllTemplates } from '@/action/user-api';

// Request a 4:3 stream; the slot is 16:9 so object-cover trims top/bottom.
const videoConstraints = {
  facingMode: 'user',
  width: 1280,
  height: 960,
};

// The photo slot's aspect ratio. Captures are center-cropped to exactly this
// so their pixels already match the slot — html2canvas ignores `object-fit`
// and would otherwise stretch a 4:3 frame to fill the 16:9 box on export.
const SLOT_ASPECT = 16 / 9;

type TemplateKey = 'broadsheet' | 'classic';

// Per-template styling. The frame markup is shared; these tokens + flags drive
// the look so a user can switch templates live, even after capturing.
const TEMPLATES: Record<
  TemplateKey,
  {
    label: string;
    icon: typeof Newspaper;
    paperBg: string;
    ink: string;
    photoBg: string;
    photoFilter: string;
    grainPaper: boolean;
    grainPhoto: boolean;
    mastheadClass: string;
    displayClass: string;
    bodyClass: string;
    ruleWidth: string; // px for the thick section rules
    dateline: boolean;
    columnDivider: boolean;
    // Per-template front-page copy.
    brand: string; // small italic line above the masthead
    eyebrowLeft: string;
    eyebrowRight: string;
    masthead: string; // big blackletter nameplate
    quote: string; // pull-quote headline under the photo
    body: [string, string]; // two body columns
  }
> = {
  broadsheet: {
    label: 'Aged Broadsheet',
    icon: Newspaper,
    paperBg: '#f4f1ea',
    ink: '#1a1a1a',
    photoBg: '#e8e2d6',
    photoFilter: 'grayscale(1) sepia(0.42) contrast(1.12) brightness(1.02)',
    grainPaper: true,
    grainPhoto: true,
    mastheadClass: 'blackletter-font',
    displayClass: 'np-display',
    bodyClass: 'np-body',
    ruleWidth: '3px',
    dateline: true,
    columnDivider: true,
    brand: 'Memoify',
    eyebrowLeft: 'Special Frame',
    eyebrowRight: 'Memoify Newspaper',
    masthead: 'Love of The Week',
    quote:
      '“Front-page proof that these two are hopelessly, happily, head-over-heels in love.”',
    body: [
      `From the very first frame, it was never really about the photos — it was about the way they look at each other when they think no one is watching. Every glance, every laugh, every almost-kiss caught mid-pose told the same quiet little story: these two are completely, helplessly smitten.`,
      `Between the playful poses and the candid in-betweens, they turned an ordinary afternoon into something straight out of a love story. No filters, no fuss — just two people who make each other ridiculously happy, and a front page lucky enough to hold the proof.`,
    ],
  },
  classic: {
    label: 'Classic B&W',
    icon: Contrast,
    paperBg: '#ffffff',
    ink: '#000000',
    photoBg: '#000000',
    photoFilter: 'grayscale(1) contrast(1.05)',
    grainPaper: false,
    grainPhoto: false,
    mastheadClass: 'blackletter-font',
    displayClass: 'font-serif',
    bodyClass: 'font-serif',
    ruleWidth: '1px',
    dateline: false,
    columnDivider: false,
    brand: 'Terbit Sejak 1998',
    eyebrowLeft: 'Memoify.live · Edisi Politik',
    eyebrowRight: 'Harga Rp 5.000',
    masthead: 'Suara Rakyat',
    quote: '#MENUJUINDONESIABANGKRUT KARENA MBG',
    body: [
      `Kami datang tanpa senjata. Tak membawa laras yang menganga, tak menyelipkan peluru di saku celana, tak menyusun strategi untuk merebut kuasa. Kami hanya mengenakan almamater semata, selembar kain yang menjelma cita-cita, yang dijahit dari uang orang tua, dan mimpi-mimpi tentang negeri yang lebih manusia. Kami datang dengan poster yang mulai pudar warnanya, dengan tenggorokan yang serak karena bertanya, dengan kaki yang rela menempuh panas kota, demi satu harapan sederhana, didengar suaranya.`,
      `Bukankah kami seharusnya disambut dengan tawa? Dengan ruang dialog yang terbuka? Dengan tangan yang mengajak berbicara? Bukan dengan pagar besi yang ditinggikan berkali-kali lipatnya. Sebab kami bukan musuh negara. Kita lahir dari rahim yang sama, menghirup udara yang sama, dan tumbuh dari tanah yang sama. Kalau kami berdiri di jalan raya, itu karena terlalu banyak pintu yang terkunci rapat adanya. Kalau suara kami meninggi nadanya, itu karena terlalu lama jawaban disimpan dalam sunyi yang sengaja dipelihara. Maka dengarkanlah, sebelum sunyi itu tumbuh menjadi sesuatu yang tak lagi bisa kalian redam.`,
    ],
  },
};

const TEMPLATE_ORDER: TemplateKey[] = ['classic', 'broadsheet'];

/** Center-crop a captured frame to the slot's 16:9 ratio (no color change). */
const cropTo169 = (base64: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const { width: iw, height: ih } = img;
      let sw = iw;
      let sh = ih;
      let sx = 0;
      let sy = 0;
      if (iw / ih > SLOT_ASPECT) {
        sw = ih * SLOT_ASPECT;
        sx = (iw - sw) / 2;
      } else {
        sh = iw / SLOT_ASPECT;
        sy = (ih - sh) / 2;
      }
      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64);
        return;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
  });

/**
 * Bake the selected template's photo treatment (filter + optional grain) into
 * the bitmap, so the look survives the html2canvas export — which only
 * partially supports CSS `filter`.
 */
const applyTreatment = (
  base64: string,
  filter: string,
  grain: boolean
): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64);
        return;
      }
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
      if (grain) {
        const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < px.data.length; i += 4) {
          const n = (Math.random() - 0.5) * 26;
          px.data[i] += n;
          px.data[i + 1] += n;
          px.data[i + 2] += n;
        }
        ctx.putImageData(px, 0, 0);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
  });

const PhotoboxNewspaperPage = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const [template, setTemplate] = useState<TemplateKey>('classic');
  const [rawCropped, setRawCropped] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [grain, setGrain] = useState<string | null>(null);

  const session = useMemoifySession();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const t = TEMPLATES[template];

  // Generate a faint noise tile once on mount for the aged paper texture. A
  // data-URI PNG (unlike an SVG noise filter) renders reliably in html2canvas.
  useEffect(() => {
    const tile = document.createElement('canvas');
    tile.width = 120;
    tile.height = 120;
    const ctx = tile.getContext('2d');
    if (!ctx) return;
    const data = ctx.createImageData(120, 120);
    for (let i = 0; i < data.data.length; i += 4) {
      const v = 150 + Math.random() * 90;
      data.data[i] = v;
      data.data[i + 1] = v;
      data.data[i + 2] = v;
      data.data[i + 3] = Math.random() * 16; // very low alpha
    }
    ctx.putImageData(data, 0, 0);
    setGrain(tile.toDataURL());
  }, []);

  // Re-treat the captured photo whenever it changes or the template switches.
  useEffect(() => {
    if (!rawCropped) {
      setCapturedImage(null);
      return;
    }
    let active = true;
    applyTreatment(rawCropped, t.photoFilter, t.grainPhoto).then((out) => {
      if (active) setCapturedImage(out);
    });
    return () => {
      active = false;
    };
  }, [rawCropped, t.photoFilter, t.grainPhoto]);

  const openNotification = (progress: number = 0, key: any) => {
    api.open({
      message: (
        <p className="text-[14px] text-black font-[600]">
          {progress < 100 ? `Uploading ${progress}%` : 'Uploading completed'}
        </p>
      ),
      description: (
        <div>
          <Progress percent={progress} />
        </div>
      ),
      duration: 2000,
      key,
    });
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    const shot = webcamRef.current.getScreenshot();
    if (!shot) {
      message.error('Could not access the camera. Please allow camera access.');
      return;
    }
    const cropped = await cropTo169(shot);
    setRawCropped(cropped);
  }, []);

  // 3-second countdown, then snap — mirrors the existing Photobox behaviour.
  const handleCaptureClick = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        capture();
      }
    }, 1000);
  };

  const handleRetake = () => setRawCropped(null);

  const handleSave = async () => {
    if (!capturedImage || !frameRef.current) {
      message.error('Capture a photo first.');
      return;
    }
    try {
      setLoading(true);

      // 1. Snapshot the whole designed newspaper to a single PNG.
      const canvas = await html2canvas(frameRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: t.paperBg,
        logging: false,
      });
      const base64 = canvas.toDataURL('image/png');

      // 2. Upload to Cloudinary.
      const key = uuidv4();
      const uploaded = await uploadImageClientSide(
        base64 as unknown as any,
        'premium',
        openNotification,
        key
      );
      const imageUrl = uploaded.data;

      // 3. Resolve our own template_id by slug (env-proof; the UUID differs
      //    between staging and production). No template-picker in this flow.
      const templates = await getAllTemplates();
      const tpl = templates?.data?.find((x) => x.slug === 'photobox-newspaper');
      if (!tpl) {
        message.error('Could not save right now. Please try again later.');
        return;
      }

      const payload = {
        template_id: tpl.id,
        detail_content_json_text: JSON.stringify({
          image: imageUrl,
          template,
        }),
        title: t.masthead,
        caption: '',
        date_scheduled: null,
        dest_email: null,
        is_scheduled: false,
        status: 'published',
      };

      const res = await createContent(payload);
      if (res.success && res.data) {
        router.push(`/photobox-newspaper/${res.data}`);
      } else {
        message.error(res.message || 'Failed to save. Please try again.');
      }
    } catch {
      message.error('Something went wrong while saving. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const phase: 'login' | 'capture' | 'review' = !session?.accessToken
    ? 'login'
    : rawCropped
      ? 'review'
      : 'capture';

  return (
    <div>
      {contextHolder}
      <Spin fullscreen spinning={loading} />

      <div className="fixed top-0 left-0 w-full z-10">
        <NavigationBar />
      </div>

      <div className="mt-[120px] pb-[160px]">
        <div className="px-[20px] mx-auto max-w-6xl 2xl:max-w-7xl mb-[20px]">
          <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
            Photobox Newspaper
          </h1>
          <p className="text-[#7B7B7B] text-[14px] font-[400]">
            Strike a pose — your shot lands straight on the front page.
          </p>
        </div>

        <div className="flex flex-col items-center px-[20px]">
          {/* The newspaper frame. The image slot holds the live camera while
              shooting, then the frozen capture. frameRef is what html2canvas
              snapshots on save. */}
          <motion.div
            key={template}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            ref={frameRef}
            className="w-full max-w-4xl border"
            style={{
              backgroundColor: t.paperBg,
              color: t.ink,
              borderColor: t.ink,
              backgroundImage:
                t.grainPaper && grain ? `url(${grain})` : undefined,
            }}>
            {/* Masthead */}
            <div
              className="px-8 pt-6 pb-5"
              style={{
                borderBottom: `${t.ruleWidth} solid ${t.ink}`,
              }}>
              <div
                className={`${t.displayClass} text-center text-[17px] italic mb-1`}>
                {t.brand}
              </div>
              <div
                className={`flex justify-between items-end ${t.bodyClass} text-[12px] uppercase tracking-[0.18em]`}>
                <span>{t.eyebrowLeft}</span>
                <span>{t.eyebrowRight}</span>
              </div>
              <h2
                className={`${t.mastheadClass} text-center text-[68px] leading-[1.1] mt-3 pb-1`}>
                {t.masthead}
              </h2>
            </div>

            {/* Dateline strip (broadsheet only) */}
            {t.dateline && (
              <div
                className={`px-8 py-1.5 text-center ${t.bodyClass} text-[11px] uppercase tracking-[0.22em]`}
                style={{ borderBottom: `1px solid ${t.ink}` }}>
                Vol. 1 · No. 1 — Jakarta, {dayjs().format('dddd, DD MMMM YYYY')}{' '}
                — Price 25¢
              </div>
            )}

            {/* Image slot — live webcam or frozen capture */}
            <div
              className="relative w-full aspect-[16/9] overflow-hidden"
              style={{
                backgroundColor: t.photoBg,
                borderBottom: `${t.ruleWidth} solid ${t.ink}`,
              }}>
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Your newspaper photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                  style={{ filter: t.photoFilter }}
                />
              )}

              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-6xl font-bold">
                  {countdown}
                </div>
              )}
            </div>

            {/* Pull quote */}
            <div
              className="px-8 py-6"
              style={{ borderBottom: `1px solid ${t.ink}` }}>
              <p
                className={`${t.displayClass} font-bold text-center text-[32px] leading-tight`}>
                {t.quote}
              </p>
            </div>

            {/* Body columns */}
            <div
              className={`grid grid-cols-2 px-8 py-7 ${
                t.columnDivider ? 'gap-0' : 'gap-8'
              }`}>
              {t.body.map((col, i) => (
                <p
                  key={i}
                  className={`${t.bodyClass} text-[15px] leading-relaxed text-justify ${
                    t.columnDivider ? (i === 1 ? 'pl-8' : 'pr-8') : ''
                  }`}
                  style={
                    t.columnDivider && i === 1
                      ? { borderLeft: `1px solid ${t.ink}` }
                      : undefined
                  }>
                  {col}
                </p>
              ))}
            </div>

            {/* Footer */}
            <div
              className={`px-8 py-3 flex justify-between ${t.bodyClass} text-[12px] uppercase tracking-[0.18em]`}
              style={{ borderTop: `${t.ruleWidth} solid ${t.ink}` }}>
              <span>Vol. 1 — No. 1</span>
              <span>{dayjs().format('DD MMM YYYY')}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating dock toolbar */}
      <motion.div
        initial={{ y: 90, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
        {/* Template switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-[#f4f1ea] p-1">
          {TEMPLATE_ORDER.map((key) => {
            const cfg = TEMPLATES[key];
            const Icon = cfg.icon;
            const active = template === key;
            return (
              <Tooltip key={key} title={cfg.label}>
                <button
                  onClick={() => setTemplate(key)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                  aria-label={cfg.label}>
                  {active && (
                    <motion.span
                      layoutId="tpl-active"
                      className="absolute inset-0 rounded-lg bg-[#E34013]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={`relative z-10 ${active ? 'text-white' : 'text-black/55'}`}
                  />
                </button>
              </Tooltip>
            );
          })}
        </div>

        <span className="mx-1 h-7 w-px bg-black/10" />

        {/* Actions */}
        <AnimatePresence mode="wait">
          {phase === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}>
              <Tooltip title="Continue with Google to capture">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signIn('google')}
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#E34013] px-4 text-[14px] font-[600] text-white">
                  <LogIn size={18} />
                  Sign in
                </motion.button>
              </Tooltip>
            </motion.div>
          )}

          {phase === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}>
              <Tooltip title="Capture">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={handleCaptureClick}
                  disabled={countdown !== null}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E34013] text-white disabled:opacity-50"
                  aria-label="Capture">
                  <Camera size={20} />
                </motion.button>
              </Tooltip>
            </motion.div>
          )}

          {phase === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2">
              <Tooltip title="Retake">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={handleRetake}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-black/70"
                  aria-label="Retake">
                  <RotateCcw size={18} />
                </motion.button>
              </Tooltip>
              <Tooltip title="Save & continue">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#E34013] px-4 text-[14px] font-[600] text-white"
                  aria-label="Save and continue">
                  <Download size={18} />
                  Save
                </motion.button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PhotoboxNewspaperPage;
