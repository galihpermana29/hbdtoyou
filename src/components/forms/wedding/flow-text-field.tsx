'use client';

import { useId, type ChangeEvent } from 'react';

import {
  flowFieldParts,
  flowLabel,
  flowTextArea,
  flowTextField,
} from './create-flow-treatment';

/**
 * A labelled text field of the shape the design draws throughout the Create
 * Flow, on one line or on several.
 *
 * It is a plain `input` or `textarea` rather than an Ant Design one so that the
 * element the label points at is the bordered box a couple can see. That matters
 * beyond tidiness: `for` on a label is how anything else - assistive technology,
 * and the style and structure check - decides which element is the field, and
 * antd aims it at an inner input with no border of its own.
 *
 * One component covers both, rather than two that differ only in a tag, because
 * the design draws one field in two lengths: same box, same type, same colours,
 * and the number of lines is the only thing it says differently about them.
 *
 * `value` and `onChange` are not passed at the call site. The field is wrapped
 * in a `Form.Item`, which injects both, so the antd form remains the one place
 * the couple's answers live.
 */

export interface FlowTextFieldProps {
  /** The words above the field, as the design writes them. */
  label: string;
  placeholder?: string;
  /**
   * How many lines of the answer the design leaves room for.
   *
   * A field that names none is a single line, which is most of them.
   */
  rows?: number;
  /**
   * The field's identifier.
   *
   * Supplied by `Form.Item` from the field's name, so the fallback is only ever
   * used by a field standing on its own.
   */
  id?: string;
  value?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function FlowTextField({
  label,
  placeholder,
  rows,
  id,
  value,
  onChange,
}: FlowTextFieldProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;

  // An empty string rather than the value as it arrives: a form field with no
  // answer yet holds `undefined`, and React reads that as a field it does not
  // control.
  const answer = value ?? '';

  return (
    <div className={flowFieldParts}>
      <label htmlFor={fieldId} className={flowLabel}>
        {label}
      </label>
      {rows === undefined ? (
        <input
          id={fieldId}
          type="text"
          value={answer}
          onChange={onChange}
          placeholder={placeholder}
          className={flowTextField}
        />
      ) : (
        <textarea
          id={fieldId}
          rows={rows}
          value={answer}
          onChange={onChange}
          placeholder={placeholder}
          className={flowTextArea}
        />
      )}
    </div>
  );
}
