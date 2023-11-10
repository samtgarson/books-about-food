/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    S3_DOMAIN: process.env.S3_DOMAIN
  },
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: []
        }
      ]
    ],
    serverActions: true,
    serverActionsBodySizeLimit: '2mb',
    serverComponentsExternalPackages: ['mjml', 'sharp']
  },
  transpilePackages: ['shared', 'database', 'email', 'core'],
  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 90, // 90 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.S3_DOMAIN).hostname
      }
    ]
  }
}

module.exports = nextConfig
