import {
  getContentByUserId,
  getContentStatsByUserId,
  getDashboardOverview,
} from '@/action/user-api';
import { mapContentToCard } from '@/lib/utils';
import { getSession } from '@/store/get-set-session';
import { Banknote, Camera, CreditCard, Megaphone, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import CardClient from './view/container/CardClient';
import DashboardContentContainer from './view/container/DashboardContentContainer';

const DashboardPage = async () => {
  const session = await getSession();

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
  const overview = isAdmin ? await getDashboardOverview() : null;
  return (
    <>
      <div className=" py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Dashboard</h1>
        <p className="text-[#475467] font-[400] text-[16px]">
          Manage your memories, scrapbook, & know your remaining credit
        </p>
      </div>

      {/* AU Program Banner - non-admin only */}
      {!isAdmin && (
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] mt-[16px]">
          <Link href="/career" className="block">
            <div className="flex items-center gap-3 md:gap-4 bg-gradient-to-r from-[#E34013]/10 to-orange-50 border border-[#E34013]/20 rounded-[10px] px-4 py-3 md:px-5 md:py-4 hover:border-[#E34013]/40 transition-colors cursor-pointer">
              <div className="w-9 h-9 bg-[#E34013] rounded-full flex items-center justify-center flex-shrink-0">
                <Megaphone size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] md:text-[15px] text-[#1B1B1B]">
                  <span className="font-bold">Announcement!</span>{' '} <br />
                  If you&apos;re an AU author on Twitter/X or TikTok, join our{' '}
                  <span className="font-semibold text-[#E34013]">
                    Memoify AU Program
                  </span>{' '}
                  and get up to 100% free access to all premium features.
                </p>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 bg-[#E34013] text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] flex-shrink-0 hover:bg-[#c23611] transition-colors">
                Learn More
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* content */}
      <div className="md:mt-[40px] py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
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
          {isAdmin && overview?.success && (
            <>
              <CardClient
                icon={<Banknote />}
                title="Total Payments"
                stats={overview.data?.total_payments ?? 0}
              />
            </>
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
