import { colour } from './tokens';

/**
 * The small marks the creator's screens draw, redrawn rather than exported.
 *
 * The capture records where every icon sits and how big it is, and none of the
 * shape: a VECTOR node arrives with its bounds and no path. So these are read
 * off the exported frames and drawn here, at the design's own 24 and 32 boxes,
 * in the one accent the design has.
 *
 * A mark's own shape takes `currentColor`, so it is coloured by the thing it
 * sits inside rather than by an argument nobody can see in the markup. What is
 * knocked out of it does not: a calendar's dots, a clock's hands and the plus
 * on an empty slot are holes, and a hole is the colour of whatever the mark is
 * drawn on. That ground is the paper nearly everywhere, so it is the default
 * and only the waiting Cover slot passes its own.
 */

/** The date a roll opens on, and the date it develops on. */
export function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 2v2.5M16.5 2v2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="2.75"
        y="3.75"
        width="18.5"
        height="18"
        rx="5"
        fill="currentColor"
      />
      {[9, 12.75].map((y) =>
        [7.5, 11.5, 15.5].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1.9"
            height="1.9"
            rx="0.6"
            fill={colour.paper}
          />
        ))
      )}
    </svg>
  );
}

/** The hour a roll opens at, and the hour it develops at. */
export function ClockIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.25" fill="currentColor" />
      <path
        d="M12 6.75V12l3.25 2"
        stroke={colour.paper}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A photograph that is not there yet: the frame of one, with a sun and a hill
 * inside it.
 *
 * Two places draw it and they differ by one thing. The empty upload slot carries
 * a plus in the corner, because pressing it is how a photograph arrives. The
 * waiting Cover slot does not, because it is a picture of what is missing rather
 * than a control - the creator adds the photograph downstairs.
 */
export function PhotoIcon({
  className = '',
  plus = false,
  /** What the plus is knocked out of: the paper, or a waiting Cover slot. */
  ground = colour.paper,
}: {
  className?: string;
  plus?: boolean;
  ground?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.2"
        y="4.6"
        width="25.6"
        height="22.8"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      <circle cx="11.4" cy="12.6" r="2.9" fill="currentColor" />
      <path
        d="M4.5 26.1l6.2-6.6a2.2 2.2 0 013.1-.1l2.4 2.3 4.2-5a2.2 2.2 0 013.3-.05l3.8 4.3v3.5a3.6 3.6 0 01-3.6 3.6H6.8a2.3 2.3 0 01-2.3-1.95z"
        fill="currentColor"
      />
      {plus ? (
        <>
          <circle cx="24.6" cy="9" r="7" fill={ground} />
          <circle cx="24.6" cy="9" r="5.2" fill="currentColor" />
          <path
            d="M24.6 6.2v5.6M21.8 9h5.6"
            stroke={ground}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </>
      ) : null}
    </svg>
  );
}

/** The pencil over the Cover photograph a creator is editing. */
export function PencilIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.6 3.9l4.5 4.5-10.4 10.4a2 2 0 01-.9.5l-5 1.3 1.3-5a2 2 0 01.5-.9L15.6 3.9z"
        fill="#ffffff"
        stroke={colour.ink}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M14.1 5.4l4.5 4.5"
        stroke={colour.ink}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The button that opens the QR a guest scans. */
export function QrIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      {[
        [2.5, 2.5],
        [14.5, 2.5],
        [2.5, 14.5],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x}
            y={y}
            width="7"
            height="7"
            rx="1.4"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x={x + 2.4}
            y={y + 2.4}
            width="2.2"
            height="2.2"
            fill="currentColor"
          />
        </g>
      ))}
      <path
        d="M14.5 14.5h3v3h-3v-3zM19.5 14.5h2v2h-2v-2zM14.5 19.5h2v2h-2v-2zM19 19h2.5v2.5H19V19z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The way back out of the QR sheet. */
export function ChevronLeftIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5 4.5L7 12l7.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** One fewer shot each, and one more. */
export function MinusIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="8.3"
        y="20"
        width="27.4"
        height="3.9"
        rx="1.95"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg">
      <rect
        x="8.3"
        y="20"
        width="27.4"
        height="3.9"
        rx="1.95"
        fill="currentColor"
      />
      <rect
        x="20"
        y="8.3"
        width="3.9"
        height="27.4"
        rx="1.95"
        fill="currentColor"
      />
    </svg>
  );
}
