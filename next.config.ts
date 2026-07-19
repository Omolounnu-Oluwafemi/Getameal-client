import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  typedRoutes: true,
  async redirects() {
    // Paystack sends customers back via the backend's callback path appended
    // to whatever base URL it's configured with. Accept both shapes and land
    // on the confirmation page (query params carry over automatically).
    return [
      {
        source: '/customer/payment/callback',
        destination: '/order-confirmed',
        permanent: false,
      },
      {
        source: '/order-confirmed/customer/payment/callback',
        destination: '/order-confirmed',
        permanent: false,
      },
    ];
  },
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
