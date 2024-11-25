'use server';

import { revalidateTag } from 'next/cache';

export const revalidateRandom = () => {
  revalidateTag('random');
};
