import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: add the production API/CDN host once deployed — see
    // lib/http.ts's uploadUrl() for how image URLs are built.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
