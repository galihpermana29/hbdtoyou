/**
 * The blinking "live" dot, with a ring spreading off it (see
 * `memoroll-live-*` in globals.css). The ring sits behind the dot, so at rest
 * it is hidden under it.
 */
export default function LiveDot({
  className,
  size,
}: {
  /** The dot's own colour, as a Tailwind background class. */
  className: string;
  size: number;
}) {
  return (
    <span
      aria-hidden
      className="relative shrink-0"
      style={{ width: size, height: size }}>
      <span className="memoroll-live-ring absolute inset-0 rounded-full" />
      <span
        className={`memoroll-live-dot absolute inset-0 rounded-full ${className}`}
      />
    </span>
  );
}
