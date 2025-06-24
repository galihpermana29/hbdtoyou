'use client';
import { getLatestInspiration } from '@/action/user-api';
import { Input, message, Select, Spin } from 'antd';
import Masonry from 'react-masonry-css';

import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { InspirationCard } from './InspirationCard';

import { LoadingOutlined } from '@ant-design/icons';
import {
  IAllTemplateResponse,
  ILatestContentResponse2,
} from '@/action/interfaces';
import { capitalizeFirstLetter, mapContentToCard } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

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
  const [debouncedSearch] = useDebounce(search, 500);
  const [activeType, setActiveType] = useState<string | null>('all');
  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Setup the intersection observer hook
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const templatesOptions = templates?.map((dx) => ({
    value: dx.id,
    label: dx.name?.split('-')[0]?.split('v')[0],
  }));

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const handleGetData = async (
    pageNum: number = 1,
    isLoadingMore: boolean = false
  ) => {
    if (pageNum === 1) {
      setLoading(true);
    } else if (isLoadingMore) {
      setLoadingMore(true);
    }

    try {
      // Pass template ID if not 'all'
      const templateId = activeType !== 'all' ? activeType : undefined;
      // Pass search keyword if present
      const keyword = debouncedSearch || undefined;
      const response = await getLatestInspiration(
        20,
        pageNum,
        templateId,
        keyword
      );
      if (response.success && response.data) {
        const mappedData = mapContentToCard(response.data.data).filter(
          (show) => show && show?.jumbotronImage && show?.title
        );

        // Update pagination info
        setTotalPages(response.data.meta.totalPage);
        setHasMore(pageNum < response.data.meta.totalPage);

        if (isLoadingMore && pageNum > 1) {
          // Append new data to existing data
          setData((prevData) => [...(prevData || []), ...(mappedData || [])]);
          setFilteredData((prevData) => [
            ...(prevData || []),
            ...(mappedData || []),
          ]);
        } else {
          // First load or refresh
          setData(mappedData || []);
          setFilteredData(mappedData || []);
        }
      } else {
        message.error('Failed to load inspirations');
      }
    } catch (error) {
      console.error('Error fetching inspirations:', error);
      message.error('Something went wrong while loading inspirations');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // We no longer need local search since we're using the API

  // Load more data when user scrolls to the bottom
  const loadMoreData = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleGetData(nextPage, true);
    }
  }, [loadingMore, hasMore, page, loading, activeType]);

  // Initial data load
  useEffect(() => {
    handleGetData(1);
  }, []);

  // Trigger load more when bottom is in view
  useEffect(() => {
    if (inView) {
      loadMoreData();
    }
  }, [inView, loadMoreData]);

  // Effect for handling template filter changes and debounced search
  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
    handleGetData(1);
  }, [activeType, debouncedSearch]);

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
            popupClassName="inspiration-select-dropdown"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            listHeight={256}
            virtual={false}
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
                  <div key={`${show.id}-${idx}`} className="mb-6">
                    <InspirationCard data={show} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No inspiration found
                </div>
              )}
            </Masonry>

            {/* Loading indicator and intersection observer target */}
            {!loading && hasMore && (
              <div ref={ref} className="w-full flex justify-center py-8">
                {loadingMore && (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 24, color: '#E34013' }}
                      />
                    }
                  />
                )}
              </div>
            )}

            {/* End of content message */}
            {!hasMore && filteredData && filteredData.length > 0 && (
              <div className="w-full text-center py-8 text-gray-500">
                You have reached the end of inspirations
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NewInspirationPage;
