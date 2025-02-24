import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fussball.de",
        port: "",
        pathname: "/export.media/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
