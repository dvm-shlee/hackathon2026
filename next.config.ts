/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const repositoryName = "hackathon2026"; // Replace with your actual repository name

const nextConfig = {
  // Use basePath for routing if deployed to a subdirectory
  basePath: isProd ? `/${repositoryName}` : "",
  // Use assetPrefix to correctly load static assets (images, CSS, etc.)
  assetPrefix: isProd ? `/${repositoryName}/` : "",
  images: {
    // Disable Next.js image optimization as GitHub Pages is a static host
    unoptimized: true,
  },
  output: "export", // Ensure the app builds as a static site
};

module.exports = nextConfig;
