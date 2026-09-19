import type { Metadata } from 'next';
import BoardOfUs from './board-of-us';
import { BOARD_OF_US_SAMPLE_DATA } from './sample-data';

export const metadata: Metadata = {
  title: 'Board of Us — Memoify',
  description:
    'Roll through a tiny board game filled with shared memories and wishes.',
};

export default function BoardOfUsSamplePage() {
  return <BoardOfUs data={BOARD_OF_US_SAMPLE_DATA} />;
}
