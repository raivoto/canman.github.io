/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to GitHub Pages user site repo canman.github.io, basePath is empty or '/'
  basePath: '',
  trailingSlash: true,
};

export default nextConfig;
