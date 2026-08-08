'use client';

import './field-treatment.css';
import { useId, type ChangeEvent, type ReactNode } from 'react';

import {
  flowFieldMark,
  flowFieldParts,
  flowHint,
  flowLabel,
  flowMarkedField,
  flowMarkedFieldAnswer,
} from './create-flow-treatment';

/**
 * A field the design draws a mark inside: a calendar before a year, a clock
 * before a time, a pin before a place.
 *
 * The box holds the mark, the answer and sometimes an action, so the box is not
 * the control - which is why it is marked `role="group"` and named by its
 * label. `FlowTextField` covers the simpler shape, where the bordered box and
 * the control a label points at are the same element.
 *
 * The mark is decoration and nothing else. The design draws a calendar beside a
 * year and a clock beside a time, and neither opens anything: a year is four
 * digits and a reception time is four more, so `format` keeps them to what they
 * can be as they are typed rather than handing a couple a picker to say it in.
 *
 * `value` and `onChange` are not passed at the call site. The field is wrapped
 * in a `Form.Item`, which injects both, so the antd form remains the one place
 * the couple's answers live.
 */

export interface FlowMarkedFieldProps {
  /**
   * The words above the field, as the design writes them.
   *
   * A field the design gives no words of its own - the two halves of the
   * reception time, which share one - passes `name` instead, and is announced
   * by that rather than by nothing.
   */
  label?: string;
  /** Whether the field must be answered, which draws the mark beside it. */
  required?: boolean;
  /** What to call a field the design draws no label for. */
  name?: string;
  /** The line of guidance the design prints between the label and the box. */
  hint?: string;
  /** What the design draws inside the box, before the answer. */
  mark: ReactNode;
  placeholder?: string;
  /**
   * What the answer may look like, applied to every keystroke.
   *
   * A field with none takes whatever is typed.
   */
  format?: (typed: string) => string;
  /**
   * What a half-given answer becomes when a couple leaves the field.
   *
   * A mask can only keep an answer to a shape while it is being typed; it
   * cannot tell a couple who typed "20" into a reception time that they have
   * not finished. Finishing it here, where they can still see it, is how the
   * invitation never quietly prints a different time from the one they left in
   * the box.
   */
  complete?: (typed: string) => string;
  inputMode?: 'numeric' | 'text';
  /** An action the design attaches to the end of the box. */
  action?: ReactNode;
  /**
   * The field's identifier.
   *
   * Supplied by `Form.Item` from the field's name, so the fallback is only ever
   * used by a field standing on its own.
   */
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function FlowMarkedField({
  label,
  required,
  name,
  hint,
  mark,
  placeholder,
  format,
  complete,
  inputMode,
  action,
  id,
  value,
  onChange,
}: FlowMarkedFieldProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const labelId = `${fieldId}-label`;

  // An empty string rather than the value as it arrives: a form field with no
  // answer yet holds `undefined`, and React reads that as a field it does not
  // control.
  const answer = value ?? '';

  function change(event: ChangeEvent<HTMLInputElement>) {
    const typed = event.target.value;
    onChange?.(format ? format(typed) : typed);
  }

  function leave() {
    if (!complete) return;
    const finished = complete(answer);
    if (finished !== answer) onChange?.(finished);
  }

  return (
    <div className={flowFieldParts}>
      {label ? (
        <label id={labelId} htmlFor={fieldId} className={`${flowLabel}${required ? ' wedding-required-label' : ''}`}>
          {label}
        </label>
      ) : null}
      {hint ? <p className={flowHint}>{hint}</p> : null}

      <div
        role="group"
        {...(label
          ? { 'aria-labelledby': labelId }
          : { 'aria-label': name ?? '' })}
        className={flowMarkedField}>
        <span aria-hidden="true" className={flowFieldMark}>
          {mark}
        </span>
        <input
          id={fieldId}
          type="text"
          inputMode={inputMode}
          aria-label={label ? undefined : name}
          value={answer}
          onChange={change}
          onBlur={leave}
          placeholder={placeholder}
          className={flowMarkedFieldAnswer}
        />
        {action}
      </div>
    </div>
  );
}
