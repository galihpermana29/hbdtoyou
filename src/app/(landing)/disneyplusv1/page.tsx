import { Play, Plus } from 'lucide-react';
import Image from 'next/image';
import EpisodeList from '../../../components/disney+/EpisodeList';
import SimilarShows from '../../../components/disney+/SimilarShows';
import TrailerSection from '../../../components/disney+/TrailerSection';
import { Button } from '../../../components/disney+/ui/button';

export default function DisneyPage() {
  return (
    <main className="min-h-screen bg-[#1A1D29] text-white">
      {/* Hero Section */}
      <div className="relative h-[100vh] w-full">
        <Image
          src="https://res.cloudinary.com/dxuumohme/image/upload/v1736524166/veevebpg774vy4n326su.jpg"
          alt="The Tyrant Hero"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#1A1D29] to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                Tunggu Aku di Bandung
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Dan bila akupun rindu, pada nyamannya pelukmu, pada hangatnya
                tawamu
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button className="bg-white text-black hover:bg-gray-200 gap-2">
                  <Play className="h-5 w-5" />
                  Watch First Episode
                  <span className="text-sm ml-2">S1 E1</span>
                </Button>
                {/* <Button variant="outline" className="gap-2 text-black">
                  <Plus className="h-5 w-5" />
                  Add to Watchlist
                </Button> */}
              </div>
              <div className="flex gap-4 mt-4">
                <span className="px-3 py-1 bg-gray-800 rounded-full">
                  Action
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full">
                  Thriller
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-full">
                  University
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8 mb-8">
          <button className="text-white border-b-2 border-white pb-2">
            Episodes
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            More Like This
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Trailers & More
          </button>
        </div>

        <EpisodeList />
        <SimilarShows />
        <TrailerSection />
      </div>
    </main>
  );
}
