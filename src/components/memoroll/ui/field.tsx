'use client';

import { useRef } from 'react';

import { colour, type } from './tokens';

/**
 * Open the platform's date or time picker. On desktop Chrome a date input
 * only opens from its own small indicator; a tap anywhere on the field should
 * do it (owner, 2026-11-13). Older browsers without showPicker() keep their
 * native behaviour, which on phones already opens on tap.
 */
function openPicker(input: HTMLInputElement | null) {
  if (!input) return;
  try {
    input.showPicker?.();
  } catch {
    // Not allowed here (no user gesture, or a browser that refuses): the
    // input keeps focus, and the platform's own behaviour takes over.
  }
}

/**
 * One thing the creator is asked for: a label, the field they answer in, and
 * whatever the design writes around it.
 *
 * Four screens use it and between them they draw every part, so all four parts
 * are here rather than in four screens that would each grow their own: the hint
 * above the field on "Name your roll", the note under it on "Venue & Location",
 * the icon inside it on the two clock screens, and the label every one of them
 * has.
 *
 * The label is a real label pointing at a real input. That matters beyond
 * markup tidiness: the visual check finds a field by the words beside it, so a
 * field whose label is a styled paragraph is a field the design cannot ask
 * about.
 */
export default function Field({
  id,
  label,
  hint,
  note,
  value,
  onChange,
  icon,
  tone = 'paper',
  inputMode,
  kind = 'text',
}: {
  id: string;
  label: string;
  /** Between the label and the field, where the design puts an explanation. */
  hint?: string;
  /** Under the field, where the design puts a smaller one. */
  note?: string;
  value: string;
  onChange: (value: string) => void;
  /** Inside the field, at its left: a calendar, a clock. */
  icon?: React.ReactNode;
  /**
   * `shaded` is the warmer ground the design gives Venue and Address, the two
   * fields it drew as answers coming from somewhere else. No field uses it
   * now (owner, 2026-11-13): it read as a disabled input.
   */
  tone?: 'paper' | 'shaded';
  inputMode?: 'text' | 'numeric';
  /**
   * `date` and `time` put the platform's own picker behind the field. The
   * design drew the clock screens as ordinary fields and the first build
   * shipped them as free text; the owner called that confusing (2026-08-30)
   * and chose pickers. The pill, label and icon stay the design's - only
   * what opens on tap changes. Values are what the platform speaks:
   * `YYYY-MM-DD` and `HH:mm`.
   */
  kind?: 'text' | 'date' | 'time';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const picks = kind === 'date' || kind === 'time';

  return (
    <div className="flex w-full flex-col gap-[12px]">
      <div className="flex flex-col gap-[2px]">
        <label
          htmlFor={id}
          className={type.label}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          {label}
        </label>
        {hint ? (
          <p
            className={type.body}
            style={{ color: colour.muted, fontFamily: 'var(--font-mr-body)' }}>
            {hint}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-[4px]">
        <div
          className={`flex items-center gap-[10px] rounded-full px-[16px] py-[8px] ${
            picks ? 'memoroll-picker cursor-pointer' : ''
          }`}
          // The pill, flame icon included, is the target: a tap anywhere on
          // it focuses the field and, for a date or a time, opens the picker.
          onClick={() => {
            inputRef.current?.focus();
            if (picks) openPicker(inputRef.current);
          }}
          style={{
            background: tone === 'shaded' ? colour.unchosen : colour.field,
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
          {icon ? (
            // Every icon the design puts inside a field is the flame, so the
            // field colours it rather than each caller repeating the value.
            <span className="flex shrink-0" style={{ color: colour.flame }}>
              {icon}
            </span>
          ) : null}
          <input
            ref={inputRef}
            id={id}
            type={kind}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            inputMode={inputMode}
            autoComplete="off"
            spellCheck={false}
            className={`min-w-0 flex-1 bg-transparent outline-none ${type.body} ${
              picks ? 'cursor-pointer' : ''
            }`}
            style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}
          />
        </div>
        {note ? (
          <p
            className={type.mark}
            style={{ color: colour.muted, fontFamily: 'var(--font-mr-body)' }}>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
