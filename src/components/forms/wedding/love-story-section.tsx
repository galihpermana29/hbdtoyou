'use client';

import { Form } from 'antd';
import { Calendar } from 'lucide-react';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import { flowFieldStack } from './create-flow-treatment';
import FlowMarkedField from './flow-marked-field';
import FlowTextField from './flow-text-field';
import PhotoDropZone from './photo-drop-zone';
import VideoDropZone from './video-drop-zone';
import { useFlowCopy } from './flow-language';
import { requiredPhotos, requiredText } from './required-fields';
import {
  LOVE_STORY_CHAPTERS,
  LOVE_STORY_LIMIT,
  type WeddingLoveStoryChapter,
} from './wedding-invitation-types';

/**
 * The fourth Section of the details-and-story step: how the couple got here.
 *
 * The design asks it as three chapters with words of its own - how they met,
 * how they grew closer, and the proposal - and offers no way to add a fourth or
 * remove one. That is not an omission: each chapter is a different question,
 * with its own label and its own place on the finished invitation, so there is
 * nothing a fourth could be called or anywhere for it to go. `hbd-byb.7` was
 * written expecting chapters a couple could add and remove; the design says
 * otherwise and the design wins, per the spec's fidelity rule. Recording that
 * in the ADR the spec keeps its deviations in is `hbd-byb.21`.
 *
 * The Proposal Photo sits between the second chapter and the third, which is
 * where the design puts it: the photo belongs to the moment the third chapter
 * is about, and it is asked for just before it is described.
 *
 * Every field is drawn empty in the design, with grey placeholder text, so the
 * form starts empty and the stories below are the design's examples rather than
 * a couple's answers.
 *
 * Two of the fields are named one thing here and another in the content the
 * invitation is built from, and the mismatch is deliberate. The design's
 * "Polaroid Photos" are the film strip, which the invitation calls
 * `loveStoryPhotos`; the design's "Proposal Photo" is the single hidden photo
 * behind the tap-to-reveal card, which the invitation calls `polaroidPhoto`.
 * The words above a field are the design's and the words in the content model
 * are the viewer's, and renaming either to match the other would break the
 * other's.
 */

/** How many lines the design leaves each chapter's story. */
const STORY_ROWS = 5;

/** What the design says beside each chapter's character count. */
const STORY_GUIDANCE = 'We know it’s hard, but keep it short please.';

/** The year the design writes in every one of the three year fields. */
const YEAR_PLACEHOLDER = '2020';

/** How many photos the design says the film strip takes, and the proposal. */
const POLAROID_PHOTO_LIMIT = 3;
const PROPOSAL_PHOTO_LIMIT = 1;

/**
 * The three stories the design prints in the boxes as its examples of one.
 *
 * Written out here rather than read from the sample invitation's content, for
 * the same reason the Holy Verse's is: the two happen to be the same words
 * today, and they are not the same thing. One is what the design suggests a
 * couple might write, the other is what an unanswered invitation shows a guest.
 */
const STORY_PLACEHOLDERS = [
  'Elias and Freya met during a summer volunteering program at a local ' +
    'wildlife sanctuary. Elias, always quiet and meticulous, found himself ' +
    'fascinated by Freya’s contagious energy and deep empathy for every ' +
    'animal in her care. A shared task repairing an aviary roof led to hours ' +
    'of conversation that flowed with surprising ease.',
  'They discovered a mutual love for hiking, old maps, and the kind of ' +
    'late-night calls that make time stand still. Over the years, they’ve ' +
    'built a relationship grounded in shared values, unwavering respect, and ' +
    'a genuine delight in each other’s success.',
  'Five years later, they are each other’s anchor and wildest adventure. ' +
    'Freya still makes Elias laugh until his sides ache, and Elias’s calm ' +
    'presence remains her haven. Now, they are excited to begin their next ' +
    'chapter together, celebrating not just their love, but the unique path ' +
    'they’ve carved side by side—surrounded by the family and friends who ' +
    'mean the most.',
];

/**
 * A year, as far as one can be typed.
 *
 * Four digits and nothing else, so a chapter cannot be dated "twenty twenty"
 * or "2020!" and the invitation never prints something that is not a year.
 */
function asYear(typed: string): string {
  return typed.replace(/\D/g, '').slice(0, 4);
}

/** One chapter: when it happened, and what happened. */
function Chapter({
  chapter,
  index,
}: {
  chapter: WeddingLoveStoryChapter;
  index: number;
}) {
  const copy = useFlowCopy();

  return (
    <>
      <Form.Item
        name={['milestones', index, 'year']}
        className="!mb-0"
        rules={requiredText(copy, chapter.yearLabel)}>
        <FlowMarkedField
            required
          label={copy[chapter.yearLabel]}
          mark={<Calendar size={20} aria-hidden="true" />}
          placeholder={YEAR_PLACEHOLDER}
          format={asYear}
          inputMode="numeric"
        />
      </Form.Item>

      <Form.Item
        name={['milestones', index, 'body']}
        className="!mb-0"
        rules={requiredText(copy, chapter.storyLabel)}>
        <FlowTextField
            required
          label={copy[chapter.storyLabel]}
          rows={STORY_ROWS}
          limit={LOVE_STORY_LIMIT}
          guidance={STORY_GUIDANCE}
          placeholder={STORY_PLACEHOLDERS[index]}
        />
      </Form.Item>
    </>
  );
}

export interface LoveStorySectionProps {
  /** The largest photo the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
  /** Raised by a refused Next, to show the couple what is missing. */
  openIt?: boolean;
}

export default function LoveStorySection({
  maxUploadMb,
  openNotification,
  openIt,
}: LoveStorySectionProps) {
  const copy = useFlowCopy();
  return (
    <CreateFlowSection
      openIt={openIt}
      name={copy.loveStoryName}
      description={copy.loveStoryDescription}>
      <div className={flowFieldStack}>
        <Form.Item
          name="loveStoryPhotos"
          className="!mb-0"
          rules={requiredPhotos(copy, 'polaroidPhotos', 3)}>
          <PhotoDropZone
            required
            label={copy.polaroidPhotos}
            limit={POLAROID_PHOTO_LIMIT}
            ratio="ratioStandard"
            atLeast={3}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        <Chapter chapter={LOVE_STORY_CHAPTERS[0]} index={0} />
        <Chapter chapter={LOVE_STORY_CHAPTERS[1]} index={1} />

        <Form.Item
          name="polaroidPhoto"
          className="!mb-0"
          rules={requiredPhotos(copy, 'proposalPhoto', 1)}>
          <PhotoDropZone
            required
            label={copy.proposalPhoto}
            limit={PROPOSAL_PHOTO_LIMIT}
            ratio="ratioStandard"
            atLeast={1}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        <Chapter chapter={LOVE_STORY_CHAPTERS[2]} index={2} />

        <Form.Item name="loveStoryVideo" noStyle>
          <VideoDropZone
            label={copy.weddingTeaserVideo}
            openNotification={openNotification}
          />
        </Form.Item>
      </div>
    </CreateFlowSection>
  );
}
