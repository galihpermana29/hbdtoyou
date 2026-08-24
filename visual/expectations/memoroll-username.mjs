/**
 * "This you?" - the one thing a guest is asked before they shoot (guest-05 in
 * the capture, Figma node 450:13751).
 *
 * The design's second frame of this screen raises the iOS keyboard over it.
 * That is the phone rather than the product, so there is nothing here about it:
 * the field is an ordinary input and the keyboard is the operating system's
 * answer to it being tapped.
 *
 * The handle is centred inside a field that is otherwise space-between, which
 * puts the pencil out at the right edge on its own. Both are asserted, because
 * a field that centred everything would look like a mistake and a field that
 * left-aligned the handle would be a different design.
 */

import { body, COLOUR, cta, memoifyFooter } from './memoroll.mjs';

export const expectations = [
  {
    name: 'the heading',
    withText: 'Welcome to Memoroll!',
    style: body(20, 700, COLOUR.ink),
  },
  {
    name: 'the line under it',
    withText: 'Let’s set you up before shooting the moments',
    style: body(12, 500, COLOUR.ink),
  },
  {
    name: 'the field label',
    withText: 'This you?',
    style: body(14, 600, COLOUR.black),
  },
  {
    name: 'the handle field',
    select: 'form div.rounded-full',
    nth: 0,
    style: {
      backgroundColor: COLOUR.field,
      borderRadius: '9999px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      padding: '8px 16px',
    },
  },
  {
    name: 'the handle itself',
    select: 'input#memoroll-handle',
    style: {
      ...body(12, 500, COLOUR.ink),
      textAlign: 'center',
    },
  },
  cta('Yup, let’s shoot!'),
  memoifyFooter,
];
