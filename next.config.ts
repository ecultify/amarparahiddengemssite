import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One address for search engines: www folds into the apex.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.amarpara.in" }],
        destination: "https://amarpara.in/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
