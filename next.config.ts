import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  typedRoutes: true,
  images: {
    // Add real remote hosts here as you wire up image sources
    // (e.g. a CMS, S3 bucket, or restaurant photo CDN).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
