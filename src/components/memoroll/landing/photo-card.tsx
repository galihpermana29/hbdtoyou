/**
 * The face of one print on the hero's arc: a white-bordered photograph, either
 * sharp or undeveloped. Undeveloped is a solid #1b1b1b block over the whole
 * photograph, blurred by 4.866px, so its edges fade into the photograph
 * beneath rather than stopping at the border: the dark never reaches the edge
 * of the frame, and a sliver of the photograph shows round it.
 *
 * Where a print sits and how far it is turned belongs to the carousel, not to
 * the print, because both change every frame. A print that is half developed
 * is not a third kind of face: it is the sharp face showing on one side of the
 * flame line and the undeveloped one on the other (see `hero-carousel.tsx`).
 */
export const PRINT_WIDTH = 233.561;
export const PRINT_HEIGHT = 342;

export default function PhotoCard({
  src,
  undeveloped = false,
}: {
  src: string;
  undeveloped?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-center bg-[#fdfdfd] p-[5.561px]"
      style={{ width: PRINT_WIDTH, height: PRINT_HEIGHT }}>
      <div className="relative h-[330.878px] w-[222.439px] shrink-0 overflow-clip">
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        {undeveloped && (
          <div className="pointer-events-none absolute -left-[0.55px] top-[0.02px] h-[330.878px] w-[223.134px] bg-[#1b1b1b] blur-[4.866px]" />
        )}
      </div>
    </div>
  );
}
