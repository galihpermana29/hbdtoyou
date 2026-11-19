import fs from 'node:fs';
import path from 'node:path';

/**
 * The first path segment of every page that shows somebody's own gift:
 * each route under `(gifts)` and `(scrapbooks)` that has a dynamic segment
 * beneath it (`netflixv1/[id]`, `w/[slug]`, ...). Read from the folders, so
 * a new template is covered the day it gets its viewer.
 */
function giftViewerRoutes() {
  const landing = path.join(process.cwd(), 'src/app/(landing)');
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const here = path.join(dir, entry.name);
      // A route group is not part of the address: look inside it.
      if (entry.name.startsWith('(')) walk(here);
      else if (
        fs
          .readdirSync(here, { withFileTypes: true })
          .some((child) => child.isDirectory() && child.name.startsWith('['))
      )
        found.push(entry.name);
    }
  };
  walk(path.join(landing, '(gifts)'));
  walk(path.join(landing, '(scrapbooks)'));
  return found;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.*',
      },
      {
        protocol: 'http',
        hostname: '*.*',
      },
      {
        protocol: 'http',
        hostname: 'cloudinary.com',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    unoptimized: true,
  },

  webpack: (config, { isServer }) => {
    // Exclude Remotion from webpack processing
    config.externals = config.externals || [];

    if (isServer) {
      config.externals.push({
        '@remotion/bundler': '@remotion/bundler',
        '@remotion/renderer': '@remotion/renderer',
        '@remotion/lambda': '@remotion/lambda',
      });
    }

    return config;
  },

  // The fonts served from public/font never change under the same name, so
  // a browser may keep them instead of asking again on every visit.
  async headers() {
    return [
      // A gift is one person's photos and words for another. It is reached
      // by its link and must not be found by searching: the page answers as
      // before, with a header telling search engines not to index it. (They
      // have to be allowed to fetch it to read this, so robots.txt does not
      // block these.) The same goes for a MemoRoll guest gallery and a
      // photobox print.
      {
        source: `/:viewer(${giftViewerRoutes().join('|')})/:id`,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/memoroll/:code((?!create$|demo$)[^/]+)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/photobox-newspaper/:id',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/font/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
      },
    ];
  },
  // The Indonesian MemoRoll landing moved to the address people search for.
  async redirects() {
    return [
      {
        source: '/id/memoroll',
        destination: '/id/kamera-tamu-pernikahan',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
