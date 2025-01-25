/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "runningfinder.s3.eu-central-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "scontent-itm1-1.cdninstagram.com",
        port: "",
      },
    ],
    domains: [
      "localhost",
      "runningfinder.s3.eu-central-1.amazonaws.com",
      "avatars.githubusercontent.com",
      "cdninstagram.com",
      "scontent-itm1-1.cdninstagram.com",
    ],
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };
    return config;
  },
};

module.exports = nextConfig;
