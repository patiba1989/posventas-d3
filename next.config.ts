import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/posventas-d3",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grupodaer.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
