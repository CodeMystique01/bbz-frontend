import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run frontend on port 3001 (backend uses 3000)
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
