/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ['shared', 'database']
}

module.exports = nextConfig
