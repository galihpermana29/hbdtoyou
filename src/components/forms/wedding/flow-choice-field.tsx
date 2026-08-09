'use client';

import { ChevronDown } from 'lucide-react';
import './field-treatment.css';
import { useId, type ChangeEvent } from 'react';

import {
  flowAnswered,
  flowChoiceAnswer,
  flowFieldMark,
  flowFieldParts,
  flowLabel,
  flowMarkedField,
  flowUnanswered,
} from './create-flow-treatment';

/**
 * A field a couple answers by choosing rather than by typing.
 *
 * The design draws it as the same box `FlowMarkedField` draws, with the mark
 * after the answer instead of before it: a chevron on the right saying the
 * answer comes from a list. The box therefore holds more than one thing again,
 * so the box carries the border and the insets, the answer carries the type, and
 * the box is marked `role="group"` and named by its label - see
 * `create-flow-treatment.ts` for why that matters beyond tidiness.
 *
 * It is a plain `<select>` rather than an Ant Design one so that the element the
 * label points at is a control a couple can actually reach with a keyboard, and
 * so the list a phone shows is the one its own operating system draws.
 *
 * `value` and `onChange` are not passed at the call site. The field is wrapped
 * in a `Form.Item`, which injects both, so the antd form remains the one place
 * the couple's answers live.
 */

export interface FlowChoiceFieldProps {
  /** The words above the field, as the design writes them. */
  label: string;
  /** Whether the field must be answered, which draws the mark beside it. */
  required?: boolean;
  /**
   * The design's own example, shown until a couple chooses.
   *
   * It cannot be chosen: it is the design's example rather than one of the
   * answers, and a couple who has answered has no reason to go back to it.
   */
  placeholder: string;
  /** Everything a couple may choose, in the order the list offers them. */
  options: string[];
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

export default function FlowChoiceField({
  label,
  required,
  placeholder,
  options,
  id,
  value,
  onChange,
}: FlowChoiceFieldProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const labelId = `${fieldId}-label`;

  // An empty string for the same reason `FlowTextField` uses one: React reads
  // the `undefined` an unanswered form field holds as a field it does not
  // control. Here it also selects the option carrying the design's example.
  const chosen = value ?? '';

  function change(event: ChangeEvent<HTMLSelectElement>) {
    onChange?.(event.target.value);
  }

  return (
    <div className={flowFieldParts}>
      <label
        id={labelId}
        htmlFor={fieldId}
        className={`${flowLabel}${required ? ' wedding-required-label' : ''}`}>
        {label}
      </label>

      <div role="group" aria-labelledby={labelId} className={flowMarkedField}>
        <select
          id={fieldId}
          value={chosen}
          onChange={change}
          className={`${flowChoiceAnswer} ${chosen ? flowAnswered : flowUnanswered}`}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className={flowFieldMark}>
          <ChevronDown size={20} />
        </span>
      </div>
    </div>
  );
}
