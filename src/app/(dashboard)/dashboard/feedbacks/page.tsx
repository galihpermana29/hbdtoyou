import { getListFeedbacks } from "@/action/user-api";
import { ErrorBoundaryCustom } from "@/components/ui/error-boundary";
import { Table } from "antd";

const getData = async () => {
  const dx = await getListFeedbacks()
  return dx
}


const columns = [{
  title: 'Email',
  dataIndex: 'email',
  key: 'email',
},
{
  title: 'Type',
  dataIndex: 'type',
  key: 'type',
},
{
  title: 'Message',
  dataIndex: 'message',
  key: 'message',
},
{
  title: 'Date Send',
  dataIndex: 'date',
  key: 'date',
}
]
const FeedbackPage = async () => {
  const data = await getData();

  if (!data.success) {
    return <ErrorBoundaryCustom />
  }

  return (
    <div className=" py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
      <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Feedbacks</h1>
      <p className="text-[#475467] font-[400] text-[16px]">
        View and manage user feedbacks
      </p>
      <div className="mt-[25px]">
        <Table columns={columns} dataSource={data.data} />
      </div>
    </div>
  );
};

export default FeedbackPage;