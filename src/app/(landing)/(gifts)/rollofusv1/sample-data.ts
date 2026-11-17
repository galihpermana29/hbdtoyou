import type { RollOfUsData } from './roll-of-us-data';

/**
 * Sample content for the preview. The pictures are the illustrations the
 * Claw of Us and Board of Us samples already use - drawings, nobody's
 * photographs - so the preview adds no assets of its own.
 */
export const ROLL_OF_US_SAMPLE_DATA: RollOfUsData = {
  title: 'Roll of Us',
  recipientName: 'Jamie',
  senderName: 'Sam',
  cameraColor: 'lime',
  frames: [
    {
      imageUrl: '/arcadeclawv1/coffee-date.svg',
      date: '2025-03-14',
      caption: 'first coffee. you talked, i stared',
      alt: 'Two coffee cups beside a vase of flowers',
    },
    {
      imageUrl: '/arcadeclawv1/road-trip.svg',
      date: '2025-05-02',
      caption: 'the wrong turn that was right',
      alt: 'A little car driving through green hills',
    },
    {
      imageUrl: '/boardofusv1/kitchen-dance.svg',
      date: '2025-06-21',
      caption: 'you moved!! (keeping it anyway)',
      alt: 'Two people dancing together in a colorful kitchen',
      blooper: 'blurry',
    },
    {
      imageUrl: '/arcadeclawv1/picnic-day.svg',
      date: '2025-07-19',
      caption: 'snacks, sun, your best laugh',
      alt: 'A picnic blanket under a leafy tree',
    },
    {
      imageUrl: '/arcadeclawv1/sunset-date.svg',
      date: '2025-08-30',
      caption: 'we forgot what time it was',
      alt: 'Two people watching a pink sunset by the sea',
    },
    {
      imageUrl: '/boardofusv1/rainy-day.svg',
      date: '2025-10-11',
      caption: 'flash too close, oops',
      alt: 'Two people walking together beneath an umbrella',
      blooper: 'overexposed',
    },
    {
      imageUrl: '/arcadeclawv1/stargazing.svg',
      date: '2025-12-24',
      caption: 'every star showed up for us',
      alt: 'Two people sitting under a starry night sky',
    },
    {
      imageUrl: '/boardofusv1/birthday-cake.svg',
      date: '2026-02-08',
      caption: 'make a wish, i already did',
      alt: 'Two people celebrating beside a birthday cake',
    },
  ],
  envelopeNote: 'open after the last photo',
  letter:
    'Happy birthday, Jamie.\n\nI used up a whole roll and still ran out of film before I ran out of reasons. Some of these came out blurry, one is mostly flash, and every single one is my favourite because you are in it.\n\nHere is to the next roll. I will bring the camera, you bring the chaos.',
};
