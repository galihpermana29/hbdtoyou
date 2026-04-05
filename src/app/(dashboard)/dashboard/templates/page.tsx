import { getAllTemplates } from '@/action/user-api';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';
import TemplatesClient from './TemplatesClient';

const TemplatesPage = async () => {
  const session = await getSession();
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  if (!isAdmin) redirect('/dashboard');

  const res = await getAllTemplates();

  return (
    <TemplatesClient initialData={res.success && res.data ? res.data : []} />
  );
};

export default TemplatesPage;
