import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   ppr: 'incremental',
  // },
  // output: 'export',
  env: { POSTGRES_URL: process.env.POSTGRES_URL },
  reactStrictMode: true,
};

export default nextConfig;