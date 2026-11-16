import DashboardNavbar from '@/components/ui/dashboard-navbar';
import MemorollFormTheme from '@/components/forms/memoroll-form-theme';
import NavigationBar from '@/components/ui/navbar';
import { isAdminEmail } from '@/lib/admin';
import { getSession } from '@/store/get-set-session';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const isAdmin = isAdminEmail(session?.email);

  return (
    <div className="min-h-screen mb-[80px]">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
        <DashboardNavbar isAdmin={isAdmin} />
      </div>

      <MemorollFormTheme className="min-h-screen pt-[180px]">
        {children}
      </MemorollFormTheme>
    </div>
  );
};

export default DashboardLayout;
