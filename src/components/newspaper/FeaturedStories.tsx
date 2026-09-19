'use client';

import NewsImage from './NewsImage';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.
const stories = [
  {
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:3,g_auto/v1789284276/placeholder/Business_Formal_Outfit_for_Women_kl6jkx.jpg',
    category: 'ARTS',
    title: 'The Most Fascinating Show? The Met Trying to Fix Itself',
    excerpt:
      'Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor libri.',
  },
  {
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:3,g_auto/v1789284277/placeholder/__db1ief.jpg',
    category: 'SPORTS',
    title: 'Where Is The Most Warm Place In The World Beside You?',
    excerpt:
      'Maecenas tempus leo ac nisi iaculis porta. Sed sapien tortor, aliquet.',
  },
  {
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:3,g_auto/v1789284278/placeholder/museum_Date_Outfit_Ideas___Academic_Chic_Poetcore_Style_n5nvg7.jpg',
    category: 'TRANSIT',
    title: 'Which New York City Subway MetroCard to Buy?',
    excerpt:
      'Duis sodales enim vel libero sollicitudin vehicula. Suspendisse non tempus.',
  },
];

export default function FeaturedStories({ content }: { content?: any }) {
  const dx = content
    ? content.stories.map((dx: any) => ({
        image: dx.imageUrl,
        category: 'ARTS',
        title: dx.title,
        excerpt: dx.desc,
      }))
    : stories;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-serif mb-6">Featured Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dx.map((story: any, index: number) => (
          <article key={index} className="group">
            <NewsImage
              src={story.image}
              alt={story.title}
              className="aspect-[4/3] mb-4 rounded-lg overflow-hidden"
            />
            <span className="text-sm text-gray-500">{story.category}</span>
            <h3 className="text-lg font-semibold mt-2 mb-2 group-hover:text-gray-600">
              {story.title}
            </h3>
            <p className="text-gray-600 text-sm">{story.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
