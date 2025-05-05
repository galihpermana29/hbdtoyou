'use client';
import { getLatestInspiration } from '@/action/user-api';
import { Divider, Input, message, Pagination, Select, Spin } from 'antd';

import { useEffect, useState } from 'react';
import { InspirationCard } from './InspirationCard';

import { LoadingOutlined } from '@ant-design/icons';
import { IAllTemplateResponse } from '@/action/interfaces';
import { capitalizeFirstLetter, mapContentToCard } from '@/lib/utils';

const PAGE_SIZE = 10;

const NewInspirationPage = ({
  templates,
}: {
  templates: IAllTemplateResponse[];
}) => {
  const [data, setData] = useState<any[] | undefined>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [paginatedData, setPaginatedData] = useState<
    | { page: number; pageSize: number; data: any[] | undefined; total: number }
    | undefined
  >({
    page: 1,
    pageSize: PAGE_SIZE,
    data: [],
    total: 0,
  });

  const [search, setSearch] = useState<string | null>('');
  const [activeType, setActiveType] = useState<string | null>('all');

  const templatesOptions = templates?.map((dx) => ({
    value: dx.id,
    label: dx.name?.split('-')[0],
  }));

  const handlePaginationChange = (page: number) => {
    setPaginatedData({
      page,
      pageSize: PAGE_SIZE,
      data: data!.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      total: data!.length,
    });
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const handleGetData = async () => {
    setLoading(true);
    const data = await getLatestInspiration();
    if (data.success) {
      const mappedData = mapContentToCard(data.data?.contents).filter(
        (show) => show && show?.jumbotronImage && show?.title
      );

      setData(mappedData ? mappedData : []);
      setPaginatedData({
        page: 1,
        pageSize: PAGE_SIZE,
        data: mappedData ? mappedData.slice(0, PAGE_SIZE) : [],
        total: mappedData ? mappedData.length : 0,
      });
    } else {
      message.error('Something went wrong');
    }
    setLoading(false);
  };

  const handleSearchByTitle = (title: string, activeType: string) => {
    const filteredData = data?.filter((item) =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );

    const finalFilteredData =
      activeType === 'all'
        ? filteredData
        : filteredData?.filter((item) => item.template_id === activeType);

    //set to pagination
    setPaginatedData({
      page: 1,
      pageSize: PAGE_SIZE,
      data: finalFilteredData ? finalFilteredData.slice(0, PAGE_SIZE) : [],
      total: finalFilteredData ? finalFilteredData.length : 0,
    });
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    if (search || activeType) {
      handleSearchByTitle(search, activeType);
    }
  }, [search, activeType]);

  return (
    <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen my-[40px]">
      <div className="flex-col md:flex-row flex justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-[#1B1B1B] font-[600] text-[18px]">Inspiration</h1>
          <p className="text-[#7B7B7B] text-[14px] font-[400]">
            Inspiration from other that maybe make you interested
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-[50%]">
          <Input
            onChange={(e) => handleSearch(e)}
            placeholder="Search inspirations"
            className="max-w-[400px] mt-[12px] md:mt-0 !h-[44px] w-full"
          />
          <Select
            onChange={(e) => setActiveType(e)}
            defaultValue={'all'}
            placeholder="Select a template"
            options={[{ value: 'all', label: 'All' }, ...templatesOptions]}
            className="max-w-[150px] mt-[12px] md:mt-0 !h-[44px] w-full"
          />
        </div>
      </div>
      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 24, color: '#E34013' }} />
            }
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col mt-[50px]">
            {data &&
              data?.length > 0 &&
              paginatedData?.data?.map((show, idx) => {
                return (
                  <div key={idx}>
                    <InspirationCard key={idx} data={show} />
                    <Divider />
                  </div>
                );
              })}
          </div>
          <div className="mx-auto flex justify-center my-[20px] w-full">
            <Pagination
              showSizeChanger={false}
              current={paginatedData?.page}
              onChange={handlePaginationChange}
              total={paginatedData?.total}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NewInspirationPage;
