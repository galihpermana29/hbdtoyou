import type { Metadata } from 'next';
import ClawOfUsPreview from './claw-of-us-preview';

export const metadata: Metadata = {
  title: 'Claw of Us — Memoify Preview',
  description: 'A playful claw-machine gift filled with shared memories.',
};

export default function ArcadeClawPreviewPage() {
  return <ClawOfUsPreview />;
}
