/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000","lyart.pro.vn"],
    },
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "static.nike.com",
        protocol: "https",
      },
      {
        hostname: "firebasestorage.googleapis.com",
        protocol: "https",
      },
      {
        hostname: "github.com",
        protocol: "https",
      },
      {
        hostname: "danviet.mediacdn.vn",
        protocol: "https",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https"
      },{
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https'
      },
      {
        hostname: 'file.lyart.pro.vn',
        protocol: 'https'
      }
    ],
  },
  transpilePackages: ["@pqina/pintura", "@pqina/react-pintura"],
};

module.exports = nextConfig;
