/**
 * What the design says the details-and-story step is, with every Section closed.
 *
 * Exported from Figma node 304-6174, "Collapsed", in the Wedding Invitations
 * file.
 *
 * Everything this screen is made of is in `details-and-story.mjs`, which the
 * step's four states share. This file names the Sections this state draws open,
 * which is none of them: a couple arriving at a closed step sees eight cards,
 * each offering to be opened, and nothing else.
 *
 * A Section that failed to close is caught by its own control rather than by its
 * fields. Nothing here can say an element is absent - the harness compares the
 * elements the design has, and a field nobody asked about is a field nobody
 * misses - but the design colours a closed Section's control in the flow's
 * orange and an open one's in grey, so a Section still open reports the wrong
 * colour on the control that was supposed to have closed it.
 */

import { detailsAndStory } from './details-and-story.mjs';

export const expectations = detailsAndStory([]);
