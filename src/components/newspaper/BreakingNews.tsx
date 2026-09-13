'use client';

import dayjs from 'dayjs';
import NewsImage from './NewsImage';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

export default function BreakingNews({ content }: { content?: any }) {
  return (
    <section>
      <h2 className="text-2xl font-serif mb-6">Breaking News</h2>
      <article className="mb-8">
        <NewsImage
          src={
            content
              ? content.jumbotronImage
              : 'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_16:9,g_auto/v1789284278/placeholder/Butter_Color_Dress__Elegant_Spring_Formal_Look_luzpa3.jpg'
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
