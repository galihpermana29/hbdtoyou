'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';

import { flowFieldAction } from './create-flow-treatment';
import { useFlowCopy } from './flow-language';
import { mapEmbedFrom } from './wedding-map';
import FlowMarkedField from './flow-marked-field';

/**
 * Where the wedding is, as a link a guest can follow.
 *
 * The design attaches a Save Location action to the end of the field, so what a
 * couple pastes is a draft until it is saved. That is not decoration: a link
 * arrives one keystroke at a time when it is typed rather than pasted, and the
 * invitation's View Location would follow every half-finished one of them. It
 * is also the only moment the design leaves to say that a link is not a link.
 *
 * Leaving the field saves it too. A couple who pastes their link and moves on
 * has plainly finished with it, and losing it because they did not press a
 * button would be the field quietly throwing away the only thing it was for.
 * Pressing it is then the same work done sooner, which is what a couple who
 * wants to be sure is asking for.
 *
 * Saving with the field empty clears the saved link, which is how a couple
 * takes one back.
 */

export interface WeddingLocationFieldProps {
  /** Whether the field must be answered, which draws the mark beside its label. */
  required?: boolean;
  /** The field's identifier, supplied by `Form.Item` from the field's name. */
  id?: string;
  value?: string;
  onChange?: (link: string) => void;
}

export default function WeddingLocationField({
  id,
  required,
  value,
  onChange,
}: WeddingLocationFieldProps) {
  const copy = useFlowCopy();
  const saved = value ?? '';
  const [draft, setDraft] = useState(saved);

  // The draft follows the saved link whenever that changes from outside, so a
  // form that is reset does not leave yesterday's link in the box.
  const [lastSaved, setLastSaved] = useState(saved);
  if (saved !== lastSaved) {
    setLastSaved(saved);
    setDraft(saved);
  }

  /**
   * Hand the link on to the invitation, and answer with what the box should
   * now say.
   *
   * A link that cannot be followed is left in the box exactly as it was typed,
   * beside the reason, so a couple can correct a link rather than retype one.
   */
  function save(typed: string): string {
    const pasted = typed.trim();
    if (pasted === '') {
      setLastSaved('');
      onChange?.('');
      return '';
    }

    // Only the address inside the paste is kept. What a couple pasted is left
    // in the box when it is refused, so they can correct it rather than go back
    // to Google Maps and copy it again - and the rule on the field says why,
    // in the one place this field says anything, alongside every other field.
    const embed = mapEmbedFrom(pasted);
    if (embed === null) {
      onChange?.(pasted);
      return typed;
    }

    setLastSaved(embed);
    onChange?.(embed);
    return embed;
  }

  return (
    <div className="flex flex-col gap-[6px]">
      <FlowMarkedField
        label={copy.weddingLocation}
        required={required}
        hint={copy.locationHint}
        mark={<MapPin size={20} aria-hidden="true" />}
        placeholder={copy.locationPlaceholder}
        id={id}
        value={draft}
        onChange={(typed) => setDraft(typed)}
        complete={save}
        action={
          <button
            type="button"
            onClick={() => setDraft(save(draft))}
            className={flowFieldAction}>
            {copy.saveLocation}
          </button>
        }
      />
    </div>
  );
}
