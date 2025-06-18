"use client";

import PageFlipScrapbook from "@/components/PageFlipScrapbook";

const pages = [
  "https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/02.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/03.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/04.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/05.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/06.jpg",
];

const ScrapbookResult = () => {
  // Cover images
  const coverImage = "https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg";
  const backCoverImage = "https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Scrapbook</h1>
      <PageFlipScrapbook 
        pages={pages} 
        coverImage={coverImage}
        backCoverImage={backCoverImage}
        coverTitle="Scrapbook by Memoify"
        backCoverTitle="The End"
      />
    </div>
  );
};

export default ScrapbookResult;
