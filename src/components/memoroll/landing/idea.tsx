/** "The Idea!" - the one-line pitch, with the gallery the guests end up in. */
export default function MemorollIdea() {
  return (
    <section
      className="flex flex-col items-center gap-12 bg-white px-4 py-12 md:px-10 lg:gap-16"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="flex max-w-[1280px] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center rounded-full border border-[#e6e6e6] px-3 py-1.5 text-[14px] font-medium capitalize tracking-[-0.28px] text-[#e34013]">
          The Idea!
        </span>
        <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
          Everyone gets a camera, wait for the photo reveal, and see the
          results!
        </h2>
      </div>

      <div className="flex w-full max-w-[1280px] flex-col items-center gap-8 lg:flex-row lg:gap-6">
        <div className="flex w-full items-end justify-center px-4 lg:h-[490px] lg:w-[545px] lg:shrink-0 lg:justify-start lg:px-10">
          {/* The three pieces sit where they do in the design (a 1655 x 1512
              frame): the card and the polaroid are separate so they can drift. */}
          <div
            role="img"
            aria-label="The MemoRoll gallery for Elias & Freya's Wedding, with a countdown to the photo reveal"
            className="relative aspect-[1655/1512] w-full max-w-[552px] lg:-mb-[26px] lg:-ml-[17.5px] lg:w-[552px] lg:max-w-none lg:shrink-0">
            <img
              src="/memoroll-landing/idea-phone.png"
              alt=""
              className="absolute left-[15.95%] top-[3.9%] w-[52.39%]"
            />
            <img
              src="/memoroll-landing/idea-card.png"
              alt=""
              className="memoroll-float-card absolute left-[23.63%] top-0 w-[76.37%]"
            />
            <img
              src="/memoroll-landing/idea-polaroid.png"
              alt=""
              className="memoroll-float-polaroid absolute left-0 top-[53.9%] w-[33.71%]"
            />
          </div>
        </div>

        <div className="flex w-full max-w-[640px] flex-col gap-[14px]">
          <h3 className="text-[26px] font-medium text-[#1b1b1b] md:text-[32px]">
            Experience the night from every angle.
          </h3>
          <p className="max-w-[592px] text-[18px] font-normal leading-[28.8px] text-[#393838] md:text-[20px]">
            No reviewing, deleting, or missing the party to stare at a screen.
            Capture the raw moments as they happen and leave the magic on the
            roll.
          </p>
        </div>
      </div>
    </section>
  );
}
