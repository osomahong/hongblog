import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/what-is-click-through-attribution",
        destination: "/insights/what-is-click-through-attribution",
        permanent: true,
      },
      {
        source: "/conversion-and-conversion-campaign",
        destination: "/insights/conversion-and-conversion-campaign",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
