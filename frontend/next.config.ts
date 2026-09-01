import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.110.172'],
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
