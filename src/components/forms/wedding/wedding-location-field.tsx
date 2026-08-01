'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';

import { flowFieldAction, flowProblem } from './create-flow-treatment';
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

/** What the design says to paste, and the only thing a guest can follow. */
const LINK_PROBLEM = 'Paste a link that starts with http:// or https://';

/** Whether this is something a guest's browser can open. */
function isFollowable(link: string): boolean {
  try {
    const { protocol } = new URL(link);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export interface WeddingLocationFieldProps {
  /** The field's identifier, supplied by `Form.Item` from the field's name. */
  id?: string;
  value?: string;
  onChange?: (link: string) => void;
}

export default function WeddingLocationField({
  id,
  value,
  onChange,
}: WeddingLocationFieldProps) {
  const saved = value ?? '';
  const [draft, setDraft] = useState(saved);
  const [problem, setProblem] = useState<string | null>(null);

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
    const link = typed.trim();
    if (link !== '' && !isFollowable(link)) {
      setProblem(LINK_PROBLEM);
      return typed;
    }
    setProblem(null);
    setLastSaved(link);
    onChange?.(link);
    return link;
  }

  return (
    <div className="flex flex-col gap-[6px]">
      <FlowMarkedField
        label="Wedding Location"
        hint="Go to Google Maps, find your wedding venue then copy the direction link"
        mark={<MapPin size={20} aria-hidden="true" />}
        placeholder="Paste the location maps"
        id={id}
        value={draft}
        // The complaint goes as soon as they start fixing it: it was about the
        // link they had, and they no longer have that one.
        onChange={(typed) => {
          setProblem(null);
          setDraft(typed);
        }}
        complete={save}
        action={
          <button
            type="button"
            onClick={() => setDraft(save(draft))}
            className={flowFieldAction}>
            Save Location
          </button>
        }
      />
      {problem ? (
        <p role="alert" className={flowProblem}>
          {problem}
        </p>
      ) : null}
    </div>
  );
}
