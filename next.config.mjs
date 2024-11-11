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
};

export default nextConfig;
