import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the user's home directory otherwise confuses root detection.
  turbopack: { root: process.cwd() },
  images: {
    // Faculty portraits stay hosted by IIT Jodhpur and are loaded directly by the browser
    // (see isIitjHosted in lib/utils). All local images are optimised to AVIF/WebP.
    remotePatterns: [{ protocol: "https", hostname: "www.iitj.ac.in", pathname: "/PageImages/**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
