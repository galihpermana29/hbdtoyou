import { getDetailContent } from '@/action/user-api';
import LockScreen from '@/components/ui/lock-screen';

import RollOfUs from '../roll-of-us';
import { normalizeRollOfUsData } from '../roll-of-us-data';
import { notFound } from 'next/navigation';

export default async function RollOfUsGiftPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getDetailContent(params.id);
  if (!response.data) {
    notFound();
  }

  let rawData: unknown;
  try {
    rawData = JSON.parse(response.data.detail_content_json_text);
  } catch {
    notFound();
  }

  const data = normalizeRollOfUsData(rawData);
  if (!data) {
    notFound();
  }

  const content = <RollOfUs data={data} />;
  const lockedContent =
    response.data.status === 'locked' ||
    (response.data.user_type === 'free' &&
      response.data.template_label === 'premium');

  if (lockedContent) {
    return (
      <LockScreen
        contentId={params.id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock this Roll of Us gift. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
}
