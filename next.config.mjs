/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://trading-view-gilt.vercel.app/:path*',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
