import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the user's home directory otherwise confuses root detection.
  turbopack: { root: process.cwd() },
  images: {
    // Official faculty photographs are served from the IIT Jodhpur website.
    remotePatterns: [{ protocol: "https", hostname: "www.iitj.ac.in", pathname: "/PageImages/**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
