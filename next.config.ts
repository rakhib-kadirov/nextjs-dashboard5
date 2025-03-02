import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   ppr: 'incremental',
  // },
  env: { POSTGRES_URL: process.env.POSTGRES_URL }
};

export default nextConfig;