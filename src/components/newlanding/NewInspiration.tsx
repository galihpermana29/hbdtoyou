'use client';
import { getLatestInspiration } from '@/action/user-api';
import { Input, message, Select, Spin } from 'antd';
import Masonry from 'react-masonry-css';

import { useEffect, useState } from 'react';
import { InspirationCard } from './InspirationCard';

import { LoadingOutlined } from '@ant-design/icons';
import { IAllTemplateResponse } from '@/action/interfaces';
import { capitalizeFirstLetter, mapContentToCard } from '@/lib/utils';

// Breakpoint object for responsive columns
const breakpointColumnsObj = {
  default: 5, // Default number of columns for very large screens
  1600: 4, // 4 columns at 1600px width
  1280: 3, // 3 columns at 1280px width
  1024: 3, // 3 columns at 1024px width
  768: 2, // 2 columns at 768px width
  640: 2, // 2 columns at 640px width and below
  480: 2, // 1 column for very small mobile screens
};

const NewInspirationPage = ({
  templates,
}: {
  templates: IAllTemplateResponse[];
}) => {
  const [data, setData] = useState<any[] | undefined>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[] | undefined>([]);

  const [search, setSearch] = useState<string | null>('');
  const [activeType, setActiveType] = useState<string | null>('all');

  const templatesOptions = templates?.map((dx) => ({
    value: dx.id,
    label: dx.name?.split('-')[0],
  }));

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
      setFilteredData(mappedData ? mappedData : []);
    } else {
      message.error('Something went wrong');
    }
    setLoading(false);
  };

  const handleSearchByTitle = (title: string, activeType: string) => {
    const filtered = data?.filter((item) =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );

    const finalFiltered =
      activeType === 'all'
        ? filtered
        : filtered?.filter((item) => item.template_id === activeType);

    setFilteredData(finalFiltered || []);
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
          <div className="mt-[50px]">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((show, idx) => (
                  <div key={idx} className="mb-6">
                    <InspirationCard data={show} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No inspiration found
                </div>
              )}
            </Masonry>
          </div>
        </>
      )}
    </div>
  );
};

export default NewInspirationPage;
