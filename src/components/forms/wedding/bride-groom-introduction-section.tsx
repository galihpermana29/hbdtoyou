'use client';

import { Form } from 'antd';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import { useFlowCopy } from './flow-language';
import { requiredPhotos, requiredText } from './required-fields';
import { flowFieldPair, flowFieldStack } from './create-flow-treatment';
import FlowTextField from './flow-text-field';
import PhotoDropZone from './photo-drop-zone';

/** One portrait each, because the invitation prints one portrait each. */
const PORTRAIT_LIMIT = 1;

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
 * Each partner is also asked for a portrait, which the design does not draw a
 * field for. The invitation prints one of each beside their names, and without
 * these two questions every couple published with the designer's two models in
 * their own frames. See `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * Every field is drawn empty in the design, with grey placeholder text, so the
 * form starts empty and the names below are the design's examples rather than
 * the couple's answers. "Frank Simajuntak" is the design's spelling of the
 * groom's father, one letter short of the groom's own surname: the design is
 * literal truth, see `docs/adr/0002-figma-is-literal-truth.md`.
 */

export default function BrideGroomIntroductionSection({
  maxUploadMb,
  openNotification,
  openIt,
}: {
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
  /** Raised by a refused Next, to show the couple what is missing. */
  openIt?: boolean;
}) {
  const copy = useFlowCopy();
  return (
    <CreateFlowSection
      openIt={openIt}
      name={copy.introductionName}
      description={copy.introductionDescription}>
      <div className={flowFieldStack}>
        <Form.Item
          name="bridePhoto"
          className="!mb-0"
          rules={requiredPhotos(copy, 'bridePhoto', 1)}>
          <PhotoDropZone
            required
            label={copy.bridePhoto}
            limit={PORTRAIT_LIMIT}
            ratio="ratioStandard"
            atLeast={1}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        <Form.Item
          name="brideFullName"
          className="!mb-0"
          rules={requiredText(copy, 'brideName')}>
          <FlowTextField
            required
            label={copy.brideName}
            placeholder="Freya Putri Magellan"
          />
        </Form.Item>

        <div className={flowFieldPair}>
          <Form.Item name="brideFatherName" noStyle>
            <FlowTextField
              label={copy.brideFather}
              placeholder="Ferdinand Magellan"
            />
          </Form.Item>
          <Form.Item name="brideMotherName" noStyle>
            <FlowTextField
              label={copy.brideMother}
              placeholder="Tuti Pudjiastuti"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="groomPhoto"
          className="!mb-0"
          rules={requiredPhotos(copy, 'groomPhoto', 1)}>
          <PhotoDropZone
            required
            label={copy.groomPhoto}
            limit={PORTRAIT_LIMIT}
            ratio="ratioStandard"
            atLeast={1}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        <Form.Item
          name="groomFullName"
          className="!mb-0"
          rules={requiredText(copy, 'groomName')}>
          <FlowTextField
            required
            label={copy.groomName}
            placeholder="Elias Frank Simanjuntak"
          />
        </Form.Item>

        <div className={flowFieldPair}>
          <Form.Item name="groomFatherName" noStyle>
            <FlowTextField
              label={copy.groomFather}
              placeholder="Frank Simajuntak"
            />
          </Form.Item>
          <Form.Item name="groomMotherName" noStyle>
            <FlowTextField
              label={copy.groomMother}
              placeholder="Esther Triasningsih"
            />
          </Form.Item>
        </div>
      </div>
    </CreateFlowSection>
  );
}
