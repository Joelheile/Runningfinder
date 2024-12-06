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
    ],
    domains: ["localhost", "runningfinder.s3.eu-central-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
