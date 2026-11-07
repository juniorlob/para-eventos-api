import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Ensures the JSON data file is bundled when deploying (Vercel/serverless).
  outputFileTracingIncludes: {
    "/*": ["./data/**/*.json"],
  },
};

export default nextConfig;
