/**
 * The hairline under a header, with the short thumb riding its middle. The
 * design draws both as one union in one colour; the gallery rules itself in
 * a light grey and the Dark Room repeats it in a darker one, so the colour
 * is the caller's.
 */
export default function HeaderRule({ tint }: { tint: string }) {
  return (
    <div aria-hidden className="relative h-[2px] w-full">
      <span
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{ background: tint }}
      />
      <span
        className="absolute left-1/2 top-0 h-[2px] w-[84px] -translate-x-1/2 rounded-[2px]"
        style={{ background: tint }}
      />
    </div>
  );
}
