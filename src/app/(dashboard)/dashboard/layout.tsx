import DashboardNavbar from '@/components/ui/dashboard-navbar';
import NavigationBar from '@/components/ui/navbar';
import { getSession } from '@/store/get-set-session';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const isAdmin = session?.email === 'memoify.live@gmail.com';

  return (
    <div className="min-h-screen mb-[80px]">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
        <DashboardNavbar isAdmin={isAdmin} />
      </div>

      <div className="pt-[180px]">{children}</div>
    </div>
  );
};

export default DashboardLayout;