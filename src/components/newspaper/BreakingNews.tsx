'use client';

import dayjs from 'dayjs';
import NewsImage from './NewsImage';

export default function BreakingNews({ content }: { content?: any }) {
  return (
    <section>
      <h2 className="text-2xl font-serif mb-6">Breaking News</h2>
      <article className="mb-8">
        <NewsImage
          src={
            content
              ? content.jumbotronImage
              : 'https://res.cloudinary.com/dxuumohme/image/upload/v1735831970/fxalkf0dcjuxneqpisjo.jpg'
          }
          alt="Wedding catering"
          className="aspect-[16/9] mb-4 rounded-lg"
        />
        <span className="text-sm text-gray-500">
          {dayjs().format('DD MMM YYYY')} • LIFE
        </span>
        <h3 className="text-xl font-semibold mt-2 mb-3">
          {content
            ? content.title
            : 'Ooops, A Man is Getting Lost in Someones Heart'}
        </h3>
        <p className="text-gray-600 mb-4">
          {content
            ? content.subTitle
            : "Galih, a quiet architecture student in Malang, lived a structured, yet carefree life. He was a good student, but he was also a bit of a loner. He had a few friends, but they weren't as close as he was."}
        </p>
        <a href="#" className="text-sm font-semibold hover:underline">
          READ MORE
        </a>
      </article>
    </section>
  );
}
