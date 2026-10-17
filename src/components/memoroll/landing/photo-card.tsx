/**
 * The face of one print on the hero's arc: a white-bordered photograph, either
 * sharp or undeveloped (a dark copy of the same photograph, blurred, over all
 * of it).
 *
 * Where a print sits and how far it is turned belongs to the carousel, not to
 * the print, because both change every frame. A print that is half developed
 * is not a third kind of face: it is the sharp face showing on one side of the
 * flame line and the undeveloped one on the other (see `hero-carousel.tsx`).
 */
export const PRINT_WIDTH = 233.561;
export const PRINT_HEIGHT = 342;

export default function PhotoCard({ undeveloped = false }: { undeveloped?: boolean }) {
  return (
    <div
      className="flex items-center justify-center bg-[#fdfdfd] p-[5.561px]"
      style={{ width: PRINT_WIDTH, height: PRINT_HEIGHT }}>
      <div className="relative h-[330.878px] w-[222.439px] shrink-0 overflow-clip">
        <img
          src="/memoroll-landing/photo.jpg"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        {undeveloped && (
          <img
            src="/memoroll-landing/blur.png"
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none blur-[4.866px]"
          />
        )}
      </div>
    </div>
  );
}
