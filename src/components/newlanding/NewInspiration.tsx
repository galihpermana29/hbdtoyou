'use client';
import { getLatestInspiration } from '@/action/user-api';
import { Divider, Input, message, Pagination, Spin } from 'antd';

import { useEffect, useState } from 'react';
import { InspirationCard } from './InspirationCard';

import { LoadingOutlined } from '@ant-design/icons';

function capitalizeFirstLetter(val: string) {
  if (!val) return;
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const PAGE_SIZE = 5;
const NewInspirationPage = () => {
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
      const mappedData = data.data?.contents
        ?.map((show) => {
          const jsonContent = JSON.parse(show.detail_content_json_text);
          const handleJumbotron = () => {
            if (
              show.template_name.includes('magazinev1') ||
              show.template_name.includes('spotifyv1') ||
              show.template_name.includes('magazinev1')
            ) {
              return Array.isArray(jsonContent.momentOfYou)
                ? jsonContent.momentOfYou.length > 0
                  ? jsonContent.momentOfYou[0]
                  : null
                : null;
            }

            if (
              show.template_name.includes('netflixv1') ||
              show.template_name.includes('disneyplusv1') ||
              show.template_name.includes('newspaperv3') ||
              show.template_name.includes('newspaperv1')
            ) {
              return jsonContent.jumbotronImage;
            }
          };

          if (!handleJumbotron()) return;

          if (
            Object.prototype.hasOwnProperty.call(jsonContent, 'isPublic') &&
            jsonContent?.isPublic === false
          )
            return;

          return {
            ...show,
            jumbotronImage: handleJumbotron(),
            title: capitalizeFirstLetter(jsonContent.title?.toLowerCase()),
            link: `/${show.template_name.split('-')[1].split(' ')[1]}/${
              show.id
            }`,
            desc: jsonContent?.subTitle,
            type: show.template_name.split('-')[0],
          };
        })
        .filter((show) => show && show?.jumbotronImage && show?.title);

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

  const handleSearchByTitle = (title: string) => {
    const filteredData = data?.filter((item) =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );
    //set to pagination
    setPaginatedData({
      page: 1,
      pageSize: PAGE_SIZE,
      data: filteredData ? filteredData.slice(0, PAGE_SIZE) : [],
      total: filteredData ? filteredData.length : 0,
    });
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    if (search) {
      handleSearchByTitle(search);
    }
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen my-[40px]">
      <div className="flex-col md:flex-row flex justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-[#1B1B1B] font-[600] text-[18px]">Inspiration</h1>
          <p className="text-[#7B7B7B] text-[14px] font-[400]">
            Inspiration from other that maybe make you interested
          </p>
        </div>
        <Input
          onChange={(e) => handleSearch(e)}
          placeholder="Search inspirations"
          className="max-w-[300px] mt-[12px] md:mt-0 !h-[44px]"
        />
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
