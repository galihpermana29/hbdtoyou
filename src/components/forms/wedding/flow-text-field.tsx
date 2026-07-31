'use client';

import { useId, type ChangeEvent } from 'react';

import {
  flowFieldParts,
  flowLabel,
  flowTextField,
} from './create-flow-treatment';

/**
 * A labelled text field of the shape the design draws throughout the Create
 * Flow.
 *
 * It is a plain `input` rather than an Ant Design one so that the element the
 * label points at is the bordered box a couple can see. That matters beyond
 * tidiness: `for` on a label is how anything else - assistive technology, and
 * the style and structure check - decides which element is the field, and antd
 * aims it at an inner input with no border of its own.
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
   * The field's identifier.
   *
   * Supplied by `Form.Item` from the field's name, so the fallback is only ever
   * used by a field standing on its own.
   */
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function FlowTextField({
  label,
  placeholder,
  id,
  value,
  onChange,
}: FlowTextFieldProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;

  return (
    <div className={flowFieldParts}>
      <label htmlFor={fieldId} className={flowLabel}>
        {label}
      </label>
      {/* An empty string rather than the value as it arrives: a form field with
          no answer yet holds `undefined`, and React reads that as a field it
          does not control. */}
      <input
        id={fieldId}
        type="text"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className={flowTextField}
      />
    </div>
  );
}
