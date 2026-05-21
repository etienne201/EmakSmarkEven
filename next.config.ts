import path from "path";
import type { NextConfig } from "next";

// When running multiple services, each gets its own build directory
// to avoid "Another next dev server is already running" conflicts
const serviceMode = process.env.SERVICE_MODE;
const distDir = serviceMode ? `.next-${serviceMode}` : ".next";

const nextConfig: NextConfig = {
  distDir,
  // Next.js 15+ uses 'turbo' top-level key
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
