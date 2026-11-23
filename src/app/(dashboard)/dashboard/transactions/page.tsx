import { getDashboardTransactions } from '@/action/user-api';
import { isAdminEmail } from '@/lib/admin';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';
import TransactionsClient from './TransactionsClient';

const TransactionsPage = async () => {
  const session = await getSession();
  const isAdmin = isAdminEmail(session?.email);
  if (!isAdmin) redirect('/dashboard');

  /**
   * What the page opens on (owner, 2026-11-24): QRIS payments that went
   * through, this month so far. It used to open on every method and status
   * since 2024, which is nobody's question.
   *
   * "This month" and "today" are Jakarta's: the server keeps UTC, and for
   * seven hours of every night that is still yesterday there, which on the
   * 1st would be last month.
   */
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
  }).format(new Date());
  const filters = {
    method: 'qris',
    status: 'done',
    date_from: `${today.slice(0, 8)}01`,
    date_to: today,
  };

  const res = await getDashboardTransactions({
    ...filters,
    page: '1',
    limit: '10',
  });

  return (
    <TransactionsClient
      initialData={res.success && res.data ? res.data : null}
      initialFilters={filters}
    />
  );
};

export default TransactionsPage;
