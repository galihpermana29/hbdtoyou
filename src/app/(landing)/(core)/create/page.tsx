import CreatePage from './create-clientside';
import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/create',
  title: 'Create a Digital Gift Online (Buat Kado Digital) | Memoify',
  description:
    'Pick a template, add photos and words, get a link to send. Pilih template, isi foto dan ucapan, lalu bagikan link kado digitalnya.',
  keywords: {
    en: ['create digital gift', 'make a gift website', 'gift maker online'],
    id: [
      'buat kado digital',
      'cara membuat kado digital',
      'bikin website ucapan ulang tahun',
    ],
  },
  image: {
    url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300467/6f5f6395-cc85-4329-b50a-b402d7fcffe8.png',
    alt: 'Create a digital gift with Memoify',
  },
});

const CreatePageServer = ({
  searchParams,
}: {
  searchParams?: { template?: string };
}) => {
  if (process.env.IS_MAINTENANCE === 'true') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className=" max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Under Maintenance
          </h1>
          <p className="text-gray-700 mt-4 max-w-[400px]">
            We are currently working on improving this feature. Please check
            back soon!
          </p>

          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  return <CreatePage initialTemplateId={searchParams?.template} />;
};

export default CreatePageServer;
