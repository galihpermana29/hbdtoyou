'use client';

import NewsImage from './NewsImage';
const stories = [
  {
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735831970/fxalkf0dcjuxneqpisjo.jpg',
    category: 'ARTS',
    title: 'The Most Fascinating Show? The Met Trying to Fix Itself',
    excerpt:
      'Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor libri.',
  },
  {
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735831493/panpzbc8csgld9wx1j3q.jpg',
    category: 'SPORTS',
    title: 'Where Is The Most Warm Place In The World Beside You?',
    excerpt:
      'Maecenas tempus leo ac nisi iaculis porta. Sed sapien tortor, aliquet.',
  },
  {
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735831490/jdufuo1tjqn1bpbhzucf.jpg',
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
