/**
 * What the design says the details-and-story step is while the Cover Header is
 * being edited.
 *
 * Exported from Figma node 332-10572, "Edit Cover", in the Wedding Invitations
 * file.
 *
 * Everything this screen is made of is in `details-and-story.mjs`, which the
 * step's four states share. This file names the Sections this state draws open,
 * which is the first one.
 *
 * The design fills that Section's fields in - Freya, Elias, MANDARIN HOTEL,
 * JAKARTA, 03/05/2026 - and draws every one of them in the grey it writes
 * examples in, so they are the design's placeholders rather than anybody's
 * answers, and this state expects the same empty fields the other states do.
 */

import { detailsAndStory } from './details-and-story.mjs';

export const expectations = detailsAndStory(['Cover Header']);
