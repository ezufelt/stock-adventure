/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/stock-adventure',
  assetPrefix: '/stock-adventure',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
