import DashboardNavbar from '@/components/ui/dashboard-navbar';
import NavigationBar from '@/components/ui/navbar';
import { Badge, Button, Tag } from 'antd';
import {
  CreditCard,
  Delete,
  Edit,
  Edit2,
  SquarePen,
  Trash,
  UserRoundPlus,
  Users,
} from 'lucide-react';
import Image from 'next/image';

const DashboardPage = () => {
  const CustomCard = () => {
    return (
      <div className="min-w-[320px] max-w-[400px] border-[1px] p-[15px] border-[#EAECF0] rounded-[6px]">
        <div className="w-full h-[190px] overflow-hidden object-cover">
          <Image
            width={1000}
            height={500}
            className="object-cover"
            alt="image"
            src={
              'https://res.cloudinary.com/dxuumohme/image/upload/v1736523215/wsirojyt0fcximpkgt20.png'
            }
          />
        </div>
        <div className="my-[24px] flex items-center justify-between">
          <Tag color="red">Netflix</Tag>
          <Tag color="blue">Draft</Tag>
        </div>
        <h1 className="text-[#475467] font-[400] text-[16px] my-[24px]">
          🎬 A Night to Remember: The Best Movie for Your Celebration
        </h1>
        <div className="flex justify-end gap-2 mt-[14px]">
          <Button
            iconPosition="end"
            icon={<SquarePen size={18} />}
            className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[40px] "
            type="primary"
            size="large">
            Edit
          </Button>{' '}
          <Button
            iconPosition="end"
            icon={<Trash size={18} />}
            className="!bg-[#fff] !text-[#E34013] !border-[1px] !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[40px] "
            type="primary"
            size="large">
            Delete
          </Button>
        </div>
      </div>
    );
  };
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <div className="p-[20px] max-h-max border-[1px] border-[#EAECF0] rounded-[12px]">
              <div className="flex items-center gap-[12px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
                  <UserRoundPlus />
                </div>
                <h1 className="text-[#1B1B1B] font-[600] text-[16px]">
                  Memories created
                </h1>
              </div>
              <h1 className="text-[#1B1B1B] font-[600] text-[36px]">328</h1>
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
              <h1 className="text-[#1B1B1B] font-[600] text-[36px]">328</h1>
            </div>
            <div className="p-[20px] max-h-max  border-[1px] border-[#EAECF0] rounded-[12px]">
              <div className="flex items-center gap-[12px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
                  <CreditCard />
                </div>
                <h1 className="text-[#1B1B1B] font-[600] text-[16px]">
                  Credit remaining
                </h1>
              </div>
              <h1 className="text-[#1B1B1B] font-[600] text-[36px]">328</h1>
            </div>
            <div className="p-[20px] max-h-max  border-[1px] border-[#EAECF0] rounded-[12px]">
              <div className="flex items-center gap-[12px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-[12px] border-[1px] border-[#EAECF0] flex justify-center items-center">
                  <UserRoundPlus />
                </div>
                <h1 className="text-[#1B1B1B] font-[600] text-[16px]">
                  Memories created
                </h1>
              </div>
              <h1 className="text-[#1B1B1B] font-[600] text-[36px]">328</h1>
            </div>
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
        <div className="md:mt-[30px] py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dx, idx) => {
            return (
              <div key={idx} className="w-full flex justify-center">
                <CustomCard />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
