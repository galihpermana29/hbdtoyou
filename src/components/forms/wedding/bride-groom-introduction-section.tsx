'use client';

import { Form } from 'antd';

import CreateFlowSection from './create-flow-section';
import { flowFieldPair, flowFieldStack } from './create-flow-treatment';
import FlowTextField from './flow-text-field';

/**
 * The third Section of the details-and-story step: who the couple are, and who
 * their families are.
 *
 * Each partner is asked for in the same shape - their own name across the card,
 * then their father and their mother side by side - and the bride comes first,
 * as the design orders them.
 *
 * A father and a mother are two fields rather than one, because they are two
 * people. The invitation prints them on one line, and joining two answers for
 * display is something the viewer can do; splitting one answer back into two
 * people is not. `joinParents` in `wedding-invitation-types.ts` is where that
 * joining lives, so the viewer and the form agree on it.
 *
 * Every field is drawn empty in the design, with grey placeholder text, so the
 * form starts empty and the names below are the design's examples rather than
 * the couple's answers. "Frank Simajuntak" is the design's spelling of the
 * groom's father, one letter short of the groom's own surname: the design is
 * literal truth, see `docs/adr/0002-figma-is-literal-truth.md`.
 */

export default function BrideGroomIntroductionSection() {
  return (
    <CreateFlowSection
      name="Bride & Groom’s Introduction"
      description="Introduction to the Bride & Groom’s family and/or education background">
      <div className={flowFieldStack}>
        <Form.Item name="brideFullName" noStyle>
          <FlowTextField
            label="Bride Name"
            placeholder="Freya Putri Magellan"
          />
        </Form.Item>

        <div className={flowFieldPair}>
          <Form.Item name="brideFatherName" noStyle>
            <FlowTextField
              label="Bride’s Father"
              placeholder="Ferdinand Magellan"
            />
          </Form.Item>
          <Form.Item name="brideMotherName" noStyle>
            <FlowTextField
              label="Bride’s Mother"
              placeholder="Tuti Pudjiastuti"
            />
          </Form.Item>
        </div>

        <Form.Item name="groomFullName" noStyle>
          <FlowTextField
            label="Groom Name"
            placeholder="Elias Frank Simanjuntak"
          />
        </Form.Item>

        <div className={flowFieldPair}>
          <Form.Item name="groomFatherName" noStyle>
            <FlowTextField
              label="Groom’s Father"
              placeholder="Frank Simajuntak"
            />
          </Form.Item>
          <Form.Item name="groomMotherName" noStyle>
            <FlowTextField
              label="Groom’s Mother"
              placeholder="Esther Triasningsih"
            />
          </Form.Item>
        </div>
      </div>
    </CreateFlowSection>
  );
}
