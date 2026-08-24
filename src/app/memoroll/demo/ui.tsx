'use client';

/**
 * What is left of the demo's first visual vocabulary, kept only for the one
 * guest screen still drawn in it - the mock sign-in, which is Google's screen
 * rather than a designed one and so was never re-cut with the rest.
 *
 * Everything else went with the screens that used it: the creator side with
 * the five-step creator demo the designer's finished flow replaced, and the
 * onboarding's PillButton when hbd-qti.2 turned that screen into the How
 * popup over the camera. The design this is measured from is the old one;
 * the current design is `docs/design/memoroll/`, and its own vocabulary
 * lives in `src/components/memoroll/ui/`.
 */

export function HandHeading({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`text-center text-[26px] leading-[1.9] text-[#212121] ${className}`}
      style={{ fontFamily: 'var(--font-mr-hand)' }}>
      {children}
    </h1>
  );
}

export function BodyText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-center text-[16px] leading-relaxed text-[#212121] ${className}`}
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      {children}
    </p>
  );
}
