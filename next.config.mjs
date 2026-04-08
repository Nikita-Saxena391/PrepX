/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
