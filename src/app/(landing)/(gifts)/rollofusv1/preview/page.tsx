import type { Metadata } from 'next';

import RollOfUs from '../roll-of-us';
import { ROLL_OF_US_SAMPLE_DATA } from '../sample-data';

export const metadata: Metadata = {
  title: 'Roll of Us - Memoify Preview',
  description:
    'Wind the film, press the shutter, and watch a roll of shared memories develop.',
  // A preview for the owner to judge, not a page to be found.
  robots: { index: false, follow: false },
};

export default function RollOfUsPreviewPage() {
  return <RollOfUs data={ROLL_OF_US_SAMPLE_DATA} />;
}
