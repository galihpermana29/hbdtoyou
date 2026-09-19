/**
 * What the design says the details-and-story step is, with every Section open.
 *
 * Exported from Figma node 332-14392, "Expanded All", in the Wedding Invitations
 * file. It is the frame of record for this step: where the step's other three
 * frames disagree with it, it wins. See
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * Everything this screen is made of is in `details-and-story.mjs`, which the
 * step's four states share. This file names the Sections this state draws open,
 * which is all of them.
 */

import { detailsAndStory, EVERY_SECTION } from './details-and-story.mjs';

export const expectations = detailsAndStory(EVERY_SECTION);
