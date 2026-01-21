import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Proxy /api/* to the Node backend (must run on port 4000). Or set NEXT_PUBLIC_API_URL=http://localhost:4000.
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://localhost:4000/:path*" }];
  },
};

export default nextConfig;
