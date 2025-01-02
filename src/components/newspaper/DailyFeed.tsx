'use client';

export default function DailyFeed() {
  const articles = [
    {
      category: 'LIFESTYLE TECHNOLOGY',
      title: 'How to Be as Productive as a Google Employee',
      excerpt:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    },
    {
      category: 'LIFESTYLE',
      title: 'The Most Fascinating Show? The Met Trying to Fix Itself',
      excerpt:
        'Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor libri, sed cursus torpes.',
    },
    {
      category: 'SPORTS',
      title: 'Liverpool Tops Hoffenheim in First Leg of Champions Playoff',
      excerpt:
        'Maecenas tempus leo ac nisi iaculis porta. Sed sapien tortor, aliquet a ipsum ut, porta vehicula.',
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-serif mb-6">Daily Feed</h2>
      <div className="space-y-6">
        {articles.map((article, index) => (
          <article key={index} className="pb-6 border-b last:border-0">
            <span className="text-sm text-gray-500">{article.category}</span>
            <h3 className="text-lg font-semibold mt-2 mb-2">{article.title}</h3>
            <p className="text-gray-600 text-sm">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
