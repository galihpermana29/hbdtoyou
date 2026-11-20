/**
 * The words under a template's sample page, which make it a page someone
 * can land on from a search and understand without opening anything else.
 *
 * `/netflixv1` is the most read page of the site but almost nobody arrives
 * there from a search: the sample says nothing in words. Each entry here is
 * what the template is, how to make it, and a few questions, drawn by
 * `components/template-guide/template-guide.tsx` below the sample and
 * repeated as FAQPage structured data (lib/seo.ts).
 *
 * Rules for the copy:
 * - Describe only what the template's form really asks for and what its
 *   page really shows.
 * - No price, no cap, no free or premium: the owner moves templates between
 *   tiers on the backend (CLAUDE.md, "Free vs premium").
 * - A page styled after another brand says "inspired by" once, in `about`,
 *   with `notAffiliated`, and is otherwise named for what it is.
 */

export interface TemplatePage {
  /** The template's route, which is also its sample page's address. */
  route: string;
  meta: { title: string; description: string; keywords: string[] };
  /** What the gift is called on its own page. */
  name: string;
  /** What it is: two or three short paragraphs. */
  about: string[];
  /** For a page styled after a brand: the line that says we are not it. */
  notAffiliated?: string;
  /** What the maker fills in, in the order of the form. */
  fill: string;
  faq: { q: string; a: string }[];
}

/** Questions every gift page can answer the same way, and truly. */
const NOTHING_TO_INSTALL = {
  q: 'Does the person I send it to need an app or an account?',
  a: 'No. The gift is a web page. They open your link in the browser on their phone or computer.',
};
const EDIT_LATER = {
  q: 'Can I change it after I have sent the link?',
  a: 'Yes. Every gift you make is kept in your Dashboard, where you can edit it. The link you sent stays the same and shows your changes.',
};
const WHAT_YOU_NEED = {
  q: 'What do I need to make one?',
  a: 'A Google account to sign in with, a few photos, and what you want to say. Everything else is already laid out by the template.',
};

export const TEMPLATE_PAGES: Record<string, TemplatePage> = {
  netflixv1: {
    route: 'netflixv1',
    meta: {
      title: 'Netflix-Style Birthday Gift Website | Memoify',
      description:
        'A gift page styled like a streaming series, with them as the star: your title, cover photo, photo rows and a message. Send it as one link.',
      keywords: [
        'netflix style gift',
        'netflix birthday gift website',
        'netflix themed gift',
        'kado ala netflix',
        'kado ulang tahun netflix',
      ],
    },
    name: 'Netflix-style series gift',
    about: [
      'A web page that looks like a streaming service, with the person you are celebrating as the star of the show. It opens on a "Who\'s watching?" screen with their photo, then shows your title and cover photo, rows of your photos, and a message that opens when they press play.',
      'The look is inspired by Netflix. You fill in the words and photos; the layout is already done.',
    ],
    notAffiliated:
      'Memoify is not affiliated with, endorsed by or sponsored by Netflix.',
    fill: 'a title and subtitle, a cover photo, your photos, and the message they will read.',
    faq: [
      {
        q: 'What is a Netflix-style gift?',
        a: 'A personal web page laid out like a streaming series about someone: their photo on the profile screen, your title as the show, your photos as the rows, and your message behind the play button.',
      },
      NOTHING_TO_INSTALL,
      EDIT_LATER,
      WHAT_YOU_NEED,
    ],
  },

  spotifyv1: {
    route: 'spotifyv1',
    meta: {
      title: 'Spotify-Style Playlist Gift for Someone You Love | Memoify',
      description:
        'A gift page laid out like a playlist: songs that are yours together, songs picked for them, your photos and a message. Send it as one link.',
      keywords: [
        'spotify style gift',
        'playlist gift website',
        'spotify playlist gift',
        'kado playlist',
        'kado ala spotify',
      ],
    },
    name: 'Spotify-style playlist gift',
    about: [
      'A web page laid out like a music app, with a playlist made for one person. It has two lists of songs, "Our Songs" and "Songs For You", a row of your photos called "Moments", and a message they can open.',
      'The look is inspired by Spotify. You choose the songs and write the words; the layout is already done.',
    ],
    notAffiliated:
      'Memoify is not affiliated with, endorsed by or sponsored by Spotify.',
    fill: 'the songs for each list (search them by title), your photos, and your message.',
    faq: [
      {
        q: 'What is a playlist gift?',
        a: 'A personal web page that looks like a playlist made for someone: the songs that mean something to you both, the ones you picked for them, your photos, and a message.',
      },
      {
        q: 'How do I add the songs?',
        a: 'While filling in the gift you search for each song by its title and add it to "Our Songs" or "Songs For You".',
      },
      NOTHING_TO_INSTALL,
      EDIT_LATER,
    ],
  },

  newspaperv3: {
    route: 'newspaperv3',
    meta: {
      title: 'Newspaper Front Page Gift About Someone | Memoify',
      description:
        'Put someone on the front page: a headline photo, a story you write and the lyrics of your song, set as a newspaper. Send it as one link.',
      keywords: [
        'newspaper gift',
        'personalized newspaper front page',
        'newspaper birthday gift online',
        'kado koran',
        'koran ulang tahun digital',
      ],
    },
    name: 'Newspaper front page gift',
    about: [
      'A web page set as the front page of a newspaper about one person. A large black-and-white photo leads the page, a line from a song you choose is printed as the quote, and the story you write fills the columns.',
      'It reads like a special edition printed for them, and it opens from a link.',
    ],
    fill: 'the headline photo, a song, the lyrics you want quoted, and your story.',
    faq: [
      {
        q: 'What can I write in it?',
        a: 'Anything you would put in a letter or a toast: how you met, what this year was like, why they matter. It is set in newspaper columns under the photo and the quote.',
      },
      NOTHING_TO_INSTALL,
      EDIT_LATER,
      WHAT_YOU_NEED,
    ],
  },

  magazinev1: {
    route: 'magazinev1',
    meta: {
      title: 'Magazine Cover Gift With Your Photos and a Letter | Memoify',
      description:
        'A magazine-style gift page: your photos as loose prints they can drag around, a song, and a letter or story from you. Send it as one link.',
      keywords: [
        'magazine gift',
        'magazine cover gift online',
        'personalized magazine gift',
        'kado majalah',
        'kado ulang tahun majalah',
      ],
    },
    name: 'Magazine cover gift',
    about: [
      'A web page made like the cover of a magazine about one person. Your photos lie on it as a pile of prints that they can pick up and move, next to the song you chose and a letter or story from you.',
      'It works on a phone or a computer, and it opens from a link.',
    ],
    fill: 'a song, your photos, and a letter or story.',
    faq: [
      {
        q: 'What do they do with the photos?',
        a: 'The photos sit on the page as a stack of prints. They can drag them around to look at each one.',
      },
      NOTHING_TO_INSTALL,
      EDIT_LATER,
      WHAT_YOU_NEED,
    ],
  },

  disneyplusv1: {
    route: 'disneyplusv1',
    meta: {
      title: 'Disney+-Style Movie Gift With Your Own Episodes | Memoify',
      description:
        'A gift page styled like a movie streaming service: your title, cover photo, photos, episodes that are your moments, and a message. One link.',
      keywords: [
        'disney plus style gift',
        'movie themed gift website',
        'streaming style gift',
        'kado ala disney',
        'kado film digital',
      ],
    },
    name: 'Disney+-style movie gift',
    about: [
      'A web page that looks like a movie on a streaming service, about the person you are celebrating. It shows your title and cover photo, your photos, a list of "episodes" where each one is a moment with its own name, and a message they open from the watch button.',
      'The look is inspired by Disney+. You fill in the words and photos; the layout is already done.',
    ],
    notAffiliated:
      'Memoify is not affiliated with, endorsed by or sponsored by Disney or Disney+.',
    fill: 'a title and subtitle, a cover photo, your photos, your episodes, and the message.',
    faq: [
      {
        q: 'What goes in the episodes?',
        a: 'Each episode is one moment you want to remember, with its own title, for example the day you met or a trip you took.',
      },
      NOTHING_TO_INSTALL,
      EDIT_LATER,
      WHAT_YOU_NEED,
    ],
  },

  vinylv1: {
    route: 'vinylv1',
    meta: {
      title: 'Vinyl Record Gift With a Song and a Letter | Memoify',
      description:
        'A gift page that opens like a record sleeve: their name, a song you choose, your letter and your photos, with an optional voice note.',
      keywords: [
        'vinyl gift',
        'vinyl record gift online',
        'song gift website',
        'kado vinyl',
        'kado lagu digital',
      ],
    },
    name: 'Vinyl record gift',
    about: [
      'A web page that opens like a record. It starts with a sleeve addressed to them; they open it to find the song you chose, a letter from you, and your photos as memories.',
      'If you want them to hear you say it, add a voice note: it plays when they click the cassette tape. A short video for the camcorder is optional too.',
    ],
    fill: 'their name, the song title and artist, your letter, your photos, and a voice note or video if you like.',
    faq: [
      {
        q: 'Can I add my own voice?',
        a: 'Yes. Upload a voice note as an MP3 and it plays when they click the cassette tape. It is optional, and you can add a short line from it to show on the page.',
      },
      NOTHING_TO_INSTALL,
      EDIT_LATER,
      WHAT_YOU_NEED,
    ],
  },
};

/** The three steps, the same for every template: only the words in step two change. */
export function templateSteps(page: TemplatePage) {
  return [
    {
      title: 'Open this template',
      body: `Press "Create this gift" and sign in with Google. The ${page.name.toLowerCase()} opens ready to fill in.`,
    },
    { title: 'Fill it in', body: `Add ${page.fill}` },
    {
      title: 'Send the link',
      body: 'When you publish it you get one link. Send it in any chat; it opens in their browser.',
    },
  ];
}

/** Where "Create this gift" goes: the Create Flow, with this template chosen. */
export function createHref(page: TemplatePage) {
  return `/create?template=${page.route}`;
}
