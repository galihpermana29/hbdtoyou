'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

import {
  flowHint,
  flowSectionCard,
  flowSectionName,
} from './create-flow-treatment';

/**
 * One Section of the details-and-story step: a card that opens and closes on
 * its own.
 *
 * On its own is the point. The design draws several Sections open at the same
 * time, which an accordion cannot reach at all, so each Section here holds
 * whether it is open and nothing coordinates them. Opening one leaves every
 * other Section exactly as the couple left it.
 *
 * A closed Section keeps its fields mounted and hidden rather than dropping
 * them, so what a couple typed survives closing the Section they typed it in.
 * `hidden` is `display: none`, so a field nobody can see is also a field nothing
 * can find - which is what makes a closed Section read as closed to the style
 * and structure check instead of as a screen full of wrongly placed fields.
 *
 * The header is a heading and a description side by side with the control that
 * opens it, laid out as a grid so the chevron can sit centred against both lines
 * without the description having to live inside the button. The button is the
 * only interactive part, which is what the design draws.
 */

export interface CreateFlowSectionProps {
  /** The Section's name, as the design names it. */
  name: string;
  /** The line under the name, saying what belongs in the Section. */
  description: string;
  /** Whether the Section starts open. */
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CreateFlowSection({
  name,
  description,
  defaultOpen = false,
  children,
}: CreateFlowSectionProps) {
  const fieldsId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Chevron = isOpen ? ChevronUp : ChevronDown;

  return (
    <section className={flowSectionCard}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[12px]">
        <h3 className={`col-start-1 ${flowSectionName}`}>{name}</h3>
        <p className={`col-start-1 ${flowHint}`}>{description}</p>
        <button
          type="button"
          aria-label={name}
          aria-expanded={isOpen}
          aria-controls={fieldsId}
          onClick={() => setIsOpen(!isOpen)}
          className="col-start-2 row-span-2 row-start-1 self-center p-[8px] text-[#1B1B1B]">
          <Chevron size={24} aria-hidden="true" />
        </button>
      </div>

      {/* One element rather than the fields themselves, so the card's 24px is
          the distance between the header and the body and nothing else. How far
          apart the fields inside sit is the Section's own business. */}
      <div id={fieldsId} className={isOpen ? undefined : 'hidden'}>
        {children}
      </div>
    </section>
  );
}
