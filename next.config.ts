import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Proxy /api/* to backend URL from env (defaults to localhost for local development).
  async rewrites() {
    const apiUrl = (process.env.BACKEND_API_URL || "http://localhost:4000").replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
};

export default nextConfig;
