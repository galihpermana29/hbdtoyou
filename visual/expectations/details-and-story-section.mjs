/**
 * What the design says the details-and-story step is while a Section other than
 * the first is being edited.
 *
 * Exported from Figma node 332-11752, "Edit Other Section", in the Wedding
 * Invitations file. The Section the design opens there is the Love Story.
 *
 * Everything this screen is made of is in `details-and-story.mjs`, which the
 * step's four states share. This file names the Sections this state draws open,
 * which is the Love Story alone - including the Cover Header, which the flow
 * opens on and which this state therefore has to have closed.
 *
 * That is what this state is for. It is the only one of the four that shows a
 * Section open with the Sections above it closed, so it is what says the
 * Sections open and close independently rather than as an accordion: reaching it
 * means closing the Cover Header and opening the Love Story, and an accordion
 * would leave the wrong one of the two open.
 */

import { detailsAndStory } from './details-and-story.mjs';

export const expectations = detailsAndStory(['Love Story']);
