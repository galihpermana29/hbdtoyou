import mark from '@/assets/memoroll/memoify-mark.png';
import { colour } from './tokens';

/**
 * "Created by Memoify.live", with the little mark beside it, at the foot of
 * every guest screen. The one place Sometype Mono is used, at 10px.
 *
 * The design draws a Safari tab bar under this on every frame, which is the
 * browser it is being photographed in rather than anything the product renders.
 * The 34px of space beneath the line is kept, because on a real phone that is
 * where the browser's own chrome sits.
 *
 * `next/image` is deliberately not used: this is an 18px mark that ships in the
 * bundle, and the project turns Next's optimiser off globally anyway
 * (`images.unoptimized` in next.config.mjs), so it would buy nothing but a
 * layout wrapper around eighteen pixels.
 */
export default function MemoifyFooter({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center pb-[34px] pt-[10px] ${className}`}
      style={{ gap: 12 }}>
      <span
        className="text-[10px] font-normal leading-none"
        style={{ color: colour.ink, fontFamily: 'var(--font-mr-mono)' }}>
        Created by Memoify.live
      </span>
      <img
        src={mark.src}
        alt=""
        width={18}
        height={18}
        className="h-[18px] w-[18px]"
      />
    </div>
  );
}
