import type { Metadata } from 'next';

import RollOfUs from './roll-of-us';
import { ROLL_OF_US_SAMPLE_DATA } from './sample-data';

export const metadata: Metadata = {
  title: 'Roll of Us - Memoify',
  description:
    'Wind the film, press the shutter, and watch a roll of shared memories develop.',
};

export default function RollOfUsSamplePage() {
  return <RollOfUs data={ROLL_OF_US_SAMPLE_DATA} />;
}
