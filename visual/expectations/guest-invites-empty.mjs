/**
 * What the design says the guest invites step is, before a Guest List exists.
 *
 * Exported from Figma node 332-12440, "Guest invites details", in the Wedding
 * Invitations file. Everything this state shares with the populated one is in
 * `guest-invites.mjs`; what is below is the Add Guest List Section as this frame
 * draws it, which is the only place the two frames differ.
 *
 * The order of this list is the order the design arranges the screen in, and the
 * check asserts it. Nothing here says how wide or how tall anything is.
 */

import {
  guestInvitesIntroduction,
  invitationPreview,
  stepActions,
} from './guest-invites.mjs';
import { pageChrome, siteFooter, TYPE } from './page-chrome.mjs';

/** The area the design offers a Guest List in, before one has been uploaded. */
const emptyGuestList = [
  {
    name: 'Guest List label',
    withText: 'Guest List',
    style: TYPE.fieldLabel,
  },
  {
    name: 'Guest List drop zone',
    select: 'form [role="group"]',
    nth: 1,
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderStyle: 'dashed',
      borderWidth: '1px',
      borderColor: '#d9d9d9',
      borderRadius: '8px',
      padding: '16px',
      gap: '16px',
    },
  },
  {
    name: 'Guest List drop zone prompt',
    withText: 'Drag & drop up your list here',
    style: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '22.4px',
      color: 'rgba(0, 0, 0, 0.88)',
    },
  },
  {
    name: 'Guest List accepted format',
    withText: 'Upload in format .CSV',
    style: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '16.8px',
      color: 'rgba(0, 0, 0, 0.45)',
    },
  },
  {
    name: 'Guest List size limit',
    withText: 'Max file size 5MB',
    style: TYPE.fieldHint,
  },
];

export const expectations = [
  ...pageChrome('Guest invites details'),
  ...guestInvitesIntroduction,
  ...emptyGuestList,
  ...stepActions,
  ...invitationPreview,
  siteFooter,
];
