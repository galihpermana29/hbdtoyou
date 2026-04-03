import { getDetailContent } from '@/action/user-api';
import BreakingNews from '@/components/newspaper/BreakingNews';
import DailyFeed from '@/components/newspaper/DailyFeed';
import FeaturedStories from '@/components/newspaper/FeaturedStories';
import Navigation from '@/components/newspaper/Navigation';
import NewsletterSection from '@/components/newspaper/NewsletterSection';
import MusicPlayer from '@/components/ui/music-player/music-player';
import LockScreen from '@/components/ui/lock-screen';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export default async function NewspaperPage({ params }: { params: any }) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  const lockedContent = data.data.status === 'locked' || data.data.user_type === 'free';

  const content = (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-lora text-gray-600">January 2, 2024</div>
            <div className="flex space-x-4 text-sm font-lora">
              <a href="#" className="hover:text-gray-600">
                HOME
              </a>
              <a href="#" className="hover:text-gray-600">
                POLITICS
              </a>
              <a href="#" className="hover:text-gray-600">
                CONTACTS
              </a>
            </div>
          </div>
          <h1 className="text-5xl font-playfair text-center font-bold mb-8 tracking-tight">
            THE NEWSPAPER
          </h1>
          <Navigation />
        </div>
      </header>

      <MusicPlayer />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Latest Articles Sidebar */}
          <aside className="lg:col-span-3">
            <h2 className="text-lg font-playfair font-semibold mb-4">LATEST ARTICLES</h2>
            <ul className="space-y-4">
              {[
                "The Ultimate Guide to New York's Hidden Food",
                'Daily Fitness Period for Dream Cafe',
                'A Cool Solution for Hot Summer Nights',
                'The Best Revolution in Marketing',
                'Decorating Your Part Of The Kitchen',
              ].map((title, index) => (
                <li key={index} className="border-b pb-2">
                  <a href="#" className="text-sm font-lora hover:text-gray-600">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main News Section */}
          <div className="lg:col-span-6">
            <BreakingNews content={parsedData} />
          </div>

          {/* Daily Feed Section */}
          <div className="lg:col-span-3">
            <DailyFeed />
          </div>
        </div>

        {/* Featured Stories */}
        <FeaturedStories content={parsedData} />

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </main>
  );

  if (lockedContent) {
    return (
      <LockScreen
        contentId={id}
        initiallyLocked
        title="Content locked for free users"
        message="Unlock to read this newspaper. Upgrade your plan for full access.">
        {content}
      </LockScreen>
    );
  }

  return content;
}
