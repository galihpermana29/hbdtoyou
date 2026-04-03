import { getDashboardTransactions } from '@/action/user-api';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';
import TransactionsClient from './TransactionsClient';

const TransactionsPage = async () => {
  const session = await getSession();
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  if (!isAdmin) redirect('/dashboard');

  const defaultParams = {
    date_from: '2024-01-01',
    date_to: '2026-12-31',
    page: '1',
    limit: '10',
  };

  const res = await getDashboardTransactions(defaultParams);

  return (
    <TransactionsClient
      initialData={res.success && res.data ? res.data : null}
    />
  );
};

export default TransactionsPage;
