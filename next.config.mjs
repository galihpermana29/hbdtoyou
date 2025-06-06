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
};

export default nextConfig;
