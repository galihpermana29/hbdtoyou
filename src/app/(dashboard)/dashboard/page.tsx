import { getContentByUserId, getContentStatsByUserId } from '@/action/user-api';
import DashboardNavbar from '@/components/ui/dashboard-navbar';
import NavigationBar from '@/components/ui/navbar';
import { mapContentToCard } from '@/lib/utils';
import { getSession } from '@/store/get-set-session';
import { CreditCard, UserRoundPlus, Users } from 'lucide-react';
import DashboardContentContainer from './view/container/DashboardContentContainer';
import CardClient from './view/container/CardClient';

const DashboardPage = async () => {
  const session = await getSession();

  //check if it's admin email memoify.live@gmail.com
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  const data = await getContentByUserId(
    isAdmin ? null : (session?.userId as string)
  );
  const mappedData = data.success
    ? mapContentToCard(data.data).filter(
        (show) => show && show?.jumbotronImage && show?.title
      )
    : [];

  const dataStats = await getContentStatsByUserId();
  return (
    <div className="min-h-screen mb-[80px]">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
        <DashboardNavbar />
      </div>

      <div className="pt-[180px]">
        <div className=" py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
          <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Dashboard</h1>
          <p className="text-[#475467] font-[400] text-[16px]">
            Manage your memories, photobox, & know your remaining credit
          </p>
        </div>

        {/* content */}
        <div className="md:mt-[40px] py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            <div className="p-[20px] max-h-max border-[1px] border-[#EAECF0] rounded-[12px]">
              <div className="flex items-center gap-[12px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
                  <UserRoundPlus />
                </div>
                <h1 className="text-[#1B1B1B] font-[600] text-[16px]">
                  Memories created
                </h1>
              </div>
              <h1 className="text-[#1B1B1B] font-[600] text-[36px]">
                {dataStats?.success
                  ? dataStats?.data?.contents?.total_gift_content
                  : '0'}
              </h1>
            </div>
            <div className="p-[20px] max-h-max  border-[1px] border-[#EAECF0] rounded-[12px]">
              <div className="flex items-center gap-[12px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
                  <Users />
                </div>
                <h1 className="text-[#1B1B1B] font-[600] text-[16px]">
                  Photobox taken
                </h1>
              </div>
              <h1 className="text-[#1B1B1B] font-[600] text-[36px]">
                {dataStats?.success
                  ? dataStats?.data?.contents?.total_photo_box_content
                  : '0'}
              </h1>
            </div>
            <CardClient />
          </div>
        </div>

        {/* manage memories */}
        <div className=" py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] !pt-[32px]">
          <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
            Manage memories & photobox
          </h1>
          <p className="text-[#475467] font-[400] text-[16px]">
            Manage your created template & download your photobox here.
          </p>
        </div>

        {/* card */}
        <DashboardContentContainer data={mappedData} />
      </div>
    </div>
  );
};

export default DashboardPage;
