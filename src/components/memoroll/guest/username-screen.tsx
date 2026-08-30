'use client';

import editIcon from '@/assets/memoroll/edit-handle.svg';
import { useEffect, useRef, useState } from 'react';
import Cta from '../ui/cta';
import MemoifyFooter from '../ui/memoify-footer';
import { colour, type } from '../ui/tokens';

/**
 * "This you?" (guest-05, guest-06): the one thing a guest is asked before they
 * shoot.
 *
 * They arrive here signed in, so the handle is already filled and the question
 * is a confirmation rather than a form - which is why the whole screen is one
 * field and a button, and why the button says "Yup, let's shoot!" instead of
 * Save.
 *
 * The handle matters beyond this screen: it is what signs their Shots in the
 * developed roll, and the answer to "Who took this?". Getting it wrong is
 * getting somebody else's name on their photographs, so it is offered for
 * correction here and nowhere later.
 *
 * The design draws the second state with the iOS keyboard raised over it. That
 * is the phone, not the product: the field is an ordinary input and the
 * keyboard comes up because a guest tapped it.
 */
export default function UsernameScreen({
  handle,
  onConfirm,
}: {
  /** Where the signed-in identity puts them. Theirs to correct. */
  handle: string;
  onConfirm: (handle: string) => void;
}) {
  const [value, setValue] = useState(handle);
  const inputRef = useRef<HTMLInputElement>(null);

  // A guest who signs in again should see the name they are actually signed in
  // as, not the one they were editing a moment ago.
  useEffect(() => setValue(handle), [handle]);

  const trimmed = value.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (trimmed) onConfirm(trimmed);
      }}
      className="flex min-h-full flex-1 flex-col"
      style={{ background: colour.paper }}>
      <div className="flex flex-1 flex-col items-center gap-[28px] px-[16px] pt-[66px]">
        <div className="flex flex-col items-center gap-[4px] text-center">
          <h1
            className={type.heading}
            style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
            Welcome to Memoroll!
          </h1>
          <p
            className={type.body}
            style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
            Let’s set you up before shooting the moments
          </p>
        </div>

        <div className="flex w-full flex-col gap-[12px]">
          <label
            htmlFor="memoroll-handle"
            className={type.label}
            style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
            This you?
          </label>

          {/* One row: the handle, and the pencil that says it can be changed.
              The design centres the handle inside a field that is otherwise
              space-between, so the pencil sits out at the right edge on its
              own. */}
          <div
            className="flex items-center justify-between rounded-full px-[16px] py-[8px]"
            style={{
              background: colour.field,
              border: '1px solid rgba(0, 0, 0, 0.2)',
            }}>
            <input
              id="memoroll-handle"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="nickname"
              spellCheck={false}
              className={`min-w-0 flex-1 bg-transparent text-center outline-none ${type.body}`}
              style={{
                color: colour.ink,
                fontFamily: 'var(--font-mr-body)',
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="ml-[8px] shrink-0"
              aria-label="Edit your handle">
              <img src={editIcon.src} alt="" className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>

        <Cta type="submit" disabled={!trimmed} className="w-full">
          Yup, let’s shoot!
        </Cta>
      </div>

      <MemoifyFooter />
    </form>
  );
}
