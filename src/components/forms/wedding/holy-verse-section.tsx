'use client';

import { Form } from 'antd';

import CreateFlowSection from './create-flow-section';
import { flowFieldStack } from './create-flow-treatment';
import FlowTextField from './flow-text-field';

/**
 * The second Section of the details-and-story step: the verse a couple opens
 * their invitation with.
 *
 * The design names the citation first and the verse itself second, which is the
 * order a couple thinks in - they know which verse it is before they have typed
 * it out - and it is the order the design draws, which settles it either way.
 *
 * Both fields are drawn empty in the design, with grey placeholder text, so the
 * form starts empty and the design's own verse is the example rather than the
 * answer. The Site Preview is not left blank by that: it falls back to the
 * sample invitation for anything the couple has not answered yet.
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
  return (
    <CreateFlowSection
      name="Holy Verse"
      description="Verses or prayers you and your partner love">
      <div className={flowFieldStack}>
        <Form.Item name="verseCitation" noStyle>
          <FlowTextField label="Verse Name" placeholder="Q.S Ar-Rum : 21" />
        </Form.Item>

        <Form.Item name="verseText" noStyle>
          <FlowTextField
            label="Verse"
            rows={VERSE_ROWS}
            placeholder={VERSE_PLACEHOLDER}
          />
        </Form.Item>
      </div>
    </CreateFlowSection>
  );
}
