/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    EMAIL_1: process.env.EMAIL_1,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGES_DOMAIN],
  },
};

module.exports = nextConfig;
