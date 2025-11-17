/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@repo/ui', '@repo/tailwind-config'],
  };
  
  export default nextConfig;