/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/canman.github.io',
  assetPrefix: '/canman.github.io/',
  images: { unoptimized: true },
  trailingSlash: true,
}
module.exports = nextConfig
