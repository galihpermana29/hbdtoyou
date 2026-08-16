'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE, REDUCED_FADE, pressTap } from './variants';

/**
 * The demo's shared visual vocabulary, straight from the measured tokens in
 * .scratch/randos/DESIGN.md: #f7f5f3 paper ground, #212121 ink, #ff3e09
 * pills, radius 10 cards, Homemade Apple for the handwritten voice.
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

export function PillButton({
  children,
  onClick,
  variant = 'orange',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'orange' | 'white';
  className?: string;
}) {
  const reduce = useReducedMotion();
  const palette =
    variant === 'orange'
      ? 'bg-[#ff3e09] text-white shadow-[0_6px_18px_rgba(255,62,9,0.35)]'
      : 'bg-white text-[#212121] border border-[#212121]/20 shadow-sm';
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduce ? undefined : pressTap}
      className={`h-[52px] w-full rounded-full text-[16px] ${palette} ${className}`}
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      {children}
    </motion.button>
  );
}

/** The small underlined escape hatch every gate carries in the demo. */
export function DemoSkipLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto block text-[12px] text-[#212121]/60 underline underline-offset-2"
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      {children}
    </button>
  );
}

/* ------------------------- form vocabulary ------------------------- */
/* The creator side's controls, in the same measured tokens: radius-10
   fields, pill chips, the orange accent for anything switched on and the
   palette's blue reserved for focus. */

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50"
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      {children}
    </label>
  );
}

export function TextInput({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`h-[52px] w-full rounded-[10px] border border-[#212121]/15 bg-white px-4 text-[16px] text-[#212121] outline-none transition-colors focus:border-[#2e7cf6] ${className}`}
      style={{ fontFamily: 'var(--font-mr-body)' }}
    />
  );
}

export function ToggleSwitch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  label: string;
}) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-[30px] w-[52px] shrink-0 rounded-full transition-colors ${
        on ? 'bg-[#ff3e09]' : 'bg-[#212121]/20'
      }`}>
      <motion.span
        layout={!reduce}
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 500, damping: 32 }
        }
        className={`absolute top-[3px] block h-[24px] w-[24px] rounded-full bg-white shadow ${
          on ? 'right-[3px]' : 'left-[3px]'
        }`}
      />
    </button>
  );
}

export function ChoiceChips<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className="flex flex-wrap gap-2"
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <motion.button
            key={String(option.value)}
            type="button"
            aria-pressed={active}
            whileTap={reduce ? undefined : pressTap}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-[14px] transition-colors ${
              active
                ? 'bg-[#212121] text-white'
                : 'border border-[#212121]/20 bg-white text-[#212121]'
            }`}>
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/** A toast message that clears itself, paired with DemoToast below. */
export function useDemoToast() {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);
  return { toast, showToast: setToast };
}

/** The demo's transient bottom toast, as the gallery introduced it. */
export function DemoToast({ message }: { message: string | null }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={reduce ? REDUCED_FADE : { duration: 0.25, ease: EASE }}
          className="fixed bottom-20 left-1/2 z-40 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-[12px] text-white"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ------------------------- hand-drawn doodles ------------------------- */
/* Simple stroked SVGs standing in for the designer's illustrations. */

export function ScribbleBurst({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" fill="none" className={className}>
      <path
        d="M12 78 L34 48 M30 82 L48 56 M50 70 L64 50"
        stroke="#ff3e09"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M58 38 L78 14"
        stroke="#ff3e09"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CurlyArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 130" fill="none" className={className}>
      <path
        d="M52 6 C18 10 14 34 44 36 C70 38 68 56 40 58 C14 60 14 82 42 86 C66 90 78 98 92 110"
        stroke="#212121"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M92 110 L74 106 M92 110 L86 92"
        stroke="#212121"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartCluster({ className = '' }: { className?: string }) {
  const heart =
    'M12 21 C7 16 2 12.5 2 8.2 C2 5 4.4 3 7 3 C9 3 10.8 4.2 12 6 C13.2 4.2 15 3 17 3 C19.6 3 22 5 22 8.2 C22 12.5 17 16 12 21 Z';
  return (
    <svg viewBox="0 0 120 160" fill="none" className={className}>
      <g fill="#e63b2e">
        <path
          d={heart}
          transform="translate(56 0) scale(1.4) rotate(8 12 12)"
        />
        <path
          d={heart}
          transform="translate(10 30) scale(1.05) rotate(-14 12 12)"
        />
        <path
          d={heart}
          transform="translate(66 52) scale(0.8) rotate(12 12 12)"
        />
        <path
          d={heart}
          transform="translate(24 76) scale(1.5) rotate(-6 12 12)"
        />
        <path
          d={heart}
          transform="translate(-6 116) scale(1.15) rotate(-18 12 12)"
        />
        <path
          d={heart}
          transform="translate(58 122) scale(0.9) rotate(10 12 12)"
        />
      </g>
    </svg>
  );
}

/** The dancing couple line sketch on the landing (guest-01), simplified. */
export function CoupleDoodle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 190 130" fill="none" className={className}>
      <g stroke="#212121" strokeWidth="4" strokeLinecap="round" fill="none">
        <circle cx="70" cy="26" r="13" />
        <path d="M60 40 C46 58 44 80 34 96 C50 104 74 104 86 96 C80 76 80 56 78 40" />
        <path d="M44 66 C30 60 20 48 16 34" />
        <path d="M82 52 L108 40" />
        <circle cx="128" cy="20" r="13" />
        <path d="M122 34 C114 52 114 76 112 98 M134 34 C142 52 142 76 144 98" />
        <path d="M112 98 L102 122 M144 98 L154 122" />
        <path d="M122 44 L108 40 M136 46 C150 42 160 34 168 24" />
      </g>
    </svg>
  );
}

/** The tilted phone-with-map illustration on the location gate (guest-02). */
export function PhoneMapDoodle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 260" fill="none" className={className}>
      <g transform="rotate(18 110 130)">
        <rect
          x="45"
          y="20"
          width="130"
          height="220"
          rx="26"
          fill="#eadfce"
          stroke="#8fbede"
          strokeWidth="5"
        />
        <rect x="60" y="44" width="100" height="150" rx="10" fill="#25314b" />
        <rect x="60" y="60" width="44" height="56" rx="10" fill="#8bc34a" />
        <rect x="118" y="44" width="42" height="42" rx="10" fill="#8fbede" />
        <rect x="118" y="150" width="42" height="44" rx="10" fill="#8fbede" />
        <path
          d="M66 150 C80 140 96 146 104 132"
          stroke="#f3efe7"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M110 96 C110 82 122 74 132 74 C142 74 154 82 154 96 C154 110 132 132 132 132 C132 132 110 110 110 96 Z"
          fill="#e14e2a"
        />
        <circle cx="132" cy="94" r="14" fill="#f3efe7" />
        <circle cx="110" cy="216" r="10" stroke="#25314b" strokeWidth="6" />
        <rect x="88" y="28" width="26" height="7" rx="3.5" fill="#25314b" />
      </g>
    </svg>
  );
}

/** The ring-bound calendar leaf on the time gate (guest-03). */
export function CalendarDoodle({
  calendar: { month, day, year },
  className = '',
}: {
  calendar: { month: string; day: string; year: string };
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 240 220" fill="none" className="h-full w-full">
        <rect
          x="20"
          y="52"
          width="200"
          height="150"
          rx="14"
          fill="#ffffff"
          stroke="#212121"
          strokeWidth="6"
        />
        <path
          d="M20 96 L20 66 C20 58 26 52 34 52 L206 52 C214 52 220 58 220 66 L220 96 Z"
          fill="#ff5a45"
          stroke="#212121"
          strokeWidth="6"
        />
        {[62, 120, 178].map((x) => (
          <g key={x}>
            <path
              d={`M${x} 58 C${x} 32 ${x + 24} 32 ${x + 24} 56`}
              stroke="#212121"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <circle
              cx={x}
              cy="60"
              r="9"
              fill="#d97f76"
              stroke="#212121"
              strokeWidth="5"
            />
          </g>
        ))}
      </svg>
      <div
        className="absolute inset-x-0 top-[46%] flex flex-col items-center text-[#212121]"
        style={{ fontFamily: 'var(--font-mr-hand)' }}>
        <span className="text-[18px] leading-none">{month}</span>
        <span className="text-[38px] leading-[1.2]">{day}</span>
        <span className="text-[13px] leading-none">{year}</span>
      </div>
    </div>
  );
}
