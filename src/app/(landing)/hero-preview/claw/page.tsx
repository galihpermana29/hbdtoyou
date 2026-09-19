'use client';

import ClawOfUs from '../../(gifts)/arcadeclawv1/claw-of-us';
import { ARCADE_CLAW_SAMPLE_DATA } from '../../(gifts)/arcadeclawv1/sample-data';

export default function HeroClawPreviewPage() {
  return <ClawOfUs compact data={ARCADE_CLAW_SAMPLE_DATA} />;
}
