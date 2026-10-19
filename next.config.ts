import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // the floating dev "N" badge sat on top of the sidebar's Sign out button
  devIndicators: false,
};

export default nextConfig;
