/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ik.imagekit.io",
      "images.unsplash.com",
      "cdn.discordapp.com",
      "your-domain.com"
    ],
  },
};

module.exports = nextConfig;
