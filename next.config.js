/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [];
  },
  // 開発サーバーのホスト名とポートを固定 - 直接ここでは設定できないため、package.jsonで設定する
};

module.exports = nextConfig; 