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
      {
        source: '/font/:file*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' },
        ],
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
