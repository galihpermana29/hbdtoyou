import { getListPackages } from '@/action/user-api';
import { isAdminEmail } from '@/lib/admin';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';
import PlansClient from './PlansClient';

const PlansPage = async () => {
  const session = await getSession();
  const isAdmin = isAdminEmail(session?.email);
  if (!isAdmin) redirect('/dashboard');

  const res = await getListPackages();

  return <PlansClient initialData={res.success && res.data ? res.data : []} />;
};

export default PlansPage;
