'use client';

import { useEffect, useState } from 'react';
import { useMemoifyProfile } from '../session-provider';
import { approveRejectProof, getListPayment } from '@/action/user-api';
import { Button, message, Table } from 'antd';

const AdminPage = () => {
  const [dataTable, setDataTable] = useState<any[]>([]);
  const profileMemoify = useMemoifyProfile();

  const handleGetData = async () => {
    const res = await getListPayment();
    if (res.data) {
      setDataTable(res.data);
    } else {
      setDataTable([]);
      message.error(res.message);
    }
  };

  const handleApproveReject = async (
    action: 'rejected' | 'done',
    id: string
  ) => {
    const res = await approveRejectProof({ status: action }, id);
    if (res.data) {
      message.success('Successfully updated!');
      handleGetData();
    } else {
      message.error(res.message);
    }
  };

  const column = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Status Payment',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Payment',
      dataIndex: 'proof_payment_url',
      key: 'proof_payment_url',
      render: (url: string) => (
        <img src={url} alt="avatar" style={{ width: '100%' }} />
      ),
    },
    {
      title: 'action',
      key: 'action',
      render: (record: any) => {
        if (record.status !== 'pending') {
          return '';
        }
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              size="large"
              onClick={() => handleApproveReject('done', record.id)}>
              Approve
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              onClick={() => handleApproveReject('rejected', record.id)}>
              Reject
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    if (profileMemoify) {
      handleGetData();
    }
  }, [profileMemoify]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[90%] my-5">
        <Table
          scroll={{ x: 1000 }}
          dataSource={dataTable}
          columns={column}
          pagination={{
            total: dataTable.length,
            pageSize: 10,
          }}
        />
      </div>
    </div>
  );
};

export default AdminPage;
