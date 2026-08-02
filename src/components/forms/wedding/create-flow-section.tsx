'use client';

import { ChevronUp, Pencil } from 'lucide-react';
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
 * opens it, laid out as a grid so the mark can sit centred against both lines
 * without the description having to live inside the button. The button is the
 * only interactive part, which is what the design draws.
 *
 * The design draws that control as two different things, and the difference is
 * what it offers rather than which way it points. A closed Section carries a
 * pencil in the flow's orange, offering to be edited; an open one carries a grey
 * chevron, offering to be put away again. Both are 20px inside 10px of padding.
 *
 * A Section whose whole block a couple may leave off the invitation carries a
 * switch at the end of that header, in the place and the shape the MemoRoll
 * Section already puts one: what appears on the invitation is answered where
 * the block is named, and how it reads is answered inside. See
 * `docs/adr/0002-figma-is-literal-truth.md`.
 */

export interface CreateFlowSectionProps {
  /** The Section's name, as the design names it. */
  name: string;
  /** The line under the name, saying what belongs in the Section. */
  description: string;
  /** Whether the Section starts open. */
  defaultOpen?: boolean;
  /**
   * The switch saying whether this Section's block appears on the invitation,
   * for the Sections a couple may leave off. Drawn at the end of the header,
   * past the control that opens the Section.
   */
  headerSwitch?: ReactNode;
  children: ReactNode;
}

export default function CreateFlowSection({
  name,
  description,
  defaultOpen = false,
  headerSwitch,
  children,
}: CreateFlowSectionProps) {
  const fieldsId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Mark = isOpen ? ChevronUp : Pencil;

  return (
    <section className={flowSectionCard}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[12px]">
        <h3 className={`col-start-1 ${flowSectionName}`}>{name}</h3>
        <p className={`col-start-1 ${flowHint}`}>{description}</p>
        {/* The control and the switch share the header's second column, 12px
            apart as everything else in this grid is, so that a Section with a
            switch stacks its two lines of words exactly where a Section without
            one does.

            The switch is the last thing in the row, at the card's right edge,
            which is where the MemoRoll Section puts its own. */}
        <div className="col-start-2 row-span-2 row-start-1 flex items-center gap-[12px] self-center">
          <button
            type="button"
            aria-label={name}
            aria-expanded={isOpen}
            aria-controls={fieldsId}
            onClick={() => setIsOpen(!isOpen)}
            className={`p-[10px] ${
              isOpen ? 'text-[#98A2B3]' : 'text-[#E34013]'
            }`}>
            <Mark size={20} aria-hidden="true" />
          </button>
          {headerSwitch}
        </div>
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
