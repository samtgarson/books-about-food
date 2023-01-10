/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ['shared', 'database'],
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_S3_DOMAIN).hostname
      }
    ]
  }
}

module.exports = nextConfig
