/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
