import type { Metadata } from 'next';
import CameraLab from './camera-lab';

/**
 * A bench for one question: how many pixels should a Shot keep?
 *
 * It opens the camera exactly as the guest camera does, says what the phone
 * really handed over, and bakes one frame three ways so the results can be
 * compared on the phone that took them. Nothing leaves the device.
 *
 * Not linked from anywhere and not meant to merge: it lives on a preview
 * deployment while the resolution is being decided.
 */
export const metadata: Metadata = {
  title: 'MemoRoll camera lab',
  robots: { index: false, follow: false },
};

export default function CameraLabPage() {
  return <CameraLab />;
}
