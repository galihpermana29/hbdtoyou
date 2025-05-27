import React from 'react';

import { getDetailContent } from '@/action/user-api';
import JournalHeader from './view/presentation/JournalHeader';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

async function EntryDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch journal data using the ID
  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  // Parse the journal content
  const entry = JSON.parse(data.data.detail_content_json_text);

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm max-w-4xl mx-auto my-8 print:border-0 print:shadow-none min-w-[700px]">
      <JournalHeader />
      <div className="p-8">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-1 font-serif">{entry.date}</p>
          <h1 className="font-serif text-2xl font-bold mb-3 text-gray-900 max-w-[500px] mx-auto">
            {entry.title}
          </h1>
          <p className="text-sm text-gray-700 font-serif">{entry.author}</p>
          <p className="text-xs text-gray-500 mt-1 font-serif">
            {entry.volume}
          </p>
        </div>

        <div className="px-[60px] text-justify">
          <div className="mb-8">
            <h2 className="font-serif text-center font-semibold text-lg mb-2 text-gray-800">
              Abstract
            </h2>
            <p
              className="text-gray-700 text-sm leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: entry.abstract }}></p>

            {entry.abstractSecondary && (
              <p
                className="text-gray-700 text-sm leading-relaxed italic"
                dangerouslySetInnerHTML={{
                  __html: entry.abstractSecondary,
                }}></p>
            )}

            {entry.keywords && entry.keywords.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Keywords:{' '}
                  <span className="font-normal italic">
                    {entry.keywords.join(', ')}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-center font-semibold text-lg mb-2 text-gray-800">
              Preamble
            </h2>
            <div
              className="columns-2 gap-8 text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: entry.preamble }}></div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-center font-semibold text-lg mb-2 text-gray-800">
              Introduction
            </h2>
            <div
              className="columns-2 gap-8 text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: entry.introduction }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryDetail;
