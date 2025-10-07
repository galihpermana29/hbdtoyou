import { getContentByUserId, getContentStatsByUserId } from '@/action/user-api';
import { mapContentToCard } from '@/lib/utils';
import { getSession } from '@/store/get-set-session';
import { Camera, CreditCard, UserRoundPlus } from 'lucide-react';
import DashboardContentContainer from './view/container/DashboardContentContainer';
import CardClient from './view/container/CardClient';

const DashboardPage = async () => {
  const session = await getSession();

  //check if it's admin email memoify.live@gmail.com
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  const data = await getContentByUserId(
    isAdmin ? null : (session?.userId as string),
    '200',
    '1'
  );
  const mappedData = data.success
    ? mapContentToCard(data.data, 'dashboard').filter(
        (show) => show && show?.jumbotronImage && show?.title
      )
    : [];

  const dataStats = await getContentStatsByUserId();
  return (
    <>
      <div className=" py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Dashboard</h1>
        <p className="text-[#475467] font-[400] text-[16px]">
          Manage your memories, scrapbook, & know your remaining credit
        </p>
      </div>

      {/* content */}
      <div className="md:mt-[40px] py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          <CardClient
            icon={<UserRoundPlus />}
            title="Memories Created"
            stats={
              dataStats?.success
                ? dataStats?.data?.contents?.total_gift_content
                : 0
            }
          />
          {isAdmin ? (
            <CardClient
              icon={<CreditCard />}
              title="Current Premium Users"
              stats={
                dataStats?.success
                  ? dataStats?.data?.contents?.total_premium_user
                  : 0
              }
            />
          ) : (
            <CardClient
              icon={<Camera />}
              title="Scrapbook Token"
              stats={
                dataStats?.success
                  ? dataStats?.data?.contents?.total_photo_box_content
                  : 0
              }
            />
          )}

          {isAdmin ? (
            <CardClient
              icon={<CreditCard />}
              title="Registered Users"
              stats={
                dataStats?.success
                  ? dataStats?.data?.contents?.total_registered_user
                  : 0
              }
            />
          ) : (
            <CardClient
              icon={<CreditCard />}
              title="Credit Remaining"
              stats={0}
            />
          )}
        </div>
      </div>

      {/* manage memories */}
      <div className=" py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] !pt-[32px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[18px]">
          Manage memories & scrapbook
        </h1>
        <p className="text-[#475467] font-[400] text-[16px]">
          Manage your created template & download your scrapbook here.
        </p>
      </div>

      {/* card */}
      <DashboardContentContainer data={mappedData} />
    </>
  );
};

export default DashboardPage;
