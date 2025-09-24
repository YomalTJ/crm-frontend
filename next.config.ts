import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Add this for Next.js 14+ (stable server actions)
  serverActions: {
    bodySizeLimit: '10mb', // Increase from default 1MB to 10MB
  },
};

export default nextConfig;