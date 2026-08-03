import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webhook and approval handlers are pure JSON APIs; no image/asset pipeline needed.
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
