import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/brainhack2026",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
