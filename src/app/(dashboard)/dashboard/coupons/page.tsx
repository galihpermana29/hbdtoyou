import { getCoupons } from '@/action/user-api';
import { isAdminEmail } from '@/lib/admin';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';
import CouponsClient from './CouponsClient';

const CouponsPage = async () => {
  const session = await getSession();
  const isAdmin = isAdminEmail(session?.email);
  if (!isAdmin) redirect('/dashboard');

  const res = await getCoupons({ page: '1', limit: '50' });

  return (
    <CouponsClient initialData={res.success && res.data ? res.data : []} />
  );
};

export default CouponsPage;
