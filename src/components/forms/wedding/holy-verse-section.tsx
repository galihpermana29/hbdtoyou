'use client';

import { Form } from 'antd';

import CreateFlowSection from './create-flow-section';
import { flowFieldStack } from './create-flow-treatment';
import FlowTextField from './flow-text-field';
import { useFlowCopy } from './flow-language';

/**
 * The second Section of the details-and-story step: the verse a couple opens
 * their invitation with.
 *
 * The design names the citation first and the verse itself second, which is the
 * order a couple thinks in - they know which verse it is before they have typed
 * it out - and it is the order the design draws, which settles it either way.
 *
 * Both fields are drawn empty in the design, with grey placeholder text. They
 * are not empty here: this is the one Section that opens already holding an
 * answer, because most couples using this template want Ar-Rum 21 and would
 * otherwise retype three lines of scripture the product already knows.
 *
 * That is a Prefill, not a Fallback. It is the couple's from the first paint -
 * editable, clearable, and saved as their own words - and clearing it leaves the
 * verse off their invitation rather than quietly restoring it. The placeholders
 * below are what a couple sees if they do clear it, which is why they stay.
 */

/**
 * The verse the design prints in the box as its example of one.
 *
 * Written out here rather than read from the sample invitation's content. The
 * two happen to be the same words today, and they are not the same thing: one
 * is what the design suggests a couple might write, the other is what an
 * unanswered invitation shows a guest.
 */
const VERSE_PLACEHOLDER =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan ' +
  'pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan ' +
  'merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan ' +
  'kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat ' +
  'tanda-tanda (kebesaran Allah) bagi kaum yang berpikir';

/** How many lines of the verse the design leaves room for. */
const VERSE_ROWS = 5;

export default function HolyVerseSection() {
  const copy = useFlowCopy();
  return (
    <CreateFlowSection
      name={copy.holyVerseName}
      description={copy.holyVerseDescription}>
      <div className={flowFieldStack}>
        <Form.Item name="verseCitation" noStyle>
          <FlowTextField label={copy.verseName} placeholder="Q.S Ar-Rum : 21" />
        </Form.Item>

        <Form.Item name="verseText" noStyle>
          <FlowTextField
            label={copy.verseBody}
            rows={VERSE_ROWS}
            placeholder={VERSE_PLACEHOLDER}
          />
        </Form.Item>
      </div>
    </CreateFlowSection>
  );
}
