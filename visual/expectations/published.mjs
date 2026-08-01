/**
 * What the design says the published screen is.
 *
 * Exported from Figma node 305-8972, "Final Step", in the Wedding Invitations
 * file. Every value below was read from that frame. The design is literal truth,
 * including its copy errors: see `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * The order of this list is the order the design arranges the screen in, and the
 * check asserts it. Nothing here says how wide or how tall anything is.
 *
 * How an element is found is written out once in
 * `details-and-story.mjs` and not repeated here. This screen adds two
 * things to the contract described there: `aside` is the panel the invitation is
 * shown in, and `a` is an action that is a destination rather than a decision.
 * Everything above this step's own content is the same on all four steps and
 * comes from `page-chrome.mjs`, including this step's title, which is "Share
 * with guests" by the one agreed deviation rather than the frame's "Share with
 * communities".
 *
 * ## Spacing
 *
 * The distances the design states are asserted as margins on the elements they
 * belong to, because a gap belongs to a container and this screen's containers
 * are plain boxes the contract above cannot name. The screen is built to match:
 * see the note in `published-step.tsx`.
 *
 * ## What is deliberately not asserted here
 *
 * The invitation inside the panel is the couple's own, rendered live, so nothing
 * in it is the design's to state. The panel around it is: the design draws it as
 * a device mockup, and its tray's colour, corner and padding are asserted while
 * the phone furniture the mockup adds - a status bar reading 9:41 - is not,
 * because that is Figma's furniture rather than a decision about this screen.
 *
 * Two lines of copy on this screen are not in the frame and cannot be asserted
 * either, because neither is on the screen at rest: the Copy action says
 * "Copied" for two seconds after it worked, and says so in words underneath if
 * the browser refused it. The design shows neither state. An action that gave no
 * sign of having done anything would be worse than a state the design is silent
 * about, and the check only ever sees a screen at rest.
 *
 * ## The link the screen shows
 *
 * The frame reads `https://FreeAtLastWithElias.memoify.live?name=guest`. Two
 * things about it are not literal. The address is a path rather than a
 * subdomain, per `docs/adr/0001-path-urls-not-subdomains.md`, and it names no
 * guest, because what the couple copies here is the invitation rather than one
 * guest's copy of it. The slug is still the couple's own: the harness types the
 * design's own name into the field on the step before, so what is asserted below
 * is what that name produces.
 */

import { FIELD_SHADOW, pageChrome, siteFooter, TYPE } from './page-chrome.mjs';

/** The heading and the paragraph that open this step, which only it has. */
const STEP_TYPE = {
  heading: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: '50px',
    color: '#1b1b1b',
  },
  description: {
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: '30px',
    color: '#7b7b7b',
  },
};

/** The Invitation Slug the harness types on the step before this one. */
export const DESIGNED_SLUG = 'FreeAtLastWithElias';

/** What that slug makes, which is what this screen has to show. */
const INVITATION_LINK = `https://memoify.live/w/${DESIGNED_SLUG}`;

export const expectations = [
  ...pageChrome('Share with guests'),
  {
    // The invitation stands to the left of the words, 60px from them.
    name: 'Invitation panel',
    select: 'aside',
    style: {
      backgroundColor: '#f7f7f7',
      borderRadius: '12px',
      padding: '14px',
      margin: '0px 60px 0px 0px',
    },
  },
  {
    name: 'Published heading',
    select: 'h2',
    text: 'Yeyyy!!, Your wedding invitation is published!',
    style: STEP_TYPE.heading,
  },
  {
    name: 'Published supporting text',
    select: 'h2 + p',
    text:
      "We've created your wedding invitation website and it's now ready for " +
      'your final touches. Personalize your domain, review your details, and ' +
      'send it to the people who matter most.',
    style: { ...STEP_TYPE.description, margin: '24px 0px 0px' },
  },
  {
    // The field is the link and the Copy action together, in one box: the box
    // carries the border, the radius and the shadow, and the two things inside
    // it carry their own.
    name: 'Invitation link field',
    select: '[role="group"]',
    style: {
      backgroundColor: '#ffffff',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#d0d5dd',
      borderRadius: '8px',
      boxShadow: FIELD_SHADOW,
      margin: '48px 0px 0px',
    },
  },
  {
    name: 'Invitation link',
    withText: INVITATION_LINK,
    style: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      color: '#e34013',
      backgroundColor: '#f9fafb',
      padding: '12px 14px',
    },
  },
  {
    name: 'Copy action',
    select: 'button',
    withText: 'Copy',
    style: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '20px',
      color: '#e34013',
      backgroundColor: '#ffffff',
      borderColor: '#d0d5dd',
      borderWidth: '0px 0px 0px 1px',
      padding: '14px 20px',
      gap: '6px',
    },
  },
  {
    name: 'Play My Invite action',
    select: 'button',
    withText: 'Play My Invite',
    style: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      color: '#e34013',
      backgroundColor: '#ffffff',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#e34013',
      borderRadius: '8px',
      padding: '10px 16px 10px 18px',
      gap: '6px',
      boxShadow: FIELD_SHADOW,
      margin: '48px 20px 0px 0px',
    },
  },
  {
    name: 'Back to home action',
    select: 'a',
    withText: 'Back to home',
    style: {
      ...TYPE.actionLabel,
      color: '#ffffff',
      backgroundColor: '#e34013',
      borderRadius: '8px',
      padding: '12px 18px 12px 20px',
      gap: '6px',
      boxShadow: FIELD_SHADOW,
      margin: '48px 0px 0px',
    },
  },
  siteFooter,
];
