import type { Metadata } from 'next';
import ClawOfUs from '../claw-of-us';
import { ARCADE_CLAW_SAMPLE_DATA } from '../sample-data';

export const metadata: Metadata = {
  title: 'Claw of Us - Memoify Preview',
  description: 'A playful claw-machine gift filled with shared memories.',
};

export default function ArcadeClawPreviewPage() {
  return <ClawOfUs data={ARCADE_CLAW_SAMPLE_DATA} />;
}
