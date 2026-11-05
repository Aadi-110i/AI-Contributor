import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force /api as the base URL in production so all API calls go through
  // the Next.js API routes — not an external backend server.
  // This overrides any NEXT_PUBLIC_API_URL set in Vercel dashboard.
  env: {
    NEXT_PUBLIC_API_URL: "/api",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
