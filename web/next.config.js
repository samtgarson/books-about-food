/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ['shared', 'database'],
  swcMinify: true
}

module.exports = nextConfig
